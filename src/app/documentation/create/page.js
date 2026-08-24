'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './create.module.css';


// ======================================================
// API
// ======================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// CATEGORIES
// ======================================================

const categories = [
    'Customs',
    'Import',
    'Export',
    'DGFT',
    'GST',
    'FEMA',
    'HS Code',
    'Shipping',
    'Logistics',
    'General'
];


// ======================================================
// DOCUMENT TYPES
// ======================================================

const documentTypes = [
    'GUIDE',
    'ARTICLE',
    'PROCEDURE',
    'CHECKLIST',
    'REGULATION',
    'CIRCULAR',
    'CASE_STUDY',
    'REFERENCE'
];


// ======================================================
// PAGE
// ======================================================

export default function CreateDocumentationPage() {

    const router = useRouter();


    // ==================================================
    // FORM
    // ==================================================

    const [form, setForm] = useState({

        title: '',

        description: '',

        documentType: 'GUIDE',

        category: 'Customs',

        content: '',

        hsCode: '',

        tags: ''

    });


    // ==================================================
    // STATE
    // ==================================================

    const [token, setToken] =
        useState(null);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState('');


    const [success, setSuccess] =
        useState('');


    // ==================================================
    // LOAD TOKEN
    // ==================================================

    useEffect(() => {

        const storedToken =
            localStorage.getItem(
                'lynktoday_token'
            );

        setToken(
            storedToken
        );

    }, []);


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]: value

            })
        );

    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError('');
        setSuccess('');


        // ==============================================
        // LOGIN
        // ==============================================

        if (!token) {

            setError(
                'Please login before creating documentation.'
            );

            return;

        }


        // ==============================================
        // VALIDATION
        // ==============================================

        if (
            !form.title.trim()
        ) {

            setError(
                'Please enter a documentation title.'
            );

            return;

        }


        if (
            !form.description.trim()
        ) {

            setError(
                'Please add a short description.'
            );

            return;

        }


        if (
            !form.content.trim()
        ) {

            setError(
                'Please write the documentation content.'
            );

            return;

        }


        try {

            setLoading(true);


            // ==========================================
            // PAYLOAD
            // ==========================================

            const payload = {

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                documentType:
                    form.documentType,

                category:
                    form.category,

                content:
                    form.content.trim(),

                hsCode:
                    form.hsCode.trim(),

                tags:
                    form.tags
                        .split(',')
                        .map(
                            tag =>
                                tag.trim()
                        )
                        .filter(
                            Boolean
                        )

            };


            // ==========================================
            // API
            // ==========================================

            const response =
                await fetch(
                    `${API_BASE_URL}/documentation`,
                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            const data =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    data.message ||
                    'Failed to create documentation.'
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                'Documentation published successfully.'
            );


            const created =
                data.documentation ||
                data.document ||
                data.data;


            // ==========================================
            // REDIRECT
            // ==========================================

            setTimeout(() => {

                if (
                    created?._id
                ) {

                    router.push(
                        `/documentation/${created._id}`
                    );

                } else {

                    router.push(
                        '/documentation'
                    );

                }

            }, 700);


        } catch (error) {

            console.error(
                'Create documentation error:',
                error
            );


            setError(
                error.message ||
                'Unable to create documentation.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (
        token === null
    ) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.loading
                    }
                >

                    <div
                        className={
                            styles.loadingSpinner
                        }
                    />

                    <p>
                        Loading...
                    </p>

                </div>

            </main>

        );

    }


    // ==================================================
    // LOGIN REQUIRED
    // ==================================================

    if (!token) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.container
                    }
                >

                    <Link
                        href="/documentation"
                        className={
                            styles.back
                        }
                    >

                        ← Documentation

                    </Link>


                    <div
                        className={
                            styles.loginCard
                        }
                    >

                        <div
                            className={
                                styles.loginIcon
                            }
                        >
                            🔐
                        </div>


                        <h2>
                            Login Required
                        </h2>


                        <p>
                            Login to your LynkToday
                            account to share documentation
                            with the community.
                        </p>


                        <Link
                            href="/login"
                            className={
                                styles.loginButton
                            }
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </main>

        );

    }


    // ==================================================
    // MAIN
    // ==================================================

    return (

        <main
            className={
                styles.page
            }
        >

            <div
                className={
                    styles.container
                }
            >

                {/* ==================================================
                    BACK
                ================================================== */}

                <Link
                    href="/documentation"
                    className={
                        styles.back
                    }
                >

                    <span>
                        ←
                    </span>

                    Documentation

                </Link>


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div
                    className={
                        styles.pageHeader
                    }
                >

                    <div
                        className={
                            styles.headerIcon
                        }
                    >
                        📚
                    </div>


                    <div>

                        <h1>
                            Create Documentation
                        </h1>

                        <p>
                            Share your knowledge,
                            experience and useful
                            trade information with
                            the LynkToday community.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    MAIN CARD
                ================================================== */}

                <div
                    className={
                        styles.card
                    }
                >

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* ==================================================
                            ERROR
                        ================================================== */}

                        {
                            error && (

                                <div
                                    className={
                                        styles.error
                                    }
                                >

                                    <span>
                                        ⚠
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

                            )
                        }


                        {/* ==================================================
                            SUCCESS
                        ================================================== */}

                        {
                            success && (

                                <div
                                    className={
                                        styles.success
                                    }
                                >

                                    <span>
                                        ✓
                                    </span>

                                    {success}

                                </div>

                            )
                        }


                        {/* ==================================================
                            BASIC INFORMATION
                        ================================================== */}

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
                                            Give your documentation
                                            a clear title and context.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ==========================================
                                TITLE
                            ========================================== */}

                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label
                                    htmlFor="title"
                                >

                                    Documentation Title

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="title"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Bill of Entry Documentation Guide"
                                    maxLength={200}
                                />


                                <div
                                    className={
                                        styles.fieldFooter
                                    }
                                >

                                    <span>
                                        Use a clear and specific title.
                                    </span>

                                    <span>
                                        {
                                            form.title.length
                                        }/200
                                    </span>

                                </div>

                            </div>


                            {/* ==========================================
                                DESCRIPTION
                            ========================================== */}

                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label
                                    htmlFor="description"
                                >

                                    Short Description

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
                                    rows={4}
                                    maxLength={500}
                                    placeholder="Briefly explain what readers will learn from this documentation..."
                                />


                                <div
                                    className={
                                        styles.fieldFooter
                                    }
                                >

                                    <span>
                                        Keep it short and useful.
                                    </span>

                                    <span>
                                        {
                                            form.description.length
                                        }/500
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            CLASSIFICATION
                        ================================================== */}

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
                                        Help professionals find
                                        your documentation easily.
                                    </p>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.twoColumn
                                }
                            >

                                {/* ======================================
                                    DOCUMENT TYPE
                                ====================================== */}

                                <div
                                    className={
                                        styles.field
                                    }
                                >

                                    <label
                                        htmlFor="documentType"
                                    >
                                        Document Type
                                    </label>


                                    <select
                                        id="documentType"
                                        name="documentType"
                                        value={
                                            form.documentType
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        {
                                            documentTypes.map(
                                                type => (

                                                    <option
                                                        key={
                                                            type
                                                        }

                                                        value={
                                                            type
                                                        }
                                                    >

                                                        {
                                                            type
                                                        }

                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                </div>


                                {/* ======================================
                                    CATEGORY
                                ====================================== */}

                                <div
                                    className={
                                        styles.field
                                    }
                                >

                                    <label
                                        htmlFor="category"
                                    >
                                        Category
                                    </label>


                                    <select
                                        id="category"
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        {
                                            categories.map(
                                                category => (

                                                    <option
                                                        key={
                                                            category
                                                        }

                                                        value={
                                                            category
                                                        }
                                                    >

                                                        {
                                                            category
                                                        }

                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                </div>

                            </div>


                            {/* ==========================================
                                HS CODE
                            ========================================== */}

                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label
                                    htmlFor="hsCode"
                                >

                                    Related HS Code

                                    <span
                                        className={
                                            styles.optional
                                        }
                                    >
                                        Optional
                                    </span>

                                </label>


                                <input
                                    id="hsCode"
                                    name="hsCode"
                                    value={
                                        form.hsCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: 62034200"
                                />


                                <small>
                                    Add an HS Code if this
                                    documentation relates to
                                    a specific product or tariff.
                                </small>

                            </div>


                            {/* ==========================================
                                TAGS
                            ========================================== */}

                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label
                                    htmlFor="tags"
                                >
                                    Tags
                                </label>


                                <input
                                    id="tags"
                                    name="tags"
                                    value={
                                        form.tags
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Customs, Import, Bill of Entry"
                                />


                                <small>
                                    Separate multiple tags
                                    with commas.
                                </small>

                            </div>

                        </section>


                        {/* ==================================================
                            CONTENT
                        ================================================== */}

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

                                <span
                                    className={
                                        styles.sectionNumber
                                    }
                                >
                                    03
                                </span>


                                <div>

                                    <h2>
                                        Documentation Content
                                    </h2>

                                    <p>
                                        Write the detailed information
                                        you want to share.
                                    </p>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.contentEditor
                                }
                            >

                                <div
                                    className={
                                        styles.editorToolbar
                                    }
                                >

                                    <span>
                                        DOCUMENT CONTENT
                                    </span>

                                    <span>
                                        Plain text
                                    </span>

                                </div>


                                <textarea
                                    id="content"
                                    name="content"
                                    value={
                                        form.content
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={20}
                                    placeholder={`Start writing your documentation...

Example:

1. Introduction

Explain the purpose of this document.

2. Required Documents

• Commercial Invoice
• Packing List
• Bill of Lading
• Certificate of Origin

3. Customs Procedure

Explain the process step by step.

4. Important Notes

Add any practical tips or common mistakes to avoid.`}
                                />


                                <div
                                    className={
                                        styles.editorFooter
                                    }
                                >

                                    <span>
                                        💡 Tip: Use headings,
                                        numbered steps and bullet
                                        points to make your guide
                                        easier to read.
                                    </span>

                                    <span>
                                        {
                                            form.content.length
                                        } characters
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            ATTACHMENTS
                        ================================================== */}

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

                                <span
                                    className={
                                        styles.sectionNumber
                                    }
                                >
                                    04
                                </span>


                                <div>

                                    <h2>
                                        Attachments
                                    </h2>

                                    <p>
                                        Add supporting documents
                                        and images to your guide.
                                    </p>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.comingSoon
                                }
                            >

                                <div
                                    className={
                                        styles.comingSoonIcon
                                    }
                                >
                                    📎
                                </div>


                                <div
                                    className={
                                        styles.comingSoonContent
                                    }
                                >

                                    <div
                                        className={
                                            styles.comingSoonTitle
                                        }
                                    >

                                        File & Image Upload

                                        <span>
                                            Coming Soon
                                        </span>

                                    </div>


                                    <p>
                                        Uploading PDFs, documents,
                                        screenshots and images is
                                        not available in this version.
                                        We plan to add secure file and
                                        image uploads in a future update.
                                    </p>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            GUIDELINES
                        ================================================== */}

                        <div
                            className={
                                styles.guidelines
                            }
                        >

                            <div
                                className={
                                    styles.guidelineIcon
                                }
                            >
                                💡
                            </div>


                            <div>

                                <strong>
                                    Make your documentation useful
                                </strong>

                                <ul>

                                    <li>
                                        Use a clear and descriptive title.
                                    </li>

                                    <li>
                                        Explain procedures step by step.
                                    </li>

                                    <li>
                                        Include practical tips and
                                        important notes.
                                    </li>

                                    <li>
                                        Avoid sharing confidential
                                        or sensitive information.
                                    </li>

                                </ul>

                            </div>

                        </div>


                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

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
                                disabled={
                                    loading
                                }

                                className={
                                    styles.submit
                                }
                            >

                                {
                                    loading ? (

                                        <>
                                            <span
                                                className={
                                                    styles.buttonSpinner
                                                }
                                            />

                                            Publishing...

                                        </>

                                    ) : (

                                        <>
                                            Publish Documentation
                                            <span>
                                                →
                                            </span>
                                        </>

                                    )
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </main>

    );

}