import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Search",
    description: "Search LynkToday trade and logistics content.",
    path: "/search",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
