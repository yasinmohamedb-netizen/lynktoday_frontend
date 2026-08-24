'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import styles from './TopProfessionals.module.css';

export default function TopProfessionals() {

    const [professionals, setProfessionals] = useState([]);

    useEffect(() => {

        fetchProfessionals();

    }, []);

    const fetchProfessionals = async () => {

        try {

            const { data } = await api.get('/users');

            const verified = (data.users || [])
                .filter(user => user.isVerified)
                .slice(0, 5);

            setProfessionals(verified);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h3>⭐ Top Professionals</h3>

                <Link href="/discover">

                    View All

                </Link>

            </div>

            {

                professionals.length === 0 && (

                    <div className={styles.empty}>

                        No verified professionals yet.

                    </div>

                )

            }

            {

                professionals.map((person) => (

                    <div
                        key={person._id}
                        className={styles.person}
                    >

                        <div className={styles.avatar}>

                            {

                                person.fullName
                                    ?.charAt(0)
                                    .toUpperCase()

                            }

                        </div>

                        <div className={styles.info}>

                            <h4>

                                {person.fullName}

                            </h4>

                            <p>

                                {person.profession}

                            </p>

                            <span>

                                📍 {person.location}

                            </span>

                        </div>

                        <button
                            className={styles.followBtn}
                        >

                            Follow

                        </button>

                    </div>

                ))

            }

        </div>

    );

}