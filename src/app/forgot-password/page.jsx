'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';

import styles from './ForgotPassword.module.css';


// ============================================================
// PAGE
// ============================================================

export default function ForgotPasswordPage() {

    const router = useRouter();


    // ========================================================
    // STEP
    // ========================================================

    const [step, setStep] = useState('email');
    // email
    // otp
    // password


    // ========================================================
    // FORM DATA
    // ========================================================

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    // ========================================================
    // UI STATE
    // ========================================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    // ========================================================
    // RESEND TIMER
    // ========================================================

    const [resendTimer, setResendTimer] = useState(0);


    useEffect(() => {

        if (resendTimer <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setResendTimer((current) => {

                if (current <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return current - 1;

            });

        }, 1000);


        return () => clearInterval(timer);

    }, [resendTimer]);


    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {

        setError('');
        setSuccess('');

    };


    // ========================================================
    // SEND RESET OTP
    // ========================================================

    const handleSendOtp = async (event) => {

        event.preventDefault();

        clearMessages();


        const normalizedEmail =
            email.trim().toLowerCase();


        if (!normalizedEmail) {

            setError('Please enter your email address.');
            return;

        }


        setLoading(true);


        try {

            const response =
                await api.post(
                    '/auth/forgot-password',
                    {
                        email: normalizedEmail
                    }
                );


            if (response.data?.success) {

                setEmail(normalizedEmail);

                setSuccess(
                    'A password reset OTP has been sent to your email.'
                );

                setStep('otp');

                setResendTimer(60);

            } else {

                setError(
                    response.data?.message ||
                    'Unable to send the reset OTP.'
                );

            }

        } catch (error) {

            console.error(
                'Forgot password error:',
                error
            );


            setError(
                error?.response?.data?.message ||
                'Unable to send the reset OTP. Please try again.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // VERIFY OTP
    // ========================================================

    const handleVerifyOtp = async (event) => {

        event.preventDefault();

        clearMessages();


        const cleanOtp =
            otp.trim();


        if (!/^\d{6}$/.test(cleanOtp)) {

            setError(
                'Please enter the 6-digit OTP.'
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await api.post(
                    '/auth/verify-reset-otp',
                    {
                        email,
                        otp: cleanOtp
                    }
                );


            if (response.data?.success) {

                setSuccess(
                    'OTP verified. You can now create a new password.'
                );

                setStep('password');

            } else {

                setError(
                    response.data?.message ||
                    'Unable to verify the OTP.'
                );

            }

        } catch (error) {

            console.error(
                'Verify reset OTP error:',
                error
            );


            setError(
                error?.response?.data?.message ||
                'Invalid or expired OTP. Please try again.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // RESEND OTP
    // ========================================================

    const handleResendOtp = async () => {

        if (resendTimer > 0 || loading) {
            return;
        }


        clearMessages();

        setLoading(true);


        try {

            const response =
                await api.post(
                    '/auth/forgot-password',
                    {
                        email
                    }
                );


            if (response.data?.success) {

                setSuccess(
                    'A new OTP has been sent to your email.'
                );

                setOtp('');

                setResendTimer(60);

            } else {

                setError(
                    response.data?.message ||
                    'Unable to resend the OTP.'
                );

            }

        } catch (error) {

            console.error(
                'Resend reset OTP error:',
                error
            );


            setError(
                error?.response?.data?.message ||
                'Unable to resend the OTP.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // RESET PASSWORD
    // ========================================================

    const handleResetPassword = async (event) => {

        event.preventDefault();

        clearMessages();


        if (newPassword.length < 6) {

            setError(
                'Password must be at least 6 characters.'
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            setError(
                'Passwords do not match.'
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await api.post(
                    '/auth/reset-password',
                    {
                        email,
                        otp,
                        newPassword
                    }
                );


            if (response.data?.success) {

                setSuccess(
                    'Password reset successfully. Redirecting to login...'
                );


                setTimeout(() => {

                    router.push('/login');

                }, 1200);

            } else {

                setError(
                    response.data?.message ||
                    'Unable to reset your password.'
                );

            }

        } catch (error) {

            console.error(
                'Reset password error:',
                error
            );


            setError(
                error?.response?.data?.message ||
                'Unable to reset your password. Please try again.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        clearMessages();


        if (step === 'otp') {

            setOtp('');
            setStep('email');
            return;

        }


        if (step === 'password') {

            setNewPassword('');
            setConfirmPassword('');
            setStep('otp');
            return;

        }

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <main className={styles.container}>


            {/* ==================================================
                LEFT BRAND PANEL
            ================================================== */}

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
                        ACCOUNT RECOVERY
                    </p>


                    <h1>
                        Get back to your
                        <br />
                        LynkToday account.
                    </h1>


                    <p className={styles.description}>
                        Securely reset your password and
                        continue connecting with the trade
                        industry.
                    </p>


                    <div className={styles.features}>

                        <div className={styles.feature}>

                            <span className={styles.featureCheck}>
                                ✓
                            </span>

                            <span>
                                Verify your email address
                            </span>

                        </div>


                        <div className={styles.feature}>

                            <span className={styles.featureCheck}>
                                ✓
                            </span>

                            <span>
                                Use a secure one-time OTP
                            </span>

                        </div>


                        <div className={styles.feature}>

                            <span className={styles.featureCheck}>
                                ✓
                            </span>

                            <span>
                                Create a new password
                            </span>

                        </div>

                    </div>


                    <div className={styles.leftFooter}>
                        Built for freight forwarding
                        and global trade professionals.
                    </div>

                </div>

            </section>


            {/* ==================================================
                RIGHT PANEL
            ================================================== */}

            <section className={styles.rightPanel}>

                <div className={styles.card}>


                    {/* MOBILE BRAND */}

                    <div className={styles.mobileBrand}>

                        <Link
                            href="/"
                            className={styles.mobileBrandLink}
                        >
                            Lynk<span>Today</span>
                        </Link>

                    </div>


                    {/* ==================================================
                        STEP HEADER
                    ================================================== */}

                    <div className={styles.heading}>

                        <span className={styles.headingLabel}>
                            ACCOUNT RECOVERY
                        </span>


                        {step === 'email' && (

                            <>
                                <h2>
                                    Forgot your password?
                                </h2>

                                <p>
                                    Enter your email address and
                                    we'll send you a reset code.
                                </p>
                            </>

                        )}


                        {step === 'otp' && (

                            <>
                                <h2>
                                    Check your email
                                </h2>

                                <p>
                                    Enter the 6-digit OTP sent to
                                    <strong className={styles.emailText}>
                                        {' '}{email}
                                    </strong>
                                </p>
                            </>

                        )}


                        {step === 'password' && (

                            <>
                                <h2>
                                    Create a new password
                                </h2>

                                <p>
                                    Choose a new password for your
                                    LynkToday account.
                                </p>
                            </>

                        )}

                    </div>


                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (

                        <div
                            className={styles.successAlert}
                            role="status"
                        >

                            <span className={styles.successIcon}>
                                ✓
                            </span>

                            <p>
                                {success}
                            </p>

                        </div>

                    )}


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div
                            className={styles.errorAlert}
                            role="alert"
                        >

                            <span className={styles.errorIcon}>
                                !
                            </span>

                            <div>

                                <strong>
                                    Something went wrong
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        STEP 1 — EMAIL
                    ================================================== */}

                    {step === 'email' && (

                        <form
                            className={styles.form}
                            onSubmit={handleSendOtp}
                        >

                            <div className={styles.fieldGroup}>

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={loading}
                                    required
                                    className={styles.input}
                                />

                            </div>


                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className={styles.spinner} />
                                        Sending...
                                    </>

                                ) : (

                                    <>
                                        Send Reset Code
                                        <span className={styles.buttonArrow}>
                                            →
                                        </span>
                                    </>

                                )}

                            </button>


                            <Link
                                href="/login"
                                className={styles.backLink}
                            >
                                ← Back to login
                            </Link>

                        </form>

                    )}


                    {/* ==================================================
                        STEP 2 — OTP
                    ================================================== */}

                    {step === 'otp' && (

                        <form
                            className={styles.form}
                            onSubmit={handleVerifyOtp}
                        >

                            <div className={styles.fieldGroup}>

                                <label htmlFor="otp">
                                    Verification Code
                                </label>

                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(event) => {

                                        const value =
                                            event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 6);

                                        setOtp(value);

                                    }}
                                    placeholder="Enter 6-digit code"
                                    disabled={loading}
                                    required
                                    className={`${styles.input} ${styles.otpInput}`}
                                />

                            </div>


                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={
                                    loading ||
                                    otp.length !== 6
                                }
                            >

                                {loading ? (

                                    <>
                                        <span className={styles.spinner} />
                                        Verifying...
                                    </>

                                ) : (

                                    <>
                                        Verify Code
                                        <span className={styles.buttonArrow}>
                                            →
                                        </span>
                                    </>

                                )}

                            </button>


                            <div className={styles.resendRow}>

                                <span>
                                    Didn't receive the code?
                                </span>


                                <button
                                    type="button"
                                    className={styles.resendButton}
                                    onClick={handleResendOtp}
                                    disabled={
                                        loading ||
                                        resendTimer > 0
                                    }
                                >

                                    {resendTimer > 0
                                        ? `Resend in ${resendTimer}s`
                                        : 'Resend code'
                                    }

                                </button>

                            </div>


                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={handleBack}
                                disabled={loading}
                            >
                                ← Change email
                            </button>

                        </form>

                    )}


                    {/* ==================================================
                        STEP 3 — NEW PASSWORD
                    ================================================== */}

                    {step === 'password' && (

                        <form
                            className={styles.form}
                            onSubmit={handleResetPassword}
                        >

                            <div className={styles.fieldGroup}>

                                <label htmlFor="newPassword">
                                    New Password
                                </label>

                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    required
                                    minLength={6}
                                    className={styles.input}
                                />

                                <span className={styles.helperText}>
                                    Minimum 6 characters.
                                </span>

                            </div>


                            <div className={styles.fieldGroup}>

                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter password again"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    required
                                    minLength={6}
                                    className={styles.input}
                                />

                            </div>


                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className={styles.spinner} />
                                        Resetting...
                                    </>

                                ) : (

                                    <>
                                        Reset Password
                                        <span className={styles.buttonArrow}>
                                            →
                                        </span>
                                    </>

                                )}

                            </button>


                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={handleBack}
                                disabled={loading}
                            >
                                ← Back to OTP
                            </button>

                        </form>

                    )}


                    {/* ==================================================
                        SECURITY NOTE
                    ================================================== */}

                    <div className={styles.securityNote}>
                        For your security, password reset codes expire
                        after 10 minutes.
                    </div>


                </div>

            </section>

        </main>

    );

}