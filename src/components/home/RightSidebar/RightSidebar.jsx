'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuthModal } from '@/components/auth/AuthModalProvider/AuthModalProvider';

import styles from './RightSidebar.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

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

const FALLBACK_NEWS = [];

function formatTime(dateString) {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const now = new Date();

    const diff = Math.floor(
        (now.getTime() - date.getTime()) / 1000
    );

    if (diff < 0) {
        return 'Just now';
    }

    if (diff < 60) {
        return 'Just now';
    }

    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);

        return `${minutes} ${
            minutes === 1 ? 'minute' : 'minutes'
        } ago`;
    }

    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);

        return `${hours} ${
            hours === 1 ? 'hour' : 'hours'
        } ago`;
    }

    if (diff < 172800) {
        return 'Yesterday';
    }

    const days = Math.floor(diff / 86400);

    if (days < 7) {
        return `${days} days ago`;
    }

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function createSlug(value) {
    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function RightSidebar() {
    const { requireAuth } = useAuthModal();

    const [topics, setTopics] = useState(
        FALLBACK_TOPICS
    );

    const [news, setNews] = useState(FALLBACK_NEWS);

    const [tradeOpportunities, setTradeOpportunities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadSidebar() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
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

                if (!response.ok) {
                    throw new Error(
                        `Right Sidebar API failed: ${response.status}`
                    );
                }

                const data = await response.json();

                if (!data?.success) {
                    throw new Error(
                        data?.message ||
                        'Unable to load right sidebar.'
                    );
                }

                if (cancelled) {
                    return;
                }

                if (
                    Array.isArray(data.trendingTopics) &&
                    data.trendingTopics.length > 0
                ) {
                    setTopics(data.trendingTopics);
                } else {
                    setTopics(FALLBACK_TOPICS);
                }

                if (Array.isArray(data.industryNews)) {
                    setNews(data.industryNews);
                } else {
                    setNews([]);
                }

                try {
                    const tradeResponse = await fetch(
                        `${API_BASE_URL}/posts?postType=TRADE_REQUEST&page=1&limit=5`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            cache: 'no-store'
                        }
                    );

                    const tradeData = await tradeResponse.json();

                    if (tradeResponse.ok && tradeData?.success && Array.isArray(tradeData.posts)) {
                        setTradeOpportunities(tradeData.posts.slice(0, 5));
                    } else {
                        setTradeOpportunities([]);
                    }
                } catch (tradeError) {
                    console.error('Failed to load trade opportunities:', tradeError);
                    setTradeOpportunities([]);
                }
            } catch (error) {
                console.error(
                    'Failed to load right sidebar:',
                    error
                );

                if (!cancelled) {
                    setError(error.message);

                    setTopics(FALLBACK_TOPICS);

                    setNews(FALLBACK_NEWS);
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

    const handleTopicClick = (
        event,
        slug
    ) => {
        handleProtectedNavigation(
            event,
            `/topics/${slug}`
        );
    };

    const handleNewsClick = (
        event,
        item
    ) => {
        const link = item?.link;

        if (!link) {
            event.preventDefault();
            return;
        }

        handleProtectedNavigation(
            event,
            link
        );
    };

    return (
        <aside className={styles.sidebar}>

            {/* ==================================================
                TRADE OPPORTUNITIES
            ================================================== */}

            <section className={styles.card}>

                <div className={styles.cardHeader}>
                    <h3>Trade Opportunities</h3>

                    <Link
                        href="/trade-requirements"
                        className={styles.viewAll}
                    >
                        View all →
                    </Link>
                </div>

                <div className={styles.opportunityList}>
                    {tradeOpportunities.slice(0, 5).map((post, index) => {
                        const category =
                            post.category === 'Export'
                                ? 'Export'
                                : post.category === 'Import'
                                    ? 'Import'
                                    : post.category === 'Customs'
                                        ? 'Customs'
                                        : 'Logistics';

                        const title =
                            post.title ||
                            post.content ||
                            'Trade requirement';

                        const location =
                            post.author?.location ||
                            post.location ||
                            '';

                        return (
                            <Link
                                key={post._id || index}
                                href={`/posts/${post._id}`}
                                className={styles.opportunityItem}
                            >
                                <span className={styles.opportunityBadge}>
                                    {category}
                                </span>

                                <span className={styles.opportunityContent}>
                                    <strong>{title}</strong>
                                    <small>
                                        {location
                                            ? `${location} · ${formatTime(post.createdAt)}`
                                            : formatTime(post.createdAt)}
                                    </small>
                                </span>

                                <span className={styles.opportunityArrow}>›</span>
                            </Link>
                        );
                    })}

                    {!loading && tradeOpportunities.length === 0 && (
                        <div className={styles.emptyNews}>
                            <p>No trade requirements yet.</p>
                        </div>
                    )}

                    {loading && (
                        <div className={styles.emptyNews}>
                            <p>Finding opportunities...</p>
                        </div>
                    )}
                </div>

            </section>


            {/* ==================================================
                TRENDING TOPICS
            ================================================== */}

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>Trending Topics</h3>
                </div>

                <div className={styles.topicList}>
                    {topics.slice(0, 8).map((topic, index) => (
                        <Link
                            key={topic.slug || topic.name || index}
                            href={`/topics/${topic.slug || createSlug(topic.name)}`}
                            className={styles.topicItem}
                            onClick={(event) =>
                                handleTopicClick(
                                    event,
                                    topic.slug || createSlug(topic.name)
                                )
                            }
                        >
                            <span className={styles.rank}>
                                {index + 1}
                            </span>

                            <span className={styles.topicContent}>
                                <strong>
                                    {topic.name || "Trending topic"}
                                </strong>
                                <span>
                                    {Number(topic.score || 0)} signals
                                </span>
                            </span>
                        </Link>
                    ))}

                    {!loading && topics.length === 0 && (
                        <div className={styles.emptyNews}>
                            <p>No trending topics yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================================================
                INDUSTRY NEWS
            ================================================== */}

            <section className={styles.card}>

                <div className={styles.cardHeader}>

                    <h3>
                        📰 Industry News
                    </h3>

                </div>

                <div className={styles.newsList}>

                    {news
                        .slice(0, 5)
                        .map((item, index) => {

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
                                        item.link || '#'
                                    }
                                    className={
                                        styles.newsItem
                                    }
                                    onClick={(event) =>
                                        handleNewsClick(
                                            event,
                                            item
                                        )
                                    }
                                >

                                    {/* NO ROUND IMAGE */}

                                    <div
                                        className={
                                            styles.newsContent
                                        }
                                    >

                                        <strong>
                                            {item.title}
                                        </strong>

                                        <span
                                            className={
                                                styles.newsCategory
                                            }
                                        >
                                            {category}
                                        </span>

                                        <small>
                                            {formatTime(
                                                item.createdAt
                                            )}
                                        </small>

                                    </div>

                                </Link>
                            );
                        })}


                    {/* EMPTY STATE */}

                    {!loading &&
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
                        )}


                    {/* LOADING */}

                    {loading && (

                        <div
                            className={
                                styles.emptyNews
                            }
                        >
                            <p>
                                Loading industry news...
                            </p>
                        </div>
                    )}

                </div>

            </section>


            {/* API ERROR — intentionally hidden */}

            {error && !loading && (
                <div
                    style={{
                        display: 'none'
                    }}
                >
                    {error}
                </div>
            )}

        </aside>
    );
}