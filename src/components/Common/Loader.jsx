'use client';

import styles from './Loader.module.css';

export default function Loader({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false
}) {
  return (
    <div
      className={`${styles.container} ${
        fullScreen ? styles.fullScreen : ''
      }`}
    >
      <div className={`${styles.spinner} ${styles[size]}`} />

      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}