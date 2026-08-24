'use client';

import styles from './Profile.module.css';

export default function ProfileEducation({ user }) {

    const education = user.education || [];

    return (

        <div className={styles.card}>

            <h3>

                Education

            </h3>

            {

                education.length === 0 ? (

                    <p className={styles.empty}>

                        No education added yet.

                    </p>

                ) : (

                    <div className={styles.timeline}>

                        {

                            education.map((item, index) => (

                                <div

                                    key={index}

                                    className={styles.timelineItem}

                                >

                                    <div

                                        className={styles.timelineLeft}

                                    >

                                        <div

                                            className={styles.timelineDot}

                                        />

                                    </div>

                                    <div

                                        className={styles.timelineContent}

                                    >

                                        <h4>

                                            {item.degree}

                                        </h4>

                                        <h5>

                                            {item.institution}

                                        </h5>

                                        {

                                            item.fieldOfStudy && (

                                                <p className={styles.meta}>

                                                    {item.fieldOfStudy}

                                                </p>

                                            )

                                        }

                                        <p className={styles.meta}>

                                            {

                                                item.startYear || ""

                                            }

                                            {

                                                item.startYear && item.endYear

                                                    ? " - "

                                                    : ""

                                            }

                                            {

                                                item.endYear || ""

                                            }

                                        </p>

                                        {

                                            item.description && (

                                                <p

                                                    className={styles.description}

                                                >

                                                    {

                                                        item.description

                                                    }

                                                </p>

                                            )

                                        }

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}