'use client';

import styles from './ConversationItem.module.css';

export default function ConversationItem({
    conversation,
    currentUser,
    selected,
    onClick
}) {

    // ======================================================
    // Other Participant
    // ======================================================

    const otherUser =
        conversation?.participants?.find(
            user =>
                user?._id?.toString() !==
                currentUser?._id?.toString()
        );


    // ======================================================
    // Last Message
    // ======================================================

    const lastMessage =
        conversation?.lastMessage;


    let lastMessageText =
        'No messages yet';


    if (lastMessage) {

        if (
            typeof lastMessage === 'string'
        ) {

            lastMessageText =
                lastMessage;

        } else if (
            lastMessage.content
        ) {

            lastMessageText =
                lastMessage.content;

        } else if (
            lastMessage.messageType === 'IMAGE'
        ) {

            lastMessageText =
                '📷 Image';

        } else if (
            lastMessage.messageType === 'FILE'
        ) {

            lastMessageText =
                '📎 File';

        } else if (
            lastMessage.attachments?.length > 0
        ) {

            lastMessageText =
                '📎 Attachment';

        }

    }


    // ======================================================
    // Last Message Time
    // ======================================================

    const messageDate =
        conversation?.lastMessageAt ||
        lastMessage?.createdAt;


    const formattedTime =
        messageDate
            ? formatMessageTime(messageDate)
            : '';


    // ======================================================
    // Unread Count
    // ======================================================

    const unreadCounts =
        conversation?.unreadCounts || {};


    const unreadCount =
        currentUser?._id
            ? (
                unreadCounts[
                    currentUser._id
                ] || 0
            )
            : 0;


    // ======================================================
    // User Information
    // ======================================================

    const fullName =
        otherUser?.fullName ||
        'User';


    const avatarLetter =
        fullName
            .charAt(0)
            .toUpperCase();


    // ======================================================
    // Render
    // ======================================================

    return (

        <button
            type="button"
            onClick={onClick}
            className={`
                ${styles.item}
                ${selected ? styles.selected : ''}
            `}
        >

            {/* ==========================================
                Avatar
            ========================================== */}

            <div className={styles.avatar}>

                {otherUser?.profileImage ? (

                    <img
                        src={getImageUrl(
                            otherUser.profileImage
                        )}
                        alt={fullName}
                    />

                ) : (

                    <span>
                        {avatarLetter}
                    </span>

                )}

            </div>


            {/* ==========================================
                Content
            ========================================== */}

            <div className={styles.content}>

                {/* ======================================
                    Name + Time
                ====================================== */}

                <div className={styles.top}>

                    <strong>

                        {fullName}

                    </strong>


                    <time>

                        {formattedTime}

                    </time>

                </div>


                {/* ======================================
                    Last Message + Unread
                ====================================== */}

                <div className={styles.bottom}>

                    <p>

                        {lastMessageText}

                    </p>


                    {unreadCount > 0 && (

                        <span className={styles.badge}>

                            {unreadCount > 99
                                ? '99+'
                                : unreadCount}

                        </span>

                    )}

                </div>

            </div>

        </button>

    );

}


// ======================================================
// Format Message Time
// ======================================================

function formatMessageTime(dateValue) {

    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return '';

    }


    const now =
        new Date();


    // ==========================================
    // Today
    // ==========================================

    if (
        date.toDateString() ===
        now.toDateString()
    ) {

        return date.toLocaleTimeString(
            [],
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        );

    }


    // ==========================================
    // Yesterday
    // ==========================================

    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    if (
        date.toDateString() ===
        yesterday.toDateString()
    ) {

        return 'Yesterday';

    }


    // ==========================================
    // Older
    // ==========================================

    return date.toLocaleDateString(
        [],
        {
            month: 'short',
            day: 'numeric'
        }
    );

}


// ======================================================
// Image URL
// ======================================================

function getImageUrl(imagePath) {

    if (!imagePath) {
        return '';
    }


    // Already complete URL

    if (
        imagePath.startsWith('http://') ||
        imagePath.startsWith('https://')
    ) {

        return imagePath;

    }


    const baseUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        'http://localhost:5001';


    return (
        `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
    );

}