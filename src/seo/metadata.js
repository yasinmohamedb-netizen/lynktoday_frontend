import {
    SITE_NAME,
    SITE_URL,
    DEFAULT_TITLE,
    DEFAULT_DESCRIPTION,
    DEFAULT_OG_IMAGE
} from './config';

export function createMetadata({
    title,
    description,
    path = '/',
    image,
    noIndex = false
} = {}) {

    const finalTitle =
        title
            ? `${title} | ${SITE_NAME}`
            : DEFAULT_TITLE;

    const finalDescription =
        description || DEFAULT_DESCRIPTION;

    const canonicalUrl =
        `${SITE_URL}${path}`;

    const ogImage =
        image || DEFAULT_OG_IMAGE;

    return {

        title: finalTitle,

        description: finalDescription,

        metadataBase:
            new URL(SITE_URL),

        alternates: {
            canonical: canonicalUrl
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

            locale: 'en_US',

            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: finalTitle
                }
            ]
        },

        twitter: {
            card: 'summary_large_image',

            title: finalTitle,

            description: finalDescription,

            images: [ogImage]
        }
    };
}
