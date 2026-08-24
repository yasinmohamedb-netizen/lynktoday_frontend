'use client';

import { useEffect, useState } from 'react';

import api from '@/utils/api';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';

import ProfileHeader from '@/components/home/Profile/ProfileHeader';
import ProfileAbout from '@/components/home/Profile/ProfileAbout';
import ProfileSkills from '@/components/home/Profile/ProfileSkills';
import ProfilePosts from '@/components/home/Profile/ProfilePosts';

import styles from './page.module.css';

export default function ProfilePage() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // ==================================================
    // FETCH OWN PROFILE
    // ==================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);

            setError('');


            const { data } = await api.get(
                '/profile/me'
            );


            if (data.success) {

                setUser(data.user);

            } else {

                setError(
                    data.message ||
                    'Unable to load profile.'
                );

            }

        } catch (error) {

            console.error(
                'Profile Error:',
                error.response?.data || error
            );


            setError(
                error.response?.data?.message ||
                'Unable to load profile.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // LOAD PROFILE
    // ==================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // ==================================================
    // PROFILE UPDATED
    // ==================================================

    const handleProfileUpdated = (
        updatedUser
    ) => {

        setUser(updatedUser);


        // Keep localStorage synchronized

        try {

            localStorage.setItem(
                'lynktoday_user',
                JSON.stringify(updatedUser)
            );

        } catch (error) {

            console.error(
                'Failed to update stored user:',
                error
            );

        }

    };


    // ==================================================
    // LOADING STATE
    // ==================================================

    if (loading) {

        return (

            <>

                <main
                    className={
                        styles.pageState
                    }
                >

                    <div
                        className={
                            styles.stateCard
                        }
                    >

                        <div
                            className={
                                styles.spinner
                            }
                        ></div>


                        <h3>
                            Loading profile
                        </h3>


                        <p>
                            Please wait while we load
                            your profile.
                        </p>

                    </div>

                </main>

            </>

        );

    }


    // ==================================================
    // ERROR STATE
    // ==================================================

    if (error) {

        return (

            <>

                <main
                    className={
                        styles.pageState
                    }
                >

                    <div
                        className={
                            styles.stateCard
                        }
                    >

                        <div
                            className={
                                styles.errorIcon
                            }
                        >
                            !
                        </div>


                        <h3>
                            Unable to load profile
                        </h3>


                        <p>
                            {error}
                        </p>


                        <button
                            type="button"
                            className={
                                styles.retryButton
                            }
                            onClick={
                                fetchProfile
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </>

        );

    }


    // ==================================================
    // NO USER
    // ==================================================

    if (!user) {

        return (

            <>

                <main
                    className={
                        styles.pageState
                    }
                >

                    <div
                        className={
                            styles.stateCard
                        }
                    >

                        <h3>
                            Profile not found
                        </h3>


                        <p>
                            We could not find your profile.
                        </p>

                    </div>

                </main>

            </>

        );

    }


    // ==================================================
    // PROFILE PAGE
    // ==================================================

    return (

        <>

            <main
                className={
                    styles.container
                }
            >

                {/* ==========================================
                    LEFT SIDEBAR
                ========================================== */}

                <aside
                    className={
                        styles.left
                    }
                >

                    <LeftSidebar />

                </aside>


                {/* ==========================================
                    CENTER CONTENT
                ========================================== */}

                <section
                    className={
                        styles.center
                    }
                >

                    {/* ======================================
                        PROFILE HEADER
                    ====================================== */}

                    <ProfileHeader
                        user={user}
                        isOwnProfile={true}
                        onProfileUpdated={
                            handleProfileUpdated
                        }
                    />


                    {/* ======================================
                        ABOUT
                    ====================================== */}

                    <ProfileAbout
                        user={user}
                    />


                    {/* ======================================
                        INDIVIDUAL PROFILE
                    ====================================== */}

                    {user.accountType === 'individual' && (

                        <ProfileSkills
                            user={user}
                        />

                    )}


                    {/* ======================================
                        COMPANY PROFILE
                    ====================================== */}

                    {user.accountType === 'company' && (

                        <section
                            className={
                                styles.card
                            }
                        >

                            <div
                                className={
                                    styles.cardHeader
                                }
                            >

                                <div>

                                    <h3>
                                        Company Information
                                    </h3>

                                    <p>
                                        Business and contact details
                                    </p>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.infoGrid
                                }
                            >

                                {/* Business Type */}

                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Business Type
                                    </span>

                                    <strong>

                                        {user.profession ||
                                            'Not specified'}

                                    </strong>

                                </div>


                                {/* Website */}

                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Website
                                    </span>

                                    <strong>

                                        {user.website ||
                                            'Not specified'}

                                    </strong>

                                </div>


                                {/* Phone */}

                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

                                    <span>
                                        Phone
                                    </span>

                                    <strong>

                                        {user.phone ||
                                            'Not specified'}

                                    </strong>

                                </div>


                                {/* Location */}

                                <div
                                    className={
                                        styles.infoItem
                                    }
                                >

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


                    {/* ======================================
                        POSTS
                    ====================================== */}

                    <ProfilePosts
                        userId={
                            user._id
                        }
                    />

                </section>


                {/* ==========================================
                    RIGHT SIDEBAR
                ========================================== */}

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