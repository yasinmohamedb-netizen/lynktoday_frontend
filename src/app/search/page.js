'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './page.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// SEARCH CONTENT
// ======================================================

function SearchContent() {

    const searchParams =
        useSearchParams();

    const urlQuery =
        searchParams.get('q') || '';


    const [query, setQuery] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const [users, setUsers] =
        useState([]);

    const [companies, setCompanies] =
        useState([]);

    const [questions, setQuestions] =
        useState([]);

    const [posts, setPosts] =
        useState([]);

    const [hsCodes, setHsCodes] =
        useState([]);

    const [documentation, setDocumentation] =
        useState([]);


    // ==================================================
    // LOAD QUERY
    // ==================================================

    useEffect(() => {

        const cleanQuery =
            urlQuery.trim();


        setQuery(cleanQuery);


        if (cleanQuery) {

            performSearch(
                cleanQuery
            );

        } else {

            setLoading(false);

            setError(
                'Please enter something to search.'
            );

            setUsers([]);

            setCompanies([]);

            setQuestions([]);

            setPosts([]);

            setHsCodes([]);

            setDocumentation([]);

        }

    }, [urlQuery]);


    // ==================================================
    // SEARCH
    // ==================================================

    const performSearch =
        async (searchQuery) => {

            const cleanQuery =
                String(
                    searchQuery || ''
                ).trim();


            if (!cleanQuery) {

                setError(
                    'Please enter something to search.'
                );

                setLoading(false);

                return;

            }


            try {

                setLoading(true);

                setError('');


                setUsers([]);

                setCompanies([]);

                setQuestions([]);

                setPosts([]);

                setHsCodes([]);

                setDocumentation([]);


                const searchUrl =
                    `${API_BASE_URL}/search?q=${encodeURIComponent(
                        cleanQuery
                    )}&limit=20`;


                console.log(
                    'Searching:',
                    searchUrl
                );


                const response =
                    await fetch(
                        searchUrl,
                        {
                            method: 'GET',

                            headers: {
                                Accept:
                                    'application/json'
                            },

                            cache: 'no-store'
                        }
                    );


                let result;


                try {

                    result =
                        await response.json();

                } catch (jsonError) {

                    console.error(
                        'Invalid search response:',
                        jsonError
                    );

                    throw new Error(
                        `Search request failed: ${response.status}`
                    );

                }


                if (!response.ok) {

                    throw new Error(
                        result?.message ||
                        `Search request failed: ${response.status}`
                    );

                }


                if (!result?.success) {

                    throw new Error(
                        result?.message ||
                        'Search failed.'
                    );

                }


                const results =
                    result.results || {};


                // ======================================
                // USERS
                // ======================================

                setUsers(
                    Array.isArray(
                        results.users
                    )
                        ? results.users
                        : []
                );


                // ======================================
                // COMPANIES
                // ======================================

                setCompanies(
                    Array.isArray(
                        results.companies
                    )
                        ? results.companies
                        : []
                );


                // ======================================
                // QUESTIONS
                // ======================================

                setQuestions(
                    Array.isArray(
                        results.questions
                    )
                        ? results.questions
                        : []
                );


                // ======================================
                // POSTS
                // ======================================

                const postResults =
                    Array.isArray(
                        results.posts
                    )
                        ? results.posts
                        : [];


                setPosts(
                    postResults.filter(
                        (post) =>
                            post?.postType !==
                            'QUESTION'
                    )
                );


                // ======================================
                // HS CODES
                // ======================================

                setHsCodes(
                    Array.isArray(
                        results.hsCodes
                    )
                        ? results.hsCodes
                        : []
                );


                // ======================================
                // DOCUMENTATION
                // ======================================

                setDocumentation(
                    Array.isArray(
                        results.documentation
                    )
                        ? results.documentation
                        : []
                );


            } catch (searchError) {

                console.error(
                    'Global search error:',
                    searchError
                );


                setError(
                    searchError?.message ||
                    'Unable to perform search.'
                );


            } finally {

                setLoading(false);

            }

        };


    // ==================================================
    // TOTAL RESULTS
    // ==================================================

    const totalResults =
        hsCodes.length +
        documentation.length +
        posts.length +
        questions.length +
        users.length +
        companies.length;


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <main
            className={
                styles.container
            }
        >

            {/* ==========================================
                HEADER
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

                        Results for:{' '}

                        <strong>
                            "{query}"
                        </strong>

                    </p>

                </div>

            </div>


            {/* ==========================================
                LOADING
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
                ERROR
            ========================================== */}

            {!loading &&
                error && (

                    <div
                        className={
                            styles.error
                        }
                    >
                        {error}
                    </div>

                )}


            {/* ==========================================
                RESULTS
            ========================================== */}

            {!loading &&
                !error &&
                query && (

                    <div
                        className={
                            styles.results
                        }
                    >

                        {/* ==================================
                            SUMMARY
                        ================================== */}

                        <div
                            className={
                                styles.resultSummary
                            }
                        >

                            Found{' '}

                            <strong>
                                {totalResults}
                            </strong>{' '}

                            {totalResults === 1
                                ? 'result'
                                : 'results'}

                        </div>


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
                                                    item._id ||
                                                    item.hsCode
                                                }
                                                href={
                                                    `/hs-codes/${
                                                        item._id ||
                                                        item.hsCode
                                                    }`
                                                }
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
                                                            item.description ||
                                                            'HS Code'
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
                                                                    item.chapterNumber ||
                                                                    item.chapter
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
                            DOCUMENTATION
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
                                    Documentation
                                </h2>

                                <span>
                                    {
                                        documentation.length
                                    }
                                </span>

                            </div>


                            {documentation.length === 0 ? (

                                <div
                                    className={
                                        styles.empty
                                    }
                                >
                                    No documentation found.
                                </div>

                            ) : (

                                <div
                                    className={
                                        styles.cardList
                                    }
                                >

                                    {documentation.map(
                                        (item) => (

                                            <Link
                                                key={
                                                    item._id ||
                                                    item.id
                                                }
                                                href={
                                                    `/documentation/${
                                                        item._id ||
                                                        item.id
                                                    }`
                                                }
                                                className={
                                                    styles.questionCard
                                                }
                                            >

                                                <div>

                                                    <h3>
                                                        {
                                                            item.title ||
                                                            'Documentation'
                                                        }
                                                    </h3>


                                                    {item.description && (

                                                        <p>
                                                            {
                                                                item.description
                                                            }
                                                        </p>

                                                    )}


                                                    <div
                                                        className={
                                                            styles.meta
                                                        }
                                                    >

                                                        {item.documentType && (

                                                            <span>
                                                                {
                                                                    item.documentType
                                                                }
                                                            </span>

                                                        )}


                                                        {item.category && (

                                                            <span>
                                                                {
                                                                    item.category
                                                                }
                                                            </span>

                                                        )}


                                                        {item.hsCode && (

                                                            <span>
                                                                HS{' '}

                                                                {
                                                                    item.hsCode
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
                                                    post._id ||
                                                    post.id
                                                }
                                                href={
                                                    `/posts/${
                                                        post._id ||
                                                        post.id
                                                    }`
                                                }
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
                                    {
                                        questions.length
                                    }
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
                                                    question._id
                                                }
                                                href={
                                                    `/posts/${question._id}`
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
                                                    user._id
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
                                    {
                                        companies.length
                                    }
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

                                            <div
                                                key={
                                                    company.companyName
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

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>


                        {/* ==================================
                            NO RESULTS
                        ================================== */}

                        {totalResults === 0 && (

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
                                    documentation, company,
                                    person or trade-related
                                    topic.
                                </p>

                            </div>

                        )}

                    </div>

                )}

        </main>

    );

}


// ======================================================
// LOADING FALLBACK
// ======================================================

function SearchLoading() {

    return (

        <main
            className={
                styles.container
            }
        >

            <div
                className={
                    styles.loading
                }
            >
                Loading search...
            </div>

        </main>

    );

}


// ======================================================
// PAGE
// ======================================================

export default function SearchPage() {

    return (

        <Suspense
            fallback={
                <SearchLoading />
            }
        >

            <SearchContent />

        </Suspense>

    );

}