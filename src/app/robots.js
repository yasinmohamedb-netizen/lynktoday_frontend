const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lynktoday.com';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/login',
                '/signup',
                '/notifications',
                '/messages',
                '/settings',
                '/saved-posts',
                '/profile/edit',
                '/admin',
                '/api/'
            ]
        },

        sitemap: `${siteUrl}/sitemap.xml`
    };
}