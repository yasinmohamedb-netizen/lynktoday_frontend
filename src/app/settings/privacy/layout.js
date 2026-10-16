import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Privacy Settings Guide",
    description: "Learn about privacy controls available on LynkToday.",
    path: "/settings/privacy",
    noIndex: false
});

export default function RouteLayout({ children }) {
    return children;
}
