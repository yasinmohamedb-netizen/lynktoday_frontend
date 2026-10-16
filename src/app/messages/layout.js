import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Messages",
    description: "Private LynkToday member messages.",
    path: "/messages",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
