import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Create Documentation",
    description: "Create trade, customs, import-export and logistics documentation on LynkToday.",
    path: "/documentation/create",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
