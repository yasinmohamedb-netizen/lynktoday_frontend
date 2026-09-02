'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './my-documents.module.css';


// ============================================================
// API
// ============================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://lynktoday-backend.onrender.com/api/v1';


// ============================================================
// CONSTANTS
// ============================================================

const DOCUMENTS_PER_PAGE = 10;


// ============================================================
// HELPERS
// ============================================================

const getDocumentId = (document) => {

    return (
        document?._id ||
        document?.id ||
        ''
    );

};


const getDocumentHref = (document) => {

    const value =
        document?.slug ||
        document?._id ||
        document?.id;

    if (!value) {

        return '/documentation';

    }

    return `/documentation/${encodeURIComponent(
        String(value)
    )}`;

};


const getEditHref = (document) => {

    const value =
        document?.slug ||
        document?._id ||
        document?.id;

    if (!value) {

        return '/documentation/my-documents';

    }

    return `/documentation/edit/${encodeURIComponent(
        String(value)
    )}`;

};


const formatDate = (dateValue) => {

    if (!dateValue) {

        return '—';

    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return '—';

    }

    return date.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }
    );

};


const getDocumentTypeLabel = (document) => {

    return (
        document?.documentType ||
        'DOCUMENT'
    );

};


const getCategoryLabel = (document) => {

    return (
        document?.category ||
        'General'
    );

};


const getDescription = (document) => {

    const description =
        document?.description ||
        '';

    if (
        description.length <= 180
    ) {

        return description;

    }

    return `${description.slice(
        0,
        177
    )}...`;

};


const getStatus = (document) => {

    return document?.isActive !== false
        ? 'Active'
        : 'Inactive';

};


// ============================================================
// PAGE
// ============================================================

