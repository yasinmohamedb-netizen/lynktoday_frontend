'use client';

import {
    useCallback,
    useEffect,
    useState
} from 'react';

import api from '@/utils/api';

import NotificationItem from './NotificationItem';

import styles from './Notification.module.css';


// ======================================================
// SOCKET URL
// ======================================================

const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    'http://localhost:5001';


// ======================================================
// NOTIFICATION LIST
// ======================================================

export default function NotificationList() {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [unreadCount, setUnreadCount] =
        useState(0);


    // ======================================================
    // GET CURRENT USER
    // ======================================================

    const getCurrentUser = () => {

        try {

            if (
                typeof window ===
                'undefined'
            ) {

                return null;

            }


            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );


            if (!storedUser) {

                return null;

            }


            return JSON.parse(
                storedUser
            );

        } catch (error) {

            console.error(
                'Unable to get current user:',
                error
            );

            return null;

        }

    };


    // ======================================================
    // FETCH NOTIFICATIONS
    // ======================================================

    const fetchNotifications =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError('');


                    const { data } =
                        await api.get(
                            '/notifications'
                        );


                    if (
                        data?.success
                    ) {

                        setNotifications(
                            data.notifications || []
                        );


                        setUnreadCount(
                            Number(
                                data.unreadCount || 0
                            )
                        );


                        // ------------------------------------------
                        // Tell Navbar latest notification count
                        // ------------------------------------------

                        if (
                            typeof window !==
                            'undefined'
                        ) {

                            window.dispatchEvent(
                                new CustomEvent(
                                    'lynktoday:notification-count',
                                    {
                                        detail:
                                            Number(
                                                data.unreadCount || 0
                                            )
                                    }
                                )
                            );

                        }

                    } else {

                        setError(
                            data?.message ||
                            'Unable to load notifications.'
                        );

                    }

                } catch (error) {

                    console.error(
                        'Notification loading error:',
                        error
                    );


                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        'Unable to load notifications.'
                    );

                } finally {

                    setLoading(false);

                }

            },
            []
        );


    // ======================================================
    // FETCH UNREAD COUNT
    // ======================================================

    const refreshUnreadCount =
        useCallback(
            async () => {

                try {

                    const { data } =
                        await api.get(
                            '/notifications/unread-count'
                        );


                    if (
                        data?.success
                    ) {

                        const count =
                            Number(
                                data.count || 0
                            );


                        setUnreadCount(
                            count
                        );


                        // ------------------------------------------
                        // Update Navbar
                        // ------------------------------------------

                        if (
                            typeof window !==
                            'undefined'
                        ) {

                            window.dispatchEvent(
                                new CustomEvent(
                                    'lynktoday:notification-count',
                                    {
                                        detail:
                                            count
                                    }
                                )
                            );

                        }

                    }

                } catch (error) {

                    console.error(
                        'Unread count error:',
                        error
                    );

                }

            },
            []
        );


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        fetchNotifications();

    }, [
        fetchNotifications
    ]);


    // ======================================================
    // REAL-TIME SOCKET NOTIFICATION
    // ======================================================

    useEffect(() => {

        const currentUser =
            getCurrentUser();


        if (
            !currentUser?._id
        ) {

            return;

        }


        let notificationSocket =
            null;


        const connectSocket =
            async () => {

                try {

                    // ------------------------------------------
                    // Dynamically import Socket.IO
                    // ------------------------------------------

                    const {
                        io
                    } =
                        await import(
                            'socket.io-client'
                        );


                    notificationSocket =
                        io(
                            SOCKET_URL,
                            {
                                transports: [
                                    'websocket'
                                ],

                                withCredentials:
                                    true,

                                autoConnect:
                                    true
                            }
                        );


                    // ==========================================
                    // CONNECTED
                    // ==========================================

                    notificationSocket.on(
                        'connect',
                        () => {

                            console.log(
                                'Notification socket connected:',
                                notificationSocket.id
                            );


                            // Register current user

                            notificationSocket.emit(
                                'setup',
                                currentUser._id
                            );

                        }
                    );


                    // ==========================================
                    // NEW NOTIFICATION
                    // ==========================================

                    notificationSocket.on(
                        'new_notification',
                        (notification) => {

                            console.log(
                                'New notification received:',
                                notification
                            );


                            if (
                                !notification
                            ) {

                                return;

                            }


                            // --------------------------------------
                            // Make sure notification belongs
                            // to current user
                            // --------------------------------------

                            const receiverId =
                                notification.receiver?._id ||
                                notification.receiver;


                            if (
                                receiverId &&
                                receiverId.toString() !==
                                currentUser._id.toString()
                            ) {

                                return;

                            }


                            // ======================================
                            // ADD NOTIFICATION
                            // ======================================

                            setNotifications(
                                previous => {

                                    const exists =
                                        previous.some(
                                            item =>
                                                item._id?.toString() ===
                                                notification._id?.toString()
                                        );


                                    if (
                                        exists
                                    ) {

                                        return previous;

                                    }


                                    return [
                                        notification,
                                        ...previous
                                    ];

                                }
                            );


                            // ======================================
                            // INCREASE UNREAD COUNT
                            // ======================================

                            setUnreadCount(
                                previous => {

                                    const newCount =
                                        previous + 1;


                                    // ----------------------------------
                                    // Update Navbar
                                    // ----------------------------------

                                    if (
                                        typeof window !==
                                        'undefined'
                                    ) {

                                        window.dispatchEvent(
                                            new CustomEvent(
                                                'lynktoday:notification-count',
                                                {
                                                    detail:
                                                        newCount
                                                }
                                            )
                                        );

                                    }


                                    return newCount;

                                }
                            );


                            // ======================================
                            // OPTIONAL BROWSER EVENT
                            // ======================================

                            if (
                                typeof window !==
                                'undefined'
                            ) {

                                window.dispatchEvent(
                                    new CustomEvent(
                                        'lynktoday:new-notification',
                                        {
                                            detail:
                                                notification
                                        }
                                    )
                                );

                            }

                        }
                    );


                    // ==========================================
                    // DISCONNECT
                    // ==========================================

                    notificationSocket.on(
                        'disconnect',
                        () => {

                            console.log(
                                'Notification socket disconnected'
                            );

                        }
                    );

                } catch (error) {

                    console.error(
                        'Notification socket error:',
                        error
                    );

                }

            };


        connectSocket();


        // ==========================================
        // CLEANUP
        // ==========================================

        return () => {

            if (
                notificationSocket
            ) {

                notificationSocket.disconnect();

            }

        };

    }, []);


    // ======================================================
    // MARK ALL AS READ
    // ======================================================

    const handleMarkAll =
        async () => {

            try {

                await api.patch(
                    '/notifications/read-all'
                );


                // ------------------------------------------
                // Update local notifications
                // ------------------------------------------

                setNotifications(
                    previous =>
                        previous.map(
                            notification => ({
                                ...notification,
                                isRead: true
                            })
                        )
                );


                // ------------------------------------------
                // Reset unread count
                // ------------------------------------------

                setUnreadCount(
                    0
                );


                // ------------------------------------------
                // Update Navbar
                // ------------------------------------------

                if (
                    typeof window !==
                    'undefined'
                ) {

                    window.dispatchEvent(
                        new CustomEvent(
                            'lynktoday:notification-count',
                            {
                                detail: 0
                            }
                        )
                    );

                }

            } catch (error) {

                console.error(
                    'Mark all notifications error:',
                    error
                );

            }

        };


    // ======================================================
    // NOTIFICATION READ CALLBACK
    // ======================================================

    const handleNotificationUpdated =
        async () => {

            await fetchNotifications();

        };


    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading
    ) {

        return (

            <div
                className={
                    styles.loading
                }
            >

                Loading notifications...

            </div>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (
        error
    ) {

        return (

            <div
                className={
                    styles.error
                }
            >

                {error}

            </div>

        );

    }


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div
            className={
                styles.page
            }
        >

            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className={
                    styles.pageHeader
                }
            >

                <div>

                    <h2>
                        Notifications
                    </h2>

                    <p>
                        Stay updated with your recent activity.
                    </p>

                </div>


                {notifications.length > 0 && (

                    <button
                        type="button"
                        className={
                            styles.markAll
                        }
                        onClick={
                            handleMarkAll
                        }
                    >

                        Mark All as Read

                    </button>

                )}

            </div>


            {/* ==========================================
                EMPTY
            ========================================== */}

            {
                notifications.length === 0 ? (

                    <div
                        className={
                            styles.empty
                        }
                    >

                        No notifications available.

                    </div>

                ) : (

                    <>

                        {/* ======================================
                            NOTIFICATION ITEMS
                        ====================================== */}

                        {notifications.map(
                            notification => (

                                <NotificationItem

                                    key={
                                        notification._id
                                    }

                                    notification={
                                        notification
                                    }

                                    refreshNotifications={
                                        handleNotificationUpdated
                                    }

                                    refreshUnreadCount={
                                        refreshUnreadCount
                                    }

                                />

                            )
                        )}

                    </>

                )
            }

        </div>

    );

}