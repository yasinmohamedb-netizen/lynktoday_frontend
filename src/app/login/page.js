'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';

import styles from './login.module.css';

const FEATURES = [
    'Sea freight discussions',
    'Air freight community',
    'Customs and HS Code knowledge',
    'Import and export resources',
    'Shipping documentation',
    'Verified industry professionals'
];

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value
        }));

        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { data } = await api.post(
                '/auth/login',
                {
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to sign in.'
                );
            }

            localStorage.setItem(
                'lynktoday_token',
                data.token
            );

            localStorage.setItem(
                'lynktoday_user',
                JSON.stringify(data.user)
            );

            router.push('/');
            router.refresh();

        } catch (error) {
            console.error(
                'Login error:',
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                'Unable to sign in. Please try again.'
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>

            {/* LEFT BRAND PANEL */}

            <section className={styles.leftPanel}>
                <div className={styles.leftContent}>

                    <Link
                        href="/"
                        className={styles.brand}
                    >
                        Lynk<span>Today</span>
                    </Link>

                    <div className={styles.brandLine} />

                    <p className={styles.eyebrow}>
                        FREIGHT FORWARDING COMMUNITY
                    </p>

                    <h1>
                        Connect with the
                        <br />
                        trade industry.
                    </h1>

                    <p className={styles.description}>
                        Learn, share knowledge and connect
                        with freight forwarding professionals
                        across the global trade community.
                    </p>

                    <div className={styles.features}>
                        {FEATURES.map((feature) => (
                            <div
                                key={feature}
                                className={styles.feature}
                            >
                                <span
                                    className={
                                        styles.featureCheck
                                    }
                                >
                                    ✓
                                </span>

                                <span>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.leftFooter}>
                        Built for freight forwarding
                        and global trade professionals.
                    </div>
                </div>
            </section>


            {/* LOGIN PANEL */}

            <section className={styles.rightPanel}>
                <div className={styles.card}>

                    <div className={styles.mobileBrand}>
                        <Link
                            href="/"
                            className={styles.mobileBrandLink}
                        >
                            Lynk<span>Today</span>
                        </Link>
                    </div>

                    <div className={styles.heading}>
                        <span className={styles.headingLabel}>
                            ACCOUNT ACCESS
                        </span>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to continue to your
                            LynkToday account.
                        </p>
                    </div>

                    {error && (
                        <div
                            className={
                                styles.errorAlert
                            }
                            role="alert"
                        >
                            <span
                                className={
                                    styles.errorIcon
                                }
                            >
                                !
                            </span>

                            <div>
                                <strong>
                                    Sign in failed
                                </strong>

                                <p>
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >
                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={loading}
                                required
                                className={
                                    styles.input
                                }
                            />
                        </div>


                        {/* PASSWORD */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >
                            <div
                                className={
                                    styles.passwordHeader
                                }
                            >
                                <label htmlFor="password">
                                    Password
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className={
                                        styles.link
                                    }
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                                required
                                className={
                                    styles.input
                                }
                            />
                        </div>


                        {/* REMEMBER */}

                        <label
                            className={
                                styles.checkbox
                            }
                        >
                            <input
                                type="checkbox"
                                name="remember"
                                checked={
                                    formData.remember
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={loading}
                            />

                            <span
                                className={
                                    styles.checkboxBox
                                }
                            />

                            <span>
                                Remember me
                            </span>
                        </label>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className={
                                styles.submitBtn
                            }
                        >
                            {loading ? (
                                <>
                                    <span
                                        className={
                                            styles.spinner
                                        }
                                    />

                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in

                                    <span
                                        className={
                                            styles.buttonArrow
                                        }
                                    >
                                        →
                                    </span>
                                </>
                            )}
                        </button>
                    </form>


                    {/* SIGN UP */}

                    <div
                        className={
                            styles.signup
                        }
                    >
                        <span>
                            Don't have an account?
                        </span>

                        <Link
                            href="/signup"
                            className={
                                styles.signupLink
                            }
                        >
                            Create an account
                        </Link>
                    </div>


                    <div
                        className={
                            styles.securityNote
                        }
                    >
                        Your account information is
                        securely handled by LynkToday.
                    </div>

                </div>
            </section>

        </main>
    );
}