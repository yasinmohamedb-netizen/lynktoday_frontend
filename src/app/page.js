'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import CreatePost from '@/components/home/CreatePost/CreatePost';
import Feed from '@/components/home/Feed/Feed';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './page.module.css';

export default function HomePage() {

    const router = useRouter();

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
    // REDIRECT NEW / LOGGED-OUT VISITORS TO LOGIN
    // ==================================================

    useEffect(() => {
        if (authChecked && !user) {
            router.replace('/login');
        }
    }, [authChecked, user, router]);


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
                        TRADE NETWORK HERO
                    ================================================== */}

                    {user && (
                        <section className={styles.tradeHero}>
                            <div className={styles.tradeHeroCopy}>
                                <span className={styles.tradeHeroEyebrow}>
                                    BUILD YOUR TRADE NETWORK
                                </span>
                                <h1>Connect. Trade. Grow.</h1>
                                <p>
                                    Find importers, exporters and logistics partners,
                                    or publish a requirement and find the right support.
                                </p>
                                <div className={styles.tradeHeroTags}>
                                    <span>Importers</span>
                                    <span>Exporters</span>
                                    <span>Customs Brokers</span>
                                    <span>Freight Forwarders</span>
                                    <span>Transporters</span>
                                </div>
                            </div>
                            <a href="/trade-requirements" className={styles.tradeHeroAction}>
                                <strong>Find Trade Opportunities</strong>
                                <span>See current requirements →</span>
                            </a>
                        </section>
                    )}


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