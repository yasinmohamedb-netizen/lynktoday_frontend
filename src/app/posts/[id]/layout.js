import { createMetadata } from '@/seo/metadata';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

async function getPost(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/posts/${encodeURIComponent(id)}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                next: {
                    revalidate: 300
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

        return data.post || null;

    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;

    const post = await getPost(id);

    if (!post) {
        return createMetadata({
            title: 'Discussion Not Found',
            description:
                'The requested LynkToday community discussion could not be found.',
            path: `/posts/${id}`,
            noIndex: true
        });
    }

    const title =
        post.title ||
        'Community Discussion';

    const category =
        post.category
            ? ` ${post.category}`
            : '';

    const description =
        `Join this LynkToday${category} discussion and explore insights from the global trade and logistics community.`;

    return createMetadata({
        title,
        description,
        path: `/posts/${id}`
    });
}

export default function PostLayout({ children }) {
    return children;
}