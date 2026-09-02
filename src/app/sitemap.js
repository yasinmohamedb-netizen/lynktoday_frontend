const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lynktoday.com';

const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

async function fetchJson(endpoint) {
    try {
        const response = await fetch(
            `${apiUrl}${endpoint}`,
            {
                next: {
                    revalidate: 3600
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

export default async function sitemap() {
    const now = new Date();

    const staticPages = [
        {
            url: siteUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1
        },
        {
            url: `${siteUrl}/discover`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${siteUrl}/documentation`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${siteUrl}/help`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6
        }
    ];

    const [
        documentationData,
        hsCodeData,
        postsData,
        topicsData
    ] = await Promise.all([
        fetchJson('/documentation?limit=100'),
        fetchJson('/hs-codes?limit=100'),
        fetchJson('/posts?limit=100'),
        fetchJson('/topics/trending')
    ]);

    const documentation =
        Array.isArray(
            documentationData?.documentation
        )
            ? documentationData.documentation
            : [];

    const documentationPages =
        documentation
            .filter(
                document =>
                    document?.slug ||
                    document?._id
            )
            .map(
                document => {
                    const identifier =
                        document.slug ||
                        document._id;

                    return {
                        url:
                            `${siteUrl}/documentation/${encodeURIComponent(
                                String(identifier)
                            )}`,

                        lastModified:
                            document.updatedAt ||
                            document.createdAt ||
                            now,

                        changeFrequency:
                            'weekly',

                        priority:
                            0.8
                    };
                }
            );

    const hsCodes =
        Array.isArray(
            hsCodeData?.hsCodes
        )
            ? hsCodeData.hsCodes
            : [];

    const hsCodePages =
        hsCodes
            .filter(
                hsCode =>
                    hsCode?._id
            )
            .map(
                hsCode => ({
                    url:
                        `${siteUrl}/hs-codes/${hsCode._id}`,

                    lastModified:
                        hsCode.updatedAt ||
                        hsCode.createdAt ||
                        now,

                    changeFrequency:
                        'monthly',

                    priority:
                        0.7
                })
            );

    const posts =
        Array.isArray(
            postsData?.posts
        )
            ? postsData.posts
            : [];

    const postPages =
        posts
            .filter(
                post =>
                    post?._id
            )
            .map(
                post => ({
                    url:
                        `${siteUrl}/posts/${post._id}`,

                    lastModified:
                        post.updatedAt ||
                        post.createdAt ||
                        now,

                    changeFrequency:
                        'weekly',

                    priority:
                        0.7
                })
            );

    const topics =
        Array.isArray(
            topicsData?.topics
        )
            ? topicsData.topics
            : [];

    const topicPages =
        topics
            .filter(
                topic =>
                    topic?.slug
            )
            .map(
                topic => ({
                    url:
                        `${siteUrl}/topics/${encodeURIComponent(
                            String(topic.slug)
                        )}`,

                    lastModified:
                        now,

                    changeFrequency:
                        'daily',

                    priority:
                        0.7
                })
            );

    return [
        ...staticPages,
        ...documentationPages,
        ...hsCodePages,
        ...postPages,
        ...topicPages
    ];
}