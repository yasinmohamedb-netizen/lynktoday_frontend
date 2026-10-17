import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Join LynkToday",
    description: "Create a LynkToday account to connect with global trade, logistics, freight forwarding and shipping professionals.",
    path: "/signup",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
