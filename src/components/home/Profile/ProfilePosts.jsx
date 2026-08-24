'use client';

import { useCallback, useEffect, useState } from 'react';

import api from '@/utils/api';
import FeedCard from '../Feed/FeedCard';

import styles from './Profile.module.css';

export default function ProfilePosts({ userId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = useCallback(async () => {
        if (!userId) {
            setPosts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const { data } = await api.get(
                `/posts/user/${userId}/posts`
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to load posts.'
                );
            }

            let userPosts = [];

            if (Array.isArray(data.posts)) {
                userPosts = data.posts;
            } else if (Array.isArray(data.data)) {
                userPosts = data.data;
            } else if (Array.isArray(data.results)) {
                userPosts = data.results;
            }

            setPosts(userPosts);
        } catch (error) {
            console.error(
                'Profile Posts Error:',
                error
            );

            setPosts([]);

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to load posts.'
            );
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const removePost = (postId) => {
        if (!postId) {
            return;
        }

        setPosts((previousPosts) =>
            previousPosts.filter(
                (post) => post._id !== postId
            )
        );
    };

    const updatePost = (updatedPost) => {
        if (!updatedPost?._id) {
            return;
        }

        setPosts((previousPosts) =>
            previousPosts.map((post) =>
                post._id === updatedPost._id
                    ? updatedPost
                    : post
            )
        );
    };

    const renderHeader = () => (
        <div className={styles.sectionHeader}>
            <div>
                <h3>Posts</h3>

                <p>
                    Your professional activity
                    and community contributions.
                </p>
            </div>

            {posts.length > 0 && (
                <span className={styles.postCount}>
                    {posts.length}{' '}
                    {posts.length === 1
                        ? 'Post'
                        : 'Posts'}
                </span>
            )}
        </div>
    );

    if (loading) {
        return (
            <section className={styles.card}>
                {renderHeader()}

                <div className={styles.loading}>
                    Loading posts...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.card}>
                {renderHeader()}

                <div className={styles.error}>
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={fetchPosts}
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    if (posts.length === 0) {
        return (
            <section className={styles.card}>
                {renderHeader()}

                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                        +
                    </div>

                    <h4>No posts yet</h4>

                    <p>
                        Posts you create on LynkToday
                        will appear here.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.card}>
            {renderHeader()}

            <div className={styles.postsList}>
                {posts.map((post) => (
                    <FeedCard
                        key={post._id}
                        post={post}
                        onDelete={removePost}
                        onUpdate={updatePost}
                        showOwnerActions={false}
                    />
                ))}
            </div>
        </section>
    );
}