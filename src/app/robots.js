const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lynktoday.com';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/connections',
                '/discover',
                '/messages',
                '/notifications',
                '/my-posts',
                '/saved',
                '/settings',
                '/documentation/create',
                '/search',
                '/admin',
                '/api/'
            ]
        },

        sitemap: `${siteUrl}/sitemap.xml`
    };
}