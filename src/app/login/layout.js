import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: "Login",
    description: "Sign in to your LynkToday account to access your global trade and logistics network.",
    path: "/login",
    noIndex: true
});

export default function RouteLayout({ children }) {
    return children;
}
