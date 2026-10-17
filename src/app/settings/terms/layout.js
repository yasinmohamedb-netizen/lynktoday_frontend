import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Terms of Service",
    description: "Read the terms governing use of LynkToday.",
    path: "/settings/terms",
    noIndex: false
});

export default function RouteLayout({ children }) {
    return children;
}
