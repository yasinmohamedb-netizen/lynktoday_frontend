'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './documentation.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

const LIMIT = 10;

const CATEGORIES = [
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

const getDocumentId = (document) =>
    document?._id || document?.id;

const getDocumentsFromResponse = (data) => {
    if (Array.isArray(data?.documentations)) {
        return data.documentations;
    }

    if (Array.isArray(data?.documentation)) {
        return data.documentation;
    }

    if (Array.isArray(data?.documents)) {
        return data.documents;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
};

const getDocumentUrl = (document) =>
    `/documentation/${getDocumentId(document)}`;

export default function DocumentationPage() {
    const [documents, setDocuments] = useState([]);
    const [featuredDocuments, setFeaturedDocuments] = useState([]);

    const [search, setSearch] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');

    const [activeCategory, setActiveCategory] = useState('All');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [user, setUser] = useState(null);

    /* --------------------------------------------------
       USER
    -------------------------------------------------- */

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('lynktoday_user');

            if (!storedUser) {
                setUser(null);
                return;
            }

            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error('Failed to parse stored user:', error);
            setUser(null);
        }
    }, []);

    /* --------------------------------------------------
       FETCH DOCUMENTS
    -------------------------------------------------- */

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const query = submittedSearch.trim();

            let url;

            if (query.length >= 2) {
                const params = new URLSearchParams({
                    q: query,
                    page: String(page),
                    limit: String(LIMIT)
                });

                url = `${API_BASE_URL}/documentation/search?${params}`;
            } else {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(LIMIT)
                });

                if (activeCategory !== 'All') {
                    params.append('category', activeCategory);
                }

                url = `${API_BASE_URL}/documentation?${params}`;
            }

            const response = await fetch(url, {
                cache: 'no-store'
            });

            const contentType =
                response.headers.get('content-type') || '';

            if (!contentType.includes('application/json')) {
                const text = await response.text();

                console.error(
                    'Documentation API returned non-JSON:',
                    text
                );

                throw new Error(
                    'Documentation API returned an invalid response.'
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    'Failed to load documentation.'
                );
            }

            const list = getDocumentsFromResponse(data);

            setDocuments(list);

            if (data?.pagination) {
                setTotalPages(
                    Number(data.pagination.totalPages) || 1
                );
            } else {
                setTotalPages(
                    list.length < LIMIT
                        ? page
                        : page + 1
                );
            }

            if (
                page === 1 &&
                !query &&
                activeCategory === 'All'
            ) {
                const featured = list
                    .filter(
                        (document) =>
                            document?.isFeatured
                    )
                    .slice(0, 3);

                setFeaturedDocuments(featured);
            } else {
                setFeaturedDocuments([]);
            }
        } catch (error) {
            console.error(
                'Documentation fetch error:',
                error
            );

            setDocuments([]);
            setFeaturedDocuments([]);

            setError(
                error?.message ||
                'Unable to load documentation.'
            );
        } finally {
            setLoading(false);
        }
    }, [
        activeCategory,
        page,
        submittedSearch
    ]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    /* --------------------------------------------------
       SEARCH
    -------------------------------------------------- */

    const handleSearch = (event) => {
        event.preventDefault();

        const query = search.trim();

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
        setSubmittedSearch(query);
    };

    const clearSearch = () => {
        setSearch('');
        setSubmittedSearch('');
        setPage(1);
        setError('');
    };

    /* --------------------------------------------------
       CATEGORY
    -------------------------------------------------- */

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setPage(1);

        setSearch('');
        setSubmittedSearch('');
        setError('');
    };

    /* --------------------------------------------------
       RESET
    -------------------------------------------------- */

    const handleShowAll = () => {
        setSearch('');
        setSubmittedSearch('');
        setActiveCategory('All');
        setPage(1);
        setError('');
    };

    /* --------------------------------------------------
       RETRY
    -------------------------------------------------- */

    const handleRetry = () => {
        setError('');
        fetchDocuments();
    };

    /* --------------------------------------------------
       DERIVED DATA
    -------------------------------------------------- */

    const featuredIds = useMemo(
        () =>
            new Set(
                featuredDocuments
                    .map(getDocumentId)
                    .filter(Boolean)
                    .map(String)
            ),
        [featuredDocuments]
    );

    const displayedDocuments = useMemo(() => {
        const isDefaultView =
            page === 1 &&
            !submittedSearch &&
            activeCategory === 'All';

        if (!isDefaultView) {
            return documents;
        }

        return documents.filter((document) => {
            const id = getDocumentId(document);

            return !featuredIds.has(String(id));
        });
    }, [
        documents,
        featuredIds,
        page,
        submittedSearch,
        activeCategory
    ]);

    const categoryCount = useMemo(
        () =>
            new Set(
                documents
                    .map(
                        (document) =>
                            document?.category
                    )
                    .filter(Boolean)
            ).size,
        [documents]
    );

    const knowledgeCount = useMemo(
        () =>
            new Set(
                documents
                    .map(
                        (document) =>
                            document?.documentType
                    )
                    .filter(Boolean)
            ).size,
        [documents]
    );

    const isSearchValidationError =
        error.includes('at least 2 characters');

    /* --------------------------------------------------
       RENDER
    -------------------------------------------------- */

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* HERO */}

                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div>
                            <Link
                                href="/"
                                className={styles.logo}
                            >
                                Lynk<span>Today</span>
                            </Link>

                            <span className={styles.eyebrow}>
                                Knowledge Hub
                            </span>

                            <h1>
                                Trade Documentation
                                <br />
                                &amp; Industry Knowledge
                            </h1>

                            <p>
                                Practical guides, customs procedures,
                                HS codes, GST, shipping documentation
                                and import/export resources for trade
                                professionals.
                            </p>
                        </div>

                        {user && (
                            <div className={styles.heroActions}>
                                <Link
                                    href="/documentation/create"
                                    className={styles.createButton}
                                >
                                    + Create Documentation
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* STATS */}

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <strong>
                                {documents.length}
                            </strong>

                            <span>
                                Documents
                            </span>
                        </div>

                        <div className={styles.stat}>
                            <strong>
                                {categoryCount}
                            </strong>

                            <span>
                                Categories
                            </span>
                        </div>

                        <div className={styles.stat}>
                            <strong>
                                {knowledgeCount}
                            </strong>

                            <span>
                                Knowledge Types
                            </span>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}

                <div className={styles.contentGrid}>

                    {/* LEFT */}

                    <div className={styles.mainColumn}>

                        {/* SEARCH */}

                        <form
                            onSubmit={handleSearch}
                            className={styles.searchBox}
                        >
                            <div
                                className={
                                    styles.searchInputWrap
                                }
                            >
                                <span
                                    className={
                                        styles.searchIcon
                                    }
                                    aria-hidden="true"
                                >
                                    ⌕
                                </span>

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search documentation, customs, Bill of Entry, GST, HS Code..."
                                    aria-label="Search documentation"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        className={
                                            styles.clearButton
                                        }
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={
                                    styles.searchButton
                                }
                            >
                                Search
                            </button>
                        </form>

                        {/* SEARCH VALIDATION */}

                        {error &&
                            !loading &&
                            isSearchValidationError && (
                                <div
                                    className={
                                        styles.error
                                    }
                                >
                                    {error}
                                </div>
                            )}

                        {/* CATEGORIES */}

                        <section
                            className={
                                styles.categorySection
                            }
                        >
                            <div
                                className={
                                    styles.categoryHeader
                                }
                            >
                                <span
                                    className={
                                        styles.sectionEyebrow
                                    }
                                >
                                    Explore
                                </span>

                                <h2>
                                    Browse by Category
                                </h2>

                                <p>
                                    Find practical knowledge
                                    by trade area.
                                </p>
                            </div>

                            <div
                                className={
                                    styles.categories
                                }
                            >
                                {CATEGORIES.map(
                                    (category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                handleCategoryChange(
                                                    category
                                                )
                                            }
                                            className={
                                                activeCategory ===
                                                category
                                                    ? `${styles.categoryButton} ${styles.activeCategory}`
                                                    : styles.categoryButton
                                            }
                                            aria-pressed={
                                                activeCategory ===
                                                category
                                            }
                                        >
                                            {category}
                                        </button>
                                    )
                                )}
                            </div>
                        </section>

                        {/* FEATURED */}

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
                                        <span
                                            className={
                                                styles.sectionEyebrow
                                            }
                                        >
                                            Editor's Pick
                                        </span>

                                        <h2>
                                            Featured Knowledge
                                        </h2>

                                        <p>
                                            Useful resources
                                            selected for the
                                            LynkToday community.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={
                                        styles.featuredGrid
                                    }
                                >
                                    {featuredDocuments.map(
                                        (document) => {
                                            const id =
                                                getDocumentId(
                                                    document
                                                );

                                            return (
                                                <Link
                                                    key={id}
                                                    href={getDocumentUrl(
                                                        document
                                                    )}
                                                    className={
                                                        styles.featuredCard
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.featuredTop
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.featuredBadge
                                                            }
                                                        >
                                                            FEATURED
                                                        </span>

                                                        <span
                                                            className={
                                                                styles.featuredType
                                                            }
                                                        >
                                                            {document.documentType ||
                                                                'GUIDE'}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={
                                                            styles.featuredIcon
                                                        }
                                                        aria-hidden="true"
                                                    >
                                                        📘
                                                    </div>

                                                    <h3>
                                                        {document.title}
                                                    </h3>

                                                    <p>
                                                        {document.description ||
                                                            'Practical trade knowledge for professionals.'}
                                                    </p>

                                                    <div
                                                        className={
                                                            styles.featuredMeta
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
                                            );
                                        }
                                    )}
                                </div>
                            </section>
                        )}

                        {/* DOCUMENT LIST */}

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
                                    <span
                                        className={
                                            styles.sectionEyebrow
                                        }
                                    >
                                        Knowledge Library
                                    </span>

                                    <h2>
                                        {submittedSearch
                                            ? `Search results for "${submittedSearch}"`
                                            : 'All Documentation'}
                                    </h2>

                                    <p>
                                        {activeCategory !==
                                            'All' &&
                                        !submittedSearch
                                            ? `Showing ${activeCategory} documentation.`
                                            : 'Explore guides, procedures, references and resources for the trade industry.'}
                                    </p>
                                </div>

                                {submittedSearch && (
                                    <button
                                        type="button"
                                        className={
                                            styles.clearFilterButton
                                        }
                                        onClick={clearSearch}
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>

                            {/* LOADING */}

                            {loading && (
                                <div
                                    className={
                                        styles.message
                                    }
                                >
                                    <div
                                        className={
                                            styles.spinner
                                        }
                                        aria-label="Loading"
                                    />

                                    <h3>
                                        Loading documentation
                                    </h3>

                                    <p>
                                        Preparing the latest
                                        trade knowledge.
                                    </p>
                                </div>
                            )}

                            {/* ERROR */}

                            {!loading &&
                                error &&
                                !isSearchValidationError && (
                                    <div
                                        className={
                                            styles.errorState
                                        }
                                    >
                                        <div
                                            className={
                                                styles.errorIcon
                                            }
                                            aria-hidden="true"
                                        >
                                            !
                                        </div>

                                        <h3>
                                            Unable to load
                                            documentation
                                        </h3>

                                        <p>
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            className={
                                                styles.retryButton
                                            }
                                            onClick={
                                                handleRetry
                                            }
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                            {/* EMPTY */}

                            {!loading &&
                                !error &&
                                displayedDocuments.length ===
                                    0 && (
                                    <div
                                        className={
                                            styles.empty
                                        }
                                    >
                                        <div
                                            className={
                                                styles.emptyIcon
                                            }
                                            aria-hidden="true"
                                        >
                                            🔎
                                        </div>

                                        <h3>
                                            No documentation found
                                        </h3>

                                        <p>
                                            Try another search
                                            or category.
                                        </p>

                                        <div
                                            className={
                                                styles.emptyActions
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={
                                                    styles.secondaryButton
                                                }
                                                onClick={
                                                    handleShowAll
                                                }
                                            >
                                                Show All
                                            </button>

                                            {user && (
                                                <Link
                                                    href="/documentation/create"
                                                    className={
                                                        styles.createButton
                                                    }
                                                >
                                                    Create Documentation
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* DOCUMENTS */}

                            {!loading &&
                                !error &&
                                displayedDocuments.length >
                                    0 && (
                                    <div
                                        className={
                                            styles.documentList
                                        }
                                    >
                                        {displayedDocuments.map(
                                            (document) => {
                                                const id =
                                                    getDocumentId(
                                                        document
                                                    );

                                                return (
                                                    <Link
                                                        key={id}
                                                        href={getDocumentUrl(
                                                            document
                                                        )}
                                                        className={
                                                            styles.documentCard
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.documentIcon
                                                            }
                                                            aria-hidden="true"
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

                                                                    <span
                                                                        className={
                                                                            styles.categoryBadge
                                                                        }
                                                                    >
                                                                        {document.category ||
                                                                            'General'}
                                                                    </span>

                                                                    {document.isFeatured && (
                                                                        <span
                                                                            className={
                                                                                styles.featuredBadge
                                                                            }
                                                                        >
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <span
                                                                    className={
                                                                        styles.cardArrow
                                                                    }
                                                                    aria-hidden="true"
                                                                >
                                                                    →
                                                                </span>
                                                            </div>

                                                            <h3>
                                                                {
                                                                    document.title
                                                                }
                                                            </h3>

                                                            <p>
                                                                {document.description ||
                                                                    'Trade, customs, shipping and logistics knowledge.'}
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
                                                                document
                                                                    .tags
                                                                    .length >
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
                                                                                (
                                                                                    tag
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            tag
                                                                                        }
                                                                                    >
                                                                                        #
                                                                                        {
                                                                                            tag
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                )}

                            {/* PAGINATION */}

                            {!loading &&
                                !error &&
                                displayedDocuments.length >
                                    0 &&
                                totalPages > 1 && (
                                    <div
                                        className={
                                            styles.pagination
                                        }
                                    >
                                        <button
                                            type="button"
                                            disabled={
                                                page <= 1
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (current) =>
                                                        current - 1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>

                                        <span>
                                            Page {page} of{' '}
                                            {totalPages}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                page >=
                                                totalPages
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (current) =>
                                                        current + 1
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                        </section>
                    </div>

                    {/* RIGHT SIDEBAR */}

                    <aside
                        className={styles.sidebar}
                    >
                        <RightSidebar />
                    </aside>
                </div>
            </div>
        </main>
    );
}