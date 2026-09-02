'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './details.module.css';


// ======================================================
// API
// ======================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// SEMANTIC DOCUMENTATION CONTENT
// ======================================================

const isDocumentationHeading = line => {

    const value =
        String(line || '').trim();


    if (!value) {
        return false;
    }


    // --------------------------------------------------
    // STEP HEADINGS
    // --------------------------------------------------

    if (
        /^STEP\s+\d+\s*:/i.test(value)
    ) {
        return true;
    }


    // --------------------------------------------------
    // KNOWN SECTION HEADINGS
    // --------------------------------------------------

    if (
        /^(WHAT IS|COMMON MISTAKES|IMPORT PROCESS AT A GLANCE|EXPORT PROCESS AT A GLANCE|PROCESS AT A GLANCE|WHO CAN HELP|FINAL CHECKLIST|CHECKLIST|CONCLUSION|INTRODUCTION)$/i.test(
            value
        )
    ) {
        return true;
    }


    // --------------------------------------------------
    // ALL-CAPS HEADINGS
    // --------------------------------------------------

    return (
        value === value.toUpperCase() &&
        /[A-Z]/.test(value) &&
        value.length >= 4 &&
        value.length <= 120
    );

};


// ======================================================
// RENDER DOCUMENTATION CONTENT
// ======================================================

const renderDocumentationContent = content => {

    if (!content) {

        return (
            <p>
                No content available.
            </p>
        );

    }


    const lines =
        String(content)
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n');


    const elements = [];

    let bullets = [];


    // ==================================================
    // FLUSH BULLET LIST
    // ==================================================

    const flushBullets = () => {

        if (
            bullets.length === 0
        ) {
            return;
        }


        elements.push(

            <ul
                key={`list-${elements.length}`}
            >

                {
                    bullets.map(
                        (
                            item,
                            index
                        ) => (

                            <li
                                key={`item-${index}`}
                            >
                                {item}
                            </li>

                        )
                    )
                }

            </ul>

        );


        bullets = [];

    };


    // ==================================================
    // PROCESS EACH LINE
    // ==================================================

    lines.forEach(
        (
            rawLine,
            index
        ) => {

            const line =
                String(
                    rawLine || ''
                ).trim();


            // ------------------------------------------
            // EMPTY LINE
            // ------------------------------------------

            if (!line) {

                flushBullets();

                return;
            }


            // ------------------------------------------
            // BULLET
            // ------------------------------------------

            if (
                /^[-•*]\s+/.test(line)
            ) {

                bullets.push(
                    line
                        .replace(
                            /^[-•*]\s+/,
                            ''
                        )
                        .trim()
                );

                return;
            }


            // ------------------------------------------
            // FLUSH PREVIOUS BULLETS
            // ------------------------------------------

            flushBullets();


            // ------------------------------------------
            // HEADING
            // ------------------------------------------

            if (
                isDocumentationHeading(
                    line
                )
            ) {

                elements.push(

                    <h2
                        key={`heading-${index}`}
                    >
                        {line}
                    </h2>

                );

                return;
            }


            // ------------------------------------------
            // NORMAL PARAGRAPH
            // ------------------------------------------

            elements.push(

                <p
                    key={`paragraph-${index}`}
                >
                    {line}
                </p>

            );

        }
    );


    // ==================================================
    // FLUSH REMAINING BULLETS
    // ==================================================

    flushBullets();


    return elements;

};


// ======================================================
// PAGE
// ======================================================

