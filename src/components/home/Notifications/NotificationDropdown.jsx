'use client';

import Link from 'next/link';

import NotificationItem from './NotificationItem';

import styles from './Notification.module.css';

export default function NotificationDropdown({
    notifications = [],
    refreshNotifications,
    refreshUnreadCount,
    closeDropdown
}) {
    const visibleNotifications = notifications.slice(0, 5);

    return (
        <div className={styles.dropdown}>
            {/* Header */}
            <div className={styles.dropdownHeader}>
                <h3>Notifications</h3>
            </div>

            {/* Notifications */}
            {visibleNotifications.length === 0 ? (
                <div className={styles.empty}>
                    No notifications available.
                </div>
            ) : (
                <div className={styles.notificationList}>
                    {visibleNotifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            refreshNotifications={refreshNotifications}
                            refreshUnreadCount={refreshUnreadCount}
                        />
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className={styles.dropdownFooter}>
                <Link
                    href="/notifications"
                    className={styles.viewAll}
                    onClick={closeDropdown}
                >
                    View All Notifications
                </Link>
            </div>
        </div>
    );
}