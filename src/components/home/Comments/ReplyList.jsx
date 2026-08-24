'use client';

import { useCallback, useEffect, useState } from 'react';

import api from '@/utils/api';

import styles from './Comments.module.css';

export default function ReplyList({
    commentId,
    refresh
}) {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReplies = useCallback(async () => {
        if (!commentId) {
            setReplies([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const { data } = await api.get(
                `/comments/${commentId}/replies`
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to load replies.'
                );
            }

            setReplies(
                Array.isArray(data.replies)
                    ? data.replies
                    : []
            );
        } catch (error) {
            console.error(
                'Failed to load replies:',
                error
            );

            setReplies([]);

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to load replies.'
            );
        } finally {
            setLoading(false);
        }
    }, [commentId]);

    useEffect(() => {
        fetchReplies();
    }, [fetchReplies, refresh]);

    if (loading) {
        return null;
    }

    if (error) {
        return (
            <div className={styles.replyError}>
                {error}
            </div>
        );
    }

    if (replies.length === 0) {
        return null;
    }

    return (
        <div className={styles.replyList}>
            {replies.map((reply) => {
                const name =
                    reply.author?.fullName ||
                    'User';

                const initial =
                    name
                        .charAt(0)
                        .toUpperCase();

                return (
                    <div
                        key={reply._id}
                        className={styles.reply}
                    >
                        <div
                            className={
                                styles.replyAvatar
                            }
                        >
                            {initial}
                        </div>

                        <div
                            className={
                                styles.replyBody
                            }
                        >
                            <div
                                className={
                                    styles.replyHeader
                                }
                            >
                                <strong>
                                    {name}
                                </strong>

                                {reply.author
                                    ?.isVerified && (
                                    <span
                                        className={
                                            styles.verify
                                        }
                                    >
                                        ✓
                                    </span>
                                )}
                            </div>

                            {(reply.author?.profession ||
                                reply.author
                                    ?.companyName) && (
                                <div
                                    className={
                                        styles.meta
                                    }
                                >
                                    {reply.author
                                        ?.profession}

                                    {reply.author
                                        ?.profession &&
                                        reply.author
                                            ?.companyName &&
                                        ' • '}

                                    {reply.author
                                        ?.companyName}
                                </div>
                            )}

                            <p
                                className={
                                    styles.replyContent
                                }
                            >
                                {reply.content}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}