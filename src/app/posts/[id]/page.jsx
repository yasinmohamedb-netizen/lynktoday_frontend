'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import api from '@/utils/api';

import FeedCard from '@/components/home/Feed/FeedCard';
import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './page.module.css';

export default function PostPage() {
    const params = useParams();
    const router = useRouter();

    const postId = params?.id;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!postId) {
            return;
        }

        let cancelled = false;

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError('');

                const { data } = await api.get(
                    `/posts/${postId}`
                );

                if (!data?.success) {
                    throw new Error(
                        data?.message ||
                        'Unable to load post.'
                    );
                }

                if (!cancelled) {
                    setPost(data.post);
                }
            } catch (error) {
                console.error(
                    'Post page error:',
                    error
                );

                if (!cancelled) {
                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        'Unable to load this post.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchPost();

        return () => {
            cancelled = true;
        };
    }, [postId]);

    const handleDelete = (deletedPostId) => {
        if (
            String(deletedPostId) ===
            String(postId)
        ) {
            router.push('/');
        }
    };

    const handleUpdate = (updatedPost) => {
        if (!updatedPost?._id) {
            return;
        }

        setPost(updatedPost);
    };

    const handleShared = (sharedPost) => {
        if (!sharedPost) {
            return;
        }

        // FeedCard handles the actual share action.
        // This callback is kept for compatibility.
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const renderShell = (content) => (
        <main className={styles.page}>
            <div className={styles.layout}>
                <aside className={styles.leftSidebar}>
                    <LeftSidebar />
                </aside>

                <section className={styles.center}>
                    {content}
                </section>

                <aside className={styles.rightSidebar}>
                    <RightSidebar />
                </aside>
            </div>
        </main>
    );

    if (loading) {
        return renderShell(
            <div className={styles.stateCard}>
                <div
                    className={styles.stateIcon}
                    aria-hidden="true"
                >
                    <span
                        className={styles.spinner}
                    />
                </div>

                <h2>
                    Loading discussion
                </h2>

                <p>
                    Please wait while we load
                    this discussion.
                </p>
            </div>
        );
    }

    if (error) {
        return renderShell(
            <div className={styles.stateCard}>
                <div
                    className={`${styles.stateIcon} ${styles.errorStateIcon}`}
                    aria-hidden="true"
                >
                    !
                </div>

                <h2>
                    Unable to load discussion
                </h2>

                <p>
                    {error}
                </p>

                <div className={styles.stateActions}>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className={styles.primaryButton}
                    >
                        Try Again
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.back()
                        }
                        className={styles.secondaryButton}
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return renderShell(
            <div className={styles.stateCard}>
                <div
                    className={`${styles.stateIcon} ${styles.notFoundIcon}`}
                    aria-hidden="true"
                >
                    ?
                </div>

                <h2>
                    Discussion not found
                </h2>

                <p>
                    This discussion may have been
                    deleted or is no longer available.
                </p>

                <div className={styles.stateActions}>
                    <button
                        type="button"
                        onClick={() =>
                            router.back()
                        }
                        className={styles.primaryButton}
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.layout}>

                <aside className={styles.leftSidebar}>
                    <LeftSidebar />
                </aside>

                <section className={styles.center}>

                    <div className={styles.topBar}>
                        <button
                            type="button"
                            onClick={() =>
                                router.back()
                            }
                            className={styles.backButton}
                        >
                            <span aria-hidden="true">
                                ←
                            </span>

                            Back
                        </button>

                        <div className={styles.context}>
                            <span>
                                Community Discussion
                            </span>

                            {post.category && (
                                <>
                                    <span
                                        className={
                                            styles.separator
                                        }
                                    >
                                        /
                                    </span>

                                    <strong>
                                        {post.category}
                                    </strong>
                                </>
                            )}
                        </div>
                    </div>


                    <header
                        className={
                            styles.discussionHeader
                        }
                    >
                        <div
                            className={
                                styles.discussionHeaderTop
                            }
                        >
                            <div
                                className={
                                    styles.headerContent
                                }
                            >
                                <span
                                    className={
                                        styles.discussionLabel
                                    }
                                >
                                    COMMUNITY DISCUSSION
                                </span>

                                <h1>
                                    {post.title}
                                </h1>

                                <p>
                                    Continue the conversation,
                                    share your experience and
                                    help the LynkToday community.
                                </p>
                            </div>

                            {post.postType && (
                                <span
                                    className={
                                        styles.postType
                                    }
                                >
                                    {post.postType}
                                </span>
                            )}
                        </div>
                    </header>


                    <article
                        className={styles.postCard}
                    >
                        <FeedCard
                            post={post}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onShared={handleShared}
                        />
                    </article>


                    <section
                        className={
                            styles.communityCard
                        }
                    >
                        <div
                            className={
                                styles.communityIcon
                            }
                            aria-hidden="true"
                        >
                            +
                        </div>

                        <div
                            className={
                                styles.communityContent
                            }
                        >
                            <h3>
                                Have something to add?
                            </h3>

                            <p>
                                Share your knowledge,
                                experience or answer with
                                the LynkToday community.
                            </p>
                        </div>
                    </section>

                </section>

                <aside
                    className={
                        styles.rightSidebar
                    }
                >
                    <RightSidebar />
                </aside>

            </div>
        </main>
    );
}