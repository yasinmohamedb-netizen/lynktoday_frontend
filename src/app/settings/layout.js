import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Account Settings",
    description: "Private LynkToday account settings.",
    path: "/settings",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
