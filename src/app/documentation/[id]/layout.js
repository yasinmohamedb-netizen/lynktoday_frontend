import { createMetadata } from '@/seo/metadata';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

async function getDocumentation(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/documentation/${encodeURIComponent(id)}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                next: {
                    revalidate: 3600
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return (
            data?.documentation ||
            data?.document ||
            data?.data ||
            null
        );
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;

    const document = await getDocumentation(id);

    if (!document) {
        return createMetadata({
            title: 'Documentation Not Found',
            description:
                'The requested LynkToday documentation could not be found.',
            path: `/documentation/${id}`,
            noIndex: true
        });
    }

    const title =
        document.title ||
        'Trade & Logistics Documentation';

    const description =
        document.description ||
        'Practical trade, customs, shipping and logistics knowledge on LynkToday.';

    return createMetadata({
        title,
        description,
        path: `/documentation/${id}`
    });
}

export default function DocumentationDetailsLayout({
    children
}) {
    return children;
}