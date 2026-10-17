import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Create HS Code",
    description: "Create an HS Code entry on LynkToday.",
    path: "/hs-codes/create",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
