import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Global Trade Directory',
    description:
        'Find official customs, import-export, tariff, shipping, port and product-compliance resources for India, the United States and China. Free public access with curated links to official government trade services.',
    path: '/global-trade-directory'
});

export default function GlobalTradeDirectoryLayout({ children }) {
    return children;
}
