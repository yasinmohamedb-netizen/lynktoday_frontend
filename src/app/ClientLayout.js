'use client';

import Navbar from '@/components/home/Navbar/Navbar';
import AuthModalProvider from '@/components/auth/AuthModalProvider/AuthModalProvider';

import styles from './layout.module.css';

export default function ClientLayout({ children }) {
    return (
        <AuthModalProvider>

            <div className={styles.appShellContainer}>

                <Navbar />

                <div className={styles.mainContentFrame}>
                    {children}
                </div>

            </div>

        </AuthModalProvider>
    );
}