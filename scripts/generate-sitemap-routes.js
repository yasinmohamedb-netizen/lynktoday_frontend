const fs = require('node:fs');
const path = require('node:path');

const appDirectory = path.join(process.cwd(), 'src', 'app');
const outputFile = path.join(
    process.cwd(),
    'src',
    'data',
    'generatedStaticRoutes.json'
);

const excludedExactRoutes = new Set([
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/discover',
    '/connections',
    '/messages',
    '/notifications',
    '/my-posts',
    '/saved',
    '/search',
    '/profile',
    '/settings',
    '/documentation/create',
    '/documentation/my-documents',
    '/hs-codes/create',
    '/hs-codes/edit',
    '/news'
]);

const excludedPrefixes = [
    '/admin',
    '/api',
    '/connections',
    '/messages',
    '/notifications',
    '/my-posts',
    '/saved',
    '/search',
    '/documentation/create',
    '/documentation/my-documents',
    '/hs-codes/create',
    '/hs-codes/edit'
];

const explicitlyPublicSettingsRoutes = new Set([
    '/settings/privacy-policy',
    '/settings/privacy',
    '/settings/terms'
]);

function walk(directory, segments = []) {
    const routes = [];

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            // Ignore Next.js private folders and API routes.
            if (entry.name.startsWith('_') || entry.name === 'api') {
                continue;
            }

            const nextSegments =
                entry.name.startsWith('(') && entry.name.endsWith(')')
                    ? segments
                    : [...segments, entry.name];

            routes.push(...walk(fullPath, nextSegments));
            continue;
        }

        if (!/^page\.(js|jsx|ts|tsx)$/.test(entry.name)) {
            continue;
        }

        // Dynamic routes are populated from public API data in sitemap.js.
        if (segments.some(segment => segment.startsWith('[') && segment.endsWith(']'))) {
            continue;
        }

        const route = '/' + segments.join('/');
        routes.push(route === '/' ? '/' : route.replace(/\/$/, ''));
    }

    return routes;
}

function isIndexableStaticRoute(route) {
    if (excludedExactRoutes.has(route)) {
        return false;
    }

    if (
        excludedPrefixes.some(prefix =>
            route === prefix || route.startsWith(prefix + '/')
        )
    ) {
        return false;
    }

    if (route.startsWith('/settings/')) {
        return explicitlyPublicSettingsRoutes.has(route);
    }

    return true;
}

function main() {
    const routes = [...new Set(
        walk(appDirectory).filter(isIndexableStaticRoute)
    )].sort();

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(routes, null, 2) + '\n');

    console.log(
        `Generated ${routes.length} public static routes for the sitemap.`
    );
}

main();
