'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';

import styles from './signup.module.css';

const PRIMARY_COLOR = '#4B5563';

export default function Signup() {
    const router = useRouter();

    // ============================================================
    // FORM STATE
    // ============================================================

    const [formData, setFormData] = useState({
        accountType: 'individual',

        fullName: '',

        profession: 'Freight Forwarder',

        companyName: '',

        designation: '',

        email: '',

        password: '',

        confirmPassword: '',

        location: '',

        bio: '',

        tradeIntent: 'Both',

        agreeToTerms: false
    });

    // ============================================================
    // OTP STATE
    // ============================================================

    const [otpMode, setOtpMode] = useState(false);

    const [otp, setOtp] = useState('');

    const [verificationEmail, setVerificationEmail] =
        useState('');

    const [otpLoading, setOtpLoading] =
        useState(false);

    const [resendLoading, setResendLoading] =
        useState(false);

    const [resendSeconds, setResendSeconds] =
        useState(0);

    // ============================================================
    // GENERAL STATE
    // ============================================================

    const [loading, setLoading] =
        useState(false);

    const [signupStep, setSignupStep] =
        useState(1);

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
    // HANDLE INPUT
    // ============================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            checked,
            type
        } = e.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === 'checkbox'
                    ? checked
                    : value
        }));

        setError('');
        setSuccess('');
    };

    // ============================================================
    // ACCOUNT TYPE
    // ============================================================

    const handleAccountTypeChange = (
        accountType
    ) => {
        setError('');
        setSuccess('');

        setFormData((previous) => ({
            ...previous,
            accountType
        }));
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        if (
            formData.accountType === 'individual' &&
            !formData.fullName.trim()
        ) {
            return 'Please enter your full name.';
        }

        if (
            formData.accountType === 'company' &&
            !formData.companyName.trim()
        ) {
            return 'Please enter your company name.';
        }

        if (!formData.email.trim()) {
            return 'Please enter your email.';
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            return 'Please enter a valid email address.';
        }

        if (formData.password.length < 8) {
            return 'Password must contain at least 8 characters.';
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            return 'Passwords do not match.';
        }

        if (!formData.location.trim()) {
            return 'Please enter your location.';
        }

        if (!formData.agreeToTerms) {
            return 'Please accept the Terms & Privacy Policy.';
        }

        return null;
    };

    // ============================================================
    // SIGNUP
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // ========================================================
        // PREVENT DOUBLE SUBMISSION
        // ========================================================
    
        if (loading) {
            return;
        }
    
        // ========================================================
        // CLEAR PREVIOUS MESSAGES
        // ========================================================
    
        setError('');
        setSuccess('');
    
        // ========================================================
        // FRONTEND VALIDATION
        // ========================================================
    
        const validationError =
            validateForm();
    
        if (validationError) {
            setError(validationError);
            return;
        }
    
        try {
    
            // ====================================================
            // START LOADING
            // ====================================================
    
            setLoading(true);
    
            // ====================================================
            // NORMALIZE EMAIL
            // ====================================================
    
            const normalizedEmail =
                formData.email
                    .trim()
                    .toLowerCase();
    
            // ====================================================
            // ACCOUNT TYPE
            // ====================================================
    
            const isCompany =
                formData.accountType === 'company';
    
            // ====================================================
            // BACKEND PAYLOAD
            // ====================================================
    
            const payload = {
    
                accountType:
                    formData.accountType,
    
                fullName:
                    isCompany
                        ? formData.companyName.trim()
                        : formData.fullName.trim(),
    
                email:
                    normalizedEmail,
    
                password:
                    formData.password,
    
                profession:
                    formData.profession,
    
                companyName:
                    formData.companyName.trim(),
    
                designation:
                    formData.designation.trim(),
    
                location:
                    formData.location.trim(),
    
                bio:
                    formData.bio.trim(),
    
                tradeIntent:
                    formData.tradeIntent,
    
                agreeToTerms:
                    formData.agreeToTerms
    
            };
    
            // ====================================================
            // DEBUG LOG
            // ====================================================
    
            console.log(
                '========================================'
            );
    
            console.log(
                'LYNKTODAY SIGNUP ATTEMPT'
            );
    
            console.log(
                'SIGNUP EMAIL:',
                normalizedEmail
            );
    
            console.log(
                'ACCOUNT TYPE:',
                payload.accountType
            );
    
            console.log(
                'PROFESSION:',
                payload.profession
            );
    
            console.log(
                'TRADE INTENT:',
                payload.tradeIntent
            );
    
            console.log(
                'AGREE TO TERMS:',
                payload.agreeToTerms
            );
    
            console.log(
                'SIGNUP PAYLOAD:',
                payload
            );
    
            console.log(
                '========================================'
            );
    
            // ====================================================
            // CREATE ACCOUNT
            // ====================================================
    
            const response =
                await api.post(
                    '/auth/signup',
                    payload
                );
    
            // ====================================================
            // RESPONSE DATA
            // ====================================================
    
            const data =
                response?.data;
    
            console.log(
                '========================================'
            );
    
            console.log(
                'SIGNUP RESPONSE:',
                data
            );
    
            console.log(
                '========================================'
            );
    
            // ====================================================
            // CHECK SUCCESS
            // ====================================================
    
            if (!data?.success) {
    
                setError(
                    data?.message ||
                    'Unable to create your account.'
                );
    
                return;
            }
    
            // ====================================================
            // EMAIL VERIFICATION REQUIRED
            // ====================================================
    
            if (
                data.requiresVerification === true
            ) {
    
                const emailForVerification =
                    data.email ||
                    normalizedEmail;
    
                // -----------------------------------------------
                // SAVE EMAIL FOR OTP VERIFICATION
                // -----------------------------------------------
    
                setVerificationEmail(
                    emailForVerification
                );
    
                // -----------------------------------------------
                // CLEAR OTP INPUT
                // -----------------------------------------------
    
                setOtp('');
    
                // -----------------------------------------------
                // CLEAR ERROR
                // -----------------------------------------------
    
                setError('');
    
                // -----------------------------------------------
                // SUCCESS MESSAGE
                // -----------------------------------------------
    
                setSuccess(
                    'Account created successfully. Please check your email for the verification OTP.'
                );
    
                // -----------------------------------------------
                // START RESEND TIMER
                // -----------------------------------------------
    
                setResendSeconds(60);
    
                // -----------------------------------------------
                // SHOW OTP SCREEN
                // -----------------------------------------------
    
                setOtpMode(true);
    
                return;
            }
    
            // ====================================================
            // FALLBACK LOGIN TOKEN
            // ====================================================
    
            if (data.token) {
    
                localStorage.setItem(
                    'lynktoday_token',
                    data.token
                );
    
            }
    
            // ====================================================
            // FALLBACK USER DATA
            // ====================================================
    
            if (data.user) {
    
                localStorage.setItem(
                    'lynktoday_user',
                    JSON.stringify(
                        data.user
                    )
                );
    
            }
    
            // ====================================================
            // REDIRECT
            // ====================================================
    
            router.push('/');
    
            router.refresh();
    
        } catch (err) {
    
            // ====================================================
            // ERROR DEBUGGING
            // ====================================================
    
            console.error(
                '========================================'
            );
    
            console.error(
                'LYNKTODAY SIGNUP ERROR'
            );
    
            console.error(
                'STATUS:',
                err?.response?.status
            );
    
            console.error(
                'DATA:',
                JSON.stringify(
                    err?.response?.data,
                    null,
                    2
                )
            );
    
            console.error(
                'MESSAGE:',
                err?.message
            );
    
            console.error(
                'FULL ERROR:',
                err
            );
    
            console.error(
                '========================================'
            );
    
            // ====================================================
            // BACKEND ERROR MESSAGE
            // ====================================================
    
            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error;
    
            // ====================================================
            // DISPLAY ERROR
            // ====================================================
    
            setError(
                backendMessage ||
                'Unable to create your account. Please try again.'
            );
    
        } finally {
    
            // ====================================================
            // STOP LOADING
            // ====================================================
    
            setLoading(false);
    
        }
    };

    // ============================================================
    // VERIFY EMAIL OTP
    // ============================================================

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otpLoading) {
            return;
        }

        setError('');
        setSuccess('');

        const cleanOtp =
            otp
                .trim()
                .replace(/\D/g, '');

        // ========================================================
        // OTP VALIDATION
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
                'Verification email is missing. Please go back and try again.'
            );

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
                'LYNKTODAY OTP VERIFICATION'
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
            // VERIFY OTP
            // ====================================================

            const response =
                await api.post(
                    '/auth/verify-email',
                    {
                        email:
                            normalizedEmail,

                        otp:
                            cleanOtp
                    }
                );

            const data =
                response?.data;

            console.log(
                'OTP VERIFICATION RESPONSE:',
                data
            );

            // ====================================================
            // CHECK VERIFICATION
            // ====================================================

            if (!data?.success) {
                setError(
                    data?.message ||
                    'Unable to verify your email.'
                );

                return;
            }

            // ====================================================
            // IMPORTANT
            //
            // Your backend verification endpoint currently
            // returns:
            //
            // {
            //   success: true,
            //   message: "Email verified successfully..."
            // }
            //
            // It does NOT return a JWT.
            //
            // Therefore we login automatically here using
            // the password the user entered during signup.
            // ====================================================

            setSuccess(
                'Email verified successfully. Signing you in...'
            );

            try {
                const loginResponse =
                    await api.post(
                        '/auth/login',
                        {
                            email:
                                normalizedEmail,

                            password:
                                formData.password
                        }
                    );

                const loginData =
                    loginResponse?.data;

                console.log(
                    'AUTO LOGIN RESPONSE:',
                    loginData
                );

                if (
                    !loginData?.success ||
                    !loginData?.token
                ) {
                    throw new Error(
                        loginData?.message ||
                        'Email verified, but automatic login failed.'
                    );
                }

                // ==================================================
                // SAVE TOKEN
                // ==================================================

                localStorage.setItem(
                    'lynktoday_token',
                    loginData.token
                );

                // ==================================================
                // SAVE USER
                // ==================================================

                if (loginData.user) {
                    localStorage.setItem(
                        'lynktoday_user',
                        JSON.stringify(
                            loginData.user
                        )
                    );
                }

                // ==================================================
                // REMOVE ANY OLD LOGIN STATE
                // ==================================================

                localStorage.removeItem(
                    'lynktoday_pending_verification'
                );

                // ==================================================
                // GO HOME
                // ==================================================

                setSuccess(
                    'Email verified successfully. Welcome to LynkToday!'
                );

                setTimeout(() => {
                    router.push('/');

                    router.refresh();
                }, 500);

            } catch (loginError) {
                console.error(
                    'AUTO LOGIN ERROR:',
                    loginError?.response?.data ||
                    loginError?.message
                );

                // Email verification succeeded.
                // Tell user to login manually if automatic
                // login happens to fail.

                setSuccess(
                    'Email verified successfully. Please sign in to continue.'
                );

                setTimeout(() => {
                    router.push('/login');
                }, 900);
            }

        } catch (err) {
            console.error(
                '========================================'
            );

            console.error(
                'LYNKTODAY OTP ERROR'
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
                'Invalid or expired OTP.'
            );

        } finally {
            setOtpLoading(false);
        }
    };

    // ============================================================
    // RESEND OTP
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
                'RESENDING VERIFICATION OTP:',
                normalizedEmail
            );

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

            if (!data?.success) {
                setError(
                    data?.message ||
                    'Unable to resend OTP.'
                );

                return;
            }

            setOtp('');

            setSuccess(
                'A new OTP has been sent to your email.'
            );

            setResendSeconds(60);

        } catch (err) {
            console.error(
                'RESEND OTP ERROR:',
                err?.response?.data ||
                err?.message
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
    // BACK TO SIGNUP
    // ============================================================

    const handleBackToSignup = () => {
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

                <div
                    className={
                        styles.leftPanel
                    }
                >
                    <div
                        className={
                            styles.overlay
                        }
                    >
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

                        <ul
                            className={
                                styles.features
                            }
                        >
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

                <div
                    className={
                        styles.rightPanel
                    }
                >
                    <div
                        className={
                            styles.card
                        }
                    >

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
                                We sent a 6-digit
                                verification code to

                                <strong
                                    className={
                                        styles.otpEmail
                                    }
                                >
                                    {' '}
                                    {verificationEmail}
                                </strong>
                            </p>

                            {/* ERROR */}

                            {error && (
                                <div
                                    className={
                                        styles.errorAlert
                                    }
                                >
                                    {error}
                                </div>
                            )}

                            {/* SUCCESS */}

                            {success && (
                                <div
                                    className={
                                        styles.successAlert
                                    }
                                >
                                    {success}
                                </div>
                            )}

                            {/* OTP FORM */}

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
                                        Enter OTP
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

                                            setSuccess('');
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

                            {/* RESEND */}

                            <div
                                className={
                                    styles.otpResend
                                }
                            >

                                <span>
                                    Didn't receive the
                                    code?
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

                            {/* BACK */}

                            <button
                                type="button"
                                className={
                                    styles.backButton
                                }
                                onClick={
                                    handleBackToSignup
                                }
                                disabled={
                                    otpLoading
                                }
                            >
                                ← Back to signup
                            </button>

                        </div>

                    </div>
                </div>

            </div>
        );
    }

    // ============================================================
    // SIGNUP SCREEN
    // ============================================================

    return (
        <>
            <style>{`
                .stepHeader{margin-bottom:18px}.stepLabel{display:block;margin-bottom:5px;color:#3B5B7A;font-size:10px;font-weight:800;letter-spacing:.1em}.stepHeader strong{display:block;color:#172033;font-size:18px;line-height:1.3}.stepHeader p{margin:5px 0 0;color:#667085;font-size:12px;line-height:1.5}
                .accountChoices{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}.choice,.choiceActive{display:flex;align-items:flex-start;gap:11px;min-height:88px;padding:14px;text-align:left;border-radius:10px;font-family:inherit;cursor:pointer;transition:.18s ease}.choice{border:1px solid #d5dce5;background:#fff;color:#172033}.choice:hover:not(:disabled){border-color:#9fb0c1;background:#f8fafc}.choiceActive{border:1px solid #3B5B7A;background:#f2f6fa;color:#172033;box-shadow:0 0 0 2px rgba(59,91,122,.08)}.choiceIcon{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#3B5B7A;color:#fff;font-size:11px;font-weight:800}.choice span:last-child{display:flex;flex-direction:column;gap:4px}.choice strong,.choiceActive strong{font-size:12px}.choice small,.choiceActive small{color:#667085;font-size:10px;line-height:1.4}
                .intentGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.intent,.intentActive{min-height:65px;padding:10px;border-radius:8px;text-align:left;font-family:inherit;cursor:pointer}.intent{border:1px solid #d5dce5;background:#fff}.intentActive{border:1px solid #3B5B7A;background:#f2f6fa}.intent strong,.intentActive strong{display:block;color:#172033;font-size:11px}.intent small,.intentActive small{display:block;margin-top:3px;color:#667085;font-size:9px;line-height:1.3}
                .nextBtn{width:100%;min-height:45px;border:0;border-radius:8px;background:#3B5B7A;color:#fff;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}.nextBtn:hover:not(:disabled){background:#2F4A63}.nextBtn span{margin-left:5px}.stepActions{display:flex;align-items:center;gap:10px;margin-top:2px}.stepActions .nextBtn,.stepActions .submitBtn{flex:1}.backStepBtn{min-height:45px;padding:0 16px;border:1px solid #d5dce5;border-radius:8px;background:#fff;color:#475467;font-family:inherit;font-size:13px;font-weight:650;cursor:pointer}.backStepBtn:hover:not(:disabled){background:#f8fafc}.backStepBtn:disabled,.nextBtn:disabled{opacity:.65;cursor:not-allowed}
                @media(max-width:700px){.accountChoices{grid-template-columns:1fr}.intentGrid{grid-template-columns:1fr}.choice,.choiceActive{min-height:auto}.stepActions{align-items:stretch}.backStepBtn{flex:0 0 auto}}
            `}</style>
            <div className={styles.container}>

            {/* ==================================================
                LEFT PANEL
            ================================================== */}

            <div
                className={
                    styles.leftPanel
                }
            >

                <div
                    className={
                        styles.overlay
                    }
                >

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

                    <ul
                        className={
                            styles.features
                        }
                    >

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

            <div
                className={
                    styles.rightPanel
                }
            >

                <div
                    className={
                        styles.card
                    }
                >

                    <h2
                        className={
                            styles.title
                        }
                    >
                        Create Your Account
                    </h2>

                    <p
                        className={
                            styles.subtitle
                        }
                    >
                        Join LynkToday and connect
                        with the global trade network.
                    </p>

                    {/* ERROR */}

                    {error && (
                        <div
                            className={
                                styles.errorAlert
                            }
                        >
                            {error}
                        </div>
                    )}

                    {/* SUCCESS */}

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
                        FORM
                    ================================================== */}

                    <form
                        className={
                            styles.form
                        }
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* STEP 1 — IDENTITY */}

                        {signupStep === 1 && (
                            <>
                                <div className={'stepHeader'}>
                                    <span className={'stepLabel'}>STEP 1 OF 2</span>
                                    <strong>Tell us how you’ll use LynkToday</strong>
                                    <p>Choose the path that matches you best. We’ll personalize the rest of your setup.</p>
                                </div>

                                <div className={'accountChoices'}>
                                    <button
                                        type="button"
                                        className={formData.accountType === 'individual' ? 'choiceActive' : 'choice'}
                                        onClick={() => handleAccountTypeChange('individual')}
                                        disabled={loading}
                                    >
                                        <span className={'choice'Icon}>P</span>
                                        <span>
                                            <strong>I’m a Professional</strong>
                                            <small>Build your network, career and trade connections.</small>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className={formData.accountType === 'company' ? 'choiceActive' : 'choice'}
                                        onClick={() => handleAccountTypeChange('company')}
                                        disabled={loading}
                                    >
                                        <span className={'choice'Icon}>B</span>
                                        <span>
                                            <strong>I’m a Business</strong>
                                            <small>Find customers, partners and logistics opportunities.</small>
                                        </span>
                                    </button>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label>{formData.accountType === 'company' ? 'What does your business do?' : 'What is your profession?'}</label>
                                    <select className={styles.input} name="profession" value={formData.profession} onChange={handleChange} disabled={loading}>
                                        <option value="Freight Forwarder">Freight Forwarder</option>
                                        <option value="Customs Broker">Customs Broker</option>
                                        <option value="Shipping Line">Shipping Line</option>
                                        <option value="Air Cargo">Air Cargo</option>
                                        <option value="Importer">Importer</option>
                                        <option value="Exporter">Exporter</option>
                                        <option value="NVOCC">NVOCC</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Transporter">Transporter</option>
                                        <option value="Trade Consultant">Trade Consultant</option>
                                        <option value="Operations Executive">Operations Executive</option>
                                        <option value="Sales Executive">Sales Executive</option>
                                        <option value="Documentation Executive">Documentation Executive</option>
                                        <option value="Logistics Executive">Logistics Executive</option>
                                        <option value="Supply Chain Executive">Supply Chain Executive</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Business Owner">Business Owner</option>
                                        <option value="Student">Student</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label>What are you looking to do?</label>
                                    <div className={'intentGrid'}>
                                        {[
                                            ['Import', 'Find import opportunities'],
                                            ['Export', 'Find export opportunities'],
                                            ['Both', 'Import & export']
                                        ].map(([value, label]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={formData.tradeIntent === value ? 'intentActive' : 'intent'}
                                                onClick={() => setFormData((previous) => ({ ...previous, tradeIntent: value }))}
                                                disabled={loading}
                                            >
                                                <strong>{value === 'Both' ? 'Import + Export' : value}</strong>
                                                <small>{label}</small>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className={'nextBtn'}
                                    onClick={() => setSignupStep(2)}
                                    disabled={loading}
                                >
                                    Continue <span>→</span>
                                </button>
                            </>
                        )}

                        {/* STEP 2 — PROFILE */}

                        {signupStep === 2 && (
                            <>
                                <div className={'stepHeader'}>
                                    <span className={'stepLabel'}>STEP 2 OF 2</span>
                                    <strong>{formData.accountType === 'company' ? 'Tell us about your business' : 'Tell us about yourself'}</strong>
                                    <p>Just the essentials for your first LynkToday profile. You can complete more later.</p>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label>{formData.accountType === 'company' ? 'Company Name' : 'Full Name'}</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name={formData.accountType === 'company' ? 'companyName' : 'fullName'}
                                        value={formData.accountType === 'company' ? formData.companyName : formData.fullName}
                                        onChange={handleChange}
                                        placeholder={formData.accountType === 'company' ? 'Your company name' : 'Your full name'}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                {formData.accountType === 'individual' && (
                                    <>
                                        <div className={styles.twoColumn}>
                                            <div className={styles.fieldGroup}>
                                                <label>Designation</label>
                                                <input type="text" className={styles.input} name="designation" value={formData.designation} onChange={handleChange} placeholder="Operations Manager" disabled={loading} />
                                            </div>
                                            <div className={styles.fieldGroup}>
                                                <label>Company / Organization</label>
                                                <input type="text" className={styles.input} name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company name" disabled={loading} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className={styles.fieldGroup}>
                                    <label>Location</label>
                                    <input type="text" className={styles.input} name="location" value={formData.location} onChange={handleChange} placeholder="Chennai, India" disabled={loading} required />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label>{formData.accountType === 'company' ? 'About your business' : 'About you'}</label>
                                    <textarea className={styles.textarea} name="bio" value={formData.bio} onChange={handleChange} placeholder={formData.accountType === 'company' ? 'What does your business offer or trade?' : 'Tell the trade community briefly about yourself.'} rows={4} disabled={loading} />
                                </div>

                                <div className={'stepActions'}>
                                    <button type="button" className={'backStepBtn'} onClick={() => setSignupStep(1)} disabled={loading}>← Back</button>
                                    <button type="button" className={'nextBtn'} onClick={() => setSignupStep(3)} disabled={loading}>Continue <span>→</span></button>
                                </div>
                            </>
                        )}

                        {/* STEP 3 — ACCOUNT */}

                        {signupStep === 3 && (
                            <>
                                <div className={'stepHeader'}>
                                    <span className={'stepLabel'}>FINAL STEP</span>
                                    <strong>Secure your account</strong>
                                    <p>Use your email to verify your LynkToday account.</p>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label>Email</label>
                                    <input type="email" className={styles.input} name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" disabled={loading} required />
                                </div>

                                <div className={styles.twoColumn}>
                                    <div className={styles.fieldGroup}>
                                        <label>Password</label>
                                        <input type="password" className={styles.input} name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" autoComplete="new-password" disabled={loading} required />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Confirm Password</label>
                                        <input type="password" className={styles.input} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" autoComplete="new-password" disabled={loading} required />
                                    </div>
                                </div>
                            </>
                        )}

                        {signupStep === 3 && (
                            <>
                                <label className={styles.terms}>
                                    <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} disabled={loading} />
                                    <span>I agree to the Terms & Privacy Policy.</span>
                                </label>

                                <div className={'stepActions'}>
                                    <button type="button" className={'backStepBtn'} onClick={() => setSignupStep(2)} disabled={loading}>← Back</button>
                                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ background: PRIMARY_COLOR }}>
                                        {loading ? 'Creating account...' : 'Create Account'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* LOGIN */}

                        <label
                            className={
                                styles.terms
                            }
                        >

                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={
                                    formData.agreeToTerms
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loading
                                }
                            />

                            <span>
                                I agree to the Terms &
                                Privacy Policy.
                            </span>

                        </label>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className={
                                styles.submitBtn
                            }
                            disabled={
                                loading
                            }
                            style={{
                                background:
                                    PRIMARY_COLOR
                            }}
                        >

                            {loading
                                ? 'Creating account...'
                                : 'Create Account'}

                        </button>

                    </form>

                    {/* LOGIN */}

                    <div
                        className={
                            styles.loginLink
                        }
                    >

                        <span>
                            Already have an account?
                        </span>

                        <Link
                            href="/login"
                            style={{
                                color:
                                    PRIMARY_COLOR
                            }}
                        >
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

            </div>
        </>
    );
}