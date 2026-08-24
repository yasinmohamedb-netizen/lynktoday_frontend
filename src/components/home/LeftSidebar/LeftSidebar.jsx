'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './LeftSidebar.module.css';

export default function LeftSidebar() {

    const [user, setUser] = useState(null);

    /* =====================================================
       LOAD USER
    ===================================================== */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem('lynktoday_user');

            if (!storedUser) {
                return;
            }

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);

        } catch (error) {

            console.error(
                'Failed to load user:',
                error
            );

        }

    }, []);


    /* =====================================================
       PROFILE IMAGE
    ===================================================== */

    const profileImage = (() => {

        if (!user?.profileImage) {
            return null;
        }

        if (
            user.profileImage.startsWith('http')
        ) {
            return user.profileImage;
        }

        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:5001/api/v1';

        const baseUrl =
            apiUrl.replace('/api/v1', '');

        return `${baseUrl}${user.profileImage}`;

    })();


    /* =====================================================
       USER INITIALS
    ===================================================== */

    const getInitials = () => {

        const name =
            user?.fullName?.trim();

        if (!name) {
            return 'L';
        }

        const parts =
            name.split(/\s+/);

        if (parts.length === 1) {

            return parts[0]
                .charAt(0)
                .toUpperCase();

        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <aside className={styles.sidebar}>

            {/* =================================================
               PROFILE CARD
            ================================================= */}

            <section className={styles.profileCard}>

                <div className={styles.profileHeader}>

                    {profileImage ? (

                        <img
                            src={profileImage}
                            alt={
                                user?.fullName ||
                                'LynkToday Member'
                            }
                            className={styles.profileImage}
                        />

                    ) : (

                        <div
                            className={styles.avatar}
                            aria-hidden="true"
                        >
                            {getInitials()}
                        </div>

                    )}

                </div>


                <div className={styles.profileDetails}>

                    <h3 className={styles.profileName}>
                        {user?.fullName ||
                            'LynkToday Member'}
                    </h3>


                    <p className={styles.designation}>
                        {user?.designation ||
                            user?.profession ||
                            'Trade Professional'}
                    </p>


                    {user?.companyName && (

                        <p className={styles.company}>
                            {user.companyName}
                        </p>

                    )}


                    <div className={styles.location}>

                        <span
                            className={
                                styles.locationIndicator
                            }
                            aria-hidden="true"
                        />

                        <span>
                            {user?.location ||
                                'Worldwide'}
                        </span>

                    </div>


                    <div
                        className={
                            user?.isVerified
                                ? styles.verifiedBadge
                                : styles.memberBadge
                        }
                    >

                        <span
                            className={
                                user?.isVerified
                                    ? styles.statusDotVerified
                                    : styles.statusDotMember
                            }
                            aria-hidden="true"
                        />

                        <span>
                            {user?.isVerified
                                ? 'Verified Professional'
                                : 'Community Member'}
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
               QUICK ACCESS
            ================================================= */}

            <section className={styles.menuCard}>

                <div className={styles.menuHeader}>

                    <h4>
                        Quick Access
                    </h4>

                </div>


                <nav
                    className={styles.menu}
                    aria-label="Quick Access"
                >

                    {/* =========================================
                       MY PROFILE
                    ========================================= */}

                    <Link
                        href="/profile"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <path
                                    d="M20 21a8 8 0 0 0-16 0"
                                />

                                <circle
                                    cx="12"
                                    cy="7"
                                    r="4"
                                />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            My Profile
                        </span>

                    </Link>


                    {/* =========================================
                       MY POSTS
                    ========================================= */}

                    <Link
                        href="/my-posts"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <path d="M4 5h16" />

                                <path d="M4 12h16" />

                                <path d="M4 19h10" />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            My Posts
                        </span>

                    </Link>


                    {/* =========================================
                       SAVED POSTS
                    ========================================= */}

                    <Link
                        href="/saved"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <path
                                    d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z"
                                />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            Saved Posts
                        </span>

                    </Link>


                    {/* =========================================
                       MESSAGES
                    ========================================= */}

                    <Link
                        href="/messages"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <path
                                    d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.95L4 20l1.45-3.45A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"
                                />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            Messages
                        </span>

                    </Link>


                    {/* =========================================
                       NOTIFICATIONS
                    ========================================= */}

                    <Link
                        href="/notifications"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <path
                                    d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                                />

                                <path d="M10 21h4" />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            Notifications
                        </span>

                    </Link>


                    {/* =========================================
                       DISCOVER
                    ========================================= */}

                    <Link
                        href="/discover"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="8"
                                />

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="3"
                                />

                                <path d="M17.5 6.5 15 9" />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            Discover Professionals
                        </span>

                    </Link>


                    {/* =========================================
                       SETTINGS
                    ========================================= */}

                    <Link
                        href="/settings"
                        className={styles.menuItem}
                    >

                        <span
                            className={styles.menuIcon}
                            aria-hidden="true"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="3"
                                />

                                <path
                                    d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V22h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 17a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 12a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.73 7.2V7h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 12c.2.63.78 1.03 1.44 1.03H21v2.4h-.16c-.66 0-1.24.4-1.44 1.03Z"
                                />

                            </svg>

                        </span>

                        <span className={styles.menuLabel}>
                            Settings
                        </span>

                    </Link>

                </nav>

            </section>

        </aside>

    );

}