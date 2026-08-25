'use client';

import Link from 'next/link';

import styles from './page.module.css';

export default function PrivacyPolicyPage() {

    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ==================================================
                    BACK
                ================================================== */}

                <Link
                    href="/settings"
                    className={styles.backButton}
                >
                    ← Back to Settings
                </Link>


                {/* ==================================================
                    HEADER
                ================================================== */}

                <header className={styles.header}>

                    <span className={styles.label}>
                        LEGAL
                    </span>


                    <h1>
                        Privacy Policy
                    </h1>


                    <p>
                        How LynkToday collects, uses and protects
                        your information.
                    </p>


                    <div className={styles.updated}>
                        Last updated: 25 August 2026
                    </div>

                </header>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <article className={styles.content}>

                    {/* ==================================================
                        1. INTRODUCTION
                    ================================================== */}

                    <section>

                        <h2>
                            1. Introduction
                        </h2>

                        <p>
                            Welcome to LynkToday. We respect your
                            privacy and are committed to protecting
                            the information you provide while using
                            our platform.
                        </p>

                        <p>
                            This Privacy Policy explains how
                            information may be collected, used and
                            protected when you use LynkToday.
                        </p>

                    </section>


                    {/* ==================================================
                        2. WHO WE ARE
                    ================================================== */}

                    <section>

                        <h2>
                            2. Who We Are
                        </h2>

                        <p>
                            LynkToday is a professional networking
                            and information platform focused on
                            trade, customs, shipping, freight
                            forwarding, logistics and related
                            professional knowledge.
                        </p>

                        <p>
                            LynkToday is operated and maintained by
                            <strong> DAG Technologies</strong>.
                        </p>

                    </section>


                    {/* ==================================================
                        3. INFORMATION WE COLLECT
                    ================================================== */}

                    <section>

                        <h2>
                            3. Information We Collect
                        </h2>

                        <p>
                            Depending on how you use LynkToday,
                            information may include:
                        </p>

                        <ul>

                            <li>
                                Name and profile information
                            </li>

                            <li>
                                Email address
                            </li>

                            <li>
                                Professional information
                            </li>

                            <li>
                                Company information
                            </li>

                            <li>
                                Location information provided by you
                            </li>

                            <li>
                                Posts, comments and other content
                                you submit
                            </li>

                            <li>
                                Account and authentication
                                information
                            </li>

                        </ul>

                    </section>


                    {/* ==================================================
                        4. HOW WE USE INFORMATION
                    ================================================== */}

                    <section>

                        <h2>
                            4. How We Use Information
                        </h2>

                        <p>
                            Information may be used to:
                        </p>

                        <ul>

                            <li>
                                Provide and operate LynkToday
                            </li>

                            <li>
                                Create and manage user accounts
                            </li>

                            <li>
                                Display professional profiles
                            </li>

                            <li>
                                Provide search and discovery
                                features
                            </li>

                            <li>
                                Allow users to create posts and
                                documentation
                            </li>

                            <li>
                                Improve platform functionality
                                and security
                            </li>

                            <li>
                                Respond to support requests
                            </li>

                        </ul>

                    </section>


                    {/* ==================================================
                        5. USER CONTENT
                    ================================================== */}

                    <section>

                        <h2>
                            5. User Content
                        </h2>

                        <p>
                            Content that you voluntarily publish on
                            LynkToday, such as posts, comments and
                            documentation, may be visible to other
                            users depending on the applicable
                            visibility settings.
                        </p>

                        <p>
                            Please avoid publishing confidential,
                            sensitive or proprietary information
                            that you do not want to make available
                            to other users.
                        </p>

                    </section>


                    {/* ==================================================
                        6. IMAGES AND FILE UPLOADS
                    ================================================== */}

                    <section>

                        <h2>
                            6. Images and File Uploads
                        </h2>

                        <p>
                            Image and file uploads are currently not
                            available in the present version of
                            LynkToday.
                        </p>

                        <p>
                            File and image upload functionality may
                            be introduced in a future version. If
                            introduced, this Privacy Policy may be
                            updated to explain how those files are
                            handled.
                        </p>

                    </section>


                    {/* ==================================================
                        7. COOKIES AND LOCAL STORAGE
                    ================================================== */}

                    <section>

                        <h2>
                            7. Cookies and Local Storage
                        </h2>

                        <p>
                            LynkToday may use browser storage
                            mechanisms to maintain authentication,
                            preferences and other functionality
                            required for the platform to operate.
                        </p>

                    </section>


                    {/* ==================================================
                        8. SECURITY
                    ================================================== */}

                    <section>

                        <h2>
                            8. Security
                        </h2>

                        <p>
                            We take reasonable measures to protect
                            information associated with LynkToday
                            accounts. However, no internet-based
                            service can guarantee absolute security.
                        </p>

                    </section>


                    {/* ==================================================
                        9. THIRD-PARTY SERVICES
                    ================================================== */}

                    <section>

                        <h2>
                            9. Third-Party Services
                        </h2>

                        <p>
                            LynkToday may use third-party services
                            for infrastructure, authentication,
                            analytics or other platform functions.
                            Such services may process information
                            according to their own privacy policies.
                        </p>

                    </section>


                    {/* ==================================================
                        10. YOUR CHOICES
                    ================================================== */}

                    <section>

                        <h2>
                            10. Your Choices
                        </h2>

                        <p>
                            You may review and update certain
                            information through your account and
                            profile settings.
                        </p>

                        <p>
                            If you have questions about your
                            information or account, please contact
                            LynkToday support.
                        </p>

                    </section>


                    {/* ==================================================
                        11. CHANGES TO THIS POLICY
                    ================================================== */}

                    <section>

                        <h2>
                            11. Changes to This Policy
                        </h2>

                        <p>
                            We may update this Privacy Policy as
                            LynkToday develops new features or
                            changes its services.
                        </p>

                        <p>
                            The updated version will be made
                            available on this page.
                        </p>

                    </section>


                    {/* ==================================================
                        12. CONTACT
                    ================================================== */}

                    <section>

                        <h2>
                            12. Contact
                        </h2>

                        <p>
                            If you have questions regarding this
                            Privacy Policy, please contact the
                            LynkToday support team.
                        </p>

                    </section>

                </article>


                {/* ==================================================
                    FOOTER LINKS
                ================================================== */}

                <div className={styles.footerLinks}>

                    <Link
                        href="/settings/terms"
                    >
                        Terms & Conditions →
                    </Link>


                    <Link
                        href="/settings"
                    >
                        Settings →
                    </Link>

                </div>

            </div>

        </main>

    );

}