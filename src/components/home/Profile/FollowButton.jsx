'use client';

import { useEffect, useState } from 'react';

import api from '@/utils/api';

import styles from './Profile.module.css';

export default function FollowButton({
    userId,
    isFollowing = false,
    onFollowChange
}) {
    const [following, setFollowing] = useState(
        Boolean(isFollowing)
    );

    const [loading, setLoading] = useState(false);

    // Sync with parent profile
    useEffect(() => {
        setFollowing(Boolean(isFollowing));
    }, [isFollowing]);

    // Toggle follow
    const handleFollow = async () => {
        if (loading || !userId) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await api.post(
                `/follow/${userId}`
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to update follow status.'
                );
            }

            const newFollowing = Boolean(
                data.following
            );

            setFollowing(newFollowing);

            if (
                typeof onFollowChange === 'function'
            ) {
                onFollowChange({
                    following: newFollowing,
                    followersCount:
                        data.followersCount
                });
            }
        } catch (error) {
            console.error(
                'Follow error:',
                error.response?.data || error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className={
                following
                    ? styles.followingButton
                    : styles.followButton
            }
            disabled={loading}
            onClick={handleFollow}
        >
            {loading
                ? 'Please wait...'
                : following
                    ? 'Following'
                    : 'Follow'}
        </button>
    );
}