'use client';

import Link from 'next/link';
import styles from './EmptyState.module.css';

export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'There is no data available at the moment.',
  buttonText,
  buttonLink = '/',
  onClick
}) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>

      <h2 className={styles.title}>{title}</h2>

      <p className={styles.description}>{description}</p>

      {buttonText &&
        (onClick ? (
          <button
            className={styles.button}
            onClick={onClick}
            type="button"
          >
            {buttonText}
          </button>
        ) : (
          <Link
            href={buttonLink}
            className={styles.button}
          >
            {buttonText}
          </Link>
        ))}
    </div>
  );
}