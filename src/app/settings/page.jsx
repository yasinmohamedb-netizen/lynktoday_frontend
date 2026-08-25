'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import styles from './settings.module.css';


export default function SettingsPage() {

    const [user, setUser] = useState(null);


    // ==================================================
    // LOAD USER
    // ==================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );


            if (storedUser) {

                setUser(
                    JSON.parse(
                        storedUser
                    )
                );

            }

        } catch (error) {

            console.error(
                'Failed to load user:',
                error
            );

        }

    }, []);


    // ==================================================
    // LOGOUT
    // ==================================================

    const handleLogout = () => {

        localStorage.removeItem(
            'lynktoday_user'
        );


        localStorage.removeItem(
            'lynktoday_token'
        );


        window.location.href =
            '/login';

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <main className={styles.page}>

            {/* ==================================================
                LEFT SIDEBAR
            ================================================== */}

            <aside
                className={
                    styles.leftSidebar
                }
            >

                <LeftSidebar />

            </aside>


            {/* ==================================================
                CENTER CONTENT
            ================================================== */}

            <section
                className={
                    styles.centerContent
                }
            >

                <div
                    className={
                        styles.contentContainer
                    }
                >

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div
                        className={
                            styles.header
                        }
                    >

                        <div>

                            <h1>
                                Settings
                            </h1>


                            <p>
                                Manage your LynkToday account,
                                privacy and support options.
                            </p>

                        </div>


                        <Link
                            href="/"
                            className={
                                styles.backButton
                            }
                        >
                            ← Back to Home
                        </Link>

                    </div>


                    {/* ==================================================
                        ACCOUNT
                    ================================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <h2>
                            Account
                        </h2>


                        <p
                            className={
                                styles.sectionDescription
                            }
                        >
                            Manage your profile and account
                            information.
                        </p>


                        <Link
                            href="/profile"
                            className={
                                styles.settingItem
                            }
                        >

                            <div
                                className={
                                    styles.icon
                                }
                            >
                                👤
                            </div>


                            <div
                                className={
                                    styles.content
                                }
                            >

                                <h3>
                                    Manage Account
                                </h3>


                                <p>
                                    Update your name,
                                    profile, profession,
                                    company and account
                                    information.
                                </p>

                            </div>


                            <span
                                className={
                                    styles.arrow
                                }
                            >
                                →
                            </span>

                        </Link>

                    </section>


                    {/* ==================================================
                        PRIVACY & SECURITY
                    ================================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <h2>
                            Privacy & Security
                        </h2>


                        <p
                            className={
                                styles.sectionDescription
                            }
                        >
                            Manage your password, privacy
                            and account security.
                        </p>


                        <Link
                            href="/settings/privacy"
                            className={
                                styles.settingItem
                            }
                        >

                            <div
                                className={
                                    styles.icon
                                }
                            >
                                🔒
                            </div>


                            <div
                                className={
                                    styles.content
                                }
                            >

                                <h3>
                                    Privacy & Security
                                </h3>


                                <p>
                                    Change your password,
                                    review security options
                                    or delete your account.
                                </p>

                            </div>


                            <span
                                className={
                                    styles.arrow
                                }
                            >
                                →
                            </span>

                        </Link>

                    </section>


                    {/* ==================================================
                        HELP & SUPPORT
                    ================================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <h2>
                            Help & Support
                        </h2>


                        <p
                            className={
                                styles.sectionDescription
                            }
                        >
                            Get help with LynkToday or
                            contact our support team.
                        </p>


                        <Link
                            href="/help"
                            className={
                                styles.settingItem
                            }
                        >

                            <div
                                className={
                                    styles.icon
                                }
                            >
                                ❓
                            </div>


                            <div
                                className={
                                    styles.content
                                }
                            >

                                <h3>
                                    Help Center & Support
                                </h3>


                                <p>
                                    Find answers to common
                                    questions, report a
                                    problem or contact
                                    LynkToday support.
                                </p>

                            </div>


                            <span
                                className={
                                    styles.arrow
                                }
                            >
                                →
                            </span>

                        </Link>

                    </section>


                    {/* ==================================================
                        MEDIA & UPLOADS
                    ================================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <h2>
                            Media & Uploads
                        </h2>


                        <p
                            className={
                                styles.sectionDescription
                            }
                        >
                            Manage files and images used
                            across your LynkToday account.
                        </p>


                        <div
                            className={
                                styles.comingSoon
                            }
                        >

                            <div
                                className={
                                    styles.comingSoonIcon
                                }
                            >
                                📎
                            </div>


                            <div
                                className={
                                    styles.comingSoonContent
                                }
                            >

                                <div
                                    className={
                                        styles.comingSoonTitle
                                    }
                                >

                                    File & Image Uploads


                                    <span>
                                        Coming Soon
                                    </span>

                                </div>


                                <p>
                                    Uploading images,
                                    documents and other
                                    files is not available
                                    in the current version
                                    of LynkToday. This feature
                                    will be improved and
                                    introduced in a later
                                    version.
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        LEGAL
                    ================================================== */}

                    <section
                        className={
                            styles.section
                        }
                    >

                        <h2>
                            Legal
                        </h2>


                        {/* ==================================================
                            PRIVACY POLICY
                        ================================================== */}

                        <Link
                            href="/settings/privacy-policy"
                            className={
                                styles.simpleItem
                            }
                        >

                            <span>
                                🔐 Privacy Policy
                            </span>


                            <span>
                                →
                            </span>

                        </Link>


                        {/* ==================================================
                            TERMS & CONDITIONS
                        ================================================== */}

                        <Link
                            href="/settings/terms"
                            className={
                                styles.simpleItem
                            }
                        >

                            <span>
                                📄 Terms & Conditions
                            </span>


                            <span>
                                →
                            </span>

                        </Link>

                    </section>


                    {/* ==================================================
                        LOGOUT
                    ================================================== */}

                    <section
                        className={
                            styles.logoutSection
                        }
                    >

                        <div>

                            <h3>
                                Sign out
                            </h3>


                            <p>
                                Sign out of your LynkToday
                                account on this device.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className={
                                styles.logoutButton
                            }
                        >
                            Logout
                        </button>

                    </section>


                    {/* ==================================================
                        USER INFO
                    ================================================== */}

                    {user && (

                        <div
                            className={
                                styles.accountInfo
                            }
                        >

                            Signed in as{' '}


                            <strong>
                                {user.fullName}
                            </strong>

                        </div>

                    )}


                    {/* ==================================================
                        POWERED BY
                    ================================================== */}

                    <div className={styles.poweredBy}>

                        Powered by DAG Technologies

                    </div>


                </div>

            </section>


            {/* ==================================================
                RIGHT SIDEBAR
            ================================================== */}

            <aside
                className={
                    styles.rightSidebar
                }
            >

                <RightSidebar />

            </aside>

        </main>

    );

}