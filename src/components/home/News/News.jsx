'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './News.module.css';

export default function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        // Replace this with:
        // const { data } = await api.get('/news');

        setNews([
            {
                title: 'DGFT issues new export policy update',
                source: 'DGFT',
                time: '2 hours ago'
            },
            {
                title: 'ICEGATE portal scheduled maintenance announced',
                source: 'ICEGATE',
                time: 'Today'
            },
            {
                title: 'Container freight rates decline across Asia',
                source: 'Industry',
                time: 'Yesterday'
            },
            {
                title: 'New customs clearance guidelines published',
                source: 'CBIC',
                time: 'Yesterday'
            },
            {
                title: 'India-UAE trade volume reaches new high',
                source: 'Trade News',
                time: '2 days ago'
            }
        ]);
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>📰 Industry News</h3>

                <Link href="/news">
                    View All
                </Link>
            </div>

            <div className={styles.newsList}>
                {news.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className={styles.newsItem}
                    >
                        <div className={styles.icon}>
                            📰
                        </div>

                        <div className={styles.content}>
                            <h4>{item.title}</h4>

                            <p>{item.source}</p>

                            <span>{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}