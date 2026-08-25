'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import api from '@/utils/api';

import styles from './page.module.css';


export default function AdminNewsDetailsPage() {

    const params = useParams();

    const newsId =
        params?.id;


    const [news, setNews] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');


    // ==================================================
    // LOAD ADMIN NEWS
    // ==================================================

    useEffect(() => {

        if (!newsId) {
            return;
        }


        const loadNews =
            async () => {

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

                } catch (error) {

                    console.error(
                        'Failed to load admin news:',
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        error.message ||
                        'Unable to load news.'
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadNews();

    }, [newsId]);


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
                        styles.state
                    }
                >

                    Loading news...

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
                        styles.state
                    }
                >

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
                            styles.backButton
                        }
                    >
                        ← Back to Home
                    </Link>

                </div>

            </main>

        );

    }


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

                {/* ==================================================
                    BACK
                ================================================== */}

                <Link
                    href="/"
                    className={
                        styles.backButton
                    }
                >
                    ← Back to Home
                </Link>


                {/* ==================================================
                    ARTICLE
                ================================================== */}

                <article
                    className={
                        styles.article
                    }
                >

                    <div
                        className={
                            styles.meta
                        }
                    >

                        <span>
                            Industry News
                        </span>


                        {news.type && (

                            <span>
                                {news.type}
                            </span>

                        )}

                    </div>


                    <h1>
                        {news.title}
                    </h1>


                    {news.createdAt && (

                        <div
                            className={
                                styles.date
                            }
                        >

                            {new Date(
                                news.createdAt
                            ).toLocaleDateString(
                                'en-IN',
                                {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }
                            )}

                        </div>

                    )}


                    {news.imageUrl && (

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

                    )}


                    {news.description && (

                        <div
                            className={
                                styles.description
                            }
                        >

                            {news.description}

                        </div>

                    )}

                </article>

            </div>

        </main>

    );

}