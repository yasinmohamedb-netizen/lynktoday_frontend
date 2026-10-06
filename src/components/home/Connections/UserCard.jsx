'use client';

import Link from 'next/link';
import ConnectionButton from './ConnectionButton';
import styles from './Connections.module.css';

export default function UserCard({ user, connectionStatus = 'ACCEPTED', onStatusChange }) {
    if (!user) return null;

    const imageUrl = user.profileImage
        ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
        : null;

    return (
        <div className={styles.card}>
            <Link href={`/profile/${user._id}`}>
                {imageUrl ? (
                    <img className={styles.image} src={imageUrl} alt={user.fullName} width={54} height={54} />
                ) : (
                    <div className={styles.avatar}>
                        {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                )}
            </Link>

            <div className={styles.info}>
                <Link className={styles.name} href={`/profile/${user._id}`}>
                    {user.fullName}
                </Link>
                {user.isVerified && <span className={styles.verified}>✔ Verified</span>}
                <p className={styles.role}>{user.designation || user.profession || 'Professional'}</p>
                {user.companyName && <p className={styles.company}>{user.companyName}</p>}
                {user.location && <p className={styles.location}>📍 {user.location}</p>}
            </div>

            {connectionStatus !== 'ACCEPTED' && (
                <div className={styles.actions}>
                    <ConnectionButton
                        userId={user._id}
                        initialStatus={connectionStatus}
                        onStatusChange={onStatusChange}
                    />
                </div>
            )}
        </div>
    );
}