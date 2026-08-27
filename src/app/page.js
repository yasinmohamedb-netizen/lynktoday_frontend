'use client';

import { useEffect, useState } from 'react';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import CreatePost from '@/components/home/CreatePost/CreatePost';
import Feed from '@/components/home/Feed/Feed';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './page.module.css';

export default function HomePage() {

    const [user, setUser] = useState(null);

    const [authChecked, setAuthChecked] =
        useState(false);

    const [leftOpen, setLeftOpen] =
        useState(false);

    const [rightOpen, setRightOpen] =
        useState(false);


    // ==================================================
    // AUTH CHECK
    // ==================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );

            const token =
                localStorage.getItem(
                    'lynktoday_token'
                );


            if (!storedUser || !token) {

                setUser(null);

                return;

            }


            try {

                setUser(
                    JSON.parse(storedUser)
                );

            } catch {

                localStorage.removeItem(
                    'lynktoday_user'
                );

                localStorage.removeItem(
                    'lynktoday_token'
                );

                setUser(null);

            }

        } catch {

            setUser(null);

        } finally {

            setAuthChecked(true);

        }

    }, []);


    // ==================================================
    // CLOSE DRAWERS
    // ==================================================

    const closeDrawers = () => {

        setLeftOpen(false);

        setRightOpen(false);

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (!authChecked) {

        return (

            <main
                className={
                    styles.container
                }
            >

                <section
                    className={
                        styles.center
                    }
                >

                    <div
                        className={
                            styles.loading
                        }
                    >
                        Loading...
                    </div>

                </section>

            </main>

        );

    }


    return (

        <>

            {/* ==================================================
                MOBILE OVERLAY
            ================================================== */}

            {(leftOpen || rightOpen) && (

                <button
                    type="button"
                    aria-label="Close sidebar"
                    className={
                        styles.mobileOverlay
                    }
                    onClick={
                        closeDrawers
                    }
                />

            )}


            {/* ==================================================
                MOBILE LEFT DRAWER
            ================================================== */}

            {user && (

                <aside
                    className={`
                        ${styles.mobileDrawer}
                        ${styles.mobileLeft}
                        ${leftOpen
                            ? styles.drawerOpen
                            : ''}
                    `}
                >

                    <div
                        className={
                            styles.drawerHeader
                        }
                    >

                        <strong>
                        My Space
                        </strong>

                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() =>
                                setLeftOpen(false)
                            }
                        >
                            ×
                        </button>

                    </div>


                    <div
                        className={
                            styles.drawerContent
                        }
                    >

                        <LeftSidebar />

                    </div>

                </aside>

            )}


            {/* ==================================================
                MOBILE RIGHT DRAWER
            ================================================== */}

            <aside
                className={`
                    ${styles.mobileDrawer}
                    ${styles.mobileRight}
                    ${rightOpen
                        ? styles.drawerOpen
                        : ''}
                `}
            >

                <div
                    className={
                        styles.drawerHeader
                    }
                >

                    <strong>
                        Explore
                    </strong>

                    <button
                        type="button"
                        aria-label="Close explore"
                        onClick={() =>
                            setRightOpen(false)
                        }
                    >
                        ×
                    </button>

                </div>


                <div
                    className={
                        styles.drawerContent
                    }
                >

                    <RightSidebar />

                </div>

            </aside>


            {/* ==================================================
                MAIN DESKTOP LAYOUT
            ================================================== */}

            <main
                className={`
                    ${styles.container}
                    ${!user
                        ? styles.loggedOut
                        : ''}
                `}
            >

                {/* ==================================================
                    DESKTOP LEFT SIDEBAR
                ================================================== */}

                {user && (

                    <aside
                        className={
                            styles.left
                        }
                    >

                        <LeftSidebar />

                    </aside>

                )}


                {/* ==================================================
                    CENTER
                ================================================== */}

                <section
                    className={
                        styles.center
                    }
                >

                    {/* ==================================================
                        MOBILE SIDEBAR BUTTONS
                    ================================================== */}

                    <div
                        className={
                            styles.mobileActions
                        }
                    >

                        {user && (

                            <button
                                type="button"
                                className={
                                    styles.mobileAction
                                }
                                onClick={() =>
                                    setLeftOpen(true)
                                }
                            >

                                <span>
                                    ☰
                                </span>

                                My Space

                            </button>

                        )}


                        <button
                            type="button"
                            className={
                                styles.mobileAction
                            }
                            onClick={() =>
                                setRightOpen(true)
                            }
                        >

                            <span>
                                🔥
                            </span>

                            Trending

                        </button>

                    </div>


                    {/* ==================================================
                        CREATE POST
                    ================================================== */}

                    {user && (

                        <CreatePost />

                    )}


                    {/* ==================================================
                        FEED
                    ================================================== */}

                    <Feed />

                </section>


                {/* ==================================================
                    DESKTOP RIGHT SIDEBAR
                ================================================== */}

                <aside
                    className={
                        styles.right
                    }
                >

                    <RightSidebar />

                </aside>

            </main>

        </>

    );

}