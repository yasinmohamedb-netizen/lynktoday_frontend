import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Notifications",
    description: "Your LynkToday account notifications.",
    path: "/notifications",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
