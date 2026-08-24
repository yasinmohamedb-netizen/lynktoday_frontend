'use client';

import { useState } from 'react';

import api from '@/utils/api';

import ExternalShare from './ExternalShare';

import styles from './ShareModal.module.css';


export default function ShareModal({
    post,
    open,
    onClose,
    onShared
}) {

    const [shareComment, setShareComment] = useState('');

    const [loading, setLoading] = useState(false);


    // ==================================================
    // MODAL CLOSED
    // ==================================================

    if (!open) {
        return null;
    }


    // ==================================================
    // INTERNAL SHARE
    // ==================================================

    const handleInternalShare = async () => {

        if (!post?._id || loading) {
            return;
        }


        try {

            setLoading(true);


            const { data } = await api.post(
                `/posts/${post._id}/share`,
                {
                    shareComment: shareComment.trim()
                }
            );


            if (!data?.success) {

                throw new Error(
                    data?.message ||
                    'Unable to share post.'
                );

            }


            // ------------------------------------------
            // CLEAR COMMENT
            // ------------------------------------------

            setShareComment('');


            // ------------------------------------------
            // UPDATE FEED
            // ------------------------------------------

            if (typeof onShared === 'function') {

                onShared(data.post);

            }


            // ------------------------------------------
            // CLOSE MODAL
            // ------------------------------------------

            onClose();


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            alert(
                'Post shared successfully.'
            );

        } catch (error) {

            console.error(
                'Share post error:',
                error
            );


            console.error(
                'Share API response:',
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                error.message ||
                'Unable to share post.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const handleClose = () => {

        if (loading) {
            return;
        }

        setShareComment('');

        onClose();

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div
            className={styles.overlay}
            onClick={handleClose}
        >

            <div
                className={styles.modal}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className={styles.header}>

                    <h2>
                        Share Post
                    </h2>


                    <button
                        type="button"
                        className={styles.close}
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close share modal"
                    >
                        ✕
                    </button>

                </div>


                {/* ==========================================
                    BODY
                ========================================== */}

                <div className={styles.body}>

                    {/* ======================================
                        INTERNAL SHARE
                    ====================================== */}

                    <div className={styles.internalSection}>

                        <label
                            htmlFor="share-comment"
                        >
                            Share on LynkToday
                        </label>


                        <textarea
                            id="share-comment"
                            rows={5}
                            className={styles.textarea}
                            placeholder="Add your thoughts..."
                            value={shareComment}
                            onChange={(event) =>
                                setShareComment(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />


                        <button
                            type="button"
                            className={styles.shareButton}
                            onClick={
                                handleInternalShare
                            }
                            disabled={loading}
                        >

                            {loading
                                ? 'Sharing...'
                                : 'Share on LynkToday'}

                        </button>

                    </div>


                    {/* ======================================
                        DIVIDER
                    ====================================== */}

                    <div className={styles.divider}>

                        <span>
                            OR
                        </span>

                    </div>


                    {/* ======================================
                        EXTERNAL SHARE
                    ====================================== */}

                    <ExternalShare
                        post={post}
                    />

                </div>

            </div>

        </div>

    );

}