const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lynktoday.com';

export default function sitemap() {
    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1
        },
        {
            url: `${siteUrl}/discover`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${siteUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${siteUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8
        },
        {
            url: `${siteUrl}/documentation`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${siteUrl}/topics`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8
        },
        {
            url: `${siteUrl}/hs-codes`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        }
    ];
}