import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Help & Support',
    description:
        'Find answers and support for LynkToday, including profiles, posts, messaging, trade documentation, HS codes and account settings.',
    path: '/help'
});

export default function HelpLayout({ children }) {
    return children;
}