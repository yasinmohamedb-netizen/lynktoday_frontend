import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'HS Code Search & Lookup',
    description:
        'Search international HS codes, product classifications and customs tariff information for import and export shipments on LynkToday.',
    path: '/hs-codes'
});

export default function HSCodesLayout({ children }) {
    return children;
}
