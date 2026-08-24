'use client';

import {
    useEffect,
    useState
} from 'react';

import {
    useRouter
} from 'next/navigation';

import api from '@/utils/api';

import FeedCard from '../Feed/FeedCard';

import styles from './MyPosts.module.css';

export default function MyPosts() {

    const router = useRouter();

    const [posts, setPosts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [user, setUser] =
        useState(null);


    // ==================================================
    // FETCH MY POSTS
    // ==================================================

    useEffect(() => {

        const fetchMyPosts =
            async () => {

                try {

                    let storedUser =
                        null;


                    // ======================================
                    // GET CURRENT USER
                    // ======================================

                    try {

                        const stored =
                            localStorage.getItem(
                                'lynktoday_user'
                            );

                        if (stored) {

                            storedUser =
                                JSON.parse(
                                    stored
                                );

                        }

                    } catch (error) {

                        console.error(
                            'Failed to parse stored user:',
                            error
                        );

                    }


                    // ======================================
                    // USER NOT LOGGED IN
                    // ======================================

                    if (!storedUser?._id) {

                        setLoading(
                            false
                        );

                        return;

                    }


                    setUser(
                        storedUser
                    );


                    // ======================================
                    // FETCH MY POSTS
                    // ======================================

                    const { data } =
                        await api.get(
                            `/posts/user/${storedUser._id}/posts`
                        );


                    if (
                        data?.success
                    ) {

                        setPosts(

                            Array.isArray(
                                data.posts
                            )

                                ? data.posts

                                : []

                        );

                    }

                } catch (error) {

                    console.error(
                        'Failed to fetch my posts:',
                        error
                    );

                    setPosts([]);

                } finally {

                    setLoading(
                        false
                    );

                }

            };


        fetchMyPosts();

    }, []);


    // ==================================================
    // CREATE POST
    // ==================================================

    const handleCreatePost =
        () => {

            router.push('/');

        };


    // ==================================================
    // DELETE POST
    // ==================================================

    const handleDelete =
        (postId) => {

            setPosts(
                (previousPosts) =>

                    previousPosts.filter(
                        (post) =>
                            post._id !==
                            postId
                    )

            );

        };


    // ==================================================
    // UPDATE POST
    // ==================================================

    const handleUpdate =
        (updatedPost) => {

            if (
                !updatedPost?._id
            ) {

                return;

            }

            setPosts(
                (previousPosts) =>

                    previousPosts.map(
                        (post) =>

                            post._id ===
                            updatedPost._id

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

            <div
                className={
                    styles.loading
                }
            >

                <div
                    className={
                        styles.loadingSpinner
                    }
                ></div>

                <p>
                    Loading your posts...
                </p>

            </div>

        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div
            className={
                styles.container
            }
        >

            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className={
                    styles.header
                }
            >

                <div
                    className={
                        styles.headerContent
                    }
                >

                    <h2>
                        My Posts
                    </h2>

                    <p>

                        Posts shared by{' '}

                        <strong>
                            {
                                user?.fullName ||
                                'you'
                            }
                        </strong>

                    </p>

                </div>


                {/* ======================================
                    HEADER ACTIONS
                ====================================== */}

                <div
                    className={
                        styles.headerActions
                    }
                >

                    <button
                        type="button"
                        className={
                            styles.createButton
                        }
                        onClick={
                            handleCreatePost
                        }
                        aria-label="Create a new post"
                        title="Create a new post"
                    >

                        +

                    </button>


                    <div
                        className={
                            styles.postCount
                        }
                    >

                        <span
                            className={
                                styles.postCountNumber
                            }
                        >

                            {
                                posts.length
                            }

                        </span>

                        <span
                            className={
                                styles.postCountLabel
                            }
                        >

                            {
                                posts.length === 1
                                    ? 'Post'
                                    : 'Posts'
                            }

                        </span>

                    </div>

                </div>

            </div>


            {/* ==========================================
                EMPTY STATE
            ========================================== */}

            {
                posts.length === 0 ? (

                    <div
                        className={
                            styles.empty
                        }
                    >

                        <button
                            type="button"
                            className={
                                styles.emptyIcon
                            }
                            onClick={
                                handleCreatePost
                            }
                            aria-label="Create your first post"
                            title="Create your first post"
                        >

                            +

                        </button>

                        <h3>
                            No Posts Yet
                        </h3>

                        <p>

                            Your published posts
                            will appear here.

                        </p>

                        <button
                            type="button"
                            className={
                                styles.createFirstButton
                            }
                            onClick={
                                handleCreatePost
                            }
                        >

                            Create Your First Post

                        </button>

                    </div>

                ) : (

                    /* ======================================
                       POSTS
                    ====================================== */

                    <div
                        className={
                            styles.postsList
                        }
                    >

                        {
                            posts.map(
                                (post) => (

                                    <FeedCard

                                        key={
                                            post._id
                                        }

                                        post={
                                            post
                                        }

                                        onDelete={
                                            handleDelete
                                        }

                                        onUpdate={
                                            handleUpdate
                                        }

                                        /*
                                         * MY POSTS
                                         *
                                         * Edit/Delete enabled.
                                         *
                                         * FeedCard ALSO checks
                                         * whether current user
                                         * owns the post.
                                         */

                                        showOwnerActions={
                                            true
                                        }

                                    />

                                )
                            )
                        }

                    </div>

                )

            }

        </div>

    );

}