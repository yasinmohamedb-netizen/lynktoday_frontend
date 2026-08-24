import { createMetadata } from '@/seo/metadata';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

async function getHSCode(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/hs-codes/id/${encodeURIComponent(id)}`,
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

        if (!data?.success) {
            return null;
        }

        return (
            data.hsCode ||
            data.data ||
            null
        );
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;

    const hsCode = await getHSCode(id);

    if (!hsCode) {
        return createMetadata({
            title: 'HS Code Not Found',
            description:
                'The requested HS Code could not be found on LynkToday.',
            path: `/hs-codes/${id}`,
            noIndex: true
        });
    }

    const code =
        hsCode.hsCode || id;

    const description =
        hsCode.description ||
        'HS Code classification and tariff information on LynkToday.';

    const title =
        `HS Code ${code}`;

    return createMetadata({
        title,
        description,
        path: `/hs-codes/${id}`
    });
}

export default function HSCodeLayout({
    children
}) {
    return children;
}