'use client';

import { useEffect, useState } from 'react';

import api from '@/utils/api';
import ReplyList from './ReplyList';

import styles from './Comments.module.css';

export default function CommentCard({
    comment,
    onDelete,
    onUpdate
}) {
    const [user, setUser] = useState(null);

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(
        comment?.content || ''
    );

    const [showReply, setShowReply] = useState(false);
    const [reply, setReply] = useState('');

    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingReply, setLoadingReply] = useState(false);

    const [refreshReplies, setRefreshReplies] = useState(0);


    /* =====================================================
       LOAD USER
    ===================================================== */

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem('lynktoday_user');

            if (!storedUser) {
                setUser(null);
                return;
            }

            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);
        } catch (error) {
            console.error(
                'Failed to load user:',
                error
            );

            setUser(null);
        }
    }, []);


    /* =====================================================
       INITIALIZE COMMENT STATE
    ===================================================== */

    useEffect(() => {
        if (!comment) return;

        setLikes(
            comment.likesCount ??
            comment.likes?.length ??
            0
        );

        if (user?._id) {
            setLiked(
                comment.likes?.includes(user._id) || false
            );
        }

        setContent(comment.content || '');
    }, [comment, user]);


    /* =====================================================
       LIKE
    ===================================================== */

    const handleLike = async () => {
        if (loadingLike) return;

        try {
            setLoadingLike(true);

            const { data } = await api.post(
                `/comments/${comment._id}/like`
            );

            setLiked(Boolean(data.liked));
            setLikes(data.likes ?? 0);
        } catch (error) {
            console.error(
                'Failed to like comment:',
                error
            );
        } finally {
            setLoadingLike(false);
        }
    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async () => {
        if (loadingDelete) return;

        const confirmed = window.confirm(
            'Delete this comment?'
        );

        if (!confirmed) return;

        try {
            setLoadingDelete(true);

            await api.delete(
                `/comments/${comment._id}`
            );

            if (onDelete) {
                onDelete(comment._id);
            }
        } catch (error) {
            console.error(
                'Failed to delete comment:',
                error
            );
        } finally {
            setLoadingDelete(false);
        }
    };


    /* =====================================================
       UPDATE
    ===================================================== */

    const handleUpdate = async () => {
        const trimmedContent = content.trim();

        if (!trimmedContent || loadingUpdate) {
            return;
        }

        try {
            setLoadingUpdate(true);

            const { data } = await api.put(
                `/comments/${comment._id}`,
                {
                    content: trimmedContent
                }
            );

            if (onUpdate && data?.comment) {
                onUpdate(data.comment);
            }

            setContent(trimmedContent);
            setEditing(false);
        } catch (error) {
            console.error(
                'Failed to update comment:',
                error
            );
        } finally {
            setLoadingUpdate(false);
        }
    };


    /* =====================================================
       REPLY
    ===================================================== */

    const handleReply = async () => {
        const trimmedReply = reply.trim();

        if (!trimmedReply || loadingReply) {
            return;
        }

        try {
            setLoadingReply(true);

            await api.post(
                `/comments/${comment._id}/reply`,
                {
                    content: trimmedReply
                }
            );

            setReply('');
            setShowReply(false);

            setRefreshReplies(
                (previous) => previous + 1
            );
        } catch (error) {
            console.error(
                'Failed to post reply:',
                error
            );
        } finally {
            setLoadingReply(false);
        }
    };


    /* =====================================================
       CANCEL EDIT
    ===================================================== */

    const handleCancelEdit = () => {
        setContent(comment?.content || '');
        setEditing(false);
    };


    /* =====================================================
       AUTHOR
    ===================================================== */

    const authorName =
        comment?.author?.fullName ||
        'Unknown User';

    const authorInitial =
        authorName
            .charAt(0)
            .toUpperCase() || 'U';

    const profession =
        comment?.author?.profession ||
        'Community Member';

    const companyName =
        comment?.author?.companyName || '';

    const isOwner =
        user?._id &&
        comment?.author?._id &&
        String(user._id) ===
            String(comment.author._id);


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <article className={styles.commentCard}>

            <div className={styles.avatar}>
                {authorInitial}
            </div>


            <div className={styles.commentBody}>

                <div className={styles.header}>

                    <strong>
                        {authorName}
                    </strong>

                    {comment?.author?.isVerified && (
                        <span
                            className={styles.verify}
                            aria-label="Verified"
                            title="Verified"
                        >
                            Verified
                        </span>
                    )}

                </div>


                <div className={styles.meta}>

                    <span>
                        {profession}
                    </span>

                    {companyName && (
                        <>
                            <span className={styles.separator}>
                                ·
                            </span>

                            <span>
                                {companyName}
                            </span>
                        </>
                    )}

                </div>


                {editing ? (
                    <div className={styles.editBox}>

                        <textarea
                            className={styles.textarea}
                            value={content}
                            onChange={(event) =>
                                setContent(
                                    event.target.value
                                )
                            }
                            rows={4}
                            disabled={loadingUpdate}
                            maxLength={5000}
                        />

                        <div className={styles.actions}>

                            <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={
                                    loadingUpdate ||
                                    !content.trim()
                                }
                            >
                                {loadingUpdate
                                    ? 'Saving...'
                                    : 'Save'}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={loadingUpdate}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                ) : (
                    <p className={styles.content}>
                        {comment?.content}
                    </p>
                )}


                <div className={styles.footer}>

                    <button
                        type="button"
                        onClick={handleLike}
                        disabled={loadingLike}
                        className={
                            liked
                                ? styles.activeAction
                                : ''
                        }
                    >
                        {liked ? 'Liked' : 'Like'}
                        <span>
                            {likes}
                        </span>
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setShowReply(
                                (previous) => !previous
                            )
                        }
                    >
                        {showReply
                            ? 'Close Reply'
                            : 'Reply'}
                    </button>


                    {isOwner && !editing && (
                        <>
                            <button
                                type="button"
                                onClick={() =>
                                    setEditing(true)
                                }
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loadingDelete}
                                className={
                                    styles.deleteAction
                                }
                            >
                                {loadingDelete
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </button>
                        </>
                    )}

                </div>


                {showReply && (
                    <div className={styles.replyBox}>

                        <textarea
                            className={styles.replyInput}
                            rows={3}
                            placeholder="Write your reply..."
                            value={reply}
                            onChange={(event) =>
                                setReply(
                                    event.target.value
                                )
                            }
                            disabled={loadingReply}
                            maxLength={5000}
                        />

                        <div className={styles.replyActions}>

                            <button
                                type="button"
                                className={styles.replyButton}
                                onClick={handleReply}
                                disabled={
                                    loadingReply ||
                                    !reply.trim()
                                }
                            >
                                {loadingReply
                                    ? 'Posting...'
                                    : 'Post Reply'}
                            </button>

                        </div>

                    </div>
                )}


                <ReplyList
                    commentId={comment._id}
                    refresh={refreshReplies}
                />

            </div>

        </article>
    );
}