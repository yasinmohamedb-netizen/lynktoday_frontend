'use client';

import NotificationList from '@/components/home/Notifications/NotificationList';
import styles from './notifications.module.css';

export default function NotificationsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.content}>
                <NotificationList />
            </div>
        </main>
    );
}