export default function MyDocumentsPage() {

    const router =
        useRouter();


    // ========================================================
    // STATE
    // ========================================================

    const [token, setToken] =
        useState(null);

    /*
     * IMPORTANT:
     *
     * We must not treat token === null
     * as "logged out" immediately.
     *
     * On the first browser render, localStorage
     * has not been checked yet.
     *
     * authChecking tells us whether that
     * browser-side authentication check is complete.
     */

    const [authChecking, setAuthChecking] =
        useState(true);


    const [documents, setDocuments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [deletingId, setDeletingId] =
        useState(null);


    const [error, setError] =
        useState('');


    const [success, setSuccess] =
        useState('');


    const [page, setPage] =
        useState(1);


    const [totalPages, setTotalPages] =
        useState(1);


    const [totalDocuments, setTotalDocuments] =
        useState(0);


    // ========================================================
    // LOAD TOKEN
    // ========================================================

    useEffect(() => {

        try {

            const storedToken =
                localStorage.getItem(
                    'lynktoday_token'
                );


            if (storedToken) {

                setToken(
                    storedToken
                );

            } else {

                setToken('');

            }

        } catch (storageError) {

            console.error(
                'Unable to read authentication token:',
                storageError
            );

            setToken('');

        } finally {

            setAuthChecking(false);

        }

    }, []);


    // ========================================================
    // REDIRECT ONLY AFTER AUTH CHECK IS COMPLETE
    // ========================================================

    useEffect(() => {

        if (
            !authChecking &&
            !token
        ) {

            router.replace(
                `/login?redirect=${encodeURIComponent(
                    '/documentation/my-documents'
                )}`
            );

        }

    }, [
        authChecking,
        token,
        router
    ]);


    // ========================================================
    // FETCH MY DOCUMENTS
    // ========================================================

    const fetchMyDocuments =
        useCallback(
            async () => {

                if (!token) {

                    return;

                }


                try {

                    setLoading(true);

                    setError('');


                    const response =
                        await fetch(
                            `${API_BASE_URL}/documentation/my?page=${page}&limit=${DOCUMENTS_PER_PAGE}`,
                            {
                                method: 'GET',

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    'Content-Type':
                                        'application/json'
                                },

                                cache: 'no-store'
                            }
                        );


                    let data = null;


                    try {

                        data =
                            await response.json();

                    } catch {

                        data = null;

                    }


                    // ==================================================
                    // AUTHENTICATION FAILURE
                    //
                    // ONLY 401 means the JWT is invalid/expired.
                    //
                    // IMPORTANT:
                    // Do NOT treat 403 as logout.
                    // 403 means authenticated but not authorized.
                    // ==================================================

                    if (
                        response.status === 401
                    ) {

                        localStorage.removeItem(
                            'lynktoday_token'
                        );

                        localStorage.removeItem(
                            'lynktoday_user'
                        );


                        setToken('');


                        router.replace(
                            `/login?redirect=${encodeURIComponent(
                                '/documentation/my-documents'
                            )}`
                        );


                        return;

                    }


                    // ==================================================
                    // PERMISSION FAILURE
                    //
                    // Do NOT remove the token.
                    // Do NOT redirect to login.
                    // ==================================================

                    if (
                        response.status === 403
                    ) {

                        setError(
                            data?.message ||
                            'You are not authorized to view your documents.'
                        );

                        setDocuments([]);

                        return;

                    }


                    // ==================================================
                    // OTHER API FAILURE
                    // ==================================================

                    if (!response.ok) {

                        throw new Error(
                            data?.message ||
                            'Failed to load your documents.'
                        );

                    }


                    // ==================================================
                    // DOCUMENT DATA
                    // ==================================================

                    const fetchedDocuments =
                        data?.documentation ||
                        data?.documents ||
                        data?.data ||
                        [];


                    setDocuments(
                        Array.isArray(
                            fetchedDocuments
                        )
                            ? fetchedDocuments
                            : []
                    );


                    // ==================================================
                    // PAGINATION
                    // ==================================================

                    const pagination =
                        data?.pagination ||
                        {};


                    const currentPage =
                        Number(
                            pagination?.currentPage ||
                            pagination?.page ||
                            page
                        );


                    const returnedTotalPages =
                        Number(
                            pagination?.totalPages ||
                            1
                        );


                    /*
                     * Backend returns:
                     *
                     * pagination.totalItems
                     *
                     * Support the older keys as fallback too.
                     */

                    const returnedTotal =
                        Number(
                            pagination?.totalItems ??
                            pagination?.total ??
                            pagination?.totalDocuments ??
                            fetchedDocuments.length
                        );


                    setPage(
                        currentPage ||
                        page
                    );


                    setTotalPages(
                        Math.max(
                            returnedTotalPages || 1,
                            1
                        )
                    );


                    setTotalDocuments(
                        returnedTotal || 0
                    );


                } catch (fetchError) {

                    console.error(
                        'Fetch my documents error:',
                        fetchError
                    );


                    setError(
                        fetchError?.message ||
                        'Unable to load your documents.'
                    );


                    setDocuments([]);

                } finally {

                    setLoading(false);

                }

            },
            [
                token,
                page,
                router
            ]
        );


    // ========================================================
    // FETCH WHEN TOKEN / PAGE CHANGES
    // ========================================================

    useEffect(() => {

        if (!token) {

            return;

        }

        fetchMyDocuments();

    }, [
        token,
        page,
        fetchMyDocuments
    ]);


    // ========================================================
    // DELETE DOCUMENT
    // ========================================================

    const handleDelete =
        async (document) => {

            const documentId =
                getDocumentId(
                    document
                );


            if (!documentId) {

                setError(
                    'Unable to identify this document.'
                );

                return;

            }


            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${document?.title || 'this document'}"?\n\nThis action cannot be undone.`
                );


            if (!confirmed) {

                return;

            }


            try {

                setDeletingId(
                    documentId
                );

                setError('');

                setSuccess('');


                const response =
                    await fetch(
                        `${API_BASE_URL}/documentation/${encodeURIComponent(
                            String(documentId)
                        )}`,
                        {
                            method: 'DELETE',

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                'Content-Type':
                                    'application/json'
                            }
                        }
                    );


                let data = null;


                try {

                    data =
                        await response.json();

                } catch {

                    data = null;

                }


                // ==================================================
                // AUTHENTICATION FAILURE
                //
                // ONLY 401 clears the login session.
                // ==================================================

                if (
                    response.status === 401
                ) {

                    localStorage.removeItem(
                        'lynktoday_token'
                    );

                    localStorage.removeItem(
                        'lynktoday_user'
                    );


                    setToken('');


                    router.replace(
                        `/login?redirect=${encodeURIComponent(
                            '/documentation/my-documents'
                        )}`
                    );


                    return;

                }


                // ==================================================
                // PERMISSION FAILURE
                //
                // Keep the user's valid session.
                // ==================================================

                if (
                    response.status === 403
                ) {

                    setError(
                        data?.message ||
                        'You are not authorized to delete this document.'
                    );

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        'Failed to delete the document.'
                    );

                }


                setSuccess(
                    'Documentation deleted successfully.'
                );


                // ==================================================
                // REMOVE FROM CURRENT LIST
                // ==================================================

                setDocuments(
                    previousDocuments =>
                        previousDocuments.filter(
                            item =>
                                String(
                                    getDocumentId(
                                        item
                                    )
                                ) !==
                                String(
                                    documentId
                                )
                        )
                );


                setTotalDocuments(
                    previousTotal =>
                        Math.max(
                            Number(
                                previousTotal || 0
                            ) - 1,
                            0
                        )
                );


                // ==================================================
                // IF CURRENT PAGE BECOMES EMPTY,
                // GO TO PREVIOUS PAGE
                // ==================================================

                if (
                    documents.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        previousPage =>
                            Math.max(
                                previousPage - 1,
                                1
                            )
                    );

                }


            } catch (deleteError) {

                console.error(
                    'Delete documentation error:',
                    deleteError
                );


                setError(
                    deleteError?.message ||
                    'Unable to delete the document.'
                );

            } finally {

                setDeletingId(
                    null
                );

            }

        };


    // ========================================================
    // PAGINATION
    // ========================================================

    const goToPreviousPage =
        () => {

            if (page <= 1) {

                return;

            }


            setPage(
                previousPage =>
                    Math.max(
                        previousPage - 1,
                        1
                    )
            );


            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        };


    const goToNextPage =
        () => {

            if (
                page >= totalPages
            ) {

                return;

            }


            setPage(
                previousPage =>
                    Math.min(
                        previousPage + 1,
                        totalPages
                    )
            );


            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        };


    // ========================================================
    // PAGE NUMBERS
    // ========================================================

    const pageNumbers =
        useMemo(() => {

            const numbers = [];

            const maxVisiblePages = 5;


            if (
                totalPages <=
                maxVisiblePages
            ) {

                for (
                    let index = 1;
                    index <= totalPages;
                    index += 1
                ) {

                    numbers.push(
                        index
                    );

                }

                return numbers;

            }


            let start =
                Math.max(
                    page - 2,
                    1
                );


            let end =
                Math.min(
                    start +
                        maxVisiblePages -
                        1,
                    totalPages
                );


            if (
                end - start <
                maxVisiblePages - 1
            ) {

                start =
                    Math.max(
                        end -
                            maxVisiblePages +
                            1,
                        1
                    );

            }


            for (
                let index = start;
                index <= end;
                index += 1
            ) {

                numbers.push(
                    index
                );

            }


            return numbers;

        }, [
            page,
            totalPages
        ]);


    // ========================================================
    // LOADING BEFORE AUTH CHECK
    // ========================================================

    if (authChecking) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.loadingScreen
                    }
                >

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <h2>
                        Checking your account...
                    </h2>

                    <p>
                        Please wait.
                    </p>

                </div>

            </main>

        );

    }


    // ========================================================
    // NO TOKEN
    //
    // Redirect effect above handles this.
    // Render nothing while redirecting.
    // ========================================================

    if (!token) {

        return null;

    }


    // ========================================================
    // PAGE UI
    // ========================================================

    return (

        <main
            className={
                styles.page
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
                        styles.headerInner
                    }
                >

                    <div
                        className={
                            styles.headerContent
                        }
                    >

                        <div
                            className={
                                styles.headerText
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


                            <h1>
                                My Documents
                            </h1>


                            <p>
                                Manage the documentation
                                you have created and published
                                on LynkToday.
                            </p>

                        </div>


                        <div
                            className={
                                styles.headerActions
                            }
                        >

                            <Link
                                href="/documentation"
                                className={
                                    styles.secondaryButton
                                }
                            >
                                Browse Documentation
                            </Link>


                            <Link
                                href="/documentation/create"
                                className={
                                    styles.primaryButton
                                }
                            >
                                + Create Documentation
                            </Link>

                        </div>

                    </div>

                </div>

            </header>


            {/* ==================================================
               CONTENT
            ================================================== */}

            <section
                className={
                    styles.container
                }
            >

                {/* ==================================================
                   ALERTS
                ================================================== */}

                {error && (

                    <div
                        className={
                            styles.errorMessage
                        }
                        role="alert"
                    >

                        <span
                            className={
                                styles.alertIcon
                            }
                        >
                            !
                        </span>


                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            className={
                                styles.alertClose
                            }
                            onClick={() =>
                                setError('')
                            }
                            aria-label="Close error"
                        >
                            ×
                        </button>

                    </div>

                )}


                {success && (

                    <div
                        className={
                            styles.successMessage
                        }
                        role="status"
                    >

                        <span
                            className={
                                styles.alertIcon
                            }
                        >
                            ✓
                        </span>


                        <span>
                            {success}
                        </span>


                        <button
                            type="button"
                            className={
                                styles.alertClose
                            }
                            onClick={() =>
                                setSuccess('')
                            }
                            aria-label="Close success message"
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* ==================================================
                   SUMMARY
                ================================================== */}

                <div
                    className={
                        styles.summaryRow
                    }
                >

                    <div>

                        <h2>
                            Your documentation
                        </h2>


                        <p>
                            {totalDocuments === 0
                                ? 'You have not published any documentation yet.'
                                : `${totalDocuments} document${totalDocuments === 1 ? '' : 's'} published`
                            }
                        </p>

                    </div>


                    <Link
                        href="/documentation/create"
                        className={
                            styles.mobileCreateButton
                        }
                    >
                        + New Document
                    </Link>

                </div>


                {/* ==================================================
                   LOADING
                ================================================== */}

                {loading && (

                    <section
                        className={
                            styles.documentsSection
                        }
                    >

                        <div
                            className={
                                styles.loadingState
                            }
                        >

                            <div
                                className={
                                    styles.spinner
                                }
                            />


                            <h3>
                                Loading your documents...
                            </h3>


                            <p>
                                Please wait while we fetch
                                your documentation.
                            </p>

                        </div>

                    </section>

                )}


                {/* ==================================================
                   EMPTY
                ================================================== */}

                {!loading &&
                    !error &&
                    documents.length === 0 && (

                        <section
                            className={
                                styles.emptyState
                            }
                        >

                            <div
                                className={
                                    styles.emptyIcon
                                }
                            >
                                ✦
                            </div>


                            <h2>
                                No documents yet
                            </h2>


                            <p>
                                You haven't published any
                                documentation yet. Share your
                                knowledge with the LynkToday
                                trade and logistics community.
                            </p>


                            <Link
                                href="/documentation/create"
                                className={
                                    styles.primaryButton
                                }
                            >
                                + Create Your First Document
                            </Link>

                        </section>

                    )}


                {/* ==================================================
                   DOCUMENT LIST
                ================================================== */}

                {!loading &&
                    documents.length > 0 && (

                        <section
                            className={
                                styles.documentsSection
                            }
                        >

                            <div
                                className={
                                    styles.documentsList
                                }
                            >

                                {documents.map(
                                    document => {

                                        const documentId =
                                            getDocumentId(
                                                document
                                            );


                                        const isDeleting =
                                            String(
                                                deletingId
                                            ) ===
                                            String(
                                                documentId
                                            );


                                        return (

                                            <article
                                                key={
                                                    documentId ||
                                                    document?.slug
                                                }
                                                className={
                                                    `${styles.documentCard} ${
                                                        document?.isActive === false
                                                            ? styles.inactiveCard
                                                            : ''
                                                    }`
                                                }
                                            >

                                                {/* ==========================================
                                                   CARD TOP
                                                ========================================== */}

                                                <div
                                                    className={
                                                        styles.cardTop
                                                    }
                                                >

                                                    <div
                                                        className={
                                                            styles.badges
                                                        }
                                                    >

                                                        <span
                                                            className={
                                                                styles.typeBadge
                                                            }
                                                        >
                                                            {
                                                                getDocumentTypeLabel(
                                                                    document
                                                                )
                                                            }
                                                        </span>


                                                        <span
                                                            className={
                                                                styles.categoryBadge
                                                            }
                                                        >
                                                            {
                                                                getCategoryLabel(
                                                                    document
                                                                )
                                                            }
                                                        </span>


                                                        <span
                                                            className={
                                                                document?.isActive === false
                                                                    ? styles.inactiveBadge
                                                                    : styles.activeBadge
                                                            }
                                                        >

                                                            <span
                                                                className={
                                                                    styles.statusDot
                                                                }
                                                            />

                                                            {
                                                                getStatus(
                                                                    document
                                                                )
                                                            }

                                                        </span>

                                                    </div>


                                                    <span
                                                        className={
                                                            styles.date
                                                        }
                                                    >
                                                        {formatDate(
                                                            document?.createdAt
                                                        )}
                                                    </span>

                                                </div>


                                                {/* ==========================================
                                                   TITLE
                                                ========================================== */}

                                                <h3
                                                    className={
                                                        styles.documentTitle
                                                    }
                                                >

                                                    <Link
                                                        href={
                                                            getDocumentHref(
                                                                document
                                                            )
                                                        }
                                                    >
                                                        {
                                                            document?.title ||
                                                            'Untitled Document'
                                                        }
                                                    </Link>

                                                </h3>


                                                {/* ==========================================
                                                   DESCRIPTION
                                                ========================================== */}

                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        getDescription(
                                                            document
                                                        ) ||
                                                        'No description available.'
                                                    }
                                                </p>


                                                {/* ==========================================
                                                   META
                                                ========================================== */}

                                                <div
                                                    className={
                                                        styles.metaRow
                                                    }
                                                >

                                                    <span>
                                                        👁{' '}
                                                        {
                                                            Number(
                                                                document?.views ||
                                                                0
                                                            )
                                                        }{' '}
                                                        views
                                                    </span>


                                                    {document?.updatedAt && (

                                                        <span>
                                                            Updated{' '}
                                                            {
                                                                formatDate(
                                                                    document?.updatedAt
                                                                )
                                                            }
                                                        </span>

                                                    )}


                                                    {document?.hsCode && (

                                                        <span>
                                                            HS Code:{' '}
                                                            {
                                                                document?.hsCode
                                                            }
                                                        </span>

                                                    )}

                                                </div>


                                                {/* ==========================================
                                                   TAGS
                                                ========================================== */}

                                                {Array.isArray(
                                                    document?.tags
                                                ) &&
                                                document.tags.length > 0 && (

                                                    <div
                                                        className={
                                                            styles.tags
                                                        }
                                                    >

                                                        {document.tags
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    tag,
                                                                    index
                                                                ) => (

                                                                    <span
                                                                        key={
                                                                            `${tag}-${index}`
                                                                        }
                                                                        className={
                                                                            styles.tag
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


                                                {/* ==========================================
                                                   ACTIONS
                                                ========================================== */}

                                                <div
                                                    className={
                                                        styles.actions
                                                    }
                                                >

                                                    <Link
                                                        href={
                                                            getDocumentHref(
                                                                document
                                                            )
                                                        }
                                                        className={
                                                            styles.viewButton
                                                        }
                                                    >
                                                        View
                                                    </Link>


                                                    <Link
                                                        href={
                                                            getEditHref(
                                                                document
                                                            )
                                                        }
                                                        className={
                                                            styles.editButton
                                                        }
                                                    >
                                                        Edit
                                                    </Link>


                                                    <button
                                                        type="button"
                                                        className={
                                                            styles.deleteButton
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                document
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting
                                                        }
                                                    >

                                                        {isDeleting
                                                            ? 'Deleting...'
                                                            : 'Delete'
                                                        }

                                                    </button>

                                                </div>

                                            </article>

                                        );

                                    }
                                )}

                            </div>


                            {/* ==================================================
                               PAGINATION
                            ================================================== */}

                            {totalPages > 1 && (

                                <nav
                                    className={
                                        styles.pagination
                                    }
                                    aria-label="Documentation pagination"
                                >

                                    <button
                                        type="button"
                                        className={
                                            styles.paginationButton
                                        }
                                        onClick={
                                            goToPreviousPage
                                        }
                                        disabled={
                                            page <= 1
                                        }
                                    >
                                        ← Previous
                                    </button>


                                    <div
                                        className={
                                            styles.pageNumbers
                                        }
                                    >

                                        {pageNumbers.map(
                                            pageNumber => (

                                                <button
                                                    key={
                                                        pageNumber
                                                    }
                                                    type="button"
                                                    className={
                                                        pageNumber === page
                                                            ? styles.activePage
                                                            : styles.pageNumber
                                                    }
                                                    onClick={() => {

                                                        setPage(
                                                            pageNumber
                                                        );

                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: 'smooth'
                                                        });

                                                    }}
                                                >
                                                    {
                                                        pageNumber
                                                    }
                                                </button>

                                            )
                                        )}

                                    </div>


                                    <button
                                        type="button"
                                        className={
                                            styles.paginationButton
                                        }
                                        onClick={
                                            goToNextPage
                                        }
                                        disabled={
                                            page >= totalPages
                                        }
                                    >
                                        Next →
                                    </button>

                                </nav>

                            )}


                            {/* ==================================================
                               PAGINATION INFO
                            ================================================== */}

                            {totalPages > 1 && (

                                <p
                                    className={
                                        styles.paginationInfo
                                    }
                                >
                                    Page{' '}
                                    <strong>
                                        {page}
                                    </strong>{' '}
                                    of{' '}
                                    <strong>
                                        {totalPages}
                                    </strong>
                                </p>

                            )}

                        </section>

                    )}

            </section>

        </main>

    );

}