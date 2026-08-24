import { createMetadata } from '@/seo/metadata';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

async function getProfile(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/profile/${encodeURIComponent(id)}`,
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

        if (!data?.success || !data?.user) {
            return null;
        }

        return data.user;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;

    const user = await getProfile(id);

    if (!user) {
        return createMetadata({
            title: 'Profile Not Found',
            description:
                'The requested LynkToday profile could not be found.',
            path: `/profile/${id}`,
            noIndex: true
        });
    }

    const name =
        user.fullName ||
        user.name ||
        'LynkToday Professional';

    const profession =
        user.profession ||
        user.jobTitle ||
        '';

    const company =
        user.company ||
        user.companyName ||
        '';

    const profileType =
        user.accountType === 'company'
            ? 'Company'
            : 'Professional';

    const title =
        profession && company
            ? `${name} | ${profession} at ${company}`
            : profession
                ? `${name} | ${profession}`
                : `${name} | ${profileType} Profile`;

    const description =
        profession && company
            ? `${name} is a ${profession} at ${company}. View their professional profile and connect through LynkToday.`
            : profession
                ? `${name} is a ${profession}. View their professional profile and connect through LynkToday.`
                : `View ${name}'s professional profile on LynkToday, a global trade and logistics network.`;

    return createMetadata({
        title,
        description,
        path: `/profile/${id}`
    });
}

export default function ProfileLayout({ children }) {
    return children;
}