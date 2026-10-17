import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Saved Items",
    description: "Your saved LynkToday posts and resources.",
    path: "/saved",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
