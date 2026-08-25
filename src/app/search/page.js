'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './page.module.css';

// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// Search Page
// ======================================================

export default function SearchPage() {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [posts, setPosts] = useState([]);
    const [hsCodes, setHsCodes] = useState([]);

    const [error, setError] = useState('');


    // ==================================================
    // Read Query From URL
    // ==================================================

    useEffect(() => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const searchQuery =
            params.get('q') || '';

        setQuery(searchQuery);

        if (searchQuery.trim()) {

            performSearch(
                searchQuery.trim()
            );

        }

    }, []);


    // ==================================================
    // Search
    // ==================================================

    const performSearch = async (
        searchQuery
    ) => {

        try {

            setLoading(true);
            setError('');

            setUsers([]);
            setCompanies([]);
            setQuestions([]);
            setPosts([]);
            setHsCodes([]);


            // ==================================================
            // GLOBAL SEARCH
            // ==================================================

            const searchUrl =
                `${API_BASE_URL}/search?q=${encodeURIComponent(
                    searchQuery
                )}&limit=20`;

            const searchResponse =
                await fetch(searchUrl);

            if (!searchResponse.ok) {

                throw new Error(
                    `Search request failed: ${searchResponse.status}`
                );

            }

            const searchData =
                await searchResponse.json();

            if (!searchData.success) {

                throw new Error(
                    searchData.message ||
                    'Search failed.'
                );

            }


            // ==================================================
            // USERS
            // ==================================================

            setUsers(
                Array.isArray(
                    searchData.results?.users
                )
                    ? searchData.results.users
                    : []
            );


            // ==================================================
            // COMPANIES
            // ==================================================

            setCompanies(
                Array.isArray(
                    searchData.results?.companies
                )
                    ? searchData.results.companies
                    : []
            );


            // ==================================================
            // QUESTIONS
            // ==================================================

            setQuestions(
                Array.isArray(
                    searchData.questions
                )
                    ? searchData.questions
                    : []
            );


            // ==================================================
            // POSTS
            //
            // We use the dedicated posts endpoint because
            // your backend supports:
            //
            // GET /api/v1/posts?search=import&limit=20
            // ==================================================

            try {

                const postsUrl =
                    `${API_BASE_URL}/posts?search=${encodeURIComponent(
                        searchQuery
                    )}&limit=20`;

                const postsResponse =
                    await fetch(postsUrl);

                if (postsResponse.ok) {

                    const postsData =
                        await postsResponse.json();

                    if (postsData.success) {

                        const postResults =
                            Array.isArray(
                                postsData.posts
                            )
                                ? postsData.posts
                                : [];

                        /*
                         * Questions are already displayed
                         * separately, so don't show QUESTION
                         * posts again inside Posts.
                         */

                        const normalPosts =
                            postResults.filter(
                                (post) =>
                                    post?.postType !==
                                    'QUESTION'
                            );

                        setPosts(
                            normalPosts
                        );

                    }

                }

            } catch (postsError) {

                console.error(
                    'Posts search failed:',
                    postsError
                );

                /*
                 * Don't fail the entire search if
                 * posts API has an issue.
                 */

                setPosts([]);

            }


            // ==================================================
            // HS CODES
            // ==================================================

            /*
             * If the global search API already returns
             * HS Codes, use them.
             */

            if (
                Array.isArray(
                    searchData.hsCodes
                )
            ) {

                setHsCodes(
                    searchData.hsCodes
                );

            }


            // ==================================================
            // FALLBACK HS CODE SEARCH
            //
            // This allows HS Code search to work even if the
            // global search controller has not yet been updated.
            // ==================================================

            if (
                !Array.isArray(
                    searchData.hsCodes
                ) ||
                searchData.hsCodes.length === 0
            ) {

                try {

                    const hsUrl =
                        `${API_BASE_URL}/hs-codes?search=${encodeURIComponent(
                            searchQuery
                        )}&limit=20`;

                    const hsResponse =
                        await fetch(hsUrl);

                    if (
                        hsResponse.ok
                    ) {

                        const hsData =
                            await hsResponse.json();

                        if (
                            hsData.success
                        ) {

                            const hsResults =
                                hsData.hsCodes ||
                                hsData.results ||
                                hsData.data ||
                                [];

                            setHsCodes(
                                Array.isArray(
                                    hsResults
                                )
                                    ? hsResults
                                    : []
                            );

                        }

                    }

                } catch (hsError) {

                    console.error(
                        'HS Code search failed:',
                        hsError
                    );

                }

            }

        } catch (searchError) {

            console.error(
                'Global search error:',
                searchError
            );

            setError(
                searchError.message ||
                'Unable to perform search.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // Render
    // ==================================================

    return (

        <main
            className={
                styles.container
            }
        >

            {/* ==========================================
                Header
            ========================================== */}

            <div
                className={
                    styles.header
                }
            >

                <Link
                    href="/"
                    className={
                        styles.backButton
                    }
                >
                    ← Back
                </Link>


                <div>

                    <h1>
                        Search Results
                    </h1>

                    <p>

                        Results for:

                        <strong>
                            {' "'}
                            {query}
                            {'"'}
                        </strong>

                    </p>

                </div>

            </div>


            {/* ==========================================
                Loading
            ========================================== */}

            {loading && (

                <div
                    className={
                        styles.loading
                    }
                >
                    Searching...
                </div>

            )}


            {/* ==========================================
                Error
            ========================================== */}

            {!loading && error && (

                <div
                    className={
                        styles.error
                    }
                >

                    {error}

                </div>

            )}


            {!loading && !error && (

                <div
                    className={
                        styles.results
                    }
                >


                    {/* ==================================
                        HS CODES
                    ================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >

                            <h2>
                                HS Codes
                            </h2>

                            <span>
                                {hsCodes.length}
                            </span>

                        </div>


                        {hsCodes.length === 0 ? (

                            <div
                                className={
                                    styles.empty
                                }
                            >

                                No HS Codes found.

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.cardList
                                }
                            >

                                {hsCodes.map(
                                    (item) => (

                                        <Link
                                            key={
                                                `hs-${item._id || item.hsCode}`
                                            }
                                            href={`/hs-codes/${item._id || item.hsCode}`}
                                            className={
                                                styles.hsCard
                                            }
                                        >

                                            <div>

                                                <div
                                                    className={
                                                        styles.hsCode
                                                    }
                                                >

                                                    {
                                                        item.hsCode
                                                    }

                                                </div>


                                                <h3>

                                                    {
                                                        item.description
                                                    }

                                                </h3>


                                                <div
                                                    className={
                                                        styles.meta
                                                    }
                                                >

                                                    {item.chapter && (

                                                        <span>

                                                            Chapter{' '}

                                                            {
                                                                item.chapterNumber
                                                            }

                                                        </span>

                                                    )}


                                                    {item.heading && (

                                                        <span>

                                                            Heading{' '}

                                                            {
                                                                item.heading
                                                            }

                                                        </span>

                                                    )}


                                                    {item.country && (

                                                        <span>

                                                            {
                                                                item.country
                                                            }

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            <span
                                                className={
                                                    styles.arrow
                                                }
                                            >
                                                →
                                            </span>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==================================
                        POSTS
                    ================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >

                            <h2>
                                Posts
                            </h2>

                            <span>
                                {posts.length}
                            </span>

                        </div>


                        {posts.length === 0 ? (

                            <div
                                className={
                                    styles.empty
                                }
                            >

                                No posts found.

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.cardList
                                }
                            >

                                {posts.map(
                                    (post) => (

                                        <Link
                                            key={
                                                `post-${post._id || post.id}`
                                            }
                                            href={`/posts/${post._id || post.id}`}
                                            className={
                                                styles.questionCard
                                            }
                                        >

                                            <div>

                                                <h3>

                                                    {
                                                        post.title ||
                                                        'Untitled Post'
                                                    }

                                                </h3>


                                                {post.content && (

                                                    <p>

                                                        {
                                                            post.content
                                                        }

                                                    </p>

                                                )}


                                                <div
                                                    className={
                                                        styles.meta
                                                    }
                                                >

                                                    {post.author?.fullName && (

                                                        <span>

                                                            {
                                                                post.author.fullName
                                                            }

                                                        </span>

                                                    )}


                                                    {post.author?.profession && (

                                                        <span>

                                                            {
                                                                post.author.profession
                                                            }

                                                        </span>

                                                    )}


                                                    {post.category && (

                                                        <span>

                                                            {
                                                                post.category
                                                            }

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            <span
                                                className={
                                                    styles.arrow
                                                }
                                            >
                                                →
                                            </span>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==================================
                        QUESTIONS
                    ================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >

                            <h2>
                                Questions
                            </h2>

                            <span>
                                {questions.length}
                            </span>

                        </div>


                        {questions.length === 0 ? (

                            <div
                                className={
                                    styles.empty
                                }
                            >

                                No questions found.

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.cardList
                                }
                            >

                                {questions.map(
                                    (question) => (

                                        <Link
                                            key={
                                                `question-${question._id}`
                                            }
                                            href={
                                                `/questions/${question._id}`
                                            }
                                            className={
                                                styles.questionCard
                                            }
                                        >

                                            <h3>

                                                {
                                                    question.title
                                                }

                                            </h3>


                                            {question.content && (

                                                <p>

                                                    {
                                                        question.content
                                                    }

                                                </p>

                                            )}

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==================================
                        PEOPLE
                    ================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >

                            <h2>
                                People
                            </h2>

                            <span>
                                {users.length}
                            </span>

                        </div>


                        {users.length === 0 ? (

                            <div
                                className={
                                    styles.empty
                                }
                            >

                                No people found.

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.peopleGrid
                                }
                            >

                                {users.map(
                                    (user) => (

                                        <Link
                                            key={
                                                `user-${user._id}`
                                            }
                                            href={
                                                `/profile/${user._id}`
                                            }
                                            className={
                                                styles.personCard
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.avatar
                                                }
                                            >

                                                {
                                                    user.fullName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()
                                                }

                                            </div>


                                            <div>

                                                <h3>

                                                    {
                                                        user.fullName
                                                    }

                                                    {user.isVerified && (

                                                        <span
                                                            className={
                                                                styles.verified
                                                            }
                                                        >
                                                            ✓
                                                        </span>

                                                    )}

                                                </h3>


                                                <p>

                                                    {
                                                        user.profession ||
                                                        user.designation ||
                                                        'Trade Professional'
                                                    }

                                                </p>


                                                {user.companyName && (

                                                    <small>

                                                        {
                                                            user.companyName
                                                        }

                                                    </small>

                                                )}

                                            </div>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==================================
                        COMPANIES
                    ================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >

                            <h2>
                                Companies
                            </h2>

                            <span>
                                {companies.length}
                            </span>

                        </div>


                        {companies.length === 0 ? (

                            <div
                                className={
                                    styles.empty
                                }
                            >

                                No companies found.

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.cardList
                                }
                            >

                                {companies.map(
                                    (company) => (

                                        <Link
                                            key={
                                                `company-${company._id}`
                                            }
                                            href={
                                                `/companies/${encodeURIComponent(
                                                    company.companyName
                                                )}`
                                            }
                                            className={
                                                styles.companyCard
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.companyIcon
                                                }
                                            >

                                                {
                                                    company.companyName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()
                                                }

                                            </div>


                                            <div>

                                                <h3>

                                                    {
                                                        company.companyName
                                                    }

                                                </h3>


                                                {company.location && (

                                                    <p>

                                                        {
                                                            company.location
                                                        }

                                                    </p>

                                                )}

                                            </div>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==================================
                        NO RESULTS
                    ================================== */}

                    {hsCodes.length === 0 &&
                        posts.length === 0 &&
                        questions.length === 0 &&
                        users.length === 0 &&
                        companies.length === 0 && (

                            <div
                                className={
                                    styles.noResults
                                }
                            >

                                <h2>
                                    No results found
                                </h2>

                                <p>

                                    Try searching for an
                                    HS Code, post, question,
                                    company, person or
                                    trade-related topic.

                                </p>

                            </div>

                        )}

                </div>

            )}

        </main>

    );

}