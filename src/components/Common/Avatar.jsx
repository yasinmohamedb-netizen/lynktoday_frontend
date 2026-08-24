'use client';

import styles from './Avatar.module.css';

export default function Avatar({

    name = 'User',

    image = '',

    size = 'medium',

    verified = false

}) {

    const firstLetter = name.charAt(0).toUpperCase();

    return (

        <div className={`${styles.wrapper} ${styles[size]}`}>

            {

                image ? (

                    <img
                        src={image}
                        alt={name}
                        className={styles.image}
                    />

                ) : (

                    <div className={styles.avatar}>

                        {firstLetter}

                    </div>

                )

            }

            {

                verified && (

                    <span className={styles.verify}>

                        ✓

                    </span>

                )

            }

        </div>

    );

}