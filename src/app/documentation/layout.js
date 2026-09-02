import { createMetadata } from '@/seo/metadata';

export const metadata = createMetadata({
    title: 'Import, Export & Trade Documentation',
    description:
        'Explore practical guides and documentation covering import, export, customs, DGFT, GST, FEMA, HS codes, shipping, freight forwarding and global trade.',
    path: '/documentation'
});

export default function DocumentationLayout({ children }) {
    return children;
}