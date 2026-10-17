import staticRoutes from '@/data/generatedStaticRoutes.json';

const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lynktoday.com'
).replace(/\/$/, '');

const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'
).replace(/\/$/, '');

const PAGE_SIZE = 100;
const REVALIDATE_SECONDS = 3600;
const MAX_PAGES = 1000;

async function fetchJson(endpoint) {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            next: { revalidate: REVALIDATE_SECONDS }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

function getCollection(data, keys) {
    if (Array.isArray(data)) return data;
    for (const key of keys) {
        if (Array.isArray(data?.[key])) return data[key];
        if (Array.isArray(data?.data?.[key])) return data.data[key];
    }
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
}

function getPagination(data) {
    const pagination = data?.pagination || data?.data?.pagination || {};
    const totalPages = Number(
        pagination.totalPages ??
        pagination.pages ??
        data?.totalPages ??
        data?.pages ??
        data?.data?.totalPages
    );
    const total = Number(
        pagination.total ??
        pagination.totalItems ??
        data?.total ??
        data?.totalItems
    );
    return { totalPages, total };
}

/**
 * Fetch all records from a paginated public endpoint.
 * Supports common response envelopes and stops safely on short/empty pages.
 */
async function fetchAllPages(endpoint, collectionKeys, pageSize = PAGE_SIZE) {
    const records = [];
    const seen = new Set();

    for (let page = 1; page <= MAX_PAGES; page += 1) {
        const separator = endpoint.includes('?') ? '&' : '?';
        const data = await fetchJson(
            `${endpoint}${separator}page=${page}&limit=${pageSize}&perPage=${pageSize}`
        );

        if (!data) break;

        const pageRecords = getCollection(data, collectionKeys);
        if (pageRecords.length === 0) break;

        for (const record of pageRecords) {
            const key = String(record?._id ?? record?.id ?? record?.slug ?? '');
            if (!key || !seen.has(key)) {
                records.push(record);
                if (key) seen.add(key);
            }
        }

        const { totalPages, total } = getPagination(data);
        if (Number.isFinite(totalPages) && totalPages > 0) {
            if (page >= totalPages) break;
            continue;
        }
        if (Number.isFinite(total) && total >= 0) {
            if (records.length >= total) break;
            // If API says there are more records, continue even if a page is short.
            continue;
        }
        if (pageRecords.length < pageSize) break;
    }

    return records;
}

function asDate(value, fallback) {
    if (!value) return fallback;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date;
}

function sitemapEntry(url, lastModified, changeFrequency, priority, now) {
    return {
        url,
        lastModified: asDate(lastModified, now),
        changeFrequency,
        priority
    };
}

function isPublished(record) {
    if (!record || record.isActive === false || record.isDeleted === true) return false;
    if (record.deletedAt) return false;
    if (record.isPublished === false || record.published === false) return false;
    const status = String(record.status || '').toLowerCase();
    if (['draft', 'private', 'deleted', 'archived', 'inactive', 'pending'].includes(status)) return false;
    return true;
}

function identifier(record) {
    return record?._id ?? record?.id ?? null;
}

function encodePathPart(value) {
    return encodeURIComponent(String(value));
}

function uniqueByUrl(entries) {
    const unique = new Map();
    for (const entry of entries) {
        if (entry?.url && entry.url.startsWith(siteUrl)) unique.set(entry.url, entry);
    }
    return [...unique.values()];
}

export default async function sitemap() {
    const now = new Date();

    const staticPages = staticRoutes.map((route) =>
        sitemapEntry(
            `${siteUrl}${route === '/' ? '' : route}`,
            null,
            route === '/documentation' || route === '/hs-codes' ? 'weekly' : 'monthly',
            route === '/global-trade-directory' ? 0.9 : 0.7,
            now
        )
    );

    // Use existing public APIs only. No backend code or schema changes required.
    const [documentation, hsCodes, posts, allTopics, trendingTopics, users] = await Promise.all([
        fetchAllPages('/documentation', ['documentation', 'documents', 'items']),
        fetchAllPages('/hs-codes', ['hsCodes', 'hsCode', 'items']),
        fetchAllPages('/posts', ['posts', 'items']),
        fetchAllPages('/topics', ['topics', 'items']),
        fetchJson('/topics/trending'),
        fetchAllPages('/users/search', ['users', 'items'])
    ]);

    const topicRecords = [
        ...allTopics,
        ...getCollection(trendingTopics, ['topics', 'trendingTopics', 'items'])
    ];

    const documentationPages = documentation
        .filter((item) => isPublished(item) && (item.slug || identifier(item)))
        .map((item) => {
            const idOrSlug = item.slug || identifier(item);
            return sitemapEntry(
                `${siteUrl}/documentation/${encodePathPart(idOrSlug)}`,
                item.updatedAt || item.modifiedAt || item.createdAt || item.publishedAt,
                'weekly',
                0.8,
                now
            );
        });

    const hsCodePages = hsCodes
        .filter((item) => isPublished(item) && identifier(item))
        .map((item) => sitemapEntry(
            `${siteUrl}/hs-codes/${encodePathPart(identifier(item))}`,
            item.updatedAt || item.modifiedAt || item.createdAt,
            'monthly',
            0.7,
            now
        ));

    const postPages = posts
        .filter((item) => isPublished(item) &&
            String(item.visibility || item.privacy || 'public').toLowerCase() === 'public' &&
            identifier(item))
        .map((item) => sitemapEntry(
            `${siteUrl}/posts/${encodePathPart(identifier(item))}`,
            item.updatedAt || item.modifiedAt || item.createdAt || item.publishedAt,
            'weekly',
            0.7,
            now
        ));

    const topicPages = topicRecords
        .filter((item) => isPublished(item) && item.slug)
        .map((item) => sitemapEntry(
            `${siteUrl}/topics/${encodePathPart(item.slug)}`,
            item.updatedAt || item.modifiedAt || item.createdAt,
            'daily',
            0.7,
            now
        ));

    const profilePages = users
        .filter((item) => isPublished(item) && identifier(item) &&
            item.isPrivate !== true && item.profilePublic !== false)
        .map((item) => sitemapEntry(
            `${siteUrl}/profile/${encodePathPart(identifier(item))}`,
            item.updatedAt || item.modifiedAt || item.createdAt,
            'monthly',
            0.5,
            now
        ));

    return uniqueByUrl([
        ...staticPages,
        ...documentationPages,
        ...hsCodePages,
        ...postPages,
        ...topicPages,
        ...profilePages
    ]);
}
