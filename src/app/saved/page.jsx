'use client';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';
import SavedPosts from '@/components/home/SavedPosts/SavedPosts';

import styles from '../page.module.css';

export default function SavedPostsPage() {
    return (
        <main className={styles.container}>

            <aside className={styles.left}>
                <LeftSidebar />
            </aside>


            <section
                className={styles.center}
                aria-label="Saved posts"
            >
                <SavedPosts />
            </section>


            <aside className={styles.right}>
                <RightSidebar />
            </aside>

        </main>
    );
}