import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Logistics Operations Support',
    description:
        'Explore logistics operations support for freight forwarding, shipping, customs clearance, transport and supply chain activities on LynkToday.',
    path: '/logistics-operations-support'
});

export default function LogisticsOperationsSupportLayout({ children }) {
    return children;
}
