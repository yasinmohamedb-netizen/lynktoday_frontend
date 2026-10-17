import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "My Profile",
    description: "Manage your LynkToday professional profile.",
    path: "/profile",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