export default function DocumentationDetailsClient({

    params,

    initialDocument = null

}) {


    // ==================================================
    // DOCUMENT STATE
    // ==================================================

    const [document, setDocument] =
        useState(
            initialDocument
        );


    // ==================================================
    // LOADING STATE
    // ==================================================

    const [loading, setLoading] =
        useState(
            !initialDocument
        );


    // ==================================================
    // ERROR STATE
    // ==================================================

    const [error, setError] =
        useState('');


    // ==================================================
    // READING PROGRESS
    // ==================================================

    const [readingProgress, setReadingProgress] =
        useState(0);


    // ==================================================
    // LOAD DOCUMENT
    // ==================================================

    useEffect(() => {


        // ------------------------------------------------
        // SERVER ALREADY PROVIDED DOCUMENT
        // ------------------------------------------------

        if (
            initialDocument
        ) {

            return;

        }


        // ------------------------------------------------
        // FALLBACK CLIENT FETCH
        // ------------------------------------------------

        const loadDocument =
            async () => {

                try {

                    setLoading(true);

                    setError('');


                    // ------------------------------------
                    // RESOLVE PARAMS
                    // ------------------------------------

                    const resolvedParams =
                        await params;


                    const id =
                        resolvedParams.id;


                    // ------------------------------------
                    // API REQUEST
                    // ------------------------------------

                    const response =
                        await fetch(

                            `${API_BASE_URL}/documentation/${encodeURIComponent(
                                id
                            )}`,

                            {
                                method: 'GET',

                                headers: {

                                    'Content-Type':
                                        'application/json'

                                },

                                cache:
                                    'no-store'
                            }

                        );


                    // ------------------------------------
                    // RESPONSE DATA
                    // ------------------------------------

                    const data =
                        await response.json();


                    // ------------------------------------
                    // ERROR
                    // ------------------------------------

                    if (
                        !response.ok
                    ) {

                        throw new Error(

                            data.message ||
                            'Documentation not found.'

                        );

                    }


                    // ------------------------------------
                    // SET DOCUMENT
                    // ------------------------------------

                    setDocument(

                        data.documentation ||
                        data.document ||
                        data.data

                    );


                } catch (
                    error
                ) {

                    console.error(

                        'Documentation details error:',

                        error

                    );


                    setError(

                        error.message ||
                        'Unable to load documentation.'

                    );


                } finally {

                    setLoading(false);

                }

            };


        loadDocument();


    }, [
        params,
        initialDocument
    ]);


    // ==================================================
    // READING PROGRESS
    // ==================================================

    useEffect(() => {


        const handleScroll = () => {


            // ------------------------------------------
            // SCROLL TOP
            // ------------------------------------------

            const scrollTop =
                window.scrollY;


            // ------------------------------------------
            // DOCUMENT HEIGHT
            // ------------------------------------------

            const documentHeight =

                window.document
                    .documentElement
                    .scrollHeight -

                window.innerHeight;


            // ------------------------------------------
            // EMPTY DOCUMENT
            // ------------------------------------------

            if (
                documentHeight <= 0
            ) {

                setReadingProgress(0);

                return;

            }


            // ------------------------------------------
            // CALCULATE PROGRESS
            // ------------------------------------------

            const progress =

                (
                    scrollTop /
                    documentHeight
                ) * 100;


            // ------------------------------------------
            // LIMIT 0 - 100
            // ------------------------------------------

            setReadingProgress(

                Math.min(

                    100,

                    Math.max(
                        0,
                        progress
                    )

                )

            );

        };


        // ----------------------------------------------
        // EVENT
        // ----------------------------------------------

        window.addEventListener(

            'scroll',

            handleScroll,

            {
                passive: true
            }

        );


        // ----------------------------------------------
        // INITIAL
        // ----------------------------------------------

        handleScroll();


        // ----------------------------------------------
        // CLEANUP
        // ----------------------------------------------

        return () => {

            window.removeEventListener(

                'scroll',

                handleScroll

            );

        };

    }, []);


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.container
                    }
                >

                    <div
                        className={
                            styles.loadingCard
                        }
                    >

                        <div
                            className={
                                styles.spinner
                            }
                        />

                        <h2>
                            Loading documentation
                        </h2>

                        <p>
                            Preparing the document for you...
                        </p>

                    </div>

                </div>

            </main>

        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (
        error ||
        !document
    ) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.container
                    }
                >

                    <div
                        className={
                            styles.errorCard
                        }
                    >

                        <div
                            className={
                                styles.errorIcon
                            }
                        >
                            !
                        </div>


                        <h2>
                            Documentation not found
                        </h2>


                        <p>

                            {
                                error ||
                                'This document may have been removed.'
                            }

                        </p>


                        <Link

                            href="/documentation"

                            className={
                                styles.primaryButton
                            }

                        >
                            Explore Documentation
                        </Link>

                    </div>

                </div>

            </main>

        );

    }


    // ==================================================
    // DATA
    // ==================================================

    const documentType =
        document.documentType ||
        'DOCUMENT';


    const category =
        document.category ||
        'General';


    const documentationSlug =
        document.slug ||
        document._id ||
        document.id;


    const documentationHref =
        `/documentation/${encodeURIComponent(
            String(
                documentationSlug
            )
        )}`;


    const title =
        document.title ||
        'Untitled Documentation';


    const description =
        document.description ||
        'Trade, customs, shipping and logistics knowledge.';


    const views =
        document.views ||
        0;


    const updatedDate =
        document.updatedAt

            ? new Date(
                document.updatedAt
            ).toLocaleDateString(
                'en-IN',
                {
                    day:
                        'numeric',

                    month:
                        'long',

                    year:
                        'numeric'
                }
            )

            : 'Not available';


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <main
            className={
                styles.page
            }
        >


            {/* ==================================================
                READING PROGRESS
            ================================================== */}

            <div
                className={
                    styles.progressTrack
                }
            >

                <div
                    className={
                        styles.progressBar
                    }

                    style={{
                        width:
                            `${readingProgress}%`
                    }}
                />

            </div>


            {/* ==================================================
                MAIN CONTAINER
            ================================================== */}

            <div
                className={
                    styles.container
                }
            >


                {/* ==================================================
                    BREADCRUMB
                ================================================== */}

                <nav
                    className={
                        styles.breadcrumb
                    }
                >

                    <Link
                        href="/documentation"
                    >
                        Documentation
                    </Link>


                    <span>
                        /
                    </span>


                    <span>
                        {category}
                    </span>


                    <span>
                        /
                    </span>


                    <span
                        className={
                            styles.currentBreadcrumb
                        }
                    >
                        {title}
                    </span>

                </nav>


                {/* ==================================================
                    MAIN GRID
                ================================================== */}

                <div
                    className={
                        styles.layout
                    }
                >


                    {/* ==================================================
                        ARTICLE
                    ================================================== */}

                    <article
                        className={
                            styles.article
                        }
                    >


                        {/* ==========================================
                            ARTICLE HEADER
                        ========================================== */}

                        <header
                            className={
                                styles.articleHeader
                            }
                        >


                            {/* ------------------------------------------
                                BADGES
                            ------------------------------------------ */}

                            <div
                                className={
                                    styles.badgeRow
                                }
                            >

                                <span
                                    className={
                                        styles.typeBadge
                                    }
                                >
                                    {documentType}
                                </span>


                                <span
                                    className={
                                        styles.categoryBadge
                                    }
                                >
                                    {category}
                                </span>


                                {
                                    document.isFeatured && (

                                        <span
                                            className={
                                                styles.featuredBadge
                                            }
                                        >
                                            ★ Featured
                                        </span>

                                    )
                                }

                            </div>


                            {/* ------------------------------------------
                                H1
                            ------------------------------------------ */}

                            <h1>
                                {title}
                            </h1>


                            {/* ------------------------------------------
                                DESCRIPTION
                            ------------------------------------------ */}

                            <p
                                className={
                                    styles.description
                                }
                            >
                                {description}
                            </p>


                            {/* ======================================
                                META
                            ====================================== */}

                            <div
                                className={
                                    styles.metaRow
                                }
                            >

                                {/* --------------------------------------
                                    VIEWS
                                -------------------------------------- */}

                                <div
                                    className={
                                        styles.metaItem
                                    }
                                >

                                    <span
                                        className={
                                            styles.metaIcon
                                        }
                                    >
                                        👁
                                    </span>


                                    <div>

                                        <strong>
                                            {views}
                                        </strong>

                                        <span>
                                            Views
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className={
                                        styles.metaDivider
                                    }
                                />


                                {/* --------------------------------------
                                    UPDATED
                                -------------------------------------- */}

                                <div
                                    className={
                                        styles.metaItem
                                    }
                                >

                                    <span
                                        className={
                                            styles.metaIcon
                                        }
                                    >
                                        ↻
                                    </span>


                                    <div>

                                        <strong>
                                            Updated
                                        </strong>

                                        <span>
                                            {updatedDate}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className={
                                        styles.metaDivider
                                    }
                                />


                                {/* --------------------------------------
                                    CATEGORY
                                -------------------------------------- */}

                                <div
                                    className={
                                        styles.metaItem
                                    }
                                >

                                    <span
                                        className={
                                            styles.metaIcon
                                        }
                                    >
                                        📚
                                    </span>


                                    <div>

                                        <strong>
                                            {category}
                                        </strong>

                                        <span>
                                            Knowledge Area
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </header>


                        {/* ==================================================
                            QUICK SUMMARY
                        ================================================== */}

                        <section
                            className={
                                styles.summaryCard
                            }
                        >

                            <div
                                className={
                                    styles.summaryIcon
                                }
                            >
                                💡
                            </div>


                            <div>

                                <h2>
                                    What you’ll learn
                                </h2>


                                <p>

                                    This documentation provides
                                    practical information related to

                                    {` ${category.toLowerCase()}`}

                                    and helps trade professionals
                                    understand the topic more clearly.

                                </p>

                            </div>

                        </section>


                        {/* ==================================================
                            HS CODE
                        ================================================== */}

                        {
                            document.hsCode && (

                                <section
                                    className={
                                        styles.hsCard
                                    }
                                >

                                    <div
                                        className={
                                            styles.hsIcon
                                        }
                                    >
                                        #
                                    </div>


                                    <div
                                        className={
                                            styles.hsContent
                                        }
                                    >

                                        <span>
                                            RELATED HS CODE
                                        </span>


                                        <strong>
                                            {document.hsCode}
                                        </strong>


                                        <p>
                                            Use this HS Code as a
                                            reference while reviewing
                                            the documentation.
                                        </p>

                                    </div>

                                </section>

                            )
                        }


                        {/* ==================================================
                            ARTICLE CONTENT
                        ================================================== */}

                        <section
                            className={
                                styles.contentSection
                            }
                        >

                            <div
                                className={
                                    styles.contentHeader
                                }
                            >

                                <span>
                                    KNOWLEDGE GUIDE
                                </span>


                                <h2>
                                    {title}
                                </h2>

                            </div>


                            <div
                                className={
                                    styles.content
                                }
                            >

                                {
                                    renderDocumentationContent(
                                        document.content
                                    )
                                }

                            </div>

                        </section>


                        {/* ==================================================
                            ATTACHED FILE
                        ================================================== */}

                        {
                            document.fileUrl && (

                                <section
                                    className={
                                        styles.fileCard
                                    }
                                >

                                    <div
                                        className={
                                            styles.fileIcon
                                        }
                                    >
                                        📄
                                    </div>


                                    <div
                                        className={
                                            styles.fileInfo
                                        }
                                    >

                                        <span>
                                            ATTACHED DOCUMENT
                                        </span>


                                        <strong>

                                            {
                                                document.fileName ||
                                                'Open document'
                                            }

                                        </strong>


                                        <p>
                                            View the original
                                            document or attached
                                            reference file.
                                        </p>

                                    </div>


                                    <a

                                        href={
                                            document.fileUrl
                                        }

                                        target="_blank"

                                        rel="noopener noreferrer"

                                        className={
                                            styles.fileButton
                                        }

                                    >
                                        Open File →
                                    </a>

                                </section>

                            )
                        }


                        {/* ==================================================
                            TAGS
                        ================================================== */}

                        {
                            Array.isArray(
                                document.tags
                            ) &&

                            document.tags.length > 0 && (

                                <section
                                    className={
                                        styles.tagsSection
                                    }
                                >

                                    <h3>
                                        Related Topics
                                    </h3>


                                    <div
                                        className={
                                            styles.tags
                                        }
                                    >

                                        {
                                            document.tags.map(
                                                (
                                                    tag,
                                                    index
                                                ) => (

                                                    <Link

                                                        key={
                                                            `${tag}-${index}`
                                                        }

                                                        href={
                                                            `/topics/${encodeURIComponent(
                                                                String(tag)
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        /\s+/g,
                                                                        '-'
                                                                    )
                                                            )}`
                                                        }

                                                        className={
                                                            styles.tag
                                                        }

                                                    >

                                                        #
                                                        {tag}

                                                    </Link>

                                                )
                                            )
                                        }

                                    </div>

                                </section>

                            )
                        }


                        {/* ==================================================
                            BOTTOM CTA
                        ================================================== */}

                        <section
                            className={
                                styles.bottomCta
                            }
                        >

                            <div>

                                <span>
                                    KEEP LEARNING
                                </span>


                                <h2>
                                    Explore more trade knowledge
                                </h2>


                                <p>
                                    Discover more documentation,
                                    customs guides, HS Code resources
                                    and logistics knowledge.
                                </p>

                            </div>


                            <Link

                                href="/documentation"

                                className={
                                    styles.ctaButton
                                }

                            >
                                Browse Documentation →
                            </Link>

                        </section>


                    </article>


                    {/* ==================================================
                        RIGHT SIDEBAR
                    ================================================== */}

                    <aside
                        className={
                            styles.sidebar
                        }
                    >


                        {/* ==========================================
                            DOCUMENT INFO
                        ========================================== */}

                        <div
                            className={
                                styles.sidebarCard
                            }
                        >

                            <div
                                className={
                                    styles.sidebarHeader
                                }
                            >

                                <span>
                                    DOCUMENT
                                </span>


                                <div
                                    className={
                                        styles.sidebarDot
                                    }
                                />

                            </div>


                            <h3>
                                Document Overview
                            </h3>


                            <div
                                className={
                                    styles.infoList
                                }
                            >

                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Category
                                    </span>


                                    <strong>
                                        {category}
                                    </strong>

                                </div>


                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Type
                                    </span>


                                    <strong>
                                        {documentType}
                                    </strong>

                                </div>


                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Views
                                    </span>


                                    <strong>
                                        {views}
                                    </strong>

                                </div>


                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Updated
                                    </span>


                                    <strong>
                                        {updatedDate}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* ==========================================
                            QUICK LINKS
                        ========================================== */}

                        <div
                            className={
                                styles.sidebarCard
                            }
                        >

                            <div
                                className={
                                    styles.sidebarHeader
                                }
                            >

                                <span>
                                    EXPLORE
                                </span>

                            </div>


                            <h3>
                                Continue Learning
                            </h3>


                            <div
                                className={
                                    styles.sidebarLinks
                                }
                            >

                                <Link
                                    href="/documentation"
                                >

                                    <span>
                                        📚
                                    </span>


                                    <div>

                                        <strong>
                                            All Documentation
                                        </strong>


                                        <small>
                                            Browse all guides
                                        </small>

                                    </div>


                                    <b>
                                        →
                                    </b>

                                </Link>


                                <Link
                                    href="/topics/import"
                                >

                                    <span>
                                        📦
                                    </span>


                                    <div>

                                        <strong>
                                            Import
                                        </strong>


                                        <small>
                                            Import discussions
                                        </small>

                                    </div>


                                    <b>
                                        →
                                    </b>

                                </Link>


                                <Link
                                    href="/topics/customs"
                                >

                                    <span>
                                        🧾
                                    </span>


                                    <div>

                                        <strong>
                                            Customs
                                        </strong>


                                        <small>
                                            Customs knowledge
                                        </small>

                                    </div>


                                    <b>
                                        →
                                    </b>

                                </Link>


                                <Link
                                    href="/topics/hs-code"
                                >

                                    <span>
                                        #
                                    </span>


                                    <div>

                                        <strong>
                                            HS Codes
                                        </strong>


                                        <small>
                                            Classification resources
                                        </small>

                                    </div>


                                    <b>
                                        →
                                    </b>

                                </Link>

                            </div>

                        </div>


                        {/* ==========================================
                            COMMUNITY CTA
                        ========================================== */}

                        <div
                            className={
                                styles.communityCard
                            }
                        >

                            <div
                                className={
                                    styles.communityIcon
                                }
                            >
                                💬
                            </div>


                            <h3>
                                Have a question?
                            </h3>


                            <p>
                                Connect with freight forwarding
                                professionals and discuss this
                                topic with the community.
                            </p>


                            <Link

                                href="/"

                                className={
                                    styles.communityButton
                                }

                            >
                                Join the Discussion
                            </Link>

                        </div>


                    </aside>

                </div>

            </div>

        </main>

    );

}