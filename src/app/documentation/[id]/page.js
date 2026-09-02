import { notFound } from 'next/navigation';

import DocumentationDetailsClient from './DocumentationDetailsClient';


// ======================================================
// API
// ======================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// SITE URL
// ======================================================

const SITE_URL =
    (
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://www.lynktoday.com'
    ).replace(/\/$/, '');


// ======================================================
// GET DOCUMENTATION
// ======================================================

async function getDocumentation(value) {

    try {

        if (!value) {
            return null;
        }

        const response =
            await fetch(
                `${API_BASE_URL}/documentation/${encodeURIComponent(
                    String(value)
                )}`,
                {
                    method: 'GET',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    next: {
                        revalidate: 3600
                    }
                }
            );


        if (!response.ok) {

            console.error(
                'Documentation API returned:',
                response.status
            );

            return null;
        }


        const data =
            await response.json();


        return (
            data.documentation ||
            data.document ||
            data.data ||
            null
        );

    } catch (error) {

        console.error(
            'Server documentation fetch error:',
            error
        );

        return null;
    }
}


// ======================================================
// ARTICLE STRUCTURED DATA
// ======================================================

function createArticleStructuredData(
    document
) {

    const slug =
        document?.slug ||
        document?._id ||
        document?.id;


    const documentUrl =
        `${SITE_URL}/documentation/${encodeURIComponent(
            String(slug)
        )}`;


    const structuredData = {

        '@context':
            'https://schema.org',

        '@type':
            'TechArticle',

        '@id':
            `${documentUrl}#article`,


        headline:
            document?.title ||
            'LynkToday Documentation',


        description:
            document?.description ||
            'Trade, customs, shipping and logistics documentation.',


        url:
            documentUrl,


        mainEntityOfPage: {

            '@type':
                'WebPage',

            '@id':
                documentUrl
        },


        publisher: {

            '@type':
                'Organization',

            name:
                'LynkToday',

            url:
                SITE_URL
        }

    };


    // --------------------------------------------------
    // Published Date
    // --------------------------------------------------

    if (document?.createdAt) {

        structuredData.datePublished =
            document.createdAt;
    }


    // --------------------------------------------------
    // Modified Date
    // --------------------------------------------------

    if (document?.updatedAt) {

        structuredData.dateModified =
            document.updatedAt;
    }


    // --------------------------------------------------
    // Keywords
    // --------------------------------------------------

    if (
        Array.isArray(document?.tags) &&
        document.tags.length > 0
    ) {

        structuredData.keywords =
            document.tags.join(', ');
    }


    // --------------------------------------------------
    // Category
    // --------------------------------------------------

    if (document?.category) {

        structuredData.articleSection =
            document.category;
    }


    return structuredData;
}


// ======================================================
// BREADCRUMB STRUCTURED DATA
// ======================================================

function createBreadcrumbStructuredData(
    document
) {

    const slug =
        document?.slug ||
        document?._id ||
        document?.id;


    const category =
        document?.category ||
        'General';


    const title =
        document?.title ||
        'Documentation';


    const documentUrl =
        `${SITE_URL}/documentation/${encodeURIComponent(
            String(slug)
        )}`;


    return {

        '@context':
            'https://schema.org',

        '@type':
            'BreadcrumbList',

        '@id':
            `${documentUrl}#breadcrumb`,


        itemListElement: [

            // ------------------------------------------
            // HOME
            // ------------------------------------------

            {

                '@type':
                    'ListItem',

                position:
                    1,

                name:
                    'Home',

                item:
                    SITE_URL
            },


            // ------------------------------------------
            // DOCUMENTATION
            // ------------------------------------------

            {

                '@type':
                    'ListItem',

                position:
                    2,

                name:
                    'Documentation',

                item:
                    `${SITE_URL}/documentation`
            },


            // ------------------------------------------
            // CATEGORY
            // ------------------------------------------

            {

                '@type':
                    'ListItem',

                position:
                    3,

                name:
                    category,

                item:
                    `${SITE_URL}/documentation`
            },


            // ------------------------------------------
            // CURRENT DOCUMENT
            // ------------------------------------------

            {

                '@type':
                    'ListItem',

                position:
                    4,

                name:
                    title,

                item:
                    documentUrl
            }

        ]

    };
}


// ======================================================
// PAGE
// ======================================================

export default async function DocumentationDetailsPage({
    params
}) {


    // ==================================================
    // RESOLVE PARAMS
    // ==================================================

    const resolvedParams =
        await params;


    const id =
        resolvedParams?.id;


    // ==================================================
    // INVALID URL
    // ==================================================

    if (!id) {

        notFound();
    }


    // ==================================================
    // FETCH DOCUMENT
    // ==================================================

    const document =
        await getDocumentation(id);


    // ==================================================
    // DOCUMENT NOT FOUND
    // ==================================================

    if (!document) {

        notFound();
    }


    // ==================================================
    // DOCUMENT SLUG
    // ==================================================

    const slug =
        document.slug ||
        document._id ||
        document.id;


    // ==================================================
    // CANONICAL URL
    // ==================================================

    const canonicalUrl =
        `${SITE_URL}/documentation/${encodeURIComponent(
            String(slug)
        )}`;


    // ==================================================
    // STRUCTURED DATA
    // ==================================================

    const articleStructuredData =
        createArticleStructuredData(
            document
        );


    const breadcrumbStructuredData =
        createBreadcrumbStructuredData(
            document
        );


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <>

            {/* ==================================================
                ARTICLE STRUCTURED DATA
            ================================================== */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            articleStructuredData
                        )
                }}
            />


            {/* ==================================================
                BREADCRUMB STRUCTURED DATA
            ================================================== */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            breadcrumbStructuredData
                        )
                }}
            />


            {/* ==================================================
                DOCUMENTATION UI
            ================================================== */}

            <DocumentationDetailsClient
                initialDocument={
                    document
                }

                documentId={
                    String(id)
                }

                canonicalUrl={
                    canonicalUrl
                }
            />

        </>

    );
}