import { createMetadata } from '@/seo/metadata';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

async function getTopic(slug) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/topics/${encodeURIComponent(slug)}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                next: {
                    revalidate: 600
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data?.success || !data?.topic) {
            return null;
        }

        return data.topic;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const topic = await getTopic(slug);

    if (!topic) {
        return createMetadata({
            title: 'Topic Not Found',
            description:
                'The requested LynkToday trade and logistics topic could not be found.',
            path: `/topics/${slug}`,
            noIndex: true
        });
    }

    const topicName =
        topic.name || slug;

    return createMetadata({
        title: `${topicName} — Trade & Logistics`,
        description:
            `Explore LynkToday community discussions and trade documentation related to ${topicName}.`,
        path: `/topics/${slug}`
    });
}

export default function TopicLayout({ children }) {
    return children;
}