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

        if (formData.password.length < 6) {
            return 'Password must contain at least 6 characters.';
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

                        {/* ACCOUNT TYPE */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Create Account As
                            </label>

                            <div
                                className={
                                    styles.accountTypeSelector
                                }
                            >

                                <button
                                    type="button"
                                    className={
                                        formData.accountType ===
                                        'individual'
                                            ? styles.activeType
                                            : styles.accountTypeBtn
                                    }
                                    onClick={() =>
                                        handleAccountTypeChange(
                                            'individual'
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    Individual
                                </button>

                                <button
                                    type="button"
                                    className={
                                        formData.accountType ===
                                        'company'
                                            ? styles.activeType
                                            : styles.accountTypeBtn
                                    }
                                    onClick={() =>
                                        handleAccountTypeChange(
                                            'company'
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    Company
                                </button>

                            </div>

                        </div>

                        {/* NAME */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                {
                                    formData.accountType ===
                                    'company'
                                        ? 'Company Name'
                                        : 'Full Name'
                                }
                            </label>

                            {formData.accountType ===
                            'company' ? (

                                <input
                                    type="text"
                                    className={
                                        styles.input
                                    }
                                    name="companyName"
                                    value={
                                        formData.companyName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Maersk India"
                                    disabled={
                                        loading
                                    }
                                    required
                                />

                            ) : (

                                <input
                                    type="text"
                                    className={
                                        styles.input
                                    }
                                    name="fullName"
                                    value={
                                        formData.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Mohamed Yasin"
                                    disabled={
                                        loading
                                    }
                                    required
                                />

                            )}

                        </div>

                        {/* PROFESSION */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Profession
                            </label>

                            <select
                                className={
                                    styles.input
                                }
                                name="profession"
                                value={
                                    formData.profession
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loading
                                }
                            >

                                <option value="Freight Forwarder">
                                    Freight Forwarder
                                </option>

                                <option value="Customs Broker">
                                    Customs Broker
                                </option>

                                <option value="Shipping Line">
                                    Shipping Line
                                </option>

                                <option value="Air Cargo">
                                    Air Cargo
                                </option>

                                <option value="Importer">
                                    Importer
                                </option>

                                <option value="Exporter">
                                    Exporter
                                </option>

                                <option value="NVOCC">
                                    NVOCC
                                </option>

                                <option value="Warehouse">
                                    Warehouse
                                </option>

                                <option value="Transporter">
                                    Transporter
                                </option>

                                <option value="Trade Consultant">
                                    Trade Consultant
                                </option>

                                <option value="Operations Executive">
                                    Operations Executive
                                </option>

                                <option value="Sales Executive">
                                    Sales Executive
                                </option>

                                <option value="Documentation Executive">
                                    Documentation Executive
                                </option>

                                <option value="Logistics Executive">
                                    Logistics Executive
                                </option>

                                <option value="Supply Chain Executive">
                                    Supply Chain Executive
                                </option>

                                <option value="Manager">
                                    Manager
                                </option>

                                <option value="Business Owner">
                                    Business Owner
                                </option>

                                <option value="Student">
                                    Student
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                        {/* DESIGNATION */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Designation
                            </label>

                            <input
                                type="text"
                                className={
                                    styles.input
                                }
                                name="designation"
                                value={
                                    formData.designation
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Operations Manager"
                                disabled={
                                    loading
                                }
                            />

                        </div>

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
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={
                                    loading
                                }
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
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Minimum 6 characters"
                                autoComplete="new-password"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        {/* CONFIRM PASSWORD */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                className={
                                    styles.input
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Re-enter your password"
                                autoComplete="new-password"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        {/* LOCATION */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                className={
                                    styles.input
                                }
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Chennai, India"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        {/* TRADE INTENT */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Trade Interest
                            </label>

                            <select
                                className={
                                    styles.input
                                }
                                name="tradeIntent"
                                value={
                                    formData.tradeIntent
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loading
                                }
                            >

                                <option value="Both">
                                    Import & Export
                                </option>

                                <option value="Import">
                                    Import
                                </option>

                                <option value="Export">
                                    Export
                                </option>

                            </select>

                        </div>

                        {/* BIO */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Bio
                            </label>

                            <textarea
                                className={
                                    styles.textarea
                                }
                                name="bio"
                                value={
                                    formData.bio
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Tell us briefly about yourself or your business."
                                rows={4}
                                disabled={
                                    loading
                                }
                            />

                        </div>

                        {/* TERMS */}

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
    );
}