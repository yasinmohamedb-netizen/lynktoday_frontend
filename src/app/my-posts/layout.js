import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "My Posts",
    description: "Manage your LynkToday posts.",
    path: "/my-posts",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
