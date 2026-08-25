'use client';

import { useEffect, useState } from 'react';

import api from '@/utils/api';

import FeedCard from '../Feed/FeedCard';

import styles from './SavedPosts.module.css';

export default function SavedPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ==================================================
    // LOAD SAVED POSTS
    // ==================================================

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                setLoading(true);
                setError('');

                const { data } = await api.get(
                    '/posts/saved'
                );

                if (!data?.success) {
                    throw new Error(
                        data?.message ||
                        'Unable to load saved posts.'
                    );
                }

                const savedPosts = Array.isArray(
                    data.posts
                )
                    ? data.posts
                    : [];

                /*
                 * IMPORTANT
                 *
                 * These posts came directly from the
                 * saved-posts endpoint.
                 *
                 * Therefore they are already bookmarked.
                 *
                 * FeedCard uses this information to display:
                 *
                 * Saved
                 *
                 * instead of:
                 *
                 * Save
                 */

                const normalizedPosts =
                    savedPosts.map((post) => ({
                        ...post,

                        isBookmarked: true,

                        // Keep this as well in case FeedCard
                        // or another component uses isSaved.
                        isSaved: true,

                        // Some API responses may use `id`
                        // instead of `_id`.
                        _id:
                            post._id ||
                            post.id
                    }));

                setPosts(normalizedPosts);
            } catch (error) {
                console.error(
                    'Failed to load saved posts:',
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Unable to load saved posts.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    // ==================================================
    // REMOVE POST
    // ==================================================

    const removePost = (postId) => {
        if (!postId) {
            return;
        }

        setPosts((previousPosts) =>
            previousPosts.filter(
                (post) =>
                    String(post._id) !==
                    String(postId)
            )
        );
    };

    // ==================================================
    // UPDATE POST
    // ==================================================

    const updatePost = (updatedPost) => {
        if (!updatedPost) {
            return;
        }

        const updatedId =
            updatedPost._id ||
            updatedPost.id;

        if (!updatedId) {
            return;
        }

        /*
         * If the user clicks "Saved" and unsaves
         * the post, remove it from this page.
         */

        if (
            updatedPost.isBookmarked === false ||
            updatedPost.isSaved === false
        ) {
            removePost(updatedId);
            return;
        }

        setPosts((previousPosts) =>
            previousPosts.map((post) => {
                const postId =
                    post._id ||
                    post.id;

                if (
                    String(postId) !==
                    String(updatedId)
                ) {
                    return post;
                }

                return {
                    ...post,
                    ...updatedPost,

                    _id:
                        updatedPost._id ||
                        post._id ||
                        updatedPost.id ||
                        post.id,

                    isBookmarked:
                        updatedPost.isBookmarked ??
                        true,

                    isSaved:
                        updatedPost.isSaved ??
                        true
                };
            })
        );
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className={styles.loading}>
                <div
                    className={
                        styles.loadingSpinner
                    }
                />

                <p>
                    Loading saved posts...
                </p>
            </div>
        );
    }

    // ==================================================
    // ERROR
    // ==================================================

    if (error) {
        return (
            <div className={styles.error}>
                <h3>
                    Unable to load saved posts
                </h3>

                <p>
                    {error}
                </p>
            </div>
        );
    }

    // ==================================================
    // EMPTY
    // ==================================================

    if (posts.length === 0) {
        return (
            <div className={styles.empty}>
                <div
                    className={
                        styles.emptyIcon
                    }
                >
                    🔖
                </div>

                <h2>
                    No Saved Posts
                </h2>

                <p>
                    Posts you bookmark will
                    appear here.
                </p>
            </div>
        );
    }

    // ==================================================
    // PAGE
    // ==================================================

    return (
        <div className={styles.container}>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className={styles.header}>

                <div
                    className={
                        styles.headerContent
                    }
                >
                    <h2>
                        Saved Posts
                    </h2>

                    <p>
                        Your bookmarked posts
                    </p>
                </div>

                <div
                    className={styles.count}
                >
                    <span
                        className={
                            styles.countNumber
                        }
                    >
                        {posts.length}
                    </span>

                    <span
                        className={
                            styles.countLabel
                        }
                    >
                        Saved
                    </span>
                </div>

            </div>


            {/* ==================================================
                POSTS
            ================================================== */}

            <div
                className={
                    styles.postsList
                }
            >
                {posts.map((post) => {

                    const postId =
                        post._id ||
                        post.id;

                    return (
                        <FeedCard
                            key={postId}

                            post={{
                                ...post,

                                /*
                                 * This is the important part.
                                 * Every post displayed on the
                                 * Saved Posts page is already saved.
                                 */

                                isBookmarked: true,
                                isSaved: true
                            }}

                            onDelete={
                                removePost
                            }

                            onUpdate={
                                updatePost
                            }

                            /*
                             * Saved Posts page:
                             *
                             * Do not show owner
                             * edit/delete actions.
                             *
                             * Keep:
                             *
                             * Like
                             * Comment
                             * Share
                             * Saved
                             */

                            showOwnerActions={
                                false
                            }
                        />
                    );
                })}
            </div>

        </div>
    );
}