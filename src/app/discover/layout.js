import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Discover Trade & Logistics Professionals',
    description:
        'Discover professionals and companies across global trade, logistics, freight forwarding, customs, shipping and supply chain.',
    path: '/discover'
});

export default function DiscoverLayout({ children }) {
    return children;
}