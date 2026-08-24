const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lynktoday.com';

export const metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: 'LynkToday | Global Trade & Logistics Network',
        template: '%s | LynkToday'
    },

    description:
        'LynkToday is a professional network for global trade, logistics, freight forwarding, customs, shipping, supply chain and international business professionals.',

    keywords: [
        'LynkToday',
        'global trade',
        'logistics',
        'freight forwarding',
        'shipping',
        'customs clearance',
        'import export',
        'supply chain',
        'international trade',
        'cargo',
        'customs',
        'trade professionals'
    ],

    applicationName: 'LynkToday',

    authors: [
        {
            name: 'LynkToday'
        }
    ],

    creator: 'LynkToday',
    publisher: 'LynkToday',

    alternates: {
        canonical: '/'
    },

    robots: {
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
        url: siteUrl,
        siteName: 'LynkToday',

        title:
            'LynkToday | Global Trade & Logistics Network',

        description:
            'Connect with professionals, discover trade opportunities and stay informed about global trade, logistics, shipping and supply chain.',

        locale: 'en_IN'
    },

    twitter: {
        card: 'summary_large_image',

        title:
            'LynkToday | Global Trade & Logistics Network',

        description:
            'A professional network for global trade, logistics, freight forwarding, customs, shipping and supply chain professionals.'
    },

    category: 'business'
};