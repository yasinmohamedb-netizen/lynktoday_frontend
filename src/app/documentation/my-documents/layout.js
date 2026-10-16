import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "My Documentation",
    description: "Manage your published LynkToday documentation.",
    path: "/documentation/my-documents",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
