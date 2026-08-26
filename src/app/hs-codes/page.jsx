'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './page.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

export default function HSCodesPage() {

    const [hsCodes, setHsCodes] = useState([]);

    const [search, setSearch] = useState('');

    const [submittedSearch, setSubmittedSearch] =
        useState('');

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');


    // ======================================================
    // FETCH HS CODES
    // ======================================================

    useEffect(() => {

        const fetchHSCodes = async () => {

            try {

                setLoading(true);
                setError('');

                let url;

                if (submittedSearch.trim()) {

                    url =
                        `${API_BASE_URL}/hs-codes/search` +
                        `?q=${encodeURIComponent(
                            submittedSearch.trim()
                        )}` +
                        `&limit=20`;

                } else {

                    url =
                        `${API_BASE_URL}/hs-codes` +
                        `?page=${page}` +
                        `&limit=20`;

                }


                const response =
                    await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        cache: 'no-store',
                    });


                const contentType =
                    response.headers.get(
                        'content-type'
                    ) || '';


                let data = null;


                if (
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
                        'HS Code API returned non-JSON:',
                        text
                    );

                    throw new Error(
                        `HS Code API returned ${response.status}.`
                    );

                }


                if (
                    !response.ok ||
                    !data?.success
                ) {

                    throw new Error(
                        data?.message ||
                        'Failed to load HS Codes.'
                    );

                }


                // ==================================================
                // GET HS CODE LIST
                // ==================================================

                const list =
                    Array.isArray(data?.hsCodes)
                        ? data.hsCodes
                        : [];


                setHsCodes(list);


                // ==================================================
                // PAGINATION
                // ==================================================

                if (data?.pagination) {

                    setTotalPages(
                        Number(
                            data.pagination.totalPages
                        ) || 1
                    );

                } else {

                    setTotalPages(
                        list.length < 20
                            ? page
                            : page + 1
                    );

                }


            } catch (err) {

                console.error(
                    'HS Code error:',
                    err
                );

                setHsCodes([]);

                setError(
                    err?.message ||
                    'Unable to load HS Codes.'
                );

            } finally {

                setLoading(false);

            }

        };


        fetchHSCodes();

    }, [page, submittedSearch]);


    // ======================================================
    // SEARCH
    // ======================================================

    const handleSearch = (event) => {

        event.preventDefault();

        const query =
            search.trim();


        if (!query) {

            setSubmittedSearch('');

            setPage(1);

            setError('');

            return;

        }


        if (query.length < 2) {

            setError(
                'Please enter at least 2 characters.'
            );

            return;

        }


        setError('');

        setPage(1);

        setSubmittedSearch(query);

    };


    // ======================================================
    // CLEAR SEARCH
    // ======================================================

    const clearSearch = () => {

        setSearch('');

        setSubmittedSearch('');

        setPage(1);

        setError('');

    };


    // ======================================================
    // RETRY
    // ======================================================

    const handleRetry = () => {

        setError('');

        setPage(currentPage => currentPage);

        setSubmittedSearch(
            currentSearch => currentSearch
        );

    };


    // ======================================================
    // DISPLAY
    // ======================================================

    return (

        <main className={styles.page}>

            <div className={styles.container}>


                {/* ==================================================
                    HEADER
                ================================================== */}

                <header className={styles.header}>

                    <div className={styles.headerLeft}>

                        <Link
                            href="/documentation"
                            className={styles.backLink}
                        >
                            ← Documentation
                        </Link>

                        <span className={styles.eyebrow}>
                            CUSTOMS TARIFF
                        </span>

                        <h1>
                            HS Codes
                        </h1>

                        <p>
                            Browse and search customs
                            tariff classifications.
                        </p>

                    </div>


                    <Link
                        href="/documentation"
                        className={styles.documentationButton}
                    >
                        Documentation
                    </Link>

                </header>


                {/* ==================================================
                    SEARCH
                ================================================== */}

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
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search HS Code, description, chapter, heading, keyword..."
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
                        className={styles.searchButton}
                    >
                        Search
                    </button>

                </form>


                {/* ==================================================
                    TITLE
                ================================================== */}

                <div
                    className={
                        styles.sectionHeader
                    }
                >

                    <div>

                        <span>
                            {submittedSearch
                                ? 'SEARCH RESULTS'
                                : 'HS CODE DIRECTORY'}
                        </span>

                        <h2>
                            {submittedSearch
                                ? `Results for "${submittedSearch}"`
                                : 'All HS Codes'}
                        </h2>

                        <p>
                            {submittedSearch
                                ? 'Matching customs tariff classifications.'
                                : 'Browse available HS Code classifications.'}
                        </p>

                    </div>


                    {!loading && !error && (

                        <div
                            className={
                                styles.countBadge
                            }
                        >

                            <strong>
                                {hsCodes.length}
                            </strong>

                            <span>
                                {submittedSearch
                                    ? 'Results'
                                    : 'Shown'}
                            </span>

                        </div>

                    )}

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {!loading && error && (

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
                            Unable to load HS Codes
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className={
                                styles.retryButton
                            }
                            onClick={handleRetry}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ==================================================
                    LOADING
                ================================================== */}

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
                            Loading HS Codes...
                        </p>

                    </div>

                )}


                {/* ==================================================
                    EMPTY
                ================================================== */}

                {!loading &&
                    !error &&
                    hsCodes.length === 0 && (

                    <div
                        className={
                            styles.emptyCard
                        }
                    >

                        <div
                            className={
                                styles.emptyIcon
                            }
                        >
                            HS
                        </div>

                        <h3>
                            No HS Codes found
                        </h3>

                        <p>
                            Try searching with another
                            HS Code, product name,
                            chapter or keyword.
                        </p>


                        {submittedSearch && (

                            <button
                                type="button"
                                className={
                                    styles.clearSearchButton
                                }
                                onClick={clearSearch}
                            >
                                View All HS Codes
                            </button>

                        )}

                    </div>

                )}


                {/* ==================================================
                    HS CODE LIST
                ================================================== */}

                {!loading &&
                    !error &&
                    hsCodes.length > 0 && (

                    <section
                        className={styles.list}
                    >

                        {hsCodes.map(
                            (item, index) => {

                                const id =
                                    item?._id ||
                                    item?.id;

                                const code =
                                    item?.hsCode ||
                                    item?.code ||
                                    'N/A';

                                const description =
                                    item?.description ||
                                    'No description available.';

                                const chapter =
                                    item?.chapter ||
                                    '';

                                const heading =
                                    item?.heading ||
                                    '';

                                const subHeading =
                                    item?.subHeading ||
                                    '';

                                const keywords =
                                    Array.isArray(
                                        item?.keywords
                                    )
                                        ? item.keywords
                                        : [];


                                return (

                                    <Link
                                        key={
                                            id ||
                                            `${code}-${index}`
                                        }
                                        href={
                                            id
                                                ? `/hs-codes/${id}`
                                                : `/hs-codes/code/${code}`
                                        }
                                        className={
                                            styles.codeCard
                                        }
                                    >

                                        <div
                                            className={
                                                styles.codeIcon
                                            }
                                        >
                                            HS
                                        </div>


                                        <div
                                            className={
                                                styles.codeBody
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.codeTop
                                                }
                                            >

                                                <span
                                                    className={
                                                        styles.codeLabel
                                                    }
                                                >
                                                    HS CODE
                                                </span>

                                                <span
                                                    className={
                                                        styles.arrow
                                                    }
                                                >
                                                    →
                                                </span>

                                            </div>


                                            <h3>
                                                {code}
                                            </h3>


                                            <p>
                                                {description}
                                            </p>


                                            <div
                                                className={
                                                    styles.meta
                                                }
                                            >

                                                {chapter && (
                                                    <span>
                                                        Chapter{' '}
                                                        {chapter}
                                                    </span>
                                                )}

                                                {heading && (
                                                    <span>
                                                        Heading{' '}
                                                        {heading}
                                                    </span>
                                                )}

                                                {subHeading && (
                                                    <span>
                                                        Sub-heading{' '}
                                                        {subHeading}
                                                    </span>
                                                )}

                                            </div>


                                            {keywords.length > 0 && (

                                                <div
                                                    className={
                                                        styles.keywords
                                                    }
                                                >

                                                    {keywords
                                                        .slice(0, 5)
                                                        .map(
                                                            (keyword) => (

                                                                <span
                                                                    key={
                                                                        keyword
                                                                    }
                                                                >
                                                                    #{keyword}
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

                    </section>

                )}


                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {!loading &&
                    !error &&
                    hsCodes.length > 0 &&
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
                                    currentPage =>
                                        Math.max(
                                            1,
                                            currentPage - 1
                                        )
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
                                    currentPage =>
                                        Math.min(
                                            totalPages,
                                            currentPage + 1
                                        )
                                )
                            }
                        >
                            Next →
                        </button>

                    </div>

                )}

            </div>

        </main>

    );

}