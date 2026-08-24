import '@/app/globals.css';

import ClientLayout from './ClientLayout';

import { createMetadata } from '@/seo/metadata';


// ======================================================
// GLOBAL SEO METADATA
// ======================================================

export const metadata = createMetadata({
    title: 'LynkToday | Global Trade & Logistics Network',

    description:
        'LynkToday is a professional network for global trade, logistics, freight forwarding, customs, shipping, supply chain and international business professionals.',

    path: '/'
});


// ======================================================
// ROOT LAYOUT
// ======================================================

export default function RootLayout({
    children
}) {

    return (

        <html lang="en">

            <body>

                <ClientLayout>
                    {children}
                </ClientLayout>

            </body>

        </html>

    );

}