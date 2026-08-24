'use client';

import styles from './Profile.module.css';

export default function ProfileSkills({ user }) {
    const skills = Array.isArray(user?.skills)
        ? user.skills
        : [];

    const languages = Array.isArray(user?.languages)
        ? user.languages
        : [];

    return (
        <div className={styles.card}>
            <h3>Skills</h3>

            {skills.length === 0 ? (
                <p className={styles.empty}>
                    No skills added yet.
                </p>
            ) : (
                <div className={styles.tagContainer}>
                    {skills.map((skill, index) => (
                        <span
                            key={`${skill}-${index}`}
                            className={styles.tag}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            <h3 className={styles.sectionTitle}>
                Languages
            </h3>

            {languages.length === 0 ? (
                <p className={styles.empty}>
                    No languages added yet.
                </p>
            ) : (
                <div className={styles.tagContainer}>
                    {languages.map((language, index) => (
                        <span
                            key={`${language}-${index}`}
                            className={styles.tagSecondary}
                        >
                            {language}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}