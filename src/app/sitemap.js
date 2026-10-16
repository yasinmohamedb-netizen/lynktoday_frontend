import staticRoutes from '@/data/generatedStaticRoutes.json';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lynktoday.com';

const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

const PAGE_SIZE = 50;
const REVALIDATE_SECONDS = 3600;

async function fetchJson(endpoint) {
    try {
        const response = await fetch(
            `${apiUrl}${endpoint}`,
            {
                next: {
                    revalidate: REVALIDATE_SECONDS
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch {
        return null;
    }
}

/**
 * Collect every page of a public list endpoint.
 *
 * The page-size fallback also supports APIs that do not return pagination
 * metadata: fetching continues until the endpoint returns a short page.
 */
async function fetchAllPages(endpoint, collectionKey, pageSize = PAGE_SIZE) {
    const records = [];
    const maxPages = 10000;

    for (let page = 1; page <= maxPages; page += 1) {
        const data = await fetchJson(
            `${endpoint}?page=${page}&limit=${pageSize}`
        );

        const pageRecords = data?.[collectionKey];

        if (!Array.isArray(pageRecords) || pageRecords.length === 0) {
            break;
        }

        records.push(...pageRecords);

        const totalPages = Number(
            data?.pagination?.totalPages ??
            data?.pagination?.pages ??
            data?.totalPages ??
            data?.pages
        );

        if (Number.isFinite(totalPages) && totalPages > 0) {
            if (page >= totalPages) {
                break;
            }
        } else if (pageRecords.length < pageSize) {
            break;
        }
    }

    return records;
}

function asDate(value, fallback) {
    if (!value) {
        return fallback;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? fallback
        : date;
}

function sitemapEntry(url, lastModified, changeFrequency, priority, now) {
    return {
        url,
        lastModified: asDate(lastModified, now),
        changeFrequency,
        priority
    };
}

export default async function sitemap() {
    const now = new Date();

    // Static public pages are discovered automatically from src/app/page.*
    // during the prebuild step. Private/authenticated routes are excluded.
    const staticPages = staticRoutes.map((route) =>
        sitemapEntry(
            `${siteUrl}${route}`,
            now,
            route === '/documentation' || route === '/hs-codes'
                ? 'weekly'
                : 'monthly',
            route === '/global-trade-directory' ? 0.9 : 0.7,
            now
        )
    );

    const [
        documentation,
        hsCodes,
        posts,
        topics,
        users
    ] = await Promise.all([
        fetchAllPages('/documentation', 'documentation'),
        fetchAllPages('/hs-codes', 'hsCodes'),
        fetchAllPages('/posts', 'posts'),
        fetchJson('/topics/trending'),
        fetchAllPages('/users/search', 'users')
    ]);

    const documentationPages = documentation
        .filter((document) =>
            document &&
            document.isActive !== false &&
            (document.slug || document._id || document.id)
        )
        .map((document) => {
            const identifier =
                document.slug ||
                document._id ||
                document.id;

            return sitemapEntry(
                `${siteUrl}/documentation/${encodeURIComponent(String(identifier))}`,
                document.updatedAt || document.createdAt,
                'weekly',
                0.8,
                now
            );
        });

    const hsCodePages = hsCodes
        .filter((hsCode) =>
            hsCode &&
            hsCode.isActive !== false &&
            (hsCode._id || hsCode.id)
        )
        .map((hsCode) => {
            const identifier = hsCode._id || hsCode.id;

            return sitemapEntry(
                `${siteUrl}/hs-codes/${encodeURIComponent(String(identifier))}`,
                hsCode.updatedAt || hsCode.createdAt,
                'monthly',
                0.7,
                now
            );
        });

    const postPages = posts
        .filter((post) =>
            post &&
            post.isDeleted !== true &&
            post.isActive !== false &&
            String(post.visibility || 'public').toLowerCase() !== 'private' &&
            (post._id || post.id)
        )
        .map((post) => {
            const identifier = post._id || post.id;

            return sitemapEntry(
                `${siteUrl}/posts/${encodeURIComponent(String(identifier))}`,
                post.updatedAt || post.createdAt,
                'weekly',
                0.7,
                now
            );
        });

    const trendingTopics = Array.isArray(topics?.topics)
        ? topics.topics
        : [];

    const topicPages = trendingTopics
        .filter((topic) => topic?.slug)
        .map((topic) =>
            sitemapEntry(
                `${siteUrl}/topics/${encodeURIComponent(String(topic.slug))}`,
                topic.updatedAt || topic.createdAt,
                'daily',
                0.7,
                now
            )
        );

    // The public search endpoint returns active users in pages. Their public
    // profile route has its own dynamic title, description and canonical URL.
    const profilePages = users
        .filter((user) =>
            user &&
            user.isActive !== false &&
            (user._id || user.id)
        )
        .map((user) => {
            const identifier = user._id || user.id;

            return sitemapEntry(
                `${siteUrl}/profile/${encodeURIComponent(String(identifier))}`,
                user.updatedAt || user.createdAt,
                'monthly',
                0.5,
                now
            );
        });

    const uniqueEntries = new Map();

    for (const entry of [
        ...staticPages,
        ...documentationPages,
        ...hsCodePages,
        ...postPages,
        ...topicPages,
        ...profilePages
    ]) {
        uniqueEntries.set(entry.url, entry);
    }

    return [...uniqueEntries.values()];
}
