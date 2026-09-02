'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './documentation.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

const getDocumentationHref = document => {
    const value =
        document?.slug ||
        document?._id ||
        document?.id;

    return value
        ? `/documentation/${encodeURIComponent(String(value))}`
        : '/documentation';
};

const categories = [
    'All',
    'Customs',
    'Import',
    'Export',
    'DGFT',
    'GST',
    'FEMA',
    'Shipping',
    'Logistics',
    'General'
];

export default function DocumentationPage() {
    const [documents, setDocuments] = useState([]);
    const [featuredDocuments, setFeaturedDocuments] =
        useState([]);

    const [search, setSearch] = useState('');
    const [submittedSearch, setSubmittedSearch] =
        useState('');

    const [activeCategory, setActiveCategory] =
        useState('All');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );

            if (!storedUser) {
                setUser(null);
                return;
            }

            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error(
                'Failed to load user:',
                error
            );

            setUser(null);
        }
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError('');

            const query =
                submittedSearch.trim();

            let url;

            if (query.length >= 2) {
                url =
                    `${API_BASE_URL}/documentation/search` +
                    `?q=${encodeURIComponent(query)}` +
                    `&page=${page}` +
                    `&limit=10`;
            } else {
                const params =
                    new URLSearchParams();

                params.set('page', page);
                params.set('limit', '10');

                if (
                    activeCategory !== 'All'
                ) {
                    params.set(
                        'category',
                        activeCategory
                    );
                }

                url =
                    `${API_BASE_URL}/documentation?${params.toString()}`;
            }

            const response =
                await fetch(url, {
                    cache: 'no-store'
                });

            const contentType =
                response.headers.get(
                    'content-type'
                );

            if (
                !contentType?.includes(
                    'application/json'
                )
            ) {
                const text =
                    await response.text();

                console.error(
                    'Documentation API response:',
                    text
                );

                throw new Error(
                    'Documentation API returned an invalid response.'
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    'Failed to load documentation.'
                );
            }

            let list = [];

            if (
                Array.isArray(
                    data?.documentations
                )
            ) {
                list = data.documentations;
            } else if (
                Array.isArray(
                    data?.documentation
                )
            ) {
                list = data.documentation;
            } else if (
                Array.isArray(
                    data?.documents
                )
            ) {
                list = data.documents;
            } else if (
                Array.isArray(
                    data?.results
                )
            ) {
                list = data.results;
            } else if (
                Array.isArray(data?.data)
            ) {
                list = data.data;
            }

            setDocuments(list);

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

            if (
                page === 1 &&
                !query &&
                activeCategory === 'All'
            ) {
                setFeaturedDocuments(
                    list
                        .filter(
                            document =>
                                document?.isFeatured
                        )
                        .slice(0, 3)
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
            setFeaturedDocuments([]);

            setError(
                error?.message ||
                'Unable to load documentation.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [
        page,
        activeCategory,
        submittedSearch
    ]);

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
        setSubmittedSearch(query);
    };

    const handleCategory = category => {
        setActiveCategory(category);
        setSearch('');
        setSubmittedSearch('');
        setPage(1);
        setError('');
    };

    const clearSearch = () => {
        setSearch('');
        setSubmittedSearch('');
        setPage(1);
        setError('');
    };

    const handleRetry = () => {
        setError('');
        fetchDocuments();
    };

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

    const displayedDocuments =
        page === 1 &&
        !submittedSearch &&
        activeCategory === 'All'
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

    const recentDocuments =
        displayedDocuments.slice(0, 5);

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Link
                            href="/"
                            className={styles.logo}
                        >
                            Lynk<span>Today</span>
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
                            className={styles.headerButton}
                        >
                            Home
                        </Link>

                        <Link
                            href="/hs-codes"
                            className={styles.hsCodeButton}
                        >
                            HS Code
                        </Link>

                        {user && (
                            <>
                                <Link
                                    href="/documentation/my-documents"
                                    className={styles.myDocumentsButton}
                                >
                                    My Documents
                                </Link>

                                <Link
                                    href="/documentation/create"
                                    className={
                                        styles.createButton
                                    }
                                >
                                    <span>+</span>
                                    Create Documentation
                                </Link>

                                <Link
                                    href="/hs-codes/create"
                                    className={
                                        styles.createButton
                                    }
                                >
                                    <span>+</span>
                                    Create HS Code
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                <div className={styles.layout}>
                    <section className={styles.main}>
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
                                >
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
                                        className={
                                            styles.clearButton
                                        }
                                        onClick={
                                            clearSearch
                                        }
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

                        {error &&
                            !loading &&
                            error.includes(
                                'at least 2 characters'
                            ) && (
                                <div
                                    className={
                                        styles.validationError
                                    }
                                >
                                    {error}
                                </div>
                            )}

                        <section
                            className={
                                styles.categorySection
                            }
                        >
                            <div
                                className={
                                    styles.sectionIntro
                                }
                            >
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

                            <div
                                className={
                                    styles.categories
                                }
                            >
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
                                                    ? styles.categoryActive
                                                    : styles.categoryButton
                                            }
                                        >
                                            {category}
                                        </button>
                                    )
                                )}
                            </div>
                        </section>

                        {featuredDocuments.length > 0 && (
                            <section>
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
                                                href={getDocumentationHref(document)}
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

                        <section>
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

                                    {activeCategory !==
                                        'All' &&
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

                            {loading && (
                                <div
                                    className={
                                        styles.stateCard
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

                            {!loading &&
                                error &&
                                !error.includes(
                                    'at least 2 characters'
                                ) && (
                                    <div
                                        className={
                                            styles.stateCard
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
                                            onClick={
                                                handleRetry
                                            }
                                            className={
                                                styles.retryButton
                                            }
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                            {!loading &&
                                !error &&
                                displayedDocuments.length === 0 && (
                                    <div
                                        className={
                                            styles.stateCard
                                        }
                                    >
                                        <div
                                            className={
                                                styles.emptyIcon
                                            }
                                        >
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
                                            <div
                                                className={
                                                    styles.emptyActions
                                                }
                                            >
                                                <Link
                                                    href="/documentation/create"
                                                    className={
                                                        styles.actionButton
                                                    }
                                                >
                                                    + Create Documentation
                                                </Link>

                                                <Link
                                                    href="/hs-codes/create"
                                                    className={
                                                        styles.actionButton
                                                    }
                                                >
                                                    + Create HS Code
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                                    href={getDocumentationHref(document)}
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
                                                                        styles.badge
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
                                            disabled={
                                                page <= 1
                                            }
                                            onClick={() =>
                                                setPage(
                                                    current =>
                                                        current - 1
                                                )
                                            }
                                        >
                                            ← Previous
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
                                                    current =>
                                                        current + 1
                                                )
                                            }
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                        </section>
                    </section>

                    <aside className={styles.sidebar}>
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
                                    Help freight forwarding
                                    and trade professionals
                                    by sharing practical
                                    knowledge.
                                </p>

                                <Link
                                    href="/documentation/my-documents"
                                    className={styles.sidebarButton}
                                >
                                    My Documents
                                </Link>

                                <Link
                                    href="/documentation/create"
                                    className={
                                        styles.sidebarButton
                                    }
                                >
                                    + Create Documentation
                                </Link>

                                <Link
                                    href="/hs-codes/create"
                                    className={
                                        styles.sidebarButton
                                    }
                                >
                                    + Create HS Code
                                </Link>
                            </div>
                        )}

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

                                <h3>
                                    Quick Access
                                </h3>
                            </div>

                            <div
                                className={
                                    styles.quickLinks
                                }
                            >
                                {[
                                    'All',
                                    'Customs',
                                    'Import',
                                    'Export',
                                    'GST',
                                    'Shipping'
                                ].map(
                                    category => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={
                                                activeCategory ===
                                                category
                                                    ? styles.quickActive
                                                    : styles.quickLink
                                            }
                                            onClick={() =>
                                                handleCategory(
                                                    category
                                                )
                                            }
                                        >
                                            <span>
                                                {category ===
                                                    'All'
                                                    ? 'All Documentation'
                                                    : category}
                                            </span>

                                            <span>
                                                →
                                            </span>
                                        </button>
                                    )
                                )}

                                <Link
                                    href="/hs-codes"
                                    className={
                                        styles.quickLink
                                    }
                                >
                                    <span>
                                        HS Code
                                    </span>

                                    <span>
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>

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
                                    RECENT
                                </span>

                                <h3>
                                    Recent Documents
                                </h3>
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
                                                href={getDocumentationHref(document)}
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
                                    TOPICS
                                </span>

                                <h3>
                                    Documentation Areas
                                </h3>
                            </div>

                            <div
                                className={
                                    styles.topicCloud
                                }
                            >
                                {categories
                                    .filter(
                                        category =>
                                            category !==
                                            'All'
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