'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import api from '@/utils/api';
import NotificationDropdown from './NotificationDropdown';

import styles from './Notification.module.css';

export default function NotificationBell({
    userId
}) {

    const [count, setCount] = useState(0);

    const [notifications, setNotifications] =
        useState([]);

    const [open, setOpen] =
        useState(false);

    const wrapperRef =
        useRef(null);

    const socketRef =
        useRef(null);


    // ==========================================
    // Load Unread Count
    // ==========================================

    const loadUnreadCount = async () => {

        try {

            const { data } =
                await api.get(
                    '/notifications/unread-count'
                );

            if (data.success) {

                setCount(
                    data.count || 0
                );

            }

        } catch (error) {

            console.error(
                'Unread count error:',
                error
            );

        }

    };


    // ==========================================
    // Load Notifications
    // ==========================================

    const loadNotifications = async () => {

        try {

            const { data } =
                await api.get(
                    '/notifications'
                );

            if (data.success) {

                setNotifications(
                    data.notifications || []
                );

                /*
                 * Use backend unread count if available.
                 * Otherwise calculate from notifications.
                 */

                const unreadCount =
                    data.unreadCount ??
                    (data.notifications || []).filter(
                        notification =>
                            !notification.isRead
                    ).length;

                setCount(
                    unreadCount
                );

            }

        } catch (error) {

            console.error(
                'Notifications error:',
                error
            );

        }

    };


    // ==========================================
    // Toggle Dropdown
    // ==========================================

    const handleToggle = async () => {

        if (!open) {

            await Promise.all([

                loadUnreadCount(),

                loadNotifications()

            ]);

        }

        setOpen(
            prev => !prev
        );

    };


    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        if (!userId) {
            return;
        }

        loadUnreadCount();

    }, [userId]);


    // ==========================================
    // Socket.IO Connection
    // ==========================================

    useEffect(() => {

        if (!userId) {

            console.log(
                'Notification socket waiting for userId...'
            );

            return;

        }


        const socketUrl =
            process.env.NEXT_PUBLIC_SOCKET_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:5001';


        console.log(
            'Connecting notification socket:',
            socketUrl
        );


        const socket =
            io(
                socketUrl,
                {
                    transports: [
                        'websocket',
                        'polling'
                    ],

                    withCredentials: false
                }
            );


        socketRef.current =
            socket;


        // ======================================
        // Socket Connected
        // ======================================

        socket.on(
            'connect',
            () => {

                console.log(
                    'Notification Socket Connected:',
                    socket.id
                );


                // Register logged-in user
                socket.emit(
                    'setup',
                    userId
                );


                console.log(
                    'Notification socket registered for user:',
                    userId
                );

            }
        );


        // ======================================
        // New Notification
        // ======================================

        socket.on(
            'new_notification',
            (notification) => {

                console.log(
                    'New notification received:',
                    notification
                );


                if (!notification) {
                    return;
                }


                setNotifications(
                    prev => {

                        // Prevent duplicate notification
                        const exists =
                            prev.some(
                                item =>
                                    item._id ===
                                    notification._id
                            );


                        if (exists) {

                            return prev;

                        }


                        return [
                            notification,
                            ...prev
                        ];

                    }
                );


                // Increase unread badge
                setCount(
                    prev => prev + 1
                );

            }
        );


        // ======================================
        // Socket Error
        // ======================================

        socket.on(
            'connect_error',
            (error) => {

                console.error(
                    'Notification Socket Error:',
                    error
                );

            }
        );


        // ======================================
        // Socket Disconnect
        // ======================================

        socket.on(
            'disconnect',
            (reason) => {

                console.log(
                    'Notification Socket Disconnected:',
                    reason
                );

            }
        );


        // ======================================
        // Cleanup
        // ======================================

        return () => {

            console.log(
                'Closing notification socket'
            );

            socket.disconnect();

            socketRef.current =
                null;

        };

    }, [userId]);


    // ==========================================
    // Auto Refresh Badge
    // ==========================================

    useEffect(() => {

        if (!userId) {
            return;
        }


        const interval =
            setInterval(
                () => {

                    loadUnreadCount();

                },
                15000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [userId]);


    // ==========================================
    // Close Dropdown On Outside Click
    // ==========================================

    useEffect(() => {

        const handleClickOutside =
            (event) => {

                if (

                    wrapperRef.current &&

                    !wrapperRef.current.contains(
                        event.target
                    )

                ) {

                    setOpen(
                        false
                    );

                }

            };


        document.addEventListener(
            'mousedown',
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );

        };

    }, []);


    // ==========================================
    // Render
    // ==========================================

    return (

        <div
            className={
                styles.notificationWrapper
            }

            ref={wrapperRef}
        >

            {/* ==================================
                Notification Button
            ================================== */}

            <button

                type="button"

                className={
                    styles.notificationButton
                }

                onClick={
                    handleToggle
                }

            >

                Notifications


                {/* ==================================
                    Unread Badge
                ================================== */}

                {
                    count > 0 && (

                        <span
                            className={
                                styles.badge
                            }
                        >

                            {
                                count > 99
                                    ? '99+'
                                    : count
                            }

                        </span>

                    )
                }

            </button>


            {/* ==================================
                Notification Dropdown
            ================================== */}

            {
                open && (

                    <NotificationDropdown

                        notifications={
                            notifications
                        }

                        refreshNotifications={
                            loadNotifications
                        }

                        refreshUnreadCount={
                            loadUnreadCount
                        }

                        closeDropdown={
                            () =>
                                setOpen(false)
                        }

                    />

                )
            }

        </div>

    );

}