'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './documentation.module.css';

/* ======================================================
   API
====================================================== */

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


/* ======================================================
   CATEGORIES
====================================================== */

const categories = [
    'All',
    'Customs',
    'Import',
    'Export',
    'DGFT',
    'GST',
    'FEMA',
    'HS Code',
    'Shipping',
    'Logistics',
    'General'
];


/* ======================================================
   PAGE
====================================================== */

export default function DocumentationPage() {

    /* ==================================================
       DOCUMENTS
    ================================================== */

    const [documents, setDocuments] = useState([]);

    const [featuredDocuments, setFeaturedDocuments] =
        useState([]);


    /* ==================================================
       SEARCH
    ================================================== */

    const [search, setSearch] = useState('');

    const [submittedSearch, setSubmittedSearch] =
        useState('');


    /* ==================================================
       CATEGORY
    ================================================== */

    const [activeCategory, setActiveCategory] =
        useState('All');


    /* ==================================================
       PAGINATION
    ================================================== */

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);


    /* ==================================================
       UI
    ================================================== */

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    /* ==================================================
       USER
    ================================================== */

    const [user, setUser] = useState(null);


    /* ==================================================
       LOAD USER
    ================================================== */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem('lynktoday_user');

            if (!storedUser) {
                setUser(null);
                return;
            }

            try {

                setUser(
                    JSON.parse(storedUser)
                );

            } catch (parseError) {

                console.error(
                    'User parse error:',
                    parseError
                );

                setUser(null);

            }

        } catch (error) {

            console.error(
                'Failed to load user:',
                error
            );

            setUser(null);

        }

    }, []);


    /* ==================================================
       FETCH DOCUMENTS
    ================================================== */

    const fetchDocuments = async () => {

        try {

            setLoading(true);
            setError('');


            const query =
                submittedSearch.trim();


            let url;


            /* ==========================================
               SEARCH
            ========================================== */

            if (query.length >= 2) {

                url =
                    `${API_BASE_URL}/documentation/search` +
                    `?q=${encodeURIComponent(query)}` +
                    `&page=${page}` +
                    `&limit=10`;

            }


            /* ==========================================
               NORMAL LIST
            ========================================== */

            else {

                const params =
                    new URLSearchParams();

                params.append(
                    'page',
                    page
                );

                params.append(
                    'limit',
                    '10'
                );


                if (
                    activeCategory !== 'All'
                ) {

                    params.append(
                        'category',
                        activeCategory
                    );

                }


                url =
                    `${API_BASE_URL}/documentation?${params.toString()}`;

            }


            /* ==========================================
               API REQUEST
            ========================================== */

            const response =
                await fetch(url, {
                    cache: 'no-store'
                });


            /* ==========================================
               PARSE RESPONSE
            ========================================== */

            const contentType =
                response.headers.get(
                    'content-type'
                );


            let data = null;


            if (
                contentType &&
                contentType.includes(
                    'application/json'
                )
            ) {

                data =
                    await response.json();

            } else {

                const text =
                    await response.text();

                console.error(
                    'Documentation API returned non-JSON:',
                    text
                );

                throw new Error(
                    'Documentation API returned an invalid response.'
                );

            }


            /* ==========================================
               API ERROR
            ========================================== */

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    'Failed to load documentation.'
                );

            }


            /* ==========================================
               EXTRACT DOCUMENTS
            ========================================== */

            let list = [];


            if (
                Array.isArray(
                    data?.documentations
                )
            ) {

                list =
                    data.documentations;

            } else if (
                Array.isArray(
                    data?.documentation
                )
            ) {

                list =
                    data.documentation;

            } else if (
                Array.isArray(
                    data?.documents
                )
            ) {

                list =
                    data.documents;

            } else if (
                Array.isArray(
                    data?.results
                )
            ) {

                list =
                    data.results;

            } else if (
                Array.isArray(
                    data?.data
                )
            ) {

                list =
                    data.data;

            }


            setDocuments(list);


            /* ==========================================
               PAGINATION
            ========================================== */

            if (data?.pagination) {

                setTotalPages(
                    Number(
                        data.pagination.totalPages
                    ) || 1
                );

            } else {

                setTotalPages(
                    list.length < 10
                        ? page
                        : page + 1
                );

            }


            /* ==========================================
               FEATURED DOCUMENTS
            ========================================== */

            if (
                page === 1 &&
                !query &&
                activeCategory === 'All'
            ) {

                const featured =
                    list
                        .filter(
                            document =>
                                document &&
                                document.isFeatured
                        )
                        .slice(0, 3);


                setFeaturedDocuments(
                    featured
                );

            } else {

                setFeaturedDocuments([]);

            }


        } catch (error) {

            console.error(
                'Documentation error:',
                error
            );

            setDocuments([]);

            setError(
                error?.message ||
                'Unable to load documentation.'
            );

        } finally {

            setLoading(false);

        }

    };


    /* ==================================================
       FETCH WHEN FILTERS CHANGE
    ================================================== */

    useEffect(() => {

        fetchDocuments();

    }, [
        page,
        activeCategory,
        submittedSearch
    ]);


    /* ==================================================
       SEARCH SUBMIT
    ================================================== */

    const handleSearch = event => {

        event.preventDefault();


        const query =
            search.trim();


        if (!query) {

            setError('');

            setSubmittedSearch('');

            setPage(1);

            return;

        }


        if (query.length < 2) {

            setError(
                'Please enter at least 2 characters to search.'
            );

            return;

        }


        setError('');

        setPage(1);

        setSubmittedSearch(
            query
        );

    };


    /* ==================================================
       CATEGORY
    ================================================== */

    const handleCategory = category => {

        setActiveCategory(category);

        setPage(1);

        setSearch('');

        setSubmittedSearch('');

        setError('');

    };


    /* ==================================================
       CLEAR SEARCH
    ================================================== */

    const clearSearch = () => {

        setSearch('');

        setSubmittedSearch('');

        setPage(1);

        setError('');

    };


    /* ==================================================
       RETRY
    ================================================== */

    const handleRetry = () => {

        setError('');

        fetchDocuments();

    };


    /* ==================================================
       FEATURED IDS
    ================================================== */

    const featuredIds =
        new Set(
            featuredDocuments.map(
                document =>
                    String(
                        document?._id ||
                        document?.id ||
                        ''
                    )
            )
        );


    /* ==================================================
       DISPLAYED DOCUMENTS
    ================================================== */

    const displayedDocuments =
        (
            page === 1 &&
            !submittedSearch &&
            activeCategory === 'All'
        )
            ? documents.filter(
                document =>
                    !featuredIds.has(
                        String(
                            document?._id ||
                            document?.id ||
                            ''
                        )
                    )
            )
            : documents;


    /* ==================================================
       SIDEBAR DOCUMENTS
    ================================================== */

    const recentDocuments =
        displayedDocuments
            .slice(0, 5);


    /* ==================================================
       RENDER
    ================================================== */

    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header className={styles.header}>

                    <div className={styles.headerLeft}>

                        <Link
                            href="/"
                            className={styles.logo}
                        >
                            Exp<span>Imp</span>
                        </Link>

                        <div className={styles.headerText}>

                            <h1>
                                Documentation
                            </h1>

                            <p>
                                Trade, customs, shipping
                                and logistics knowledge.
                            </p>

                        </div>

                    </div>


                    <div className={styles.headerActions}>

                        <Link
                            href="/"
                            className={styles.homeButton}
                        >
                            Home
                        </Link>


                        {user && (

                            <Link
                                href="/documentation/create"
                                className={styles.createButton}
                            >
                                <span>+</span>
                                Create Documentation
                            </Link>

                        )}

                    </div>

                </header>


                {/* ==================================================
                    PAGE GRID
                ================================================== */}

                <div className={styles.layout}>

                    {/* ==================================================
                        MAIN CONTENT
                    ================================================== */}

                    <section className={styles.main}>

                        {/* ==========================================
                            SEARCH
                        ========================================== */}

                        <form
                            onSubmit={handleSearch}
                            className={styles.searchBox}
                        >

                            <div className={styles.searchInputWrap}>

                                <span className={styles.searchIcon}>
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={event =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search documentation, customs, Bill of Entry, GST..."
                                />

                                {search && (

                                    <button
                                        type="button"
                                        className={styles.clearButton}
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>

                                )}

                            </div>


                            <button
                                type="submit"
                                className={styles.searchButton}
                            >
                                Search
                            </button>

                        </form>


                        {/* ==========================================
                            SEARCH VALIDATION
                        ========================================== */}

                        {error &&
                            !loading &&
                            error.includes(
                                'at least 2 characters'
                            ) && (

                                <div className={styles.validationError}>
                                    {error}
                                </div>

                            )}


                        {/* ==========================================
                            CATEGORIES
                        ========================================== */}

                        <section className={styles.categorySection}>

                            <div className={styles.sectionIntro}>

                                <div>

                                    <span>
                                        EXPLORE
                                    </span>

                                    <h2>
                                        Browse by Category
                                    </h2>

                                    <p>
                                        Find practical knowledge
                                        by trade area.
                                    </p>

                                </div>

                            </div>


                            <div className={styles.categories}>

                                {categories.map(
                                    category => (

                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                handleCategory(
                                                    category
                                                )
                                            }
                                            className={
                                                activeCategory ===
                                                category
                                                    ? styles.activeCategory
                                                    : styles.categoryButton
                                            }
                                        >
                                            {category}
                                        </button>

                                    )
                                )}

                            </div>

                        </section>


                        {/* ==========================================
                            FEATURED
                        ========================================== */}

                        {featuredDocuments.length > 0 && (

                            <section
                                className={
                                    styles.featuredSection
                                }
                            >

                                <div
                                    className={
                                        styles.sectionHeader
                                    }
                                >

                                    <div>

                                        <span>
                                            EDITOR'S PICK
                                        </span>

                                        <h2>
                                            Featured Knowledge
                                        </h2>

                                        <p>
                                            Useful resources selected
                                            for the LynkToday community.
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className={
                                        styles.featuredGrid
                                    }
                                >

                                    {featuredDocuments.map(
                                        document => (

                                            <Link
                                                key={
                                                    document._id ||
                                                    document.id
                                                }
                                                href={
                                                    `/documentation/${
                                                        document._id ||
                                                        document.id
                                                    }`
                                                }
                                                className={
                                                    styles.featuredCard
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.featuredTop
                                                    }
                                                >

                                                    <span>
                                                        FEATURED
                                                    </span>

                                                    <small>
                                                        {document.documentType ||
                                                            'GUIDE'}
                                                    </small>

                                                </div>


                                                <div
                                                    className={
                                                        styles.featuredIcon
                                                    }
                                                >
                                                    📖
                                                </div>


                                                <h3>
                                                    {document.title}
                                                </h3>


                                                <p>
                                                    {document.description ||
                                                        'Practical trade and industry documentation.'}
                                                </p>


                                                <div
                                                    className={
                                                        styles.cardMeta
                                                    }
                                                >

                                                    <span>
                                                        {document.category ||
                                                            'General'}
                                                    </span>

                                                    <strong>
                                                        Read Guide →
                                                    </strong>

                                                </div>

                                            </Link>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* ==========================================
                            DOCUMENT LIST
                        ========================================== */}

                        <section
                            className={
                                styles.listSection
                            }
                        >

                            <div
                                className={
                                    styles.sectionHeader
                                }
                            >

                                <div>

                                    <span>
                                        KNOWLEDGE LIBRARY
                                    </span>

                                    <h2>
                                        {submittedSearch
                                            ? `Search results for "${submittedSearch}"`
                                            : 'All Documentation'}
                                    </h2>

                                    {activeCategory !== 'All' &&
                                        !submittedSearch && (

                                            <p>
                                                Category:{' '}
                                                <strong>
                                                    {activeCategory}
                                                </strong>
                                            </p>

                                        )}

                                </div>

                            </div>


                            {/* ======================================
                                LOADING
                            ====================================== */}

                            {loading && (

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

                                    <p>
                                        Loading documentation...
                                    </p>

                                </div>

                            )}


                            {/* ======================================
                                ERROR
                            ====================================== */}

                            {!loading &&
                                error &&
                                !error.includes(
                                    'at least 2 characters'
                                ) && (

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

                                        <h3>
                                            Unable to load documentation
                                        </h3>

                                        <p>
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleRetry}
                                            className={
                                                styles.retryButton
                                            }
                                        >
                                            Try Again
                                        </button>

                                    </div>

                                )}


                            {/* ======================================
                                EMPTY
                            ====================================== */}

                            {!loading &&
                                !error &&
                                displayedDocuments.length === 0 && (

                                    <div
                                        className={
                                            styles.empty
                                        }
                                    >

                                        <div className={styles.emptyIcon}>
                                            📚
                                        </div>

                                        <h3>
                                            No documentation found
                                        </h3>

                                        <p>
                                            Try another search
                                            or category.
                                        </p>


                                        {user && (

                                            <Link
                                                href="/documentation/create"
                                                className={
                                                    styles.emptyCreateButton
                                                }
                                            >
                                                + Create Documentation
                                            </Link>

                                        )}

                                    </div>

                                )}


                            {/* ======================================
                                DOCUMENTS
                            ====================================== */}

                            {!loading &&
                                !error &&
                                displayedDocuments.length > 0 && (

                                    <div
                                        className={
                                            styles.documentList
                                        }
                                    >

                                        {displayedDocuments.map(
                                            document => (

                                                <Link
                                                    key={
                                                        document._id ||
                                                        document.id
                                                    }
                                                    href={
                                                        `/documentation/${
                                                            document._id ||
                                                            document.id
                                                        }`
                                                    }
                                                    className={
                                                        styles.documentCard
                                                    }
                                                >

                                                    <div
                                                        className={
                                                            styles.documentIcon
                                                        }
                                                    >
                                                        📄
                                                    </div>


                                                    <div
                                                        className={
                                                            styles.documentBody
                                                        }
                                                    >

                                                        <div
                                                            className={
                                                                styles.documentTop
                                                            }
                                                        >

                                                            <div
                                                                className={
                                                                    styles.badges
                                                                }
                                                            >

                                                                <span
                                                                    className={
                                                                        styles.type
                                                                    }
                                                                >
                                                                    {document.documentType ||
                                                                        'DOCUMENT'}
                                                                </span>


                                                                {document.isFeatured && (

                                                                    <span
                                                                        className={
                                                                            styles.featuredBadge
                                                                        }
                                                                    >
                                                                        FEATURED
                                                                    </span>

                                                                )}

                                                            </div>


                                                            <span
                                                                className={
                                                                    styles.arrow
                                                                }
                                                            >
                                                                →
                                                            </span>

                                                        </div>


                                                        <h3>
                                                            {document.title}
                                                        </h3>


                                                        <p>
                                                            {document.description ||
                                                                'No description available.'}
                                                        </p>


                                                        <div
                                                            className={
                                                                styles.documentMeta
                                                            }
                                                        >

                                                            <span>
                                                                {document.category ||
                                                                    'General'}
                                                            </span>

                                                            <span>
                                                                {document.views ||
                                                                    0}{' '}
                                                                views
                                                            </span>

                                                        </div>


                                                        {Array.isArray(
                                                            document.tags
                                                        ) &&
                                                            document.tags.length >
                                                            0 && (

                                                                <div
                                                                    className={
                                                                        styles.tags
                                                                    }
                                                                >

                                                                    {document.tags
                                                                        .slice(
                                                                            0,
                                                                            4
                                                                        )
                                                                        .map(
                                                                            tag => (

                                                                                <span
                                                                                    key={
                                                                                        tag
                                                                                    }
                                                                                >
                                                                                    #
                                                                                    {tag}
                                                                                </span>

                                                                            )
                                                                        )}

                                                                </div>

                                                            )}

                                                    </div>

                                                </Link>

                                            )
                                        )}

                                    </div>

                                )}


                            {/* ======================================
                                PAGINATION
                            ====================================== */}

                            {!loading &&
                                !error &&
                                displayedDocuments.length > 0 &&
                                totalPages > 1 && (

                                    <div
                                        className={
                                            styles.pagination
                                        }
                                    >

                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() =>
                                                setPage(
                                                    previousPage =>
                                                        previousPage - 1
                                                )
                                            }
                                        >
                                            ← Previous
                                        </button>


                                        <span>
                                            Page {page} of {totalPages}
                                        </span>


                                        <button
                                            type="button"
                                            disabled={
                                                page >= totalPages
                                            }
                                            onClick={() =>
                                                setPage(
                                                    previousPage =>
                                                        previousPage + 1
                                                )
                                            }
                                        >
                                            Next →
                                        </button>

                                    </div>

                                )}

                        </section>

                    </section>


                    {/* ==================================================
                        RIGHT SIDEBAR
                    ================================================== */}

                    <aside className={styles.sidebar}>

                        {/* ==========================================
                            CREATE DOCUMENTATION
                        ========================================== */}

                        {user && (

                            <div
                                className={
                                    styles.contributeCard
                                }
                            >

                                <div
                                    className={
                                        styles.contributeIcon
                                    }
                                >
                                    ✦
                                </div>

                                <h3>
                                    Share your knowledge
                                </h3>

                                <p>
                                    Help freight forwarding and
                                    trade professionals by sharing
                                    practical knowledge.
                                </p>

                                <Link
                                    href="/documentation/create"
                                    className={
                                        styles.sidebarCreateButton
                                    }
                                >
                                    + Create Documentation
                                </Link>

                            </div>

                        )}


                        {/* ==========================================
                            QUICK ACCESS
                        ========================================== */}

                        <div className={styles.sidebarCard}>

                            <div
                                className={
                                    styles.sidebarHeader
                                }
                            >

                                <div>

                                    <span>
                                        EXPLORE
                                    </span>

                                    <h3>
                                        Quick Access
                                    </h3>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.quickLinks
                                }
                            >

                                {[
                                    ['All', 'All Documentation'],
                                    ['Customs', 'Customs'],
                                    ['Import', 'Import'],
                                    ['Export', 'Export'],
                                    ['GST', 'GST'],
                                    ['HS Code', 'HS Code'],
                                    ['Shipping', 'Shipping']
                                ].map(
                                    ([category, label]) => (

                                        <button
                                            key={category}
                                            type="button"
                                            className={
                                                activeCategory ===
                                                category
                                                    ? styles.quickLinkActive
                                                    : styles.quickLink
                                            }
                                            onClick={() =>
                                                handleCategory(
                                                    category
                                                )
                                            }
                                        >

                                            <span>
                                                {label}
                                            </span>

                                            <span>
                                                →
                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* ==========================================
                            RECENT DOCUMENTS
                        ========================================== */}

                        <div className={styles.sidebarCard}>

                            <div
                                className={
                                    styles.sidebarHeader
                                }
                            >

                                <div>

                                    <span>
                                        RECENT
                                    </span>

                                    <h3>
                                        Recent Documents
                                    </h3>

                                </div>

                            </div>


                            {recentDocuments.length > 0 ? (

                                <div
                                    className={
                                        styles.recentList
                                    }
                                >

                                    {recentDocuments.map(
                                        document => (

                                            <Link
                                                key={
                                                    document._id ||
                                                    document.id
                                                }
                                                href={
                                                    `/documentation/${
                                                        document._id ||
                                                        document.id
                                                    }`
                                                }
                                                className={
                                                    styles.recentItem
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.recentIcon
                                                    }
                                                >
                                                    📄
                                                </div>

                                                <div
                                                    className={
                                                        styles.recentBody
                                                    }
                                                >

                                                    <strong>
                                                        {document.title}
                                                    </strong>

                                                    <span>
                                                        {document.category ||
                                                            'General'}
                                                    </span>

                                                </div>

                                            </Link>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div
                                    className={
                                        styles.sidebarEmpty
                                    }
                                >
                                    No recent documents.
                                </div>

                            )}

                        </div>


                        {/* ==========================================
                            CATEGORIES
                        ========================================== */}

                        <div className={styles.sidebarCard}>

                            <div
                                className={
                                    styles.sidebarHeader
                                }
                            >

                                <div>

                                    <span>
                                        TOPICS
                                    </span>

                                    <h3>
                                        Documentation Areas
                                    </h3>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.topicCloud
                                }
                            >

                                {categories
                                    .filter(
                                        category =>
                                            category !== 'All'
                                    )
                                    .map(
                                        category => (

                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() =>
                                                    handleCategory(
                                                        category
                                                    )
                                                }
                                                className={
                                                    activeCategory ===
                                                    category
                                                        ? styles.topicActive
                                                        : styles.topic
                                                }
                                            >
                                                {category}
                                            </button>

                                        )
                                    )}

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </main>

    );

}