'use client';

import Link from 'next/link';

import styles from './page.module.css';

export default function TermsPage() {

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
                        Terms & Conditions
                    </h1>


                    <p>
                        Terms governing your use of LynkToday.
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
                        1. ACCEPTANCE OF TERMS
                    ================================================== */}

                    <section>

                        <h2>
                            1. Acceptance of Terms
                        </h2>

                        <p>
                            By accessing or using LynkToday, you
                            agree to these Terms & Conditions.
                            If you do not agree with these terms,
                            please do not use the platform.
                        </p>

                    </section>


                    {/* ==================================================
                        2. ABOUT LYNKTODAY
                    ================================================== */}

                    <section>

                        <h2>
                            2. About LynkToday
                        </h2>

                        <p>
                            LynkToday is a professional community
                            platform focused on trade, customs,
                            shipping, freight forwarding, logistics
                            and related professional knowledge.
                        </p>

                        <p>
                            LynkToday is operated and maintained by
                            <strong> DAG Technologies</strong>.
                        </p>

                    </section>


                    {/* ==================================================
                        3. USER ACCOUNTS
                    ================================================== */}

                    <section>

                        <h2>
                            3. User Accounts
                        </h2>

                        <p>
                            You are responsible for maintaining the
                            accuracy of information associated with
                            your account and for keeping your account
                            credentials secure.
                        </p>

                        <p>
                            You should not impersonate another person
                            or provide misleading professional
                            information.
                        </p>

                    </section>


                    {/* ==================================================
                        4. USER CONTENT
                    ================================================== */}

                    <section>

                        <h2>
                            4. User Content
                        </h2>

                        <p>
                            Users may create posts, comments,
                            questions and documentation on
                            LynkToday.
                        </p>

                        <p>
                            You are responsible for the content you
                            publish and should ensure that you have
                            the necessary rights to publish it.
                        </p>

                    </section>


                    {/* ==================================================
                        5. PROHIBITED USE
                    ================================================== */}

                    <section>

                        <h2>
                            5. Prohibited Use
                        </h2>

                        <p>
                            You agree not to use LynkToday to:
                        </p>

                        <ul>

                            <li>
                                Publish unlawful or fraudulent content
                            </li>

                            <li>
                                Impersonate another individual or
                                organization
                            </li>

                            <li>
                                Harass or threaten other users
                            </li>

                            <li>
                                Distribute malicious software
                            </li>

                            <li>
                                Attempt to gain unauthorized access
                            </li>

                            <li>
                                Abuse or disrupt platform
                                functionality
                            </li>

                            <li>
                                Publish confidential information
                                without authorization
                            </li>

                        </ul>

                    </section>


                    {/* ==================================================
                        6. PROFESSIONAL INFORMATION
                    ================================================== */}

                    <section>

                        <h2>
                            6. Professional Information
                        </h2>

                        <p>
                            Information shared by users on LynkToday
                            may represent individual opinions,
                            experiences or professional knowledge.
                        </p>

                        <p>
                            Users should independently verify
                            information before relying on it for
                            business, customs, legal, financial or
                            regulatory decisions.
                        </p>

                    </section>


                    {/* ==================================================
                        7. HS CODES AND TRADE INFORMATION
                    ================================================== */}

                    <section>

                        <h2>
                            7. HS Codes and Trade Information
                        </h2>

                        <p>
                            HS codes, customs information, trade
                            information and documentation available
                            on LynkToday are provided as informational
                            resources.
                        </p>

                        <p>
                            Such information should not be treated as
                            a substitute for official government
                            notifications, applicable legislation,
                            professional advice or customs
                            authorities.
                        </p>

                    </section>


                    {/* ==================================================
                        8. DOCUMENTATION
                    ================================================== */}

                    <section>

                        <h2>
                            8. Documentation
                        </h2>

                        <p>
                            Documentation created by users may be
                            shared with the LynkToday community.
                            Users are responsible for ensuring that
                            their documentation is accurate,
                            appropriate and does not violate the
                            rights of others.
                        </p>

                    </section>


                    {/* ==================================================
                        9. PLATFORM AVAILABILITY
                    ================================================== */}

                    <section>

                        <h2>
                            9. Platform Availability
                        </h2>

                        <p>
                            We may modify, suspend or discontinue
                            parts of LynkToday when necessary for
                            maintenance, security, development or
                            other operational reasons.
                        </p>

                    </section>


                    {/* ==================================================
                        10. INTELLECTUAL PROPERTY
                    ================================================== */}

                    <section>

                        <h2>
                            10. Intellectual Property
                        </h2>

                        <p>
                            LynkToday branding, interface, software
                            and platform materials may be protected
                            by applicable intellectual property laws.
                        </p>

                        <p>
                            Users retain rights in content they
                            independently create, subject to the
                            permissions necessary to operate the
                            platform.
                        </p>

                    </section>


                    {/* ==================================================
                        11. ACCOUNT TERMINATION
                    ================================================== */}

                    <section>

                        <h2>
                            11. Account Termination
                        </h2>

                        <p>
                            LynkToday may restrict or terminate
                            accounts that violate these Terms,
                            applicable laws or platform rules.
                        </p>

                    </section>


                    {/* ==================================================
                        12. CHANGES TO THESE TERMS
                    ================================================== */}

                    <section>

                        <h2>
                            12. Changes to These Terms
                        </h2>

                        <p>
                            These Terms may be updated from time to
                            time as LynkToday develops and introduces
                            new functionality.
                        </p>

                        <p>
                            Continued use of the platform after
                            updated terms are published may be
                            subject to the revised terms.
                        </p>

                    </section>


                    {/* ==================================================
                        13. CONTACT
                    ================================================== */}

                    <section>

                        <h2>
                            13. Contact
                        </h2>

                        <p>
                            If you have questions regarding these
                            Terms & Conditions, please contact the
                            LynkToday support team.
                        </p>

                    </section>

                </article>


                {/* ==================================================
                    FOOTER LINKS
                ================================================== */}

                <div className={styles.footerLinks}>

                    <Link
                        href="/settings/privacy-policy"
                    >
                        Privacy Policy →
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