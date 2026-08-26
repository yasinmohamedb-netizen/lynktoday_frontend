'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import api from '@/utils/api';

import styles from './page.module.css';

export default function NewsDetailsPage() {
    const params = useParams();
    const newsId = params?.id;

    const [news, setNews] = useState(null);

    const [trendingTopics, setTrendingTopics] =
        useState([]);

    const [industryNews, setIndustryNews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [sidebarLoading, setSidebarLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const newsScrollRef =
        useRef(null);


    // ==================================================
    // LOAD NEWS
    // ==================================================

    useEffect(() => {

        if (!newsId) {
            return;
        }


        const loadNews = async () => {

            try {

                setLoading(true);

                setError('');


                const { data } =
                    await api.get(
                        `/admin/highlights/${newsId}`
                    );


                if (
                    !data?.success ||
                    !data?.highlight
                ) {

                    throw new Error(
                        data?.message ||
                        'News not found.'
                    );

                }


                setNews(
                    data.highlight
                );

            } catch (err) {

                console.error(
                    'Failed to load news:',
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Unable to load news.'
                );

            } finally {

                setLoading(false);

            }

        };


        loadNews();

    }, [newsId]);


    // ==================================================
    // LOAD RIGHT SIDEBAR DATA
    // ==================================================

    useEffect(() => {

        const loadSidebar =
            async () => {

                try {

                    setSidebarLoading(true);


                    const { data } =
                        await api.get(
                            '/right-sidebar'
                        );


                    if (!data?.success) {

                        throw new Error(
                            data?.message ||
                            'Failed to load sidebar.'
                        );

                    }


                    const topics =
                        Array.isArray(
                            data?.trendingTopics
                        )
                            ? data.trendingTopics
                            : [];


                    const newsList =
                        Array.isArray(
                            data?.industryNews
                        )
                            ? data.industryNews
                            : [];


                    setTrendingTopics(
                        topics
                    );


                    /*
                     * Remove the currently opened
                     * news article from the horizontal
                     * Industry News section.
                     */

                    const filteredNews =
                        newsList.filter(
                            (item) => {

                                const itemId =
                                    item?._id ||
                                    item?.id;

                                return (
                                    String(itemId) !==
                                    String(newsId)
                                );

                            }
                        );


                    setIndustryNews(
                        filteredNews
                    );

                } catch (err) {

                    console.error(
                        'Failed to load sidebar:',
                        err
                    );

                } finally {

                    setSidebarLoading(false);

                }

            };


        loadSidebar();

    }, [newsId]);


    // ==================================================
    // HORIZONTAL SCROLL
    // ==================================================

    const scrollNews = (direction) => {

        if (!newsScrollRef.current) {
            return;
        }


        const amount =
            direction === 'left'
                ? -420
                : 420;


        newsScrollRef.current.scrollBy({
            left: amount,
            behavior: 'smooth'
        });

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

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

                    <div
                        className={
                            styles.state
                        }
                    >

                        <div
                            className={
                                styles.spinner
                            }
                        />

                        <p>
                            Loading news...
                        </p>

                    </div>

                </div>

            </main>

        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error || !news) {

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

                    <div
                        className={
                            styles.state
                        }
                    >

                        <div
                            className={
                                styles.stateIcon
                            }
                        >
                            !
                        </div>


                        <h1>
                            News Not Found
                        </h1>


                        <p>
                            {error ||
                                'The news article could not be found.'}
                        </p>


                        <Link
                            href="/"
                            className={
                                styles.primaryButton
                            }
                        >
                            ← Back to Home
                        </Link>

                    </div>

                </div>

            </main>

        );

    }


    // ==================================================
    // DATE
    // ==================================================

    const formattedDate =
        news.createdAt
            ? new Date(
                news.createdAt
            ).toLocaleDateString(
                'en-IN',
                {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }
            )
            : '';


    const newsType =
        news.type ||
        'NEWS';


    // ==================================================
    // PAGE
    // ==================================================

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

                {/* ==========================================
                    BACK
                ========================================== */}

                <Link
                    href="/"
                    className={
                        styles.backButton
                    }
                >
                    ← Back to Home
                </Link>


                {/* ==========================================
                    TOP CONTENT
                ========================================== */}

                <div
                    className={
                        styles.topGrid
                    }
                >

                    {/* ======================================
                        ARTICLE
                    ====================================== */}

                    <article
                        className={
                            styles.article
                        }
                    >

                        {/* ARTICLE HEADER */}

                        <header
                            className={
                                styles.articleHeader
                            }
                        >

                            <div
                                className={
                                    styles.meta
                                }
                            >

                                <span
                                    className={
                                        styles.category
                                    }
                                >
                                    Industry News
                                </span>


                                <span
                                    className={
                                        styles.type
                                    }
                                >
                                    {newsType}
                                </span>

                            </div>


                            <h1>
                                {news.title}
                            </h1>


                            <div
                                className={
                                    styles.articleInfo
                                }
                            >

                                {formattedDate && (

                                    <span>
                                        {formattedDate}
                                    </span>

                                )}


                                <span
                                    className={
                                        styles.dot
                                    }
                                >
                                    •
                                </span>


                                <span>
                                    LynkToday
                                </span>

                            </div>

                        </header>


                        {/* IMAGE */}

                        {news.imageUrl && (

                            <div
                                className={
                                    styles.imageWrapper
                                }
                            >

                                <img
                                    src={
                                        news.imageUrl
                                    }
                                    alt={
                                        news.title
                                    }
                                    className={
                                        styles.image
                                    }
                                />

                            </div>

                        )}


                        {/* ARTICLE BODY */}

                        <div
                            className={
                                styles.articleBody
                            }
                        >

                            {news.description && (

                                <p
                                    className={
                                        styles.lead
                                    }
                                >
                                    {news.description}
                                </p>

                            )}


                            <div
                                className={
                                    styles.divider
                                }
                            />


                            <div
                                className={
                                    styles.articleNote
                                }
                            >

                                <span
                                    className={
                                        styles.noteIcon
                                    }
                                >
                                    ✦
                                </span>


                                <div>

                                    <strong>
                                        Trade & Industry Update
                                    </strong>


                                    <p>
                                        Stay informed about
                                        developments across
                                        international trade,
                                        customs, shipping and
                                        logistics.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FOOTER */}

                        <footer
                            className={
                                styles.articleFooter
                            }
                        >

                            <div>

                                <span
                                    className={
                                        styles.footerLabel
                                    }
                                >
                                    Category
                                </span>


                                <strong>
                                    Industry News
                                </strong>

                            </div>


                            <div>

                                <span
                                    className={
                                        styles.footerLabel
                                    }
                                >
                                    Published
                                </span>


                                <strong>
                                    {formattedDate ||
                                        'Recently'}
                                </strong>

                            </div>


                            <Link
                                href="/"
                                className={
                                    styles.footerButton
                                }
                            >
                                Explore LynkToday →
                            </Link>

                        </footer>

                    </article>


                    {/* ======================================
                        TRENDING TOPICS
                    ====================================== */}

                    <aside
                        className={
                            styles.sidebar
                        }
                    >

                        <section
                            className={
                                styles.sidebarCard
                            }
                        >

                            <div
                                className={
                                    styles.sidebarHeader
                                }
                            >

                                <h2>
                                    🔥 Trending Topics
                                </h2>

                            </div>


                            {sidebarLoading ? (

                                <div
                                    className={
                                        styles.sidebarLoading
                                    }
                                >
                                    Loading...
                                </div>

                            ) : trendingTopics.length > 0 ? (

                                <div
                                    className={
                                        styles.topicList
                                    }
                                >

                                    {trendingTopics
                                        .slice(0, 8)
                                        .map(
                                            (
                                                topic,
                                                index
                                            ) => {

                                                const name =
                                                    topic?.name ||
                                                    topic?.topic ||
                                                    topic?.title ||
                                                    'Topic';

                                                const slug =
                                                    topic?.slug ||
                                                    name
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

                                                const count =
                                                    topic?.count ??
                                                    topic?.mentions ??
                                                    topic?.mentionCount ??
                                                    1;


                                                return (

                                                    <Link
                                                        key={
                                                            topic?._id ||
                                                            topic?.id ||
                                                            slug ||
                                                            index
                                                        }
                                                        href={
                                                            `/topics/${slug}`
                                                        }
                                                        className={
                                                            styles.topicItem
                                                        }
                                                    >

                                                        <div
                                                            className={
                                                                styles.topicContent
                                                            }
                                                        >

                                                            <strong>
                                                                #
                                                                {name
                                                                    .replace(
                                                                        /^#/,
                                                                        ''
                                                                    )}
                                                            </strong>


                                                            <span>
                                                                {count}{' '}
                                                                {count === 1
                                                                    ? 'mention'
                                                                    : 'mentions'}
                                                            </span>

                                                        </div>


                                                        <span
                                                            className={
                                                                styles.rank
                                                            }
                                                        >
                                                            #{index + 1}
                                                        </span>

                                                    </Link>

                                                );

                                            }
                                        )}

                                </div>

                            ) : (

                                <div
                                    className={
                                        styles.emptySidebar
                                    }
                                >
                                    No trending topics yet.
                                </div>

                            )}

                        </section>

                    </aside>

                </div>


                {/* ==========================================
                    HORIZONTAL INDUSTRY NEWS
                ========================================== */}

                {industryNews.length > 0 && (

                    <section
                        className={
                            styles.industrySection
                        }
                    >

                        <div
                            className={
                                styles.industryHeader
                            }
                        >

                            <div>

                                <span
                                    className={
                                        styles.sectionEyebrow
                                    }
                                >
                                    KEEP READING
                                </span>


                                <h2>
                                    📰 Industry News
                                </h2>


                                <p>
                                    Explore more updates from
                                    the trade and logistics
                                    industry.
                                </p>

                            </div>


                            {industryNews.length > 3 && (

                                <div
                                    className={
                                        styles.scrollControls
                                    }
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollNews(
                                                'left'
                                            )
                                        }
                                        aria-label="Previous news"
                                    >
                                        ←
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollNews(
                                                'right'
                                            )
                                        }
                                        aria-label="Next news"
                                    >
                                        →
                                    </button>

                                </div>

                            )}

                        </div>


                        <div
                            ref={
                                newsScrollRef
                            }
                            className={
                                styles.newsScroller
                            }
                        >

                            {industryNews.map(
                                (item, index) => {

                                    const itemId =
                                        item?._id ||
                                        item?.id;

                                    const title =
                                        item?.title ||
                                        'Industry News';

                                    const description =
                                        item?.description ||
                                        '';

                                    const type =
                                        item?.type ||
                                        'NEWS';

                                    const date =
                                        item?.createdAt
                                            ? new Date(
                                                item.createdAt
                                            ).toLocaleDateString(
                                                'en-IN',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }
                                            )
                                            : 'Recently';


                                    return (

                                        <Link
                                            key={
                                                itemId ||
                                                index
                                            }
                                            href={
                                                itemId
                                                    ? `/news/${itemId}`
                                                    : '#'
                                            }
                                            className={
                                                styles.newsCard
                                            }
                                        >

                                            {item?.imageUrl ? (

                                                <img
                                                    src={
                                                        item.imageUrl
                                                    }
                                                    alt={
                                                        title
                                                    }
                                                    className={
                                                        styles.newsCardImage
                                                    }
                                                />

                                            ) : (

                                                <div
                                                    className={
                                                        styles.newsCardImagePlaceholder
                                                    }
                                                >
                                                    📰
                                                </div>

                                            )}


                                            <div
                                                className={
                                                    styles.newsCardBody
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.newsCardMeta
                                                    }
                                                >

                                                    <span>
                                                        Industry News
                                                    </span>

                                                    <span>
                                                        {type}
                                                    </span>

                                                </div>


                                                <h3>
                                                    {title}
                                                </h3>


                                                {description && (

                                                    <p>
                                                        {description}
                                                    </p>

                                                )}


                                                <div
                                                    className={
                                                        styles.newsCardFooter
                                                    }
                                                >

                                                    <span>
                                                        {date}
                                                    </span>


                                                    <span>
                                                        Read →
                                                    </span>

                                                </div>

                                            </div>

                                        </Link>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}

            </div>

        </main>
    );
}