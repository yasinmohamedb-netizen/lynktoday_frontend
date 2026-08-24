'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import api from '@/utils/api';

import styles from './Notification.module.css';


export default function NotificationItem({

    notification,

    refreshNotifications,

    refreshUnreadCount

}) {

    const router = useRouter();


    // ==================================================
    // STATE
    // ==================================================

    const [isRead, setIsRead] =
        useState(
            Boolean(
                notification?.isRead
            )
        );


    const [deleting, setDeleting] =
        useState(false);


    const [opening, setOpening] =
        useState(false);


    // ==================================================
    // GET ID HELPER
    // ==================================================

    const getId = (value) => {

        if (!value) {

            return null;

        }


        if (
            typeof value === 'string'
        ) {

            return value;

        }


        return (
            value._id ||
            value.id ||
            null
        );

    };


    // ==================================================
    // GET SENDER ID
    // ==================================================

    const senderId =
        getId(
            notification?.sender
        );


    // ==================================================
    // GET POST ID
    // ==================================================

    const postId =
        getId(
            notification?.post
        ) ||
        notification?.postId ||
        notification?.relatedPostId ||
        null;


    // ==================================================
    // GET COMMENT ID
    // ==================================================

    const commentId =
        getId(
            notification?.comment
        ) ||
        notification?.commentId ||
        null;


    // ==================================================
    // GET CONVERSATION ID
    // ==================================================

    const conversationId =
        getId(
            notification?.conversation
        ) ||
        notification?.conversationId ||
        null;


    // ==================================================
    // MARK NOTIFICATION AS READ
    // ==================================================

    const markAsRead = async () => {

        if (
            isRead
        ) {

            return true;

        }


        try {

            await api.patch(
                `/notifications/${notification._id}/read`
            );


            setIsRead(true);


            // ==========================================
            // UPDATE UNREAD COUNT
            // ==========================================

            if (
                refreshUnreadCount
            ) {

                await refreshUnreadCount();

            }


            // ==========================================
            // UPDATE NOTIFICATION LIST
            // ==========================================

            if (
                refreshNotifications
            ) {

                await refreshNotifications();

            }


            return true;

        } catch (error) {

            console.error(
                'Mark notification as read error:',
                error.response?.data ||
                error
            );


            return false;

        }

    };


    // ==================================================
    // OPEN NOTIFICATION CONTENT
    // ==================================================

    const openNotification =
        () => {

            const type =
                String(
                    notification?.type ||
                    ''
                ).toUpperCase();


            // ==================================================
            // MESSAGE
            // ==================================================

            if (
                type === 'MESSAGE' ||
                type === 'NEW_MESSAGE' ||
                type === 'CHAT'
            ) {

                if (
                    conversationId
                ) {

                    router.push(
                        `/messages?conversationId=${conversationId}`
                    );

                    return;

                }


                router.push(
                    '/messages'
                );

                return;

            }


            // ==================================================
            // FOLLOW
            // ==================================================

            if (
                type === 'FOLLOW'
            ) {

                if (
                    senderId
                ) {

                    router.push(
                        `/profile/${senderId}`
                    );

                    return;

                }


                return;

            }


            // ==================================================
            // CONNECTION REQUEST
            // ==================================================

            if (
                type === 'CONNECTION_REQUEST' ||
                type === 'CONNECTION_REQUEST_RECEIVED' ||
                type === 'CONNECT'
            ) {

                router.push(
                    '/connections'
                );

                return;

            }


            // ==================================================
            // CONNECTION ACCEPTED
            // ==================================================

            if (
                type === 'CONNECTION_ACCEPTED' ||
                type === 'CONNECTION_APPROVED'
            ) {

                if (
                    senderId
                ) {

                    router.push(
                        `/profile/${senderId}`
                    );

                    return;

                }


                router.push(
                    '/connections'
                );

                return;

            }


            // ==================================================
            // POST NOTIFICATIONS
            // ==================================================

            if (
                type === 'LIKE_POST' ||
                type === 'COMMENT' ||
                type === 'REPLY' ||
                type === 'SHARE' ||
                type === 'MENTION' ||
                type === 'POST'
            ) {

                if (
                    postId
                ) {

                    router.push(
                        `/posts/${postId}`
                    );

                    return;

                }


                return;

            }


            // ==================================================
            // COMMENT
            // ==================================================

            if (
                type === 'COMMENT_LIKE' ||
                type === 'LIKE_COMMENT'
            ) {

                if (
                    postId
                ) {

                    router.push(
                        `/posts/${postId}`
                    );

                    return;

                }


                if (
                    commentId
                ) {

                    // If later you create a
                    // dedicated comment page,
                    // this can be changed.

                    return;

                }


                return;

            }


            // ==================================================
            // PROFILE / USER
            // ==================================================

            if (
                type === 'PROFILE_VIEW' ||
                type === 'PROFILE'
            ) {

                if (
                    senderId
                ) {

                    router.push(
                        `/profile/${senderId}`
                    );

                    return;

                }


                return;

            }


            // ==================================================
            // DEFAULT FALLBACK
            // ==================================================

            // If the notification has a post,
            // open the post.

            if (
                postId
            ) {

                router.push(
                    `/posts/${postId}`
                );

                return;

            }


            // Otherwise, if it has a sender,
            // open the sender's profile.

            if (
                senderId
            ) {

                router.push(
                    `/profile/${senderId}`
                );

                return;

            }

        };


    // ==================================================
    // HANDLE CLICK
    // ==================================================

    const handleClick = async () => {

        if (
            opening ||
            deleting
        ) {

            return;

        }


        try {

            setOpening(true);


            // ==========================================
            // Mark read if necessary
            // ==========================================

            if (
                !isRead
            ) {

                await markAsRead();

            }


            // ==========================================
            // IMPORTANT
            //
            // Navigate AFTER marking as read.
            // This works for both unread and
            // already-read notifications.
            // ==========================================

            openNotification();

        } catch (error) {

            console.error(
                'Open notification error:',
                error
            );

        } finally {

            setOpening(false);

        }

    };


    // ==================================================
    // DELETE NOTIFICATION
    // ==================================================

    const deleteNotification =
        async (event) => {

            event.stopPropagation();


            if (
                deleting
            ) {

                return;

            }


            try {

                setDeleting(true);


                await api.delete(
                    `/notifications/${notification._id}`
                );


                // ==========================================
                // Refresh notification list
                // ==========================================

                if (
                    refreshNotifications
                ) {

                    await refreshNotifications();

                }


                // ==========================================
                // Refresh unread badge
                // ==========================================

                if (
                    refreshUnreadCount
                ) {

                    await refreshUnreadCount();

                }

            } catch (error) {

                console.error(
                    'Delete notification error:',
                    error.response?.data ||
                    error
                );

            } finally {

                setDeleting(false);

            }

        };


    // ==================================================
    // FORMAT TIME
    // ==================================================

    const time =
        notification?.createdAt

            ? new Date(
                notification.createdAt
            ).toLocaleString()

            : '';


    // ==================================================
    // NOTIFICATION MESSAGE
    // ==================================================

    const getMessage = () => {

        const sender =
            notification?.sender?.fullName ||
            'Someone';


        switch (
            notification?.type
        ) {

            case 'LIKE_POST':

                return (
                    `${sender} liked your post.`
                );


            case 'COMMENT':

                return (
                    `${sender} commented on your post.`
                );


            case 'REPLY':

                return (
                    `${sender} replied to your comment.`
                );


            case 'SHARE':

                return (
                    `${sender} shared your post.`
                );


            case 'FOLLOW':

                return (
                    `${sender} started following you.`
                );


            case 'MENTION':

                return (
                    `${sender} mentioned you in a post.`
                );


            case 'CONNECTION_REQUEST':

                return (
                    `${sender} sent you a connection request.`
                );


            case 'CONNECTION_REQUEST_RECEIVED':

                return (
                    `${sender} sent you a connection request.`
                );


            case 'CONNECTION_ACCEPTED':

                return (
                    `${sender} accepted your connection request.`
                );


            case 'MESSAGE':

                return (
                    `${sender} sent you a message.`
                );


            case 'NEW_MESSAGE':

                return (
                    `${sender} sent you a message.`
                );


            case 'SYSTEM':

                return (
                    notification?.message ||
                    'System notification.'
                );


            default:

                return (
                    notification?.message ||
                    'Notification'
                );

        }

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div

            className={`
                ${styles.notificationItem}
                ${!isRead ? styles.unread : ''}
            `}

            onClick={
                handleClick
            }

            role="button"

            tabIndex={0}

            onKeyDown={
                event => {

                    if (
                        event.key === 'Enter' ||
                        event.key === ' '
                    ) {

                        event.preventDefault();

                        handleClick();

                    }

                }
            }

        >

            {/* ==========================================
                NOTIFICATION CONTENT
            ========================================== */}

            <div
                className={
                    styles.notificationContent
                }
            >

                <h4>

                    {
                        notification?.sender?.fullName ||
                        'System'
                    }

                </h4>


                <p>

                    {
                        getMessage()
                    }

                </p>


                <span>

                    {
                        time
                    }

                </span>

            </div>


            {/* ==========================================
                DELETE BUTTON
            ========================================== */}

            <button

                type="button"

                className={
                    styles.deleteButton
                }

                onClick={
                    deleteNotification
                }

                disabled={
                    deleting ||
                    opening
                }

            >

                {
                    deleting

                        ? 'Deleting...'

                        : 'Delete'
                }

            </button>

        </div>

    );

}