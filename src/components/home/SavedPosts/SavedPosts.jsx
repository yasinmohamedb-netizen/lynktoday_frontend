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


                setPosts(
                    Array.isArray(data.posts)
                        ? data.posts
                        : []
                );

            } catch (error) {

                console.error(
                    'Failed to load saved posts:',
                    error
                );


                setError(
                    error.response?.data?.message ||
                    error.message ||
                    'Unable to load saved posts.'
                );

            } finally {

                setLoading(false);

            }

        };


        fetchSavedPosts();

    }, []);


    // ==================================================
    // REMOVE FROM SAVED POSTS
    // ==================================================

    const removePost = (postId) => {

        if (!postId) {

            return;

        }


        setPosts((previousPosts) =>

            previousPosts.filter(
                (post) =>
                    post._id !== postId
            )

        );

    };


    // ==================================================
    // UPDATE POST
    // ==================================================

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


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className={styles.loading}>

                <div
                    className={styles.loadingSpinner}
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

                <div className={styles.emptyIcon}>
                    🔖
                </div>

                <h2>
                    No Saved Posts
                </h2>

                <p>
                    Posts you bookmark will appear here.
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

                <div className={styles.headerContent}>

                    <h2>
                        Saved Posts
                    </h2>

                    <p>
                        Your bookmarked posts
                    </p>

                </div>


                <div className={styles.count}>

                    <span className={styles.countNumber}>
                        {posts.length}
                    </span>

                    <span className={styles.countLabel}>
                        {posts.length === 1
                            ? 'Saved'
                            : 'Saved'}
                    </span>

                </div>

            </div>


            {/* ==================================================
                POSTS
            ================================================== */}

            <div className={styles.postsList}>

                {posts.map((post) => (

                    <FeedCard

                        key={post._id}

                        post={post}

                        onDelete={removePost}

                        onUpdate={updatePost}

                        /*
                         * SAVED POSTS PAGE
                         *
                         * Never show Edit/Delete.
                         *
                         * FeedCard should only show:
                         *
                         * Like
                         * Comment
                         * Share
                         * Save/Unsave
                         */

                        showOwnerActions={false}

                    />

                ))}

            </div>

        </div>

    );

}