import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Trade & Logistics Documentation',
    description:
        'Explore practical documentation and knowledge covering customs, import, export, DGFT, GST, FEMA, HS codes, shipping and logistics.',
    path: '/documentation'
});

export default function DocumentationLayout({ children }) {
    return children;
}