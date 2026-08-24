'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './page.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

export default function TopicPage() {
    const params = useParams();
    const slug = params?.slug;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;

        const loadTopic = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(
                    `${API_BASE_URL}/topics/${slug}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        cache: 'no-store',
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Topic API failed: ${response.status}`
                    );
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message || 'Failed to load topic'
                    );
                }

                setData(result);
            } catch (err) {
                console.error('Failed to load topic:', err);

                setError(
                    err.message || 'Failed to load topic'
                );
            } finally {
                setLoading(false);
            }
        };

        loadTopic();
    }, [slug]);

    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loadingCard}>
                        <div className={styles.loadingSpinner} />
                        <p>Loading topic...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.errorCard}>
                        <div className={styles.errorIcon}>!</div>

                        <h1>Unable to load topic</h1>

                        <p>{error}</p>

                        <Link
                            href="/"
                            className={styles.primaryButton}
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const topic = data?.topic || null;

    const posts = Array.isArray(data?.posts)
        ? data.posts
        : [];

    const documents = Array.isArray(data?.documents)
        ? data.documents
        : [];

    const topicName =
        topic?.name ||
        slug ||
        'Topic';

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* Topic Header */}

                <section className={styles.hero}>
                    <div className={styles.heroMain}>

                        <div className={styles.topicIcon}>
                            #
                        </div>

                        <div className={styles.heroContent}>
                            <span className={styles.eyebrow}>
                                Trending Topic
                            </span>

                            <h1>
                                #{topicName}
                            </h1>

                            <p>
                                Explore community discussions
                                and trade documentation related
                                to this topic.
                            </p>
                        </div>
                    </div>

                    <div className={styles.heroStats}>

                        <div className={styles.statCard}>
                            <strong>{posts.length}</strong>
                            <span>
                                {posts.length === 1
                                    ? 'Discussion'
                                    : 'Discussions'}
                            </span>
                        </div>

                        <div className={styles.statCard}>
                            <strong>{documents.length}</strong>
                            <span>
                                {documents.length === 1
                                    ? 'Document'
                                    : 'Documents'}
                            </span>
                        </div>

                    </div>
                </section>


                {/* Main Content */}

                <div className={styles.contentGrid}>

                    <div className={styles.mainColumn}>

                        {/* Discussions */}

                        <section
                            id="discussions"
                            className={styles.section}
                        >
                            <div className={styles.sectionHeader}>
                                <div>
                                    <h2>Discussions</h2>

                                    <p>
                                        Conversations from the
                                        LynkToday community.
                                    </p>
                                </div>

                                <span className={styles.sectionCount}>
                                    {posts.length}
                                </span>
                            </div>

                            {posts.length > 0 ? (
                                <div className={styles.postList}>

                                    {posts.map((post) => {
                                        const authorName =
                                            post.author?.fullName ||
                                            'Unknown User';

                                        const authorInitial =
                                            authorName
                                                .charAt(0)
                                                .toUpperCase() || 'U';

                                        const postType =
                                            post.postType ||
                                            'Discussion';

                                        const likes =
                                            post.likesCount ??
                                            post.likes?.length ??
                                            0;

                                        const comments =
                                            post.commentCount ?? 0;

                                        const views =
                                            post.views ?? 0;

                                        return (
                                            <Link
                                                key={post._id}
                                                href={`/posts/${post._id}`}
                                                className={styles.postCard}
                                            >

                                                <div className={styles.postHeader}>

                                                    <div className={styles.author}>

                                                        <div className={styles.avatar}>
                                                            {authorInitial}
                                                        </div>

                                                        <div className={styles.authorInfo}>
                                                            <strong>
                                                                {authorName}
                                                            </strong>

                                                            <span>
                                                                {post.author?.profession ||
                                                                    post.author?.companyName ||
                                                                    'Community Member'}
                                                            </span>
                                                        </div>

                                                    </div>

                                                    <span className={styles.postType}>
                                                        {postType}
                                                    </span>

                                                </div>


                                                <div className={styles.postBody}>

                                                    <h3>
                                                        {post.title ||
                                                            'Untitled Discussion'}
                                                    </h3>

                                                    {post.content && (
                                                        <p>
                                                            {post.content}
                                                        </p>
                                                    )}

                                                </div>


                                                <div className={styles.postMeta}>

                                                    <span>
                                                        Likes {likes}
                                                    </span>

                                                    <span>
                                                        Comments {comments}
                                                    </span>

                                                    <span>
                                                        Views {views}
                                                    </span>

                                                    <span className={styles.viewLink}>
                                                        View discussion
                                                    </span>

                                                </div>

                                            </Link>
                                        );
                                    })}

                                </div>
                            ) : (
                                <div className={styles.emptyCard}>

                                    <div className={styles.emptyIcon}>
                                        Discussions
                                    </div>

                                    <h3>
                                        No discussions yet
                                    </h3>

                                    <p>
                                        There are currently no
                                        discussions available
                                        for this topic.
                                    </p>

                                </div>
                            )}

                        </section>


                        {/* Documentation */}

                        <section
                            id="documentation"
                            className={styles.section}
                        >

                            <div className={styles.sectionHeader}>

                                <div>
                                    <h2>Documentation</h2>

                                    <p>
                                        Trade, customs and logistics
                                        resources related to this topic.
                                    </p>
                                </div>

                                <span className={styles.sectionCount}>
                                    {documents.length}
                                </span>

                            </div>


                            {documents.length > 0 ? (
                                <div className={styles.documentList}>

                                    {documents.map((document) => {
                                        const documentId =
                                            document._id ||
                                            document.id;

                                        return (
                                            <Link
                                                key={documentId}
                                                href={`/documentation/${documentId}`}
                                                className={styles.documentCard}
                                            >

                                                <div className={styles.documentIcon}>
                                                    DOC
                                                </div>

                                                <div className={styles.documentContent}>

                                                    <div className={styles.documentHeader}>

                                                        <span className={styles.documentType}>
                                                            {document.documentType ||
                                                                'DOCUMENT'}
                                                        </span>

                                                        <span className={styles.documentArrow}>
                                                            →
                                                        </span>

                                                    </div>

                                                    <h3>
                                                        {document.title ||
                                                            'Untitled Document'}
                                                    </h3>

                                                    {document.description && (
                                                        <p>
                                                            {document.description}
                                                        </p>
                                                    )}

                                                    <span className={styles.documentCategory}>
                                                        {document.category ||
                                                            'General'}
                                                    </span>

                                                </div>

                                            </Link>
                                        );
                                    })}

                                </div>
                            ) : (
                                <div className={styles.emptyCard}>

                                    <div className={styles.emptyIcon}>
                                        Documentation
                                    </div>

                                    <h3>
                                        No documentation yet
                                    </h3>

                                    <p>
                                        No documentation is currently
                                        available for this topic.
                                    </p>

                                </div>
                            )}

                        </section>

                    </div>


                    {/* Right Sidebar */}

                    <aside className={styles.sidebar}>
                        <RightSidebar />
                    </aside>

                </div>

            </div>
        </main>
    );
}