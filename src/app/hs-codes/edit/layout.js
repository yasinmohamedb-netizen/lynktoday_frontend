import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Edit HS Code',
    description: 'Edit a private HS Code entry on LynkToday.',
    path: '/hs-codes/edit',
    noIndex: true
});

export default function EditHSCodeLayout({ children }) {
    return children;
}
