'use client';

import styles from './Profile.module.css';

export default function ProfileCertificates({ user }) {

    const certificates = user.certifications || [];

    return (

        <div className={styles.card}>

            <h3>

                Certifications

            </h3>

            {

                certificates.length === 0 ? (

                    <p className={styles.empty}>

                        No certifications added yet.

                    </p>

                ) : (

                    <div className={styles.timeline}>

                        {

                            certificates.map((certificate, index) => (

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

                                            {certificate.name}

                                        </h4>

                                        {

                                            certificate.organization && (

                                                <h5>

                                                    {certificate.organization}

                                                </h5>

                                            )

                                        }

                                        {

                                            certificate.issueDate && (

                                                <p className={styles.meta}>

                                                    Issued: {

                                                        new Date(

                                                            certificate.issueDate

                                                        ).toLocaleDateString(

                                                            'en-US',

                                                            {

                                                                month: 'short',

                                                                year: 'numeric'

                                                            }

                                                        )

                                                    }

                                                </p>

                                            )

                                        }

                                        {

                                            certificate.credentialId && (

                                                <p className={styles.meta}>

                                                    Credential ID: {

                                                        certificate.credentialId

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