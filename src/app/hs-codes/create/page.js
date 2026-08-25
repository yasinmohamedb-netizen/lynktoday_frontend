'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

const INITIAL_FORM = {
    hsCode: '',
    description: '',

    section: '',
    sectionNumber: '',
    chapter: '',
    chapterNumber: '',
    heading: '',
    subHeading: '',

    unit: '',
    basicDuty: '',
    igst: '',
    cess: '',

    importPolicy: '',
    exportPolicy: '',
    country: 'India',

    keywords: '',
    notes: ''
};

export default function CreateHSCodePage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [form, setForm] = useState(
        INITIAL_FORM
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ======================================================
    // AUTH
    // ======================================================

    useEffect(() => {
        try {
            const token =
                localStorage.getItem(
                    'lynktoday_token'
                );

            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );

            if (!token || !storedUser) {
                setUser(null);
                setCheckingAuth(false);
                return;
            }

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);
        } catch (authError) {
            console.error(
                'HS Code auth error:',
                authError
            );

            setUser(null);
        } finally {
            setCheckingAuth(false);
        }
    }, []);

    // ======================================================
    // INPUT CHANGE
    // ======================================================

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) {
            setError('');
        }

        if (success) {
            setSuccess('');
        }
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        const token =
            localStorage.getItem(
                'lynktoday_token'
            );

        if (!token || !user) {
            setError(
                'Please log in to create an HS Code.'
            );
            return;
        }

        if (!form.hsCode.trim()) {
            setError(
                'HS Code is required.'
            );
            return;
        }

        if (!form.description.trim()) {
            setError(
                'Description is required.'
            );
            return;
        }

        try {
            setLoading(true);

            const keywords =
                form.keywords
                    .split(',')
                    .map((keyword) =>
                        keyword.trim()
                    )
                    .filter(Boolean);

            const payload = {
                hsCode:
                    form.hsCode.trim(),

                description:
                    form.description.trim(),

                section:
                    form.section.trim(),

                sectionNumber:
                    form.sectionNumber
                        ? Number(
                            form.sectionNumber
                        )
                        : null,

                chapter:
                    form.chapter.trim(),

                chapterNumber:
                    form.chapterNumber
                        ? Number(
                            form.chapterNumber
                        )
                        : null,

                heading:
                    form.heading.trim(),

                subHeading:
                    form.subHeading.trim(),

                unit:
                    form.unit.trim(),

                basicDuty:
                    form.basicDuty.trim(),

                igst:
                    form.igst.trim(),

                cess:
                    form.cess.trim(),

                importPolicy:
                    form.importPolicy.trim(),

                exportPolicy:
                    form.exportPolicy.trim(),

                country:
                    form.country.trim() ||
                    'India',

                keywords,

                notes:
                    form.notes.trim(),

                isActive: true
            };

            const response =
                await fetch(
                    `${API_BASE_URL}/hs-codes`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify(
                            payload
                        )
                    }
                );

            const contentType =
                response.headers.get(
                    'content-type'
                ) || '';

            let data = null;

            if (
                contentType.includes(
                    'application/json'
                )
            ) {
                data =
                    await response.json();
            } else {
                const text =
                    await response.text();

                console.error(
                    'HS Code API returned non-JSON:',
                    text
                );

                throw new Error(
                    `Server returned ${response.status}.`
                );
            }

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to create HS Code.'
                );
            }

            setSuccess(
                'HS Code created successfully.'
            );

            const createdHSCode =
                data.hsCode;

            if (
                createdHSCode?._id
            ) {
                setTimeout(() => {
                    router.push(
                        `/hs-codes/${createdHSCode._id}`
                    );
                }, 700);

                return;
            }

            setForm(
                INITIAL_FORM
            );
        } catch (submitError) {
            console.error(
                'Create HS Code error:',
                submitError
            );

            if (
                submitError?.message
                    ?.toLowerCase()
                    ?.includes('401')
            ) {
                setError(
                    'Your session has expired. Please log in again.'
                );
            } else {
                setError(
                    submitError?.message ||
                    'Unable to create HS Code.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // LOADING AUTH
    // ======================================================

    if (checkingAuth) {
        return (
            <main
                className={
                    styles.container
                }
            >
                <div
                    className={
                        styles.stateCard
                    }
                >
                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <h2>
                        Checking account
                    </h2>

                    <p>
                        Please wait...
                    </p>
                </div>
            </main>
        );
    }

    // ======================================================
    // NOT LOGGED IN
    // ======================================================

    if (!user) {
        return (
            <main
                className={
                    styles.container
                }
            >
                <div
                    className={
                        styles.stateCard
                    }
                >
                    <div
                        className={
                            styles.stateIcon
                        }
                    >
                        🔐
                    </div>

                    <h1>
                        Login required
                    </h1>

                    <p>
                        You need to be logged in
                        to create an HS Code.
                    </p>

                    <Link
                        href="/login"
                        className={
                            styles.primaryButton
                        }
                    >
                        Login
                    </Link>

                    <Link
                        href="/"
                        className={
                            styles.secondaryButton
                        }
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    // ======================================================
    // FORM
    // ======================================================

    return (
        <main
            className={
                styles.container
            }
        >
            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className={
                    styles.header
                }
            >
                <div>
                    <Link
                        href="/documentation"
                        className={
                            styles.backButton
                        }
                    >
                        ← Back to Documentation
                    </Link>

                    <div
                        className={
                            styles.headingBlock
                        }
                    >
                        <span
                            className={
                                styles.eyebrow
                            }
                        >
                            HS CODE
                        </span>

                        <h1>
                            Create HS Code
                        </h1>

                        <p>
                            Add an HS Code and
                            share classification
                            information with the
                            LynkToday community.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==========================================
                FORM
            ========================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
                className={
                    styles.form
                }
            >
                {/* ======================================
                    BASIC INFORMATION
                ====================================== */}

                <section
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <span
                                className={
                                    styles.sectionNumber
                                }
                            >
                                01
                            </span>

                            <div>
                                <h2>
                                    Basic Information
                                </h2>

                                <p>
                                    Enter the HS
                                    Code and its
                                    description.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            styles.grid
                        }
                    >
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="hsCode">
                                HS Code
                                <span>
                                    *
                                </span>
                            </label>

                            <input
                                id="hsCode"
                                name="hsCode"
                                type="text"
                                value={
                                    form.hsCode
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="62034200"
                                required
                            />

                            <small>
                                Enter the complete
                                HS Code.
                            </small>
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="country">
                                Country
                            </label>

                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={
                                    form.country
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="India"
                            />
                        </div>

                        <div
                            className={`${styles.field} ${styles.fullWidth}`}
                        >
                            <label htmlFor="description">
                                Description
                                <span>
                                    *
                                </span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Men's or boys' trousers and breeches of cotton"
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* ======================================
                    CLASSIFICATION
                ====================================== */}

                <section
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <span
                                className={
                                    styles.sectionNumber
                                }
                            >
                                02
                            </span>

                            <div>
                                <h2>
                                    Classification
                                </h2>

                                <p>
                                    Add section,
                                    chapter and
                                    heading details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            styles.grid
                        }
                    >
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="section">
                                Section
                            </label>

                            <input
                                id="section"
                                name="section"
                                type="text"
                                value={
                                    form.section
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Textiles and Textile Articles"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="sectionNumber">
                                Section Number
                            </label>

                            <input
                                id="sectionNumber"
                                name="sectionNumber"
                                type="number"
                                min="1"
                                value={
                                    form.sectionNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="11"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="chapter">
                                Chapter
                            </label>

                            <input
                                id="chapter"
                                name="chapter"
                                type="text"
                                value={
                                    form.chapter
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Articles of apparel and clothing accessories"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="chapterNumber">
                                Chapter Number
                            </label>

                            <input
                                id="chapterNumber"
                                name="chapterNumber"
                                type="number"
                                min="1"
                                value={
                                    form.chapterNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="62"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="heading">
                                Heading
                            </label>

                            <input
                                id="heading"
                                name="heading"
                                type="text"
                                value={
                                    form.heading
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="6203"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="subHeading">
                                Sub Heading
                            </label>

                            <input
                                id="subHeading"
                                name="subHeading"
                                type="text"
                                value={
                                    form.subHeading
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="620342"
                            />
                        </div>
                    </div>
                </section>

                {/* ======================================
                    TARIFF INFORMATION
                ====================================== */}

                <section
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <span
                                className={
                                    styles.sectionNumber
                                }
                            >
                                03
                            </span>

                            <div>
                                <h2>
                                    Tariff Information
                                </h2>

                                <p>
                                    Add duty and tax
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            styles.grid
                        }
                    >
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="unit">
                                Unit
                            </label>

                            <input
                                id="unit"
                                name="unit"
                                type="text"
                                value={
                                    form.unit
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="KG"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="basicDuty">
                                Basic Duty
                            </label>

                            <input
                                id="basicDuty"
                                name="basicDuty"
                                type="text"
                                value={
                                    form.basicDuty
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="10%"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="igst">
                                IGST
                            </label>

                            <input
                                id="igst"
                                name="igst"
                                type="text"
                                value={
                                    form.igst
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="5%"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="cess">
                                Cess
                            </label>

                            <input
                                id="cess"
                                name="cess"
                                type="text"
                                value={
                                    form.cess
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="0%"
                            />
                        </div>
                    </div>
                </section>

                {/* ======================================
                    TRADE INFORMATION
                ====================================== */}

                <section
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <span
                                className={
                                    styles.sectionNumber
                                }
                            >
                                04
                            </span>

                            <div>
                                <h2>
                                    Trade Information
                                </h2>

                                <p>
                                    Add import and
                                    export policy
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            styles.grid
                        }
                    >
                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="importPolicy">
                                Import Policy
                            </label>

                            <input
                                id="importPolicy"
                                name="importPolicy"
                                type="text"
                                value={
                                    form.importPolicy
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Free"
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="exportPolicy">
                                Export Policy
                            </label>

                            <input
                                id="exportPolicy"
                                name="exportPolicy"
                                type="text"
                                value={
                                    form.exportPolicy
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Free"
                            />
                        </div>
                    </div>
                </section>

                {/* ======================================
                    ADDITIONAL INFORMATION
                ====================================== */}

                <section
                    className={
                        styles.section
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <span
                                className={
                                    styles.sectionNumber
                                }
                            >
                                05
                            </span>

                            <div>
                                <h2>
                                    Additional Information
                                </h2>

                                <p>
                                    Add keywords and
                                    notes to help the
                                    community find
                                    this HS Code.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            styles.grid
                        }
                    >
                        <div
                            className={`${styles.field} ${styles.fullWidth}`}
                        >
                            <label htmlFor="keywords">
                                Keywords
                            </label>

                            <input
                                id="keywords"
                                name="keywords"
                                type="text"
                                value={
                                    form.keywords
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="cotton trousers, mens trousers, apparel"
                            />

                            <small>
                                Separate multiple
                                keywords with commas.
                            </small>
                        </div>

                        <div
                            className={`${styles.field} ${styles.fullWidth}`}
                        >
                            <label htmlFor="notes">
                                Notes
                            </label>

                            <textarea
                                id="notes"
                                name="notes"
                                value={
                                    form.notes
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Additional information about this HS Code..."
                                rows={5}
                            />
                        </div>
                    </div>
                </section>

                {/* ======================================
                    STATUS
                ====================================== */}

                {error && (
                    <div
                        className={
                            styles.error
                        }
                    >
                        <strong>
                            Unable to create HS Code
                        </strong>

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {success && (
                    <div
                        className={
                            styles.success
                        }
                    >
                        {success}
                    </div>
                )}

                {/* ======================================
                    ACTIONS
                ====================================== */}

                <div
                    className={
                        styles.actions
                    }
                >
                    <Link
                        href="/documentation"
                        className={
                            styles.cancelButton
                        }
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className={
                            styles.submitButton
                        }
                    >
                        {loading
                            ? 'Creating HS Code...'
                            : 'Create HS Code'}
                    </button>
                </div>

                <p
                    className={
                        styles.disclaimer
                    }
                >
                    Please make sure the HS Code
                    information is accurate before
                    submitting. Duplicate HS Codes
                    cannot be created.
                </p>
            </form>
        </main>
    );
}