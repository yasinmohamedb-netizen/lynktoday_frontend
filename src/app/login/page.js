'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';

import styles from './login.module.css';

const PRIMARY_COLOR = '#4B5563';

export default function Login() {
    const router = useRouter();

    // ============================================================
    // LOGIN STATE
    // ============================================================

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    // ============================================================
    // OTP STATE
    // ============================================================

    const [otpMode, setOtpMode] = useState(false);

    const [verificationEmail, setVerificationEmail] =
        useState('');

    const [otp, setOtp] = useState('');

    const [otpLoading, setOtpLoading] =
        useState(false);

    const [resendLoading, setResendLoading] =
        useState(false);

    const [resendSeconds, setResendSeconds] =
        useState(0);

    // ============================================================
    // MESSAGES
    // ============================================================

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    // ============================================================
    // OTP RESEND TIMER
    // ============================================================

    useEffect(() => {
        if (resendSeconds <= 0) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setResendSeconds(
                (previous) =>
                    previous > 0
                        ? previous - 1
                        : 0
            );
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendSeconds]);

    // ============================================================
    // LOGIN
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (loading) {
            return;
        }
    
        setError('');
        setSuccess('');
    
        const normalizedEmail =
            email
                .trim()
                .toLowerCase();
    
        // ========================================================
        // VALIDATION
        // ========================================================
    
        if (!normalizedEmail) {
            setError(
                'Please enter your email.'
            );
    
            return;
        }
    
        if (!password) {
            setError(
                'Please enter your password.'
            );
    
            return;
        }
    
        try {
    
            setLoading(true);
    
            console.log(
                '========================================'
            );
    
            console.log(
                'LYNKTODAY LOGIN ATTEMPT'
            );
    
            console.log(
                'LOGIN EMAIL:',
                normalizedEmail
            );
    
            console.log(
                '========================================'
            );
    
            // ====================================================
            // LOGIN API
            // ====================================================
    
            const response =
                await api.post(
                    '/auth/login',
                    {
                        email:
                            normalizedEmail,
    
                        password:
                            password
                    }
                );
    
            const data =
                response?.data;
    
            console.log(
                'LOGIN RESPONSE:',
                data
            );
    
            // ====================================================
            // SUCCESSFUL LOGIN
            // ====================================================
    
            if (data?.success) {
    
                console.log(
                    '========================================'
                );
    
                console.log(
                    'LYNKTODAY LOGIN SUCCESS'
                );
    
                console.log(
                    'USER:',
                    data.user
                );
    
                console.log(
                    'TOKEN RECEIVED:',
                    !!data.token
                );
    
                console.log(
                    '========================================'
                );
    
                // ----------------------------------------------
                // SAVE JWT
                // ----------------------------------------------
    
                if (data.token) {
    
                    localStorage.setItem(
                        'lynktoday_token',
                        data.token
                    );
    
                }
    
                // ----------------------------------------------
                // SAVE USER
                // ----------------------------------------------
    
                if (data.user) {
    
                    localStorage.setItem(
                        'lynktoday_user',
                        JSON.stringify(
                            data.user
                        )
                    );
    
                }
    
                // ----------------------------------------------
                // CLEAR PENDING VERIFICATION
                // ----------------------------------------------
    
                localStorage.removeItem(
                    'lynktoday_pending_verification'
                );
    
                // ----------------------------------------------
                // CLEAR OTP STATE
                // ----------------------------------------------
    
                setOtpMode(false);
    
                setOtp('');
    
                setVerificationEmail('');
    
                setError('');
    
                setSuccess(
                    data.message ||
                    'Login successful. Welcome back!'
                );
    
                // ----------------------------------------------
                // GO HOME
                // ----------------------------------------------
    
                console.log(
                    'LYNKTODAY: Redirecting to home...'
                );
    
                router.replace('/');
    
                router.refresh();
    
                return;
            }
    
            // ====================================================
            // UNEXPECTED NON-SUCCESS RESPONSE
            // ====================================================
    
            setError(
                data?.message ||
                'Unable to login. Please try again.'
            );
    
        } catch (err) {
    
            const status =
                err?.response?.status;
    
            const data =
                err?.response?.data;
    
            // ====================================================
            // EMAIL NOT VERIFIED
            //
            // THIS IS AN EXPECTED LOGIN STATE.
            //
            // DO NOT LOG THIS AS AN ERROR.
            // ====================================================
    
            if (
                status === 403 &&
                data?.code ===
                    'EMAIL_NOT_VERIFIED'
            ) {
    
                const emailForVerification =
                    (
                        data?.email ||
                        normalizedEmail
                    )
                        .trim()
                        .toLowerCase();
    
                console.log(
                    '========================================'
                );
    
                console.log(
                    'LYNKTODAY: EMAIL VERIFICATION REQUIRED'
                );
    
                console.log(
                    'EMAIL:',
                    emailForVerification
                );
    
                console.log(
                    'OTP SENT:',
                    data?.otpSent
                );
    
                console.log(
                    'MESSAGE:',
                    data?.message
                );
    
                console.log(
                    '========================================'
                );
    
                // ----------------------------------------------
                // SAVE EMAIL FOR OTP
                // ----------------------------------------------
    
                setVerificationEmail(
                    emailForVerification
                );
    
                // ----------------------------------------------
                // CLEAR OLD OTP
                // ----------------------------------------------
    
                setOtp('');
    
                // ----------------------------------------------
                // SHOW OTP SCREEN
                // ----------------------------------------------
    
                setOtpMode(true);
    
                // ----------------------------------------------
                // OTP TIMER
                //
                // If backend says a new OTP was sent,
                // start the 60 second timer.
                //
                // If otpSent is false, don't start timer.
                // User can resend if required.
                // ----------------------------------------------
    
                setResendSeconds(
                    data?.otpSent
                        ? 60
                        : 0
                );
    
                // ----------------------------------------------
                // CLEAR ERROR
                //
                // 403 is expected here.
                // ----------------------------------------------
    
                setError('');
    
                // ----------------------------------------------
                // SHOW INFORMATION MESSAGE
                // ----------------------------------------------
    
                setSuccess(
                    data?.message ||
                    'Your email is not verified. Please enter the OTP sent to your email.'
                );
    
                return;
            }
    
            // ====================================================
            // OTHER LOGIN ERRORS
            // ====================================================
    
            console.error(
                '========================================'
            );
    
            console.error(
                'LYNKTODAY LOGIN ERROR'
            );
    
            console.error(
                'STATUS:',
                status
            );
    
            console.error(
                'DATA:',
                data
            );
    
            console.error(
                'MESSAGE:',
                err?.message
            );
    
            console.error(
                '========================================'
            );
    
            // ====================================================
            // INVALID CREDENTIALS
            // ====================================================
    
            if (status === 401) {
    
                setError(
                    data?.message ||
                    'Invalid email or password.'
                );
    
                return;
            }
    
            // ====================================================
            // ACCOUNT INACTIVE
            // ====================================================
    
            if (status === 403) {
    
                setError(
                    data?.message ||
                    'Your account is currently inactive.'
                );
    
                return;
            }
    
            // ====================================================
            // VALIDATION ERROR
            // ====================================================
    
            if (status === 400) {
    
                setError(
                    data?.message ||
                    'Please check your login details.'
                );
    
                return;
            }
    
            // ====================================================
            // SERVER ERROR
            // ====================================================
    
            if (status >= 500) {
    
                setError(
                    'Server error. Please try again later.'
                );
    
                return;
            }
    
            // ====================================================
            // NETWORK / UNKNOWN ERROR
            // ====================================================
    
            setError(
                data?.message ||
                data?.error ||
                err?.message ||
                'Unable to login. Please try again.'
            );
    
        } finally {
    
            setLoading(false);
    
        }
    };

    // ============================================================
    // VERIFY LOGIN OTP
    // ============================================================

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otpLoading) {
            return;
        }

        setError('');
        setSuccess('');

        // ========================================================
        // CLEAN OTP
        // ========================================================

        const cleanOtp =
            otp
                .trim()
                .replace(/\D/g, '');

        // ========================================================
        // VALIDATE OTP
        // ========================================================

        if (!cleanOtp) {
            setError(
                'Please enter the OTP.'
            );

            return;
        }

        if (!/^\d{6}$/.test(cleanOtp)) {
            setError(
                'Please enter the 6-digit OTP.'
            );

            return;
        }

        if (!verificationEmail) {
            setError(
                'Verification email is missing.'
            );

            return;
        }

        if (!password) {
            setError(
                'Your login session has expired. Please enter your password again.'
            );

            setOtpMode(false);

            return;
        }

        try {
            setOtpLoading(true);

            const normalizedEmail =
                verificationEmail
                    .trim()
                    .toLowerCase();

            console.log(
                '========================================'
            );

            console.log(
                'LYNKTODAY LOGIN OTP VERIFICATION'
            );

            console.log(
                'EMAIL:',
                normalizedEmail
            );

            console.log(
                'OTP LENGTH:',
                cleanOtp.length
            );

            console.log(
                '========================================'
            );

            // ====================================================
            // STEP 1
            // VERIFY EMAIL OTP
            // ====================================================

            const verifyResponse =
                await api.post(
                    '/auth/verify-email',
                    {
                        email:
                            normalizedEmail,

                        otp:
                            cleanOtp
                    }
                );

            const verifyData =
                verifyResponse?.data;

            console.log(
                'OTP VERIFICATION RESPONSE:',
                verifyData
            );

            // ====================================================
            // OTP VERIFICATION FAILED
            // ====================================================

            if (!verifyData?.success) {

                setError(
                    verifyData?.message ||
                    'Unable to verify your email.'
                );

                return;
            }

            console.log(
                'EMAIL VERIFIED SUCCESSFULLY'
            );

            // ====================================================
            // STEP 2
            //
            // IMPORTANT:
            //
            // /verify-email returns only:
            //
            // {
            //     success: true,
            //     message: "Email verified successfully..."
            // }
            //
            // It does NOT return JWT.
            //
            // Therefore we MUST login again automatically.
            // ====================================================

            setSuccess(
                'Email verified successfully. Signing you in...'
            );

            console.log(
                'AUTO LOGIN STARTING...'
            );

            const loginResponse =
                await api.post(
                    '/auth/login',
                    {
                        email:
                            normalizedEmail,

                        password:
                            password
                    }
                );

            const loginData =
                loginResponse?.data;

            console.log(
                'AUTO LOGIN RESPONSE:',
                loginData
            );

            // ====================================================
            // AUTO LOGIN FAILED
            // ====================================================

            if (
                !loginData?.success ||
                !loginData?.token
            ) {

                console.error(
                    'AUTO LOGIN FAILED:',
                    loginData
                );

                setError(
                    loginData?.message ||
                    'Email verified, but automatic login failed. Please login again.'
                );

                setSuccess('');

                return;
            }

            // ====================================================
            // STEP 3
            // SAVE JWT
            // ====================================================

            console.log(
                'AUTO LOGIN SUCCESS'
            );

            console.log(
                'SAVING JWT TOKEN'
            );

            localStorage.setItem(
                'lynktoday_token',
                loginData.token
            );

            // ====================================================
            // STEP 4
            // SAVE USER
            // ====================================================

            if (loginData.user) {

                console.log(
                    'SAVING USER DATA'
                );

                localStorage.setItem(
                    'lynktoday_user',
                    JSON.stringify(
                        loginData.user
                    )
                );
            }

            // ====================================================
            // STEP 5
            // CLEAR PENDING VERIFICATION
            // ====================================================

            localStorage.removeItem(
                'lynktoday_pending_verification'
            );

            // ====================================================
            // STEP 6
            // REDIRECT HOME
            // ====================================================

            setSuccess(
                'Email verified successfully. Welcome to LynkToday!'
            );

            console.log(
                'REDIRECTING TO HOME...'
            );

            // Small delay so the success message is visible
            // and localStorage is definitely updated.

            setTimeout(() => {

                router.replace('/');

                router.refresh();

            }, 500);

        } catch (err) {

            console.error(
                '========================================'
            );

            console.error(
                'LYNKTODAY LOGIN OTP ERROR'
            );

            console.error(
                'STATUS:',
                err?.response?.status
            );

            console.error(
                'DATA:',
                err?.response?.data
            );

            console.error(
                'MESSAGE:',
                err?.message
            );

            console.error(
                '========================================'
            );

            const status =
                err?.response?.status;

            const data =
                err?.response?.data;

            // ====================================================
            // VERIFY OTP ERROR
            // ====================================================

            if (status === 400) {

                setError(
                    data?.message ||
                    'Invalid or expired OTP.'
                );

                return;
            }

            // ====================================================
            // AUTO LOGIN ERROR
            // ====================================================

            setError(
                data?.message ||
                data?.error ||
                'Unable to complete verification. Please try again.'
            );

        } finally {
            setOtpLoading(false);
        }
    };

    // ============================================================
    // RESEND LOGIN OTP
    // ============================================================

    const handleResendOtp = async () => {

        if (
            resendLoading ||
            resendSeconds > 0 ||
            !verificationEmail
        ) {
            return;
        }

        try {

            setResendLoading(true);

            setError('');
            setSuccess('');

            const normalizedEmail =
                verificationEmail
                    .trim()
                    .toLowerCase();

            console.log(
                '========================================'
            );

            console.log(
                'RESENDING VERIFICATION OTP'
            );

            console.log(
                'EMAIL:',
                normalizedEmail
            );

            console.log(
                '========================================'
            );

            // ====================================================
            // RESEND OTP
            // ====================================================

            const response =
                await api.post(
                    '/auth/resend-verification',
                    {
                        email:
                            normalizedEmail
                    }
                );

            const data =
                response?.data;

            console.log(
                'RESEND OTP RESPONSE:',
                data
            );

            // ====================================================
            // CHECK RESPONSE
            // ====================================================

            if (!data?.success) {

                setError(
                    data?.message ||
                    'Unable to resend OTP.'
                );

                return;
            }

            // ====================================================
            // SUCCESS
            // ====================================================

            setOtp('');

            setSuccess(
                'A new verification OTP has been sent to your email.'
            );

            setResendSeconds(60);

        } catch (err) {

            console.error(
                '========================================'
            );

            console.error(
                'LYNKTODAY RESEND OTP ERROR'
            );

            console.error(
                'STATUS:',
                err?.response?.status
            );

            console.error(
                'DATA:',
                err?.response?.data
            );

            console.error(
                'MESSAGE:',
                err?.message
            );

            console.error(
                '========================================'
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Unable to resend OTP.'
            );

        } finally {

            setResendLoading(false);

        }
    };

    // ============================================================
    // BACK TO LOGIN
    // ============================================================

    const handleBackToLogin = () => {

        setOtpMode(false);

        setOtp('');

        setVerificationEmail('');

        setError('');

        setSuccess('');

        setResendSeconds(0);

    };

    // ============================================================
    // OTP SCREEN
    // ============================================================

    if (otpMode) {

        return (

            <div className={styles.container}>

                {/* ==================================================
                    LEFT PANEL
                ================================================== */}

                <div className={styles.leftPanel}>

                    <div className={styles.overlay}>

                        <h1>
                            LynkToday
                        </h1>

                        <h2>
                            Join the Global
                            <br />
                            Trade Network
                        </h2>

                        <p>
                            Connect with freight
                            forwarders, customs
                            brokers, importers,
                            exporters, shipping
                            lines, logistics
                            companies and trade
                            professionals worldwide.
                        </p>

                        <ul className={styles.features}>

                            <li>
                                Sea Freight
                            </li>

                            <li>
                                Air Freight
                            </li>

                            <li>
                                Customs Clearance
                            </li>

                            <li>
                                Import & Export
                            </li>

                            <li>
                                Global Trade Network
                            </li>

                            <li>
                                Verified Professionals
                            </li>

                        </ul>

                    </div>

                </div>

                {/* ==================================================
                    OTP PANEL
                ================================================== */}

                <div className={styles.rightPanel}>

                    <div className={styles.card}>

                        <div
                            className={
                                styles.otpContainer
                            }
                        >

                            <div
                                className={
                                    styles.otpIcon
                                }
                                style={{
                                    color:
                                        PRIMARY_COLOR
                                }}
                            >
                                @
                            </div>

                            <h2
                                className={
                                    styles.title
                                }
                            >
                                Verify Your Email
                            </h2>

                            <p
                                className={
                                    styles.subtitle
                                }
                            >

                                Your account exists,
                                but your email has not
                                been verified.

                                <br />

                                Enter the 6-digit OTP
                                sent to:

                                <strong
                                    className={
                                        styles.otpEmail
                                    }
                                >
                                    {' '}
                                    {verificationEmail}
                                </strong>

                            </p>

                            {/* ==================================================
                                ERROR
                            ================================================== */}

                            {error && (

                                <div
                                    className={
                                        styles.errorAlert
                                    }
                                >
                                    {error}
                                </div>

                            )}

                            {/* ==================================================
                                SUCCESS
                            ================================================== */}

                            {success && (

                                <div
                                    className={
                                        styles.successAlert
                                    }
                                >
                                    {success}
                                </div>

                            )}

                            {/* ==================================================
                                OTP FORM
                            ================================================== */}

                            <form
                                className={
                                    styles.form
                                }
                                onSubmit={
                                    handleVerifyOtp
                                }
                            >

                                <div
                                    className={
                                        styles.fieldGroup
                                    }
                                >

                                    <label>
                                        Verification Code
                                    </label>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        className={
                                            styles.otpInput
                                        }
                                        value={otp}
                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ''
                                                    )
                                                    .slice(
                                                        0,
                                                        6
                                                    );

                                            setOtp(value);

                                            setError('');

                                        }}
                                        placeholder="000000"
                                        disabled={
                                            otpLoading
                                        }
                                        autoFocus
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className={
                                        styles.submitBtn
                                    }
                                    disabled={
                                        otpLoading ||
                                        otp.length !== 6
                                    }
                                    style={{
                                        background:
                                            PRIMARY_COLOR
                                    }}
                                >

                                    {otpLoading
                                        ? 'Verifying...'
                                        : 'Verify Email'}

                                </button>

                            </form>

                            {/* ==================================================
                                RESEND OTP
                            ================================================== */}

                            <div
                                className={
                                    styles.otpResend
                                }
                            >

                                <span>
                                    Didn't receive the code?
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        handleResendOtp
                                    }
                                    disabled={
                                        resendLoading ||
                                        resendSeconds > 0 ||
                                        otpLoading
                                    }
                                    className={
                                        styles.resendButton
                                    }
                                >

                                    {resendLoading
                                        ? 'Sending...'
                                        : resendSeconds > 0
                                            ? `Resend in ${resendSeconds}s`
                                            : 'Resend OTP'}

                                </button>

                            </div>

                            {/* ==================================================
                                BACK TO LOGIN
                            ================================================== */}

                            <button
                                type="button"
                                className={
                                    styles.backButton
                                }
                                onClick={
                                    handleBackToLogin
                                }
                                disabled={
                                    otpLoading
                                }
                            >
                                ← Back to login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );
    }

    // ============================================================
    // NORMAL LOGIN SCREEN
    // ============================================================

    return (

        <div className={styles.container}>

            {/* ==================================================
                LEFT PANEL
            ================================================== */}

            <div className={styles.leftPanel}>

                <div className={styles.overlay}>

                    <h1>
                        LynkToday
                    </h1>

                    <h2>
                        Connect. Trade.
                        <br />
                        Grow.
                    </h2>

                    <p>
                        Connect with freight
                        forwarders, customs
                        brokers, importers,
                        exporters, shipping
                        lines, logistics
                        companies and trade
                        professionals worldwide.
                    </p>

                    <ul className={styles.features}>

                        <li>
                            Sea Freight
                        </li>

                        <li>
                            Air Freight
                        </li>

                        <li>
                            Customs Clearance
                        </li>

                        <li>
                            Import & Export
                        </li>

                        <li>
                            Global Trade Network
                        </li>

                        <li>
                            Verified Professionals
                        </li>

                    </ul>

                </div>

            </div>

            {/* ==================================================
                RIGHT PANEL
            ================================================== */}

            <div className={styles.rightPanel}>

                <div className={styles.card}>

                    <h2 className={styles.title}>
                        Welcome Back
                    </h2>

                    <p className={styles.subtitle}>
                        Sign in to your LynkToday account.
                    </p>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div
                            className={
                                styles.errorAlert
                            }
                        >
                            {error}
                        </div>

                    )}

                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (

                        <div
                            className={
                                styles.successAlert
                            }
                        >
                            {success}
                        </div>

                    )}

                    {/* ==================================================
                        LOGIN FORM
                    ================================================== */}

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

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                className={
                                    styles.input
                                }
                                value={email}
                                onChange={(e) => {

                                    setEmail(
                                        e.target.value
                                    );

                                    setError('');
                                    setSuccess('');

                                }}
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* PASSWORD */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                className={
                                    styles.input
                                }
                                value={password}
                                onChange={(e) => {

                                    setPassword(
                                        e.target.value
                                    );

                                    setError('');
                                    setSuccess('');

                                }}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* FORGOT PASSWORD */}

                        <div
                            className={
                                styles.forgotRow
                            }
                        >

                            <Link
                                href="/forgot-password"
                                className={
                                    styles.forgotLink
                                }
                            >
                                Forgot password?
                            </Link>

                        </div>

                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className={
                                styles.submitBtn
                            }
                            disabled={loading}
                            style={{
                                background:
                                    PRIMARY_COLOR
                            }}
                        >

                            {loading
                                ? 'Signing in...'
                                : 'Login'}

                        </button>

                    </form>

                    {/* CREATE ACCOUNT */}

                    <div
                        className={
                            styles.loginLink
                        }
                    >

                        <span>
                            Don't have an account?
                        </span>

                        <Link
                            href="/signup"
                            style={{
                                color:
                                    PRIMARY_COLOR
                            }}
                        >
                            Create Account
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );
}