'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuthModal } from '@/components/auth/AuthModalProvider/AuthModalProvider';

import styles from './RightSidebar.module.css';


// ======================================================
// API CONFIG
// ======================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// FALLBACK TOPICS
// ======================================================

const FALLBACK_TOPICS = [

    {
        name: 'Customs',
        slug: 'customs',
        score: 0
    },

    {
        name: 'Import',
        slug: 'import',
        score: 0
    },

    {
        name: 'Export',
        slug: 'export',
        score: 0
    },

    {
        name: 'Shipping',
        slug: 'shipping',
        score: 0
    },

    {
        name: 'Logistics',
        slug: 'logistics',
        score: 0
    },

    {
        name: 'DGFT',
        slug: 'dgft',
        score: 0
    },

    {
        name: 'GST',
        slug: 'gst',
        score: 0
    },

    {
        name: 'General',
        slug: 'general',
        score: 0
    }

];


// ======================================================
// FALLBACK NEWS
// ======================================================

const FALLBACK_NEWS = [];


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(dateString) {

    if (!dateString) {

        return '';

    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return '';

    }


    const now =
        new Date();


    const diff =
        Math.floor(
            (
                now.getTime() -
                date.getTime()
            ) / 1000
        );


    // --------------------------------------------------
    // Future date
    // --------------------------------------------------

    if (diff < 0) {

        return 'Just now';

    }


    // --------------------------------------------------
    // Less than one minute
    // --------------------------------------------------

    if (diff < 60) {

        return 'Just now';

    }


    // --------------------------------------------------
    // Less than one hour
    // --------------------------------------------------

    if (diff < 3600) {

        const minutes =
            Math.floor(
                diff / 60
            );


        return `${minutes} ${
            minutes === 1
                ? 'minute'
                : 'minutes'
        } ago`;

    }


    // --------------------------------------------------
    // Less than one day
    // --------------------------------------------------

    if (diff < 86400) {

        const hours =
            Math.floor(
                diff / 3600
            );


        return `${hours} ${
            hours === 1
                ? 'hour'
                : 'hours'
        } ago`;

    }


    // --------------------------------------------------
    // Yesterday
    // --------------------------------------------------

    if (diff < 172800) {

        return 'Yesterday';

    }


    // --------------------------------------------------
    // Less than one week
    // --------------------------------------------------

    const days =
        Math.floor(
            diff / 86400
        );


    if (days < 7) {

        return `${days} days ago`;

    }


    // --------------------------------------------------
    // Older
    // --------------------------------------------------

    return date.toLocaleDateString(
        'en-IN',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }
    );

}


// ======================================================
// CREATE SLUG
// ======================================================

function createSlug(value) {

    return String(
        value || ''
    )

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9]+/g,
            '-'
        )

        .replace(
            /^-+|-+$/g,
            ''
        );

}


// ======================================================
// COMPONENT
// ======================================================

