import {
    SITE_NAME,
    SITE_URL,
    DEFAULT_TITLE,
    DEFAULT_DESCRIPTION
} from './config';

export function createMetadata({
    title,
    description,
    path = '/',
    image,
    noIndex = false
} = {}) {

    const finalTitle =
        title || DEFAULT_TITLE;

    const finalDescription =
        description || DEFAULT_DESCRIPTION;

    const canonicalUrl =
        `${SITE_URL}${path}`;

    return {

        title: finalTitle,

        description: finalDescription,

        alternates: {
            canonical: path
        },

        robots: noIndex
            ? {
                index: false,
                follow: true
            }
            : {
                index: true,
                follow: true,

                googleBot: {
                    index: true,
                    follow: true,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                    'max-video-preview': -1
                }
            },

        openGraph: {
            type: 'website',

            url: canonicalUrl,

            siteName: SITE_NAME,

            title: finalTitle,

            description: finalDescription,

            ...(image
                ? {
                    images: [
                        {
                            url: image,
                            width: 1200,
                            height: 630,
                            alt: finalTitle
                        }
                    ]
                }
                : {})
        },

        twitter: {
            card: image
                ? 'summary_large_image'
                : 'summary',

            title: finalTitle,

            description: finalDescription,

            ...(image
                ? {
                    images: [image]
                }
                : {})
        }
    };
}