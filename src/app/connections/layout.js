import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Connections",
    description: "Manage your professional connections on LynkToday.",
    path: "/connections",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
