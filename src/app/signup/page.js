'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';

import styles from './signup.module.css';

export default function Signup() {

    const router = useRouter();

    // ==================================================
    // FORM STATE
    // ==================================================

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

        agreeToTerms: false

    });

    // ==================================================
    // OTP STATE
    // ==================================================

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

    // ==================================================
    // GENERAL STATE
    // ==================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    // ==================================================
    // HANDLE INPUT
    // ==================================================

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
    };

    // ==================================================
    // ACCOUNT TYPE
    // ==================================================

    const handleAccountTypeChange = (type) => {

        setError('');

        setFormData((previous) => ({

            ...previous,

            accountType: type

        }));

    };

    // ==================================================
    // VALIDATION
    // ==================================================

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

    // ==================================================
    // START OTP RESEND COUNTDOWN
    // ==================================================

    const startResendCountdown = () => {

        setResendSeconds(60);

        const interval = setInterval(() => {

            setResendSeconds((previous) => {

                if (previous <= 1) {

                    clearInterval(interval);

                    return 0;

                }

                return previous - 1;

            });

        }, 1000);

    };

    // ==================================================
    // SIGNUP
    // ==================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');

        const validationError =
            validateForm();

        if (validationError) {

            setError(validationError);

            return;

        }

        try {

            setLoading(true);

            const isCompany =
                formData.accountType === 'company';

            const payload = {

                accountType:
                    formData.accountType,

                fullName:
                    isCompany
                        ? formData.companyName.trim()
                        : formData.fullName.trim(),

                email:
                    formData.email.trim().toLowerCase(),

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

                agreeToTerms:
                    formData.agreeToTerms

            };

            const { data } = await api.post(
                '/auth/signup',
                payload
            );

            if (!data?.success) {

                setError(
                    data?.message ||
                    'Unable to create your account.'
                );

                return;

            }

            // ==================================================
            // EMAIL VERIFICATION REQUIRED
            // ==================================================

            if (data.requiresEmailVerification) {

                setVerificationEmail(
                    data.email ||
                    formData.email.trim().toLowerCase()
                );

                setOtp('');

                setOtpMode(true);

                setSuccess(
                    'OTP sent successfully to your email.'
                );

                startResendCountdown();

                return;

            }

            // ==================================================
            // FALLBACK
            // ==================================================

            if (data.token) {

                localStorage.setItem(
                    'lynktoday_token',
                    data.token
                );

            }

            if (data.user) {

                localStorage.setItem(
                    'lynktoday_user',
                    JSON.stringify(data.user)
                );

            }

            router.push('/');

            router.refresh();

        } catch (err) {

            console.error(
                'Signup error:',
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Unable to create your account.'
            );

        } finally {

            setLoading(false);

        }

    };

    // ==================================================
    // VERIFY OTP
    // ==================================================

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');

        if (!otp.trim()) {

            setError(
                'Please enter the OTP.'
            );

            return;

        }

        if (!/^\d{6}$/.test(otp)) {

            setError(
                'Please enter the 6-digit OTP.'
            );

            return;

        }

        try {

            setOtpLoading(true);

            const { data } = await api.post(
                '/auth/verify-email',
                {
                    email: verificationEmail,
                    otp: otp.trim()
                }
            );

            if (!data?.success) {

                setError(
                    data?.message ||
                    'Unable to verify your email.'
                );

                return;

            }

            // ==================================================
            // SAVE AUTH DATA ONLY AFTER OTP VERIFICATION
            // ==================================================

            if (data.token) {

                localStorage.setItem(
                    'lynktoday_token',
                    data.token
                );

            }

            if (data.user) {

                localStorage.setItem(
                    'lynktoday_user',
                    JSON.stringify(data.user)
                );

            }

            setSuccess(
                'Email verified successfully.'
            );

            // Small delay so user can see success message

            setTimeout(() => {

                router.push('/');

                router.refresh();

            }, 500);

        } catch (err) {

            console.error(
                'OTP verification error:',
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Invalid or expired OTP.'
            );

        } finally {

            setOtpLoading(false);

        }

    };

    // ==================================================
    // RESEND OTP
    // ==================================================

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

            const { data } = await api.post(
                '/auth/resend-otp',
                {
                    email: verificationEmail
                }
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

            startResendCountdown();

        } catch (err) {

            console.error(
                'Resend OTP error:',
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Unable to resend OTP.'
            );

        } finally {

            setResendLoading(false);

        }

    };

    // ==================================================
    // OTP SCREEN
    // ==================================================

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
                            Trade Community
                        </h2>

                        <p>
                            Connect with freight forwarders,
                            customs brokers, importers,
                            exporters, shipping lines and
                            trade professionals worldwide.
                        </p>

                        <ul className={styles.features}>

                            <li>Sea Freight</li>
                            <li>Air Freight</li>
                            <li>Customs Clearance</li>
                            <li>Import & Export</li>
                            <li>Global Trade Network</li>
                            <li>Verified Professionals</li>

                        </ul>

                    </div>

                </div>

                {/* ==================================================
                    OTP PANEL
                ================================================== */}

                <div className={styles.rightPanel}>

                    <div className={styles.card}>

                        <div className={styles.otpContainer}>

                            <div className={styles.otpIcon}>
                                ✉
                            </div>

                            <h2 className={styles.title}>
                                Verify Your Email
                            </h2>

                            <p className={styles.subtitle}>

                                We sent a 6-digit verification
                                code to

                                <strong
                                    className={
                                        styles.otpEmail
                                    }
                                >
                                    {verificationEmail}
                                </strong>

                            </p>

                            {error && (

                                <div
                                    className={
                                        styles.errorAlert
                                    }
                                >
                                    {error}
                                </div>

                            )}

                            {success && (

                                <div
                                    className={
                                        styles.successAlert
                                    }
                                >
                                    {success}
                                </div>

                            )}

                            <form
                                className={styles.form}
                                onSubmit={handleVerifyOtp}
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

                                        }}
                                        placeholder="000000"
                                        disabled={otpLoading}
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
                                >

                                    {otpLoading
                                        ? 'Verifying...'
                                        : 'Verify Email'}

                                </button>

                            </form>

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
                                        resendSeconds > 0
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

                            <button
                                type="button"
                                className={
                                    styles.backButton
                                }
                                onClick={() => {

                                    setOtpMode(false);

                                    setOtp('');

                                    setError('');

                                    setSuccess('');

                                }}
                                disabled={otpLoading}
                            >

                                ← Back to signup

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    // ==================================================
    // SIGNUP SCREEN
    // ==================================================

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
                        Trade Community
                    </h2>

                    <p>
                        Connect with freight forwarders,
                        customs brokers, importers,
                        exporters, shipping lines,
                        logistics companies and trade
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
                        Create Your Account
                    </h2>

                    <p className={styles.subtitle}>
                        Join the largest trade networking
                        community.
                    </p>

                    {error && (

                        <div
                            className={
                                styles.errorAlert
                            }
                        >
                            {error}
                        </div>

                    )}

                    {success && (

                        <div
                            className={
                                styles.successAlert
                            }
                        >
                            {success}
                        </div>

                    )}

                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
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
                                    disabled={loading}
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
                                    disabled={loading}
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

                                {formData.accountType ===
                                'company'
                                    ? 'Company Name'
                                    : 'Full Name'}

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
                                    disabled={loading}
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
                                    placeholder="John Smith"
                                    disabled={loading}
                                    required
                                />

                            )}

                        </div>

                        {/* EMAIL */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>
                                Email Address
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
                                placeholder="john@email.com"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* PASSWORD */}

                        <div
                            className={
                                styles.twoColumn
                            }
                        >

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
                                    disabled={loading}
                                    required
                                />

                            </div>

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
                                    placeholder="Confirm password"
                                    disabled={loading}
                                    required
                                />

                            </div>

                        </div>

                        {/* PROFESSION */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>

                                {formData.accountType ===
                                'company'
                                    ? 'Business Type'
                                    : 'Profession'}

                            </label>

                            <select
                                className={
                                    styles.select
                                }
                                name="profession"
                                value={
                                    formData.profession
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={loading}
                            >

                                <option>
                                    Freight Forwarder
                                </option>

                                <option>
                                    Customs Broker
                                </option>

                                <option>
                                    Importer
                                </option>

                                <option>
                                    Exporter
                                </option>

                                <option>
                                    Shipping Line
                                </option>

                                <option>
                                    Air Cargo
                                </option>

                                <option>
                                    NVOCC
                                </option>

                                <option>
                                    Warehouse
                                </option>

                                <option>
                                    Transporter
                                </option>

                                <option>
                                    Trade Consultant
                                </option>

                                <option>
                                    Student
                                </option>

                                <option>
                                    Other
                                </option>

                            </select>

                        </div>

                        {/* INDIVIDUAL FIELDS */}

                        {formData.accountType ===
                        'individual' && (

                            <div
                                className={
                                    styles.twoColumn
                                }
                            >

                                <div
                                    className={
                                        styles.fieldGroup
                                    }
                                >

                                    <label>
                                        Company
                                    </label>

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
                                        placeholder="Company Name"
                                        disabled={loading}
                                    />

                                </div>

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
                                        placeholder="Operations Executive"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                        )}

                        {/* COMPANY CONTACT */}

                        {formData.accountType ===
                        'company' && (

                            <div
                                className={
                                    styles.fieldGroup
                                }
                            >

                                <label>
                                    Contact Person
                                    <span
                                        style={{
                                            fontWeight: 400,
                                            color: '#94a3b8'
                                        }}
                                    >
                                        {' '}
                                        (Optional)
                                    </span>
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
                                    placeholder="John Smith"
                                    disabled={loading}
                                />

                            </div>

                        )}

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
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* BIO */}

                        <div
                            className={
                                styles.fieldGroup
                            }
                        >

                            <label>

                                {formData.accountType ===
                                'company'
                                    ? 'Company Description'
                                    : 'Short Bio'}

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
                                rows={4}
                                placeholder={
                                    formData.accountType ===
                                    'company'
                                        ? 'Tell the community about your company...'
                                        : 'Tell the community about yourself...'
                                }
                                disabled={loading}
                            />

                        </div>

                        {/* TERMS */}

                        <label
                            className={
                                styles.checkbox
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
                                disabled={loading}
                            />

                            <span>
                                I agree to the Terms of
                                Service and Privacy Policy
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

                            {loading
                                ? 'Creating Account...'
                                : formData.accountType ===
                                  'company'
                                    ? 'Register Company'
                                    : 'Create Account'}

                        </button>

                    </form>

                    {/* FOOTER */}

                    <div
                        className={
                            styles.footer
                        }
                    >

                        Already have an account?

                        <Link
                            href="/login"
                            className={
                                styles.link
                            }
                        >
                            Sign In
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}