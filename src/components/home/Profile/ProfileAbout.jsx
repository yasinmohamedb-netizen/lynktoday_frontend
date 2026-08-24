'use client';

import styles from './Profile.module.css';

export default function ProfileAbout({ user }) {
    const hasContent =
        Boolean(user?.bio) ||
        Boolean(user?.phone) ||
        Boolean(user?.website) ||
        Boolean(user?.linkedin);

    if (!hasContent) {
        return (
            <div className={styles.card}>
                <h3>About</h3>

                <p className={styles.empty}>
                    No profile information added yet.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <h3>About</h3>

            {user?.bio && (
                <div className={styles.infoRow}>
                    <span className={styles.label}>
                        Bio
                    </span>

                    <p className={styles.value}>
                        {user.bio}
                    </p>
                </div>
            )}

            {user?.phone && (
                <div className={styles.infoRow}>
                    <span className={styles.label}>
                        Phone
                    </span>

                    <p className={styles.value}>
                        {user.phone}
                    </p>
                </div>
            )}

            {user?.website && (
                <div className={styles.infoRow}>
                    <span className={styles.label}>
                        Website
                    </span>

                    <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        {user.website}
                    </a>
                </div>
            )}

            {user?.linkedin && (
                <div className={styles.infoRow}>
                    <span className={styles.label}>
                        LinkedIn
                    </span>

                    <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        {user.linkedin}
                    </a>
                </div>
            )}
        </div>
    );
}