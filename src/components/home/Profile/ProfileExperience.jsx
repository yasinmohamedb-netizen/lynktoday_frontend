'use client';

import styles from './Profile.module.css';

export default function ProfileExperience({ user }) {

    const experience = user.experience || [];

    return (

        <div className={styles.card}>

            <h3>

                Experience

            </h3>

            {

                experience.length === 0 ? (

                    <p className={styles.empty}>

                        No experience added yet.

                    </p>

                ) : (

                    <div className={styles.timeline}>

                        {

                            experience.map((item, index) => (

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

                                            {item.designation}

                                        </h4>

                                        <h5>

                                            {item.company}

                                        </h5>

                                        {

                                            item.employmentType && (

                                                <p className={styles.meta}>

                                                    {item.employmentType}

                                                </p>

                                            )

                                        }

                                        <p className={styles.meta}>

                                            {

                                                item.startDate

                                                    ? new Date(

                                                          item.startDate

                                                      ).toLocaleDateString(

                                                          'en-US',

                                                          {

                                                              month: 'short',

                                                              year: 'numeric'

                                                          }

                                                      )

                                                    : ''

                                            }

                                            {' - '}

                                            {

                                                item.currentlyWorking

                                                    ? 'Present'

                                                    : item.endDate

                                                    ? new Date(

                                                          item.endDate

                                                      ).toLocaleDateString(

                                                          'en-US',

                                                          {

                                                              month: 'short',

                                                              year: 'numeric'

                                                          }

                                                      )

                                                    : ''

                                            }

                                        </p>

                                        {

                                            item.location && (

                                                <p

                                                    className={styles.meta}

                                                >

                                                    {item.location}

                                                </p>

                                            )

                                        }

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