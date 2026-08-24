'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';
import FollowButton from './FollowButton';

import styles from './Profile.module.css';

export default function FollowList({
    userId,
    type = 'followers',
    onClose
}) {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch followers / following
    useEffect(() => {
        const fetchUsers = async () => {
            if (!userId) {
                return;
            }

            try {
                setLoading(true);
                setError('');

                const endpoint =
                    type === 'followers'
                        ? `/follow/followers/${userId}`
                        : `/follow/following/${userId}`;

                const { data } = await api.get(endpoint);

                if (!data?.success) {
                    throw new Error(
                        data?.message ||
                        'Unable to load users.'
                    );
                }

                setUsers(
                    type === 'followers'
                        ? data.followers || []
                        : data.following || []
                );
            } catch (err) {
                console.error(
                    'Follow list error:',
                    err.response?.data || err
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Unable to load users.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userId, type]);

    // Open user profile
    const handleUserClick = (targetUserId) => {
        if (!targetUserId) {
            return;
        }

        if (onClose) {
            onClose();
        }

        router.push(`/profile/${targetUserId}`);
    };

    // Follow / unfollow
    const handleFollowChange = (
        targetUserId,
        data
    ) => {
        if (!data) {
            return;
        }

        setUsers((previousUsers) =>
            previousUsers.map((user) => {
                if (
                    user._id?.toString() !==
                    targetUserId?.toString()
                ) {
                    return user;
                }

                return {
                    ...user,
                    isFollowing: data.following,
                    followersCount:
                        data.followersCount ??
                        user.followersCount
                };
            })
        );
    };

    // Close when clicking overlay
    const handleOverlayClick = (event) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose?.();
        }
    };

    const title =
        type === 'followers'
            ? 'Followers'
            : 'Following';

    return (
        <div
            className={styles.followOverlay}
            onClick={handleOverlayClick}
        >
            <div className={styles.followModal}>
                {/* Header */}
                <div className={styles.followModalHeader}>
                    <h2>{title}</h2>

                    <button
                        type="button"
                        className={
                            styles.followCloseButton
                        }
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className={styles.followModalContent}>
                    {/* Loading */}
                    {loading && (
                        <div
                            className={
                                styles.followMessage
                            }
                        >
                            Loading...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div
                            className={
                                styles.followError
                            }
                        >
                            {error}
                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        users.length === 0 && (
                            <div
                                className={
                                    styles.followMessage
                                }
                            >
                                {type === 'followers'
                                    ? 'No followers yet.'
                                    : 'Not following anyone yet.'
                                }
                            </div>
                        )}

                    {/* Users */}
                    {!loading &&
                        !error &&
                        users.length > 0 && (
                            <div
                                className={
                                    styles.followUserList
                                }
                            >
                                {users.map((user) => {
                                    const imageUrl =
                                        user.profileImage
                                            ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
                                            : null;

                                    return (
                                        <div
                                            key={user._id}
                                            className={
                                                styles.followUserItem
                                            }
                                        >
                                            {/* User information */}
                                            <div
                                                className={
                                                    styles.followUserInfo
                                                }
                                            >
                                                {/* Profile image */}
                                                <button
                                                    type="button"
                                                    className={
                                                        styles.followProfileButton
                                                    }
                                                    onClick={() =>
                                                        handleUserClick(
                                                            user._id
                                                        )
                                                    }
                                                    aria-label={`View ${user.fullName}'s profile`}
                                                >
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={
                                                                user.fullName
                                                            }
                                                            className={
                                                                styles.followUserAvatar
                                                            }
                                                        />
                                                    ) : (
                                                        <div
                                                            className={
                                                                styles.followUserAvatarPlaceholder
                                                            }
                                                        >
                                                            {user.fullName
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                    )}
                                                </button>

                                                {/* User details */}
                                                <div
                                                    className={
                                                        styles.followUserDetails
                                                    }
                                                    onClick={() =>
                                                        handleUserClick(
                                                            user._id
                                                        )
                                                    }
                                                >
                                                    <strong>
                                                        {user.fullName}

                                                        {user.isVerified && (
                                                            <span
                                                                className={
                                                                    styles.followVerified
                                                                }
                                                            >
                                                                ✔
                                                            </span>
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {user.designation ||
                                                            user.profession ||
                                                            'Professional'}
                                                    </span>

                                                    {user.companyName && (
                                                        <small>
                                                            {
                                                                user.companyName
                                                            }
                                                        </small>
                                                    )}

                                                    {user.location && (
                                                        <small>
                                                            📍{' '}
                                                            {
                                                                user.location
                                                            }
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Follow button */}
                                            <div
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                            >
                                                <FollowButton
                                                    userId={user._id}
                                                    isFollowing={
                                                        user.isFollowing ||
                                                        false
                                                    }
                                                    onFollowChange={(
                                                        data
                                                    ) =>
                                                        handleFollowChange(
                                                            user._id,
                                                            data
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}