export default function RightSidebar() {

    const {
        requireAuth
    } = useAuthModal();


    const [
        topics,
        setTopics
    ] = useState(
        FALLBACK_TOPICS
    );


    const [
        news,
        setNews
    ] = useState(
        FALLBACK_NEWS
    );


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState(null);


    // ==================================================
    // LOAD RIGHT SIDEBAR
    // ==================================================

    useEffect(() => {

        let cancelled = false;


        async function loadSidebar() {

            try {

                setLoading(true);

                setError(null);


                // ==================================================
                // API
                // ==================================================

                const response =
                    await fetch(
                        `${API_BASE_URL}/right-sidebar`,
                        {
                            method: 'GET',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            cache: 'no-store'
                        }
                    );


                // ==================================================
                // HTTP ERROR
                // ==================================================

                if (!response.ok) {

                    throw new Error(
                        `Right Sidebar API failed: ${response.status}`
                    );

                }


                // ==================================================
                // RESPONSE
                // ==================================================

                const data =
                    await response.json();


                if (!data?.success) {

                    throw new Error(
                        data?.message ||
                        'Unable to load right sidebar.'
                    );

                }


                if (cancelled) {

                    return;

                }


                // ==================================================
                // TRENDING TOPICS
                // ==================================================

                if (
                    Array.isArray(
                        data.trendingTopics
                    ) &&
                    data.trendingTopics.length > 0
                ) {

                    setTopics(
                        data.trendingTopics
                    );

                } else {

                    setTopics(
                        FALLBACK_TOPICS
                    );

                }


                // ==================================================
                // INDUSTRY NEWS
                // ==================================================

                if (
                    Array.isArray(
                        data.industryNews
                    ) &&
                    data.industryNews.length > 0
                ) {

                    setNews(
                        data.industryNews
                    );

                } else {

                    setNews([]);

                }


            } catch (error) {

                console.error(
                    'Failed to load right sidebar:',
                    error
                );


                if (!cancelled) {

                    setError(
                        error.message
                    );


                    setTopics(
                        FALLBACK_TOPICS
                    );


                    // Don't show fake news.
                    setNews(
                        FALLBACK_NEWS
                    );

                }


            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }


        loadSidebar();


        return () => {

            cancelled = true;

        };

    }, []);


    // ======================================================
    // PROTECTED NAVIGATION
    // ======================================================

    const handleProtectedNavigation = (
        event,
        path
    ) => {

        const token =
            localStorage.getItem(
                'lynktoday_token'
            );


        if (!token) {

            event.preventDefault();

            requireAuth();

            return;

        }

    };


    // ======================================================
    // TOPIC CLICK
    // ======================================================

    const handleTopicClick = (
        event,
        slug
    ) => {

        handleProtectedNavigation(
            event,
            `/topics/${slug}`
        );

    };


    // ======================================================
    // NEWS CLICK
    // ======================================================

    const handleNewsClick = (
        event,
        item
    ) => {

        const link =
            item?.link;


        if (!link) {

            event.preventDefault();

            return;

        }


        handleProtectedNavigation(
            event,
            link
        );

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <aside
            className={
                styles.sidebar
            }
        >

            {/* ==================================================
                TRENDING TOPICS
            ================================================== */}

            <section
                className={
                    styles.card
                }
            >

                {/* HEADER */}

                <div
                    className={
                        styles.cardHeader
                    }
                >

                    <h3>
                        🔥 Trending Topics
                    </h3>

                </div>


                {/* TOPIC LIST */}

                <div
                    className={
                        styles.topicList
                    }
                >

                    {
                        topics
                            .slice(
                                0,
                                8
                            )
                            .map(
                                (
                                    topic,
                                    index
                                ) => {

                                    const slug =
                                        topic.slug ||
                                        createSlug(
                                            topic.name
                                        );


                                    const score =
                                        Number(
                                            topic.score
                                        ) || 0;


                                    return (

                                        <Link

                                            key={
                                                topic._id ||
                                                topic.slug ||
                                                topic.name ||
                                                index
                                            }

                                            href={
                                                `/topics/${slug}`
                                            }

                                            className={
                                                styles.topicItem
                                            }

                                            onClick={
                                                event =>
                                                    handleTopicClick(
                                                        event,
                                                        slug
                                                    )
                                            }

                                        >

                                            {/* TOPIC CONTENT */}

                                            <div
                                                className={
                                                    styles.topicContent
                                                }
                                            >

                                                <strong>
                                                    #
                                                    {topic.name}
                                                </strong>


                                                <span>
                                                    {score}{' '}
                                                    {
                                                        score === 1
                                                            ? 'mention'
                                                            : 'mentions'
                                                    }
                                                </span>

                                            </div>


                                            {/* RANK */}

                                            <div
                                                className={
                                                    styles.rank
                                                }
                                            >

                                                #
                                                {
                                                    index + 1
                                                }

                                            </div>

                                        </Link>

                                    );

                                }
                            )
                    }

                </div>

            </section>


            {/* ==================================================
                INDUSTRY NEWS
            ================================================== */}

            <section
                className={
                    styles.card
                }
            >

                {/* HEADER */}

                <div
                    className={
                        styles.cardHeader
                    }
                >

                    <h3>
                        📰 Industry News
                    </h3>

                </div>


                {/* NEWS LIST */}

                <div
                    className={
                        styles.newsList
                    }
                >

                    {
                        news
                            .slice(
                                0,
                                5
                            )
                            .map(
                                (
                                    item,
                                    index
                                ) => {

                                    const category =
                                        item.category ||
                                        'Industry';


                                    return (

                                        <Link

                                            key={
                                                item._id ||
                                                index
                                            }

                                            href={
                                                item.link ||
                                                '#'
                                            }

                                            className={
                                                styles.newsItem
                                            }

                                            onClick={
                                                event =>
                                                    handleNewsClick(
                                                        event,
                                                        item
                                                    )
                                            }

                                        >

                                            {/* ==================================================
                                                ICON
                                            ================================================== */}

                                            <div
                                                className={
                                                    styles.newsIcon
                                                }
                                            >

                                                {
                                                    item.imageUrl
                                                        ? (

                                                            <img
                                                                src={
                                                                    item.imageUrl
                                                                }

                                                                alt=""
                                                            />

                                                        )
                                                        : (

                                                            '📰'

                                                        )
                                                }

                                            </div>


                                            {/* ==================================================
                                                CONTENT
                                            ================================================== */}

                                            <div
                                                className={
                                                    styles.newsContent
                                                }
                                            >

                                                <strong>

                                                    {
                                                        item.title
                                                    }

                                                </strong>


                                                {/* CATEGORY */}

                                                <span
                                                    className={
                                                        styles.newsCategory
                                                    }
                                                >

                                                    {
                                                        category
                                                    }

                                                </span>


                                                {/* TIME */}

                                                <small>

                                                    {
                                                        formatTime(
                                                            item.createdAt
                                                        )
                                                    }

                                                </small>

                                            </div>

                                        </Link>

                                    );

                                }
                            )
                    }


                    {/* ==================================================
                        EMPTY STATE
                    ================================================== */}

                    {
                        !loading &&
                        !news.length && (

                            <div
                                className={
                                    styles.emptyNews
                                }
                            >

                                <span>
                                    📰
                                </span>

                                <p>
                                    No industry news yet.
                                </p>

                            </div>

                        )
                    }


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {
                        loading && (

                            <div
                                className={
                                    styles.emptyNews
                                }
                            >

                                <p>
                                    Loading industry news...
                                </p>

                            </div>

                        )
                    }

                </div>

            </section>


            {/* ==================================================
                API ERROR
            ================================================== */}

            {
                error && !loading && (

                    <div
                        style={{
                            display: 'none'
                        }}
                    >

                        {error}

                    </div>

                )
            }

        </aside>

    );

}