'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import EditProfileModal from './EditProfileModal';
import FollowButton from './FollowButton';
import FollowList from './FollowList';

import api from '@/utils/api';

import styles from './Profile.module.css';

export default function ProfileHeader({
    user,
    onProfileUpdated,
    isOwnProfile = true,
    onFollowChange
}) {

    const router = useRouter();

    // ==================================================
    // MODAL STATE
    // ==================================================

    const [showEdit, setShowEdit] = useState(false);

    const [showFollowList, setShowFollowList] =
        useState(false);

    const [followListType, setFollowListType] =
        useState('followers');


    // ==================================================
    // MESSAGE STATE
    // ==================================================

    const [messageLoading, setMessageLoading] =
        useState(false);


    // ==================================================
    // OPEN FOLLOWERS LIST
    // ==================================================

    const handleFollowersClick = () => {

        setFollowListType('followers');

        setShowFollowList(true);

    };


    // ==================================================
    // OPEN FOLLOWING LIST
    // ==================================================

    const handleFollowingClick = () => {

        setFollowListType('following');

        setShowFollowList(true);

    };


    // ==================================================
    // CLOSE FOLLOW LIST
    // ==================================================

    const handleCloseFollowList = () => {

        setShowFollowList(false);

    };


    // ==================================================
    // CREATE / GET CONVERSATION
    // ==================================================

    const handleMessage = async () => {

        if (
            messageLoading ||
            !user?._id
        ) {

            return;

        }


        try {

            setMessageLoading(true);


            const { data } =
                await api.post(
                    '/messages/conversations',
                    {
                        userId: user._id
                    }
                );


            if (
                !data?.success ||
                !data?.conversation?._id
            ) {

                throw new Error(
                    data?.message ||
                    'Unable to open conversation.'
                );

            }


            const conversationId =
                data.conversation._id;


            router.push(
                `/messages?conversationId=${conversationId}`
            );


        } catch (error) {

            console.error(
                'Open conversation error:',
                error.response?.data ||
                error
            );


            alert(
                error.response?.data?.message ||
                error.message ||
                'Unable to open conversation.'
            );


        } finally {

            setMessageLoading(false);

        }

    };


    // ==================================================
    // SAFETY
    // ==================================================

    if (!user) {

        return null;

    }


    // ==================================================
    // PROFILE IMAGE
    // ==================================================

    const imageUrl = user.profileImage

        ? user.profileImage.startsWith('http')

            ? user.profileImage

            : `${(
                process.env.NEXT_PUBLIC_API_URL ||
                'http://localhost:5001/api/v1'
            ).replace(
                '/api/v1',
                ''
            )}${user.profileImage}`

        : null;


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <>

            {/* ==================================================
                PROFILE HEADER
            ================================================== */}

            <div className={styles.headerCard}>


                {/* ==================================================
                    PROFILE PHOTO
                ================================================== */}

                <div className={styles.avatarSection}>

                    {imageUrl ? (

                        <img
                            src={imageUrl}
                            alt={
                                user.fullName ||
                                'Profile'
                            }
                            className={styles.avatar}
                        />

                    ) : (

                        <div
                            className={
                                styles.avatarPlaceholder
                            }
                        >

                            {user.fullName
                                ?.charAt(0)
                                .toUpperCase() || 'L'}

                        </div>

                    )}

                </div>


                {/* ==================================================
                    PROFILE INFORMATION
                ================================================== */}

                <div className={styles.profileInfo}>


                    {/* NAME */}

                    <h1>

                        {user.fullName}

                        {user.isVerified && (

                            <span
                                className={
                                    styles.verified
                                }
                            >

                                ✔ Verified

                            </span>

                        )}

                    </h1>


                    {/* HEADLINE */}

                    {user.headline && (

                        <h2>

                            {user.headline}

                        </h2>

                    )}


                    {/* PROFESSION / DESIGNATION */}

                    <p>

                        {user.designation ||
                            user.profession ||
                            'Professional'}

                    </p>


                    {/* COMPANY */}

                    {user.companyName && (

                        <p>

                            {user.companyName}

                        </p>

                    )}


                    {/* LOCATION */}

                    {user.location && (

                        <p>

                            {user.location}

                        </p>

                    )}


                    {/* ==================================================
                        PROFILE STATISTICS
                    ================================================== */}

                    <div className={styles.stats}>


                        {/* FOLLOWERS */}

                        <button
                            type="button"
                            className={
                                styles.statButton
                            }
                            onClick={
                                handleFollowersClick
                            }
                        >

                            <strong>

                                {user.followersCount ||
                                    0}

                            </strong>{' '}

                            Followers

                        </button>


                        {/* FOLLOWING */}

                        <button
                            type="button"
                            className={
                                styles.statButton
                            }
                            onClick={
                                handleFollowingClick
                            }
                        >

                            <strong>

                                {user.followingCount ||
                                    0}

                            </strong>{' '}

                            Following

                        </button>


                        {/* POSTS */}

                        <span
                            className={
                                styles.statItem
                            }
                        >

                            <strong>

                                {user.postsCount ||
                                    0}

                            </strong>{' '}

                            {user.postsCount === 1
                                ? 'Post'
                                : 'Posts'}

                        </span>

                    </div>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className={styles.actions}>


                    {/* ==================================================
                        OWN PROFILE
                    ================================================== */}

                    {isOwnProfile ? (

                        <button
                            type="button"
                            className={
                                styles.editButton
                            }
                            onClick={() =>
                                setShowEdit(true)
                            }
                        >

                            Edit Profile

                        </button>

                    ) : (

                        <>


                            {/* ==================================================
                                FOLLOW
                            ================================================== */}

                            <FollowButton
                                userId={user._id}
                                isFollowing={
                                    Boolean(
                                        user.isFollowing
                                    )
                                }
                                onFollowChange={
                                    onFollowChange
                                }
                            />


                            {/* ==================================================
                                MESSAGE
                            ================================================== */}

                            <button
                                type="button"
                                className={
                                    styles.followButton
                                }
                                onClick={
                                    handleMessage
                                }
                                disabled={
                                    messageLoading
                                }
                            >

                                {messageLoading
                                    ? 'Opening...'
                                    : 'Message'}

                            </button>


                        </>

                    )}

                </div>

            </div>


            {/* ==================================================
                EDIT PROFILE MODAL
            ================================================== */}

            {showEdit && isOwnProfile && (

                <EditProfileModal
                    user={user}
                    onClose={() =>
                        setShowEdit(false)
                    }
                    onUpdated={(updatedUser) => {

                        if (
                            typeof onProfileUpdated ===
                            'function'
                        ) {

                            onProfileUpdated(
                                updatedUser
                            );

                        }

                        setShowEdit(false);

                    }}
                />

            )}


            {/* ==================================================
                FOLLOWERS / FOLLOWING MODAL
            ================================================== */}

            {showFollowList && (

                <FollowList
                    userId={user._id}
                    type={followListType}
                    onClose={
                        handleCloseFollowList
                    }
                />

            )}

        </>

    );

}