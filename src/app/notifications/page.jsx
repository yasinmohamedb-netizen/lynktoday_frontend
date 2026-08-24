'use client';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';
import NotificationList from '@/components/home/Notifications/NotificationList';

import styles from '../page.module.css';

export default function NotificationsPage() {
    return (
        <main className={styles.container}>

            {/* LEFT SIDEBAR */}

            <aside className={styles.left}>
                <LeftSidebar />
            </aside>


            {/* NOTIFICATIONS */}

            <section
                className={styles.center}
                aria-label="Notifications"
            >
                <NotificationList />
            </section>


            {/* RIGHT SIDEBAR */}

            <aside className={styles.right}>
                <RightSidebar />
            </aside>

        </main>
    );
}