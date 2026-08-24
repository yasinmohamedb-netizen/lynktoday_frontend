'use client';

import { useCallback, useEffect, useState } from 'react';

import api from '@/utils/api';

import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

import styles from './Comments.module.css';

export default function CommentList({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchComments = useCallback(async () => {
        if (!postId) {
            setComments([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const { data } = await api.get(
                `/comments/${postId}`
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to load comments.'
                );
            }

            setComments(
                Array.isArray(data.comments)
                    ? data.comments
                    : []
            );
        } catch (error) {
            console.error(
                'Failed to load comments:',
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to load comments.'
            );
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentAdded = (comment) => {
        if (!comment) return;

        setComments((previous) => [
            comment,
            ...previous
        ]);
    };

    const handleDelete = (commentId) => {
        setComments((previous) =>
            previous.filter(
                (comment) =>
                    comment._id !== commentId
            )
        );
    };

    const handleUpdate = (updatedComment) => {
        if (!updatedComment?._id) return;

        setComments((previous) =>
            previous.map((comment) =>
                comment._id === updatedComment._id
                    ? updatedComment
                    : comment
            )
        );
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading comments...
            </div>
        );
    }

    return (
        <section className={styles.wrapper}>
            <CommentForm
                postId={postId}
                onCommentAdded={handleCommentAdded}
            />

            {error && (
                <div className={styles.error}>
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={fetchComments}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className={styles.total}>
                {comments.length}{' '}
                {comments.length === 1
                    ? 'Comment'
                    : 'Comments'}
            </div>

            {comments.length === 0 ? (
                <div className={styles.empty}>
                    No comments yet. Be the first to
                    start the conversation.
                </div>
            ) : (
                <div className={styles.commentList}>
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}