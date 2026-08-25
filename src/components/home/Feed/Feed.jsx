'use client';

import {
    useCallback,
    useEffect,
    useState
} from 'react';

import api from '@/utils/api';

import FeedCard from './FeedCard';

import styles from './Feed.module.css';

export default function Feed({ newPost }) {

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');


    // ==================================================
    // LOAD FEED
    // ==================================================

    const fetchPosts = useCallback(
        async () => {

            try {

                setLoading(true);
                setError('');

                const { data } =
                    await api.get('/posts');

                if (!data?.success) {

                    throw new Error(
                        data?.message ||
                        'Unable to load posts.'
                    );

                }

                setPosts(
                    Array.isArray(data.posts)
                        ? data.posts
                        : []
                );

            } catch (error) {

                console.error(
                    'Failed to load feed:',
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    'Unable to load posts.'
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        fetchPosts();

    }, [fetchPosts]);


    // ==================================================
    // ADD NEW POST FROM PARENT
    // ==================================================

    useEffect(() => {

        if (!newPost?._id) {
            return;
        }

        setPosts((previousPosts) => {

            const exists =
                previousPosts.some(
                    (post) =>
                        String(post._id) ===
                        String(newPost._id)
                );

            if (exists) {
                return previousPosts;
            }

            return [
                newPost,
                ...previousPosts
            ];

        });

    }, [newPost]);


    // ==================================================
    // LISTEN FOR NEW POST EVENT
    //
    // This makes the feed update immediately even
    // if the parent does not pass newPost correctly.
    // ==================================================

    useEffect(() => {

        const handlePostCreated = (event) => {

            const createdPost =
                event.detail;

            if (!createdPost?._id) {
                return;
            }

            setPosts((previousPosts) => {

                const exists =
                    previousPosts.some(
                        (post) =>
                            String(post._id) ===
                            String(createdPost._id)
                    );

                if (exists) {
                    return previousPosts;
                }

                return [
                    createdPost,
                    ...previousPosts
                ];

            });

        };

        window.addEventListener(
            'lynktoday:post-created',
            handlePostCreated
        );

        return () => {

            window.removeEventListener(
                'lynktoday:post-created',
                handlePostCreated
            );

        };

    }, []);


    // ==================================================
    // DELETE POST
    // ==================================================

    const removePost = (postId) => {

        if (!postId) {
            return;
        }

        setPosts(
            (previousPosts) =>
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

        if (!updatedPost?._id) {
            return;
        }

        setPosts(
            (previousPosts) =>
                previousPosts.map(
                    (post) =>
                        String(post._id) ===
                        String(updatedPost._id)

                            ? {
                                ...post,
                                ...updatedPost
                            }

                            : post
                )
        );

    };


    // ==================================================
    // ADD SHARED POST
    // ==================================================

    const addSharedPost = (sharedPost) => {

        if (!sharedPost?._id) {
            return;
        }

        setPosts((previousPosts) => {

            const exists =
                previousPosts.some(
                    (post) =>
                        String(post._id) ===
                        String(sharedPost._id)
                );

            if (exists) {
                return previousPosts;
            }

            return [
                sharedPost,
                ...previousPosts
            ];

        });

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (
            <div className={styles.loading}>
                Loading posts...
            </div>
        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error) {

        return (
            <div className={styles.error}>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={fetchPosts}
                >
                    Try Again
                </button>

            </div>
        );

    }


    // ==================================================
    // EMPTY
    // ==================================================

    if (posts.length === 0) {

        return (
            <div className={styles.empty}>
                No posts available.
            </div>
        );

    }


    // ==================================================
    // FEED
    // ==================================================

    return (

        <div className={styles.feed}>

            {posts.map((post) => (

                <FeedCard
                    key={post._id}
                    post={post}

                    onDelete={removePost}

                    onUpdate={updatePost}

                    onShared={addSharedPost}

                    showOwnerActions={false}
                />

            ))}

        </div>

    );

}