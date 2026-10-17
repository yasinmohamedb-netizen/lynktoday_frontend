import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Privacy Policy",
    description: "Read the LynkToday privacy policy and learn how information is handled.",
    path: "/settings/privacy-policy",
    noIndex: false
});

export default function RouteLayout({ children }) {
    return children;
}
