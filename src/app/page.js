'use client';

import { useEffect, useState } from 'react';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import CreatePost from '@/components/home/CreatePost/CreatePost';
import Feed from '@/components/home/Feed/Feed';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './page.module.css';

export default function HomePage() {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem('lynktoday_user');

            const storedToken =
                localStorage.getItem('lynktoday_token');

            if (!storedUser || !storedToken) {
                setUser(null);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser);

                setUser(parsedUser);
            } catch (error) {
                console.error(
                    'Failed to parse stored user:',
                    error
                );

                localStorage.removeItem('lynktoday_user');
                localStorage.removeItem('lynktoday_token');

                setUser(null);
            }
        } catch (error) {
            console.error(
                'Failed to check authentication:',
                error
            );

            setUser(null);
        } finally {
            setAuthChecked(true);
        }
    }, []);

    if (!authChecked) {
        return (
            <main className={styles.container}>
                <section className={styles.center}>
                    <div className={styles.loading}>
                        Loading...
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main
            className={`${styles.container} ${
                !user ? styles.loggedOut : ''
            }`}
        >
            {user && (
                <aside className={styles.left}>
                    <LeftSidebar />
                </aside>
            )}

            <section className={styles.center}>
                {user && <CreatePost />}

                <Feed />
            </section>

            <aside className={styles.right}>
                <RightSidebar />
            </aside>
        </main>
    );
}