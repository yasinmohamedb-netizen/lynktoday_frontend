'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import styles from './Trending.module.css';


export default function Trending() {

    const [topics, setTopics] = useState([]);

    const [loading, setLoading] = useState(true);


    // ==================================================
    // LOAD TRENDING TOPICS
    // ==================================================

    useEffect(() => {

        const loadTrending = async () => {

            try {

                /*
                 * Future API
                 *
                 * const { data } =
                 *     await api.get('/trending');
                 *
                 * setTopics(
                 *     Array.isArray(data.topics)
                 *         ? data.topics
                 *         : []
                 * );
                 */


                // ------------------------------------------
                // TEMPORARY DATA
                // ------------------------------------------

                setTopics([

                    {
                        name: '#OceanFreight',
                        posts: 125
                    },

                    {
                        name: '#AirCargo',
                        posts: 94
                    },

                    {
                        name: '#CustomsClearance',
                        posts: 82
                    },

                    {
                        name: '#ExportBusiness',
                        posts: 71
                    },

                    {
                        name: '#ImportBusiness',
                        posts: 68
                    },

                    {
                        name: '#ShippingLines',
                        posts: 59
                    },

                    {
                        name: '#SupplyChain',
                        posts: 51
                    },

                    {
                        name: '#FreightForwarding',
                        posts: 47
                    }

                ]);

            } catch (error) {

                console.error(
                    'Failed to load trending topics:',
                    error
                );

                setTopics([]);

            } finally {

                setLoading(false);

            }

        };


        loadTrending();

    }, []);


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className={styles.card}>

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className={styles.header}>

                <h3>
                    🔥 Trending Topics
                </h3>


                <Link
                    href="/explore"
                    className={styles.viewAll}
                >
                    View All
                </Link>

            </div>


            {/* ==========================================
                LOADING
            ========================================== */}

            {loading ? (

                <div className={styles.loading}>

                    Loading trending topics...

                </div>

            ) : topics.length === 0 ? (

                /* ======================================
                   EMPTY
                ====================================== */

                <div className={styles.empty}>

                    No trending topics available.

                </div>

            ) : (

                /* ======================================
                   TOPICS
                ====================================== */

                <div className={styles.list}>

                    {topics.map((topic, index) => (

                        <div
                            key={`${topic.name}-${index}`}
                            className={styles.item}
                        >

                            <div
                                className={
                                    styles.topicContent
                                }
                            >

                                <Link
                                    href={`/search?q=${encodeURIComponent(
                                        topic.name
                                    )}`}
                                    className={
                                        styles.topic
                                    }
                                >
                                    {topic.name}
                                </Link>


                                <span>
                                    {topic.posts}{' '}
                                    {topic.posts === 1
                                        ? 'discussion'
                                        : 'discussions'}
                                </span>

                            </div>


                            <div
                                className={styles.rank}
                            >
                                #{index + 1}
                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}