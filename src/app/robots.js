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
                '/messages',
                '/notifications',
                '/my-posts',
                '/saved',
                '/documentation/create',
                '/admin',
                '/api/'
            ]
        },

        sitemap: `${siteUrl}/sitemap.xml`
    };
}