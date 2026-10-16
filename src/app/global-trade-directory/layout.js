import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Global Trade Directory',
    description:
        'Find official customs, import-export, shipping, port, tax and product compliance resources for India. Free public access, no login required.',
    path: '/global-trade-directory'
});

export default function GlobalTradeDirectoryLayout({ children }) {
    return children;
}
