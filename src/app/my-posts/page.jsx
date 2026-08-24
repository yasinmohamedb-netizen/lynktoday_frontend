'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';
import MyPosts from '@/components/home/MyPosts/MyPosts';

import styles from '../page.module.css';

export default function MyPostsPage() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    // ==================================================
    // CHECK AUTHENTICATION
    // ==================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );

            const storedToken =
                localStorage.getItem(
                    'lynktoday_token'
                );

            if (
                storedUser &&
                storedToken
            ) {

                try {

                    const parsedUser =
                        JSON.parse(
                            storedUser
                        );

                    setUser(parsedUser);

                } catch (parseError) {

                    console.error(
                        'Failed to parse stored user:',
                        parseError
                    );

                    localStorage.removeItem(
                        'lynktoday_user'
                    );

                    localStorage.removeItem(
                        'lynktoday_token'
                    );

                    setUser(null);

                }

            } else {

                setUser(null);

            }

        } catch (error) {

            console.error(
                'Authentication check failed:',
                error
            );

            setUser(null);

        } finally {

            setAuthChecked(true);

        }

    }, []);


    // ==================================================
    // AUTH LOADING
    // ==================================================

    if (!authChecked) {

        return (

            <main className={styles.container}>

                <section className={styles.center}>

                    <div
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '40px',
                            textAlign: 'center',
                            color: '#64748b'
                        }}
                    >
                        Loading...
                    </div>

                </section>

            </main>

        );

    }


    // ==================================================
    // NOT LOGGED IN
    // ==================================================

    if (!user) {

        return (

            <main className={styles.container}>

                <section className={styles.center}>

                    <div
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                    >

                        <h2
                            style={{
                                margin: '0 0 10px',
                                color: '#111827'
                            }}
                        >
                            Sign in required
                        </h2>

                        <p
                            style={{
                                margin: '0 0 20px',
                                color: '#64748b'
                            }}
                        >
                            Please sign in to view your posts.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push('/login')
                            }
                            style={{
                                border: 'none',
                                borderRadius: '8px',
                                padding: '11px 20px',
                                background: '#2563eb',
                                color: '#ffffff',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Sign In
                        </button>

                    </div>

                </section>

            </main>

        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <main className={styles.container}>

            {/* ==========================================
                LEFT SIDEBAR
            ========================================== */}

            <aside className={styles.left}>

                <LeftSidebar />

            </aside>


            {/* ==========================================
                CENTER
            ========================================== */}

            <section className={styles.center}>

                <MyPosts />

            </section>


            {/* ==========================================
                RIGHT SIDEBAR
            ========================================== */}

            <aside className={styles.right}>

                <RightSidebar />

            </aside>

        </main>

    );

}