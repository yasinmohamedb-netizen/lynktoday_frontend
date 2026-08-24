'use client';

import styles from './Badge.module.css';

export default function Badge({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = true
}) {
  return (
    <span
      className={[
        styles.badge,
        styles[variant],
        styles[size],
        rounded ? styles.rounded : ''
      ].join(' ')}
    >
      {children}
    </span>
  );
}