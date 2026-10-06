'use client';

import Connections from '@/components/home/Connections/Connections';
import styles from './connections.module.css';

export default function ConnectionsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.content}>
                <Connections />
            </div>
        </main>
    );
}
