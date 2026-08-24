'use client';

import { useRouter } from 'next/navigation';
import styles from './LoginRequiredModal.module.css';

export default function LoginRequiredModal({
    open,
    onClose
}) {

    const router = useRouter();

    if (!open) {
        return null;
    }


    const handleLogin = () => {

        onClose();

        router.push('/login');

    };


    const handleSignup = () => {

        onClose();

        router.push('/signup');

    };


    return (

        <div
            className={styles.overlay}
            onClick={onClose}
        >

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >

                {/* ==========================================
                    CLOSE BUTTON
                ========================================== */}

                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>


                {/* ==========================================
                    ICON
                ========================================== */}

                <div className={styles.icon}>
                    🔐
                </div>


                {/* ==========================================
                    CONTENT
                ========================================== */}

                <h2 className={styles.title}>
                    Join LynkToday
                </h2>


                <p className={styles.description}>
                    Sign in or create a free account to
                    participate in the LynkToday community.
                </p>


                {/* ==========================================
                    BENEFITS
                ========================================== */}

                <div className={styles.benefits}>

                    <div className={styles.benefit}>
                        <span>❤️</span>
                        <span>
                            Like and save posts
                        </span>
                    </div>


                    <div className={styles.benefit}>
                        <span>💬</span>
                        <span>
                            Comment and join discussions
                        </span>
                    </div>


                    <div className={styles.benefit}>
                        <span>🤝</span>
                        <span>
                            Connect with professionals
                        </span>
                    </div>


                    <div className={styles.benefit}>
                        <span>📩</span>
                        <span>
                            Message and network
                        </span>
                    </div>

                </div>


                {/* ==========================================
                    ACTIONS
                ========================================== */}

                <div className={styles.actions}>

                    <button
                        type="button"
                        className={styles.loginButton}
                        onClick={handleLogin}
                    >
                        Login
                    </button>


                    <button
                        type="button"
                        className={styles.signupButton}
                        onClick={handleSignup}
                    >
                        Join Free
                    </button>

                </div>


                {/* ==========================================
                    CONTINUE BROWSING
                ========================================== */}

                <button
                    type="button"
                    className={styles.continueButton}
                    onClick={onClose}
                >
                    Continue Browsing
                </button>

            </div>

        </div>

    );

}