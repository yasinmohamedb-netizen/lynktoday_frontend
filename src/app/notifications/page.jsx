'use client';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';
import NotificationList from '@/components/home/Notifications/NotificationList';
import styles from './notifications.module.css';

export default function NotificationsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.layout}>
                <aside className={styles.leftSidebar}>
                    <LeftSidebar />
                </aside>

                <section className={styles.content}>
                    <NotificationList />
                </section>

                <aside className={styles.rightSidebar}>
                    <RightSidebar />
                </aside>
            </div>
        </main>
    );
}
