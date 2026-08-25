'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from './help.module.css';

export default function HelpPage() {

    const [search, setSearch] = useState('');

    const faqs = [
        {
            question: 'How do I update my profile?',
            answer:
                'Go to My Profile from the left sidebar. You can update your name, profession, company, profile image and other available profile information.'
        },

        {
            question: 'How do I create a post?',
            answer:
                'Use the Create Post section on the home page. You can create discussions, questions and other supported post types.'
        },

        {
            question: 'How can I save a post?',
            answer:
                'Open the post and use the Save option. Your saved posts can be accessed from Saved Posts in the left sidebar.'
        },

        {
            question: 'How do I find customs or HS Code information?',
            answer:
                'Use the Documentation, HS Codes and search features available on LynkToday to find relevant trade and customs information.'
        },

        {
            question: 'How do I change my password?',
            answer:
                'Go to Settings → Privacy & Security → Change Password.'
        },

        {
            question: 'How do I delete my account?',
            answer:
                'Go to Settings → Privacy & Security → Delete Account. You will be asked to confirm the deletion before the account can be removed.'
        }
    ];


    const filteredFaqs =
        faqs.filter(item => {

            const text =
                `${item.question} ${item.answer}`
                    .toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    return (

        <main className={styles.page}>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className={styles.header}>

                <div>

                    <h1>
                        Help & Support
                    </h1>

                    <p>
                        Find answers, learn how LynkToday
                        works, or get help from our support team.
                    </p>

                </div>


                <Link
                    href="/settings"
                    className={styles.backButton}
                >
                    ← Settings
                </Link>

            </div>


            {/* ==================================================
                SEARCH
            ================================================== */}


            {/* ==================================================
                QUICK HELP
            ================================================== */}

            {/* <section className={styles.section}>

                <h2>
                    Popular Topics
                </h2>

                <div className={styles.topicGrid}>

                    <Link
                        href="/profile"
                        className={styles.topicCard}
                    >

                        <span>
                            👤
                        </span>

                        <div>

                            <h3>
                                Account & Profile
                            </h3>

                            <p>
                                Manage your profile and
                                account information.
                            </p>

                        </div>

                    </Link>


                    <Link
                        href="/"
                        className={styles.topicCard}
                    >

                        <span>
                            📝
                        </span>

                        <div>

                            <h3>
                                Posts & Discussions
                            </h3>

                            <p>
                                Learn about posts,
                                questions and discussions.
                            </p>

                        </div>

                    </Link>


                    <Link
                        href="/messages"
                        className={styles.topicCard}
                    >

                        <span>
                            💬
                        </span>

                        <div>

                            <h3>
                                Messages
                            </h3>

                            <p>
                                Get help with messaging
                                and conversations.
                            </p>

                        </div>

                    </Link>


                    <Link
                        href="/hs-codes"
                        className={styles.topicCard}
                    >

                        <span>
                            📦
                        </span>

                        <div>

                            <h3>
                                HS Codes
                            </h3>

                            <p>
                                Find information about
                                HS classification.
                            </p>

                        </div>

                    </Link>


                    <Link
                        href="/documentation"
                        className={styles.topicCard}
                    >

                        <span>
                            📚
                        </span>

                        <div>

                            <h3>
                                Documentation
                            </h3>

                            <p>
                                Browse trade and customs
                                documentation.
                            </p>

                        </div>

                    </Link>


                    <Link
                        href="/"
                        className={styles.topicCard}
                    >

                        <span>
                            🚢
                        </span>

                        <div>

                            <h3>
                                Import & Export
                            </h3>

                            <p>
                                Explore import, export and
                                logistics discussions.
                            </p>

                        </div>

                    </Link>

                </div>

            </section> */}


            {/* ==================================================
                FAQ
            ================================================== */}

            <section className={styles.section}>

                <h2>
                    Frequently Asked Questions
                </h2>


                <div className={styles.faqList}>

                    {filteredFaqs.length > 0 ? (

                        filteredFaqs.map(
                            (faq, index) => (

                                <details
                                    key={index}
                                    className={styles.faq}
                                >

                                    <summary>

                                        {faq.question}

                                        <span>
                                            +
                                        </span>

                                    </summary>


                                    <p>
                                        {faq.answer}
                                    </p>

                                </details>

                            )

                        )

                    ) : (

                        <div className={styles.noResults}>

                            <span>
                                🔍
                            </span>

                            <h3>
                                No results found
                            </h3>

                            <p>
                                Try searching with different
                                keywords.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* ==================================================
                CONTACT SUPPORT
            ================================================== */}

            <section className={styles.supportCard}>

                <div className={styles.supportIcon}>
                    💬
                </div>

                <div className={styles.supportContent}>

                    <h2>
                        Still need help?
                    </h2>

                    <p>
                        If you couldn't find what you were
                        looking for, contact the LynkToday
                        support team.
                    </p>


                    <div className={styles.supportActions}>

                        <a
                            href="mailto:support@lynktoday.com"
                            className={styles.primaryButton}
                        >
                            ✉ Email Support
                        </a>


                        <a
                            href="mailto:support@lynktoday.com?subject=LynkToday%20Support%20Request"
                            className={styles.secondaryButton}
                        >
                            Report a Problem
                        </a>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className={styles.footer}>

                <Link href="/privacy-policy">
                    Privacy Policy
                </Link>


                <Link href="/terms">
                    Terms & Conditions
                </Link>


                {/* ==================================================
                    SOCIAL LINKS
                ================================================== */}

                <a
                    href="https://www.instagram.com/lynktoday"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow LynkToday on Instagram"
                >
                    Instagram
                </a>


                <a
                    href="https://www.facebook.com/share/19NLFCVVLM/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow LynkToday on Facebook"
                >
                    Facebook
                </a>


                <Link href="/">
                    Back to LynkToday
                </Link>

            </div>

        </main>

    );

}