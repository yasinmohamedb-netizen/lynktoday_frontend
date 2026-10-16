import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Import, Export & Freight Requirements',
    description:
        'Discover business requirements for imports, exports, sea freight, air freight, road transport, customs, warehousing and trade documentation on LynkToday.',
    path: '/trade-requirements'
});

export default function TradeRequirementsLayout({ children }) {
    return children;
}
