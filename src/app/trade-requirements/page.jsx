'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import api from '@/utils/api';
import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';
import FeedCard from '@/components/home/Feed/FeedCard';

import styles from './trade-requirements.module.css';

const categories = [
    'All',
    'Import',
    'Export',
    'Sea Freight',
    'Air Freight',
    'Road Transport',
    'Customs',
    'Warehousing',
    'Documentation'
];

export default function TradeRequirementsPage() {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequirements = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams({
                postType: 'TRADE_REQUEST',
                page: '1',
                limit: '30'
            });

            if (category !== 'All') {
                params.set('category', category);
            }

            const { data } = await api.get('/posts?' + params.toString());

            if (!data?.success) {
                throw new Error(data?.message || 'Unable to load trade requirements.');
            }

            setPosts(Array.isArray(data.posts) ? data.posts : []);
        } catch (err) {
            console.error('Trade requirements error:', err);
            setPosts([]);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Unable to load trade requirements.'
            );
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchRequirements();
    }, [fetchRequirements]);

    const removePost = (postId) => {
        setPosts((items) =>
            items.filter((post) => String(post._id) !== String(postId))
        );
    };

    const updatePost = (updatedPost) => {
        setPosts((items) =>
            items.map((post) =>
                String(post._id) === String(updatedPost?._id)
                    ? { ...post, ...updatedPost }
                    : post
            )
        );
    };

    const addSharedPost = (sharedPost) => {
        if (!sharedPost?._id) return;
        setPosts((items) => {
            if (items.some((post) => String(post._id) === String(sharedPost._id))) {
                return items;
            }
            return [sharedPost, ...items];
        });
    };

    return (
        <main className={styles.container}>
            <aside className={styles.left}>
                <LeftSidebar />
            </aside>

            <section className={styles.center}>
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>BUSINESS NETWORK</span>
                        <h1>Trade Requirements</h1>
                        <p>
                            Find real import, export, freight and logistics requirements
                            posted by businesses and professionals.
                        </p>
                    </div>

                    <Link href="/?createPost=trade" className={styles.postButton}>
                        + Post Requirement
                    </Link>
                </header>

                <div className={styles.infoCard}>
                    <div>
                        <strong>Looking for a shipment, supplier or logistics partner?</strong>
                        <span>Post your requirement on LynkToday and let relevant professionals respond.</span>
                    </div>
                    <Link href="/?createPost=trade">Post a requirement</Link>
                </div>

                <div className={styles.filters}>
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={category === item ? styles.activeFilter : ''}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {!loading && !error && (
                    <div className={styles.resultsHeader}>
                        <strong>{posts.length}</strong>
                        <span>{posts.length === 1 ? 'requirement' : 'requirements'} found</span>
                    </div>
                )}

                {loading && (
                    <div className={styles.stateCard}>
                        <div className={styles.loader} />
                        <p>Finding trade requirements...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <h3>Unable to load requirements</h3>
                        <p>{error}</p>
                        <button type="button" onClick={fetchRequirements}>Try again</button>
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className={styles.stateCard}>
                        <div className={styles.emptyIcon}>TR</div>
                        <h3>No trade requirements yet</h3>
                        <p>Be the first to publish an import, export or logistics requirement.</p>
                        <Link href="/?createPost=trade">Post a requirement</Link>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className={styles.feed}>
                        {posts.map((post) => (
                            <div key={post._id} className={styles.requirementCard}>
                                <div className={styles.requestBadge}>TRADE REQUIREMENT</div>
                                <FeedCard
                                    post={post}
                                    onDelete={removePost}
                                    onUpdate={updatePost}
                                    onShared={addSharedPost}
                                    showOwnerActions={false}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <aside className={styles.right}>
                <RightSidebar />
            </aside>
        </main>
    );
}
