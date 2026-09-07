'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './page.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

const PAGE_SIZE = 20;
const MY_HS_CODE_LIMIT = 100;

export default function HSCodesPage() {
    // ======================================================
    // PUBLIC HS CODES
    // ======================================================

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
    // MY HS CODES
    // ======================================================

    const [myHsCodes, setMyHsCodes] =
        useState([]);

    const [myHsCodesLoading, setMyHsCodesLoading] =
        useState(true);

    const [myHsCodesError, setMyHsCodesError] =
        useState('');

    const [isLoggedIn, setIsLoggedIn] =
        useState(false);

    const [showMyHsCodes, setShowMyHsCodes] =
        useState(false);


    // ======================================================
    // MOBILE DRAWER BODY LOCK
    // ======================================================

    useEffect(() => {
        if (showMyHsCodes) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showMyHsCodes]);


    // ======================================================
    // ESCAPE KEY
    // ======================================================

    useEffect(() => {
        const handleEscape = (event) => {
            if (
                event.key === 'Escape' &&
                showMyHsCodes
            ) {
                setShowMyHsCodes(false);
            }
        };

        window.addEventListener(
            'keydown',
            handleEscape
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, [showMyHsCodes]);


    // ======================================================
    // FETCH PUBLIC HS CODES
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
                        `&limit=${PAGE_SIZE}`;
                } else {
                    url =
                        `${API_BASE_URL}/hs-codes` +
                        `?page=${page}` +
                        `&limit=${PAGE_SIZE}`;
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

                const list =
                    Array.isArray(
                        data?.hsCodes
                    )
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
                        list.length < PAGE_SIZE
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
    // FETCH MY HS CODES
    // ======================================================

    useEffect(() => {
        const fetchMyHSCodes = async () => {
            try {
                setMyHsCodesLoading(true);
                setMyHsCodesError('');

                // ----------------------------------------------
                // GET TOKEN
                // ----------------------------------------------

                const token =
                    localStorage.getItem(
                        'lynktoday_token'
                    );

                if (!token) {
                    setIsLoggedIn(false);
                    setMyHsCodes([]);
                    return;
                }

                setIsLoggedIn(true);

                // ----------------------------------------------
                // GET USER'S OWN HS CODES
                // ----------------------------------------------

                const response =
                    await fetch(
                        `${API_BASE_URL}/hs-codes/my?page=1&limit=${MY_HS_CODE_LIMIT}&sort=newest`,
                        {
                            method: 'GET',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            cache: 'no-store',
                        }
                    );

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
                        'My HS Codes API returned non-JSON:',
                        text
                    );

                    throw new Error(
                        `My HS Codes API returned ${response.status}.`
                    );
                }

                // ----------------------------------------------
                // AUTH FAILURE
                // ----------------------------------------------

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {
                    setIsLoggedIn(false);
                    setMyHsCodes([]);
                    return;
                }

                // ----------------------------------------------
                // API FAILURE
                // ----------------------------------------------

                if (
                    !response.ok ||
                    !data?.success
                ) {
                    throw new Error(
                        data?.message ||
                        'Failed to load your HS Codes.'
                    );
                }

                // ----------------------------------------------
                // GET USER'S HS CODES
                // ----------------------------------------------

                const list =
                    Array.isArray(
                        data?.hsCodes
                    )
                        ? data.hsCodes
                        : [];

                setMyHsCodes(list);

            } catch (err) {
                console.error(
                    'My HS Codes error:',
                    err
                );

                setMyHsCodes([]);

                setMyHsCodesError(
                    err?.message ||
                    'Unable to load your HS Codes.'
                );

            } finally {
                setMyHsCodesLoading(false);
            }
        };

        fetchMyHSCodes();

    }, []);


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
        window.location.reload();
    };


    // ======================================================
    // HS CODE URL
    // ======================================================

    const getHSCodeUrl = (item) => {
        const code =
            item?.hsCode ||
            item?.code;

        if (code) {
            return `/hs-codes/${encodeURIComponent(
                code
            )}`;
        }

        const id =
            item?._id ||
            item?.id;

        if (id) {
            return `/hs-codes/${id}`;
        }

        return '#';
    };


    // ======================================================
    // DISPLAY HS CODE CARD
    // ======================================================

    const [actionLoading, setActionLoading] = useState('');

    // ======================================================
    // MY HS CODE MANAGEMENT ACTIONS
    // ======================================================

    const handleMyHSCodeAction = async (item, action) => {
        const id = item?._id || item?.id;
        const code = item?.hsCode || item?.code || 'this HS Code';

        if (!id) {
            setMyHsCodesError('Unable to identify this HS Code.');
            return;
        }

        const token = localStorage.getItem('lynktoday_token');

        if (!token) {
            setIsLoggedIn(false);
            setMyHsCodesError('Please log in again to manage your HS Codes.');
            return;
        }

        if (action === 'delete') {
            const confirmed = window.confirm(
                `Are you sure you want to delete HS Code ${code}? This action cannot be undone.`
            );

            if (!confirmed) {
                return;
            }
        }

        const actionKey = `${action}-${id}`;

        try {
            setActionLoading(actionKey);
            setMyHsCodesError('');

            let method = 'PATCH';
            let endpoint = '';

            if (action === 'activate') {
                endpoint = `${API_BASE_URL}/hs-codes/${id}/activate`;
            } else if (action === 'deactivate') {
                endpoint = `${API_BASE_URL}/hs-codes/${id}/deactivate`;
            } else if (action === 'delete') {
                method = 'DELETE';
                endpoint = `${API_BASE_URL}/hs-codes/${id}`;
            } else {
                return;
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                cache: 'no-store',
            });

            const contentType =
                response.headers.get('content-type') || '';

            let data = null;

            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error(
                    'HS Code management API returned non-JSON:',
                    text
                );

                throw new Error(
                    `HS Code API returned ${response.status}.`
                );
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                setIsLoggedIn(false);
                setMyHsCodesError(
                    data?.message ||
                    'Your session has expired. Please log in again.'
                );
                return;
            }

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message ||
                    `Failed to ${action} HS Code.`
                );
            }

            if (action === 'delete') {
                setMyHsCodes((current) =>
                    current.filter(
                        (hsCode) =>
                            (hsCode?._id || hsCode?.id) !== id
                    )
                );

                setHsCodes((current) =>
                    current.filter(
                        (hsCode) =>
                            (hsCode?._id || hsCode?.id) !== id
                    )
                );
            } else {
                const updatedItem =
                    data?.hsCode ||
                    data?.data?.hsCode ||
                    data?.updatedHSCode ||
                    data?.hsCodeData ||
                    null;

                const newActiveState =
                    action === 'activate';

                setMyHsCodes((current) =>
                    current.map((hsCode) => {
                        const hsCodeId =
                            hsCode?._id || hsCode?.id;

                        if (hsCodeId !== id) {
                            return hsCode;
                        }

                        return updatedItem
                            ? updatedItem
                            : {
                                  ...hsCode,
                                  isActive: newActiveState,
                              };
                    })
                );

                setHsCodes((current) =>
                    current.map((hsCode) => {
                        const hsCodeId =
                            hsCode?._id || hsCode?.id;

                        if (hsCodeId !== id) {
                            return hsCode;
                        }

                        return updatedItem
                            ? updatedItem
                            : {
                                  ...hsCode,
                                  isActive: newActiveState,
                              };
                    })
                );
            }
        } catch (err) {
            console.error(
                `HS Code ${action} error:`,
                err
            );

            setMyHsCodesError(
                err?.message ||
                `Unable to ${action} HS Code.`
            );
        } finally {
            setActionLoading('');
        }
    };


    // ======================================================
    // DISPLAY HS CODE CARD
    // ======================================================

    const renderHSCodeCard = (
        item,
        index,
        isMyCode = false
    ) => {
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
            Array.isArray(item?.keywords)
                ? item.keywords
                : [];

        const isActive =
            item?.isActive !== false;

        const cardContent = (
            <>
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
                            {isMyCode
                                ? 'MY HS CODE'
                                : 'HS CODE'}
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

                    {isMyCode && (
                        <div
                            className={
                                styles.statusRow
                            }
                        >
                            <span
                                className={
                                    isActive
                                        ? styles.activeStatus
                                        : styles.inactiveStatus
                                }
                            >
                                {isActive
                                    ? 'Active'
                                    : 'Inactive'}
                            </span>
                        </div>
                    )}

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
                                    (
                                        keyword,
                                        keywordIndex
                                    ) => (
                                        <span
                                            key={`${keyword}-${keywordIndex}`}
                                        >
                                            #
                                            {
                                                keyword
                                            }
                                        </span>
                                    )
                                )}
                        </div>
                    )}
                </div>
            </>
        );

        if (!isMyCode) {
            return (
                <Link
                    key={
                        id ||
                        `${code}-${index}`
                    }
                    href={getHSCodeUrl(item)}
                    className={styles.codeCard}
                >
                    {cardContent}
                </Link>
            );
        }

        const editUrl = id
            ? `/hs-codes/edit/${encodeURIComponent(id)}`
            : '#';

        return (
            <article
                key={
                    id ||
                    `${code}-${index}`
                }
                className={`${styles.codeCard} ${styles.myCodeCard}`}
            >
                <Link
                    href={getHSCodeUrl(item)}
                    className={styles.cardMainLink}
                >
                    {cardContent}
                </Link>

                <div
                    className={styles.managementArea}
                >
                    <div
                        className={styles.managementButtons}
                    >
                        <Link
                            href={getHSCodeUrl(item)}
                            className={styles.viewButton}
                        >
                            View
                        </Link>

                        <Link
                            href={editUrl}
                            className={styles.editButton}
                        >
                            Edit
                        </Link>

                        {isActive ? (
                            <button
                                type="button"
                                className={
                                    styles.deactivateButton
                                }
                                disabled={
                                    actionLoading ===
                                    `deactivate-${id}`
                                }
                                onClick={() =>
                                    handleMyHSCodeAction(
                                        item,
                                        'deactivate'
                                    )
                                }
                            >
                                {actionLoading ===
                                `deactivate-${id}`
                                    ? '...'
                                    : 'Deactivate'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={
                                    styles.activateButton
                                }
                                disabled={
                                    actionLoading ===
                                    `activate-${id}`
                                }
                                onClick={() =>
                                    handleMyHSCodeAction(
                                        item,
                                        'activate'
                                    )
                                }
                            >
                                {actionLoading ===
                                `activate-${id}`
                                    ? '...'
                                    : 'Activate'}
                            </button>
                        )}

                        <button
                            type="button"
                            className={styles.deleteButton}
                            disabled={
                                actionLoading ===
                                `delete-${id}`
                            }
                            onClick={() =>
                                handleMyHSCodeAction(
                                    item,
                                    'delete'
                                )
                            }
                        >
                            {actionLoading ===
                            `delete-${id}`
                                ? '...'
                                : 'Delete'}
                        </button>
                    </div>
                </div>
            </article>
        );
    };


    // ======================================================
    // RENDER
    // ======================================================

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

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className={
                        styles.header
                    }
                >

                    <div
                        className={
                            styles.headerLeft
                        }
                    >

                        <Link
                            href="/documentation"
                            className={
                                styles.backLink
                            }
                        >
                            ← Documentation
                        </Link>

                        <span
                            className={
                                styles.eyebrow
                            }
                        >
                            CUSTOMS TARIFF
                        </span>

                        <h1>
                            HS Codes
                        </h1>

                        <p>
                            Browse and search
                            customs tariff
                            classifications.
                        </p>

                    </div>


                    <Link
                        href="/documentation"
                        className={
                            styles.documentationButton
                        }
                    >
                        Documentation
                    </Link>

                </header>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <form
                    onSubmit={
                        handleSearch
                    }
                    className={
                        styles.searchBox
                    }
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
                            onChange={
                                (event) =>
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
                                onClick={
                                    clearSearch
                                }
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


                {/* ==================================================
                    MOBILE MY HS CODES BUTTON
                ================================================== */}

                {isLoggedIn && (
                    <div
                        className={
                            styles.mobileMyHsButtonWrap
                        }
                    >

                        <button
                            type="button"
                            className={
                                styles.mobileMyHsButton
                            }
                            onClick={() =>
                                setShowMyHsCodes(true)
                            }
                        >

                            <span
                                className={
                                    styles.mobileMyHsButtonIcon
                                }
                            >
                                HS
                            </span>

                            <span
                                className={
                                    styles.mobileMyHsButtonText
                                }
                            >
                                <strong>
                                    My HS Codes
                                </strong>

                                <small>
                                    {
                                        myHsCodes.length
                                    }{' '}
                                    created
                                </small>
                            </span>

                            <span
                                className={
                                    styles.mobileMyHsButtonArrow
                                }
                            >
                                →
                            </span>

                        </button>

                    </div>
                )}


                {/* ==================================================
                    MAIN HS CODE CONTENT
                ================================================== */}

                <div
                    className={
                        styles.hsCodeLayout
                    }
                >

                    {/* ==================================================
                        MY HS CODES — DESKTOP LEFT
                    ================================================== */}

                    {isLoggedIn && (
                        <aside
                            className={
                                styles.myHsColumn
                            }
                        >

                            <div
                                className={
                                    styles.myHsDesktopHeader
                                }
                            >

                                <div>

                                    <span>
                                        YOUR HS CODES
                                    </span>

                                    <h2>
                                        My HS Codes
                                    </h2>

                                    <p>
                                        HS Code
                                        classifications
                                        created by you.
                                    </p>

                                </div>


                                {!myHsCodesLoading &&
                                    !myHsCodesError && (
                                        <div
                                            className={
                                                styles.countBadge
                                            }
                                        >
                                            <strong>
                                                {
                                                    myHsCodes.length
                                                }
                                            </strong>

                                            <span>
                                                Created
                                            </span>
                                        </div>
                                    )}

                            </div>


                            {/* ------------------------------------------
                                MY HS LOADING
                            ------------------------------------------ */}

                            {myHsCodesLoading && (
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
                                        Loading your
                                        HS Codes...
                                    </p>
                                </div>
                            )}


                            {/* ------------------------------------------
                                MY HS ERROR
                            ------------------------------------------ */}

                            {!myHsCodesLoading &&
                                myHsCodesError && (
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
                                            Unable to load
                                            your HS Codes
                                        </h3>

                                        <p>
                                            {
                                                myHsCodesError
                                            }
                                        </p>

                                    </div>
                                )}


                            {/* ------------------------------------------
                                MY HS EMPTY
                            ------------------------------------------ */}

                            {!myHsCodesLoading &&
                                !myHsCodesError &&
                                myHsCodes.length === 0 && (
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
                                            You haven't
                                            created any
                                            HS Codes yet
                                        </h3>

                                        <p>
                                            Create your
                                            first HS Code
                                            classification
                                            to see it here.
                                        </p>

                                        <Link
                                            href="/hs-codes/create"
                                            className={
                                                styles.createButton
                                            }
                                        >
                                            + Create HS Code
                                        </Link>

                                    </div>
                                )}


                            {/* ------------------------------------------
                                MY HS LIST
                            ------------------------------------------ */}

                            {!myHsCodesLoading &&
                                !myHsCodesError &&
                                myHsCodes.length > 0 && (
                                    <section
                                        className={
                                            styles.myHsList
                                        }
                                    >

                                        {myHsCodes.map(
                                            (
                                                item,
                                                index
                                            ) =>
                                                renderHSCodeCard(
                                                    item,
                                                    index,
                                                    true
                                                )
                                        )}

                                    </section>
                                )}

                        </aside>
                    )}


                    {/* ==================================================
                        ALL HS CODES
                    ================================================== */}

                    <section
                        className={
                            styles.publicHsColumn
                        }
                    >

                        {/* ------------------------------------------
                            DIRECTORY HEADER
                        ------------------------------------------ */}

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


                            {!loading &&
                                !error && (
                                    <div
                                        className={
                                            styles.countBadge
                                        }
                                    >

                                        <strong>
                                            {
                                                hsCodes.length
                                            }
                                        </strong>

                                        <span>
                                            {submittedSearch
                                                ? 'Results'
                                                : 'Shown'}
                                        </span>

                                    </div>
                                )}

                        </div>


                        {/* ------------------------------------------
                            ERROR
                        ------------------------------------------ */}

                        {!loading &&
                            error && (
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
                                        Unable to load
                                        HS Codes
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


                        {/* ------------------------------------------
                            LOADING
                        ------------------------------------------ */}

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


                        {/* ------------------------------------------
                            EMPTY
                        ------------------------------------------ */}

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
                                        Try searching with
                                        another HS Code,
                                        product name,
                                        chapter or keyword.
                                    </p>

                                    {submittedSearch && (
                                        <button
                                            type="button"
                                            className={
                                                styles.clearSearchButton
                                            }
                                            onClick={
                                                clearSearch
                                            }
                                        >
                                            View All HS Codes
                                        </button>
                                    )}

                                </div>
                            )}


                        {/* ------------------------------------------
                            ALL HS CODE LIST
                        ------------------------------------------ */}

                        {!loading &&
                            !error &&
                            hsCodes.length > 0 && (
                                <section
                                    className={
                                        styles.list
                                    }
                                >

                                    {hsCodes.map(
                                        (
                                            item,
                                            index
                                        ) =>
                                            renderHSCodeCard(
                                                item,
                                                index,
                                                false
                                            )
                                    )}

                                </section>
                            )}


                        {/* ------------------------------------------
                            PAGINATION
                        ------------------------------------------ */}

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
                                        disabled={
                                            page <= 1
                                        }
                                        onClick={() =>
                                            setPage(
                                                (
                                                    currentPage
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        currentPage -
                                                            1
                                                    )
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
                                                (
                                                    currentPage
                                                ) =>
                                                    Math.min(
                                                        totalPages,
                                                        currentPage +
                                                            1
                                                    )
                                            )
                                        }
                                    >
                                        Next →
                                    </button>

                                </div>
                            )}

                    </section>

                </div>

            </div>


            {/* ==================================================
                MOBILE MY HS CODES DRAWER
            ================================================== */}

            {isLoggedIn &&
                showMyHsCodes && (
                    <div
                        className={
                            styles.mobileMyHsOverlay
                        }
                        onClick={() =>
                            setShowMyHsCodes(false)
                        }
                    >

                        <aside
                            className={
                                styles.mobileMyHsDrawer
                            }
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            {/* ------------------------------------------
                                DRAWER HEADER
                            ------------------------------------------ */}

                            <div
                                className={
                                    styles.mobileDrawerHeader
                                }
                            >

                                <div>

                                    <span>
                                        YOUR HS CODES
                                    </span>

                                    <h2>
                                        My HS Codes
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className={
                                        styles.mobileDrawerClose
                                    }
                                    onClick={() =>
                                        setShowMyHsCodes(false)
                                    }
                                    aria-label="Close My HS Codes"
                                >
                                    ×
                                </button>

                            </div>


                            {/* ------------------------------------------
                                DRAWER CONTENT
                            ------------------------------------------ */}

                            <div
                                className={
                                    styles.mobileDrawerContent
                                }
                            >

                                {/* LOADING */}

                                {myHsCodesLoading && (
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
                                            Loading your
                                            HS Codes...
                                        </p>

                                    </div>
                                )}


                                {/* ERROR */}

                                {!myHsCodesLoading &&
                                    myHsCodesError && (
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
                                                Unable to load
                                                your HS Codes
                                            </h3>

                                            <p>
                                                {
                                                    myHsCodesError
                                                }
                                            </p>

                                        </div>
                                    )}


                                {/* EMPTY */}

                                {!myHsCodesLoading &&
                                    !myHsCodesError &&
                                    myHsCodes.length === 0 && (
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
                                                You haven't
                                                created any
                                                HS Codes yet
                                            </h3>

                                            <p>
                                                Create your
                                                first HS Code
                                                classification
                                                to see it here.
                                            </p>

                                            <Link
                                                href="/hs-codes/create"
                                                className={
                                                    styles.createButton
                                                }
                                                onClick={() =>
                                                    setShowMyHsCodes(
                                                        false
                                                    )
                                                }
                                            >
                                                + Create HS Code
                                            </Link>

                                        </div>
                                    )}


                                {/* MY HS CODE LIST */}

                                {!myHsCodesLoading &&
                                    !myHsCodesError &&
                                    myHsCodes.length > 0 && (
                                        <section
                                            className={
                                                styles.myHsList
                                            }
                                        >

                                            {myHsCodes.map(
                                                (
                                                    item,
                                                    index
                                                ) =>
                                                    renderHSCodeCard(
                                                        item,
                                                        index,
                                                        true
                                                    )
                                            )}

                                        </section>
                                    )}

                            </div>

                        </aside>

                    </div>
                )}

        </main>
    );
}