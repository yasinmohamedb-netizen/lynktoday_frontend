'use client';

import { useState } from 'react';

import api from '@/utils/api';

import styles from './Comments.module.css';

export default function CommentForm({
    postId,
    onCommentAdded
}) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent || loading) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            const { data } = await api.post(
                `/comments/${postId}`,
                {
                    content: trimmedContent
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to post comment.'
                );
            }

            setContent('');

            if (
                typeof onCommentAdded === 'function' &&
                data.comment
            ) {
                onCommentAdded(data.comment);
            }
        } catch (error) {
            console.error(
                'Failed to post comment:',
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to post comment. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className={styles.commentForm}
            onSubmit={handleSubmit}
        >
            <textarea
                className={styles.commentInput}
                rows={3}
                maxLength={5000}
                placeholder="Write a comment..."
                value={content}
                onChange={(event) => {
                    setContent(event.target.value);

                    if (error) {
                        setError('');
                    }
                }}
                disabled={loading}
            />

            <div className={styles.commentFooter}>
                <span className={styles.characterCount}>
                    {content.length}/5000
                </span>

                <button
                    type="submit"
                    className={styles.commentButton}
                    disabled={
                        loading ||
                        !content.trim()
                    }
                >
                    {loading
                        ? 'Posting...'
                        : 'Post Comment'}
                </button>
            </div>

            {error && (
                <div className={styles.commentError}>
                    {error}
                </div>
            )}
        </form>
    );
}