'use client';

import styles from './MessageBubble.module.css';


// ======================================================
// BACKEND URL
// ======================================================

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(
        /\/api\/v1\/?$/,
        ''
    ) ||
    'http://localhost:5001';


// ======================================================
// MESSAGE BUBBLE
// ======================================================

export default function MessageBubble({
    message,
    currentUser,
    onDelete
}) {

    const isOwn =
        message.sender?._id ===
        currentUser?._id;


    const deleted =
        message.isDeleted;


    return (

        <div
            className={`
                ${styles.row}
                ${isOwn
                    ? styles.ownRow
                    : styles.otherRow}
            `}
        >

            {!isOwn && (

                <div className={styles.avatar}>

                    {message.sender?.profileImage ? (

                        <img
                            src={
                                message.sender.profileImage.startsWith(
                                    'http'
                                )
                                    ? message.sender.profileImage
                                    : `${BACKEND_URL}${message.sender.profileImage}`
                            }

                            alt={
                                message.sender.fullName
                            }
                        />

                    ) : (

                        <span>
                            {
                                message.sender?.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase()
                            }
                        </span>

                    )}

                </div>

            )}


            <div className={styles.messageWrapper}>

                <div
                    className={`
                        ${styles.bubble}
                        ${isOwn
                            ? styles.ownBubble
                            : styles.otherBubble}
                        ${deleted
                            ? styles.deleted
                            : ''}
                    `}
                >

                    <p>
                        {message.content}
                    </p>

                </div>


                <div
                    className={styles.meta}
                >

                    <time>

                        {new Date(
                            message.createdAt
                        ).toLocaleTimeString(
                            [],
                            {
                                hour: '2-digit',
                                minute: '2-digit'
                            }
                        )}

                    </time>


                    {isOwn && !deleted && (

                        <span>

                            {message.isRead
                                ? '✓✓'
                                : message.isDelivered
                                    ? '✓'
                                    : '✓'}

                        </span>

                    )}


                    {isOwn && !deleted && (

                        <button
                            type="button"
                            onClick={() =>
                                onDelete(
                                    message._id
                                )
                            }
                        >
                            Delete
                        </button>

                    )}

                </div>

            </div>

        </div>

    );

}