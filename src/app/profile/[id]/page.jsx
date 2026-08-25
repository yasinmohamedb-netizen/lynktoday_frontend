'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import api from '@/utils/api';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import ProfileHeader from '@/components/home/Profile/ProfileHeader';
import ProfileAbout from '@/components/home/Profile/ProfileAbout';
import ProfileSkills from '@/components/home/Profile/ProfileSkills';
import ProfilePosts from '@/components/home/Profile/ProfilePosts';

import styles from './page.module.css';

export default function PublicProfilePage() {
    const params = useParams();

    const userId = params?.id;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const { data } = await api.get(
                    `/profile/${userId}`
                );

                if (!data?.success || !data?.user) {
                    throw new Error(
                        data?.message ||
                        'Unable to load profile.'
                    );
                }

                if (!cancelled) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error(
                    'Public profile error:',
                    error
                );

                if (!cancelled) {
                    setUser(null);

                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        'Unable to load profile.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const handleFollowChange = (changedUserId, data) => {
        if (
            !user ||
            String(user._id) !== String(changedUserId)
        ) {
            return;
        }

        setUser((currentUser) => ({
            ...currentUser,

            isFollowing: Boolean(
                data?.following
            ),

            followersCount: Number(
                data?.followersCount ??
                currentUser.followersCount ??
                0
            ),

            followingCount: Number(
                data?.followingCount ??
                currentUser.followingCount ??
                0
            )
        }));
    };

    const renderLayout = (content) => (
        <main className={styles.container}>

            <aside className={styles.left}>
                <LeftSidebar />
            </aside>

            <section className={styles.center}>
                {content}
            </section>

            <aside className={styles.right}>
                <RightSidebar />
            </aside>

        </main>
    );

    if (loading) {
        return renderLayout(
            <div className={styles.stateCard}>

                <div className={styles.loadingIndicator}>
                    <span />
                </div>

                <h2>
                    Loading profile
                </h2>

                <p>
                    Please wait while we load
                    this profile.
                </p>

            </div>
        );
    }

    if (error) {
        return renderLayout(
            <div className={styles.stateCard}>

                <div
                    className={`${styles.stateIcon} ${styles.errorIcon}`}
                >
                    !
                </div>

                <h2>
                    Unable to load profile
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        window.location.reload()
                    }
                    className={styles.primaryButton}
                >
                    Try Again
                </button>

            </div>
        );
    }

    if (!user) {
        return renderLayout(
            <div className={styles.stateCard}>

                <div
                    className={`${styles.stateIcon} ${styles.notFoundIcon}`}
                >
                    ?
                </div>

                <h2>
                    Profile not found
                </h2>

                <p>
                    This profile may have been
                    removed or is no longer available.
                </p>

            </div>
        );
    }

    return (
        <main className={styles.container}>

            <aside className={styles.left}>
                <LeftSidebar />
            </aside>


            <section className={styles.center}>

                <ProfileHeader
                    user={user}
                    isOwnProfile={false}
                    onFollowChange={
                        handleFollowChange
                    }
                />


                <ProfileAbout
                    user={user}
                />


                {user.accountType === 'individual' && (
                    <ProfileSkills
                        user={user}
                    />
                )}


                {user.accountType === 'company' && (
                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div>

                                <h2>
                                    Company Information
                                </h2>

                                <p>
                                    Business and contact details
                                </p>

                            </div>

                        </div>


                        <div className={styles.infoGrid}>

                            <div className={styles.infoItem}>

                                <span>
                                    Business Type
                                </span>

                                <strong>
                                    {user.profession ||
                                        'Not specified'}
                                </strong>

                            </div>


                            <div className={styles.infoItem}>

                                <span>
                                    Website
                                </span>

                                {user.website ? (

                                    <a
                                        href={
                                            user.website.startsWith(
                                                'http://'
                                            ) ||
                                            user.website.startsWith(
                                                'https://'
                                            )
                                                ? user.website
                                                : `https://${user.website}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={
                                            styles.website
                                        }
                                    >
                                        {user.website}
                                    </a>

                                ) : (

                                    <strong>
                                        Not specified
                                    </strong>

                                )}

                            </div>


                            <div className={styles.infoItem}>

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {user.phone ||
                                        'Not specified'}
                                </strong>

                            </div>


                            <div className={styles.infoItem}>

                                <span>
                                    Location
                                </span>

                                <strong>
                                    {user.location ||
                                        'Not specified'}
                                </strong>

                            </div>

                        </div>

                    </section>
                )}


                <ProfilePosts
                    userId={user._id}
                />


                {/* ==================================================
                    LYNKTODAY SOCIAL LINKS
                ================================================== */}

                <section className={styles.card}>

                    <div className={styles.cardHeader}>

                        <div>

                            <h2>
                                Follow LynkToday
                            </h2>

                            <p>
                                Stay connected with LynkToday
                                for updates, industry insights
                                and community news.
                            </p>

                        </div>

                    </div>


                    <div className={styles.infoGrid}>

                        <a
                            href="https://www.instagram.com/lynktoday"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.website}
                            aria-label="Follow LynkToday on Instagram"
                        >
                            Instagram
                        </a>


                        <a
                            href="https://www.facebook.com/share/19NLFCVVLM/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.website}
                            aria-label="Follow LynkToday on Facebook"
                        >
                            Facebook
                        </a>

                    </div>

                </section>

            </section>


            <aside className={styles.right}>
                <RightSidebar />
            </aside>

        </main>
    );
}