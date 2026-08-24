'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './create.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

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

const tagOptions = [
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

export default function CreateDocumentationPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        documentType: 'GUIDE',
        category: 'Customs',
        content: '',
        hsCode: '',
        tags: []
    });

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('lynktoday_token');
        setToken(storedToken);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) setError('');
    };

    const toggleTag = (tag) => {
        setForm((previous) => {
            const exists = previous.tags.includes(tag);

            return {
                ...previous,
                tags: exists
                    ? previous.tags.filter(
                          (existingTag) => existingTag !== tag
                      )
                    : [...previous.tags, tag]
            };
        });

        if (error) setError('');
    };

    const removeTag = (tag) => {
        setForm((previous) => ({
            ...previous,
            tags: previous.tags.filter(
                (existingTag) => existingTag !== tag
            )
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!token) {
            setError(
                'Please login before creating documentation.'
            );
            return;
        }

        if (!form.title.trim()) {
            setError(
                'Please enter a documentation title.'
            );
            return;
        }

        if (!form.description.trim()) {
            setError(
                'Please add a short description.'
            );
            return;
        }

        if (!form.content.trim()) {
            setError(
                'Please write the documentation content.'
            );
            return;
        }

        if (form.tags.length === 0) {
            setError(
                'Please select at least one relevant tag.'
            );
            return;
        }

        try {
            setLoading(true);

            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                documentType: form.documentType,
                category: form.category,
                content: form.content.trim(),
                hsCode: form.hsCode.trim(),
                tags: form.tags
            };

            const response = await fetch(
                `${API_BASE_URL}/documentation`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        'Failed to create documentation.'
                );
            }

            setSuccess(
                'Documentation published successfully.'
            );

            const created =
                data.documentation ||
                data.document ||
                data.data;

            setTimeout(() => {
                if (created?._id) {
                    router.push(
                        `/documentation/${created._id}`
                    );
                } else {
                    router.push('/documentation');
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

    if (token === null) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>
                    <span
                        className={styles.loadingSpinner}
                    />
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    if (!token) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <Link
                        href="/documentation"
                        className={styles.back}
                    >
                        <span>←</span>
                        Documentation
                    </Link>

                    <div className={styles.loginCard}>
                        <div className={styles.loginIcon}>
                            <span className={styles.loginIconMark}>
                                L
                            </span>
                        </div>

                        <h2>Login Required</h2>

                        <p>
                            Login to your LynkToday account
                            to share documentation with
                            the community.
                        </p>

                        <Link
                            href="/login"
                            className={styles.loginButton}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <Link
                    href="/documentation"
                    className={styles.back}
                >
                    <span>←</span>
                    Documentation
                </Link>

                <header className={styles.pageHeader}>
                    <div className={styles.headerIcon}>
                        <span>DOC</span>
                    </div>

                    <div>
                        <h1>Create Documentation</h1>

                        <p>
                            Share practical knowledge,
                            procedures and trade information
                            with the LynkToday community.
                        </p>
                    </div>
                </header>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className={styles.error}>
                                <div className={styles.messageMark}>
                                    !
                                </div>

                                <div>
                                    <strong>
                                        Unable to publish
                                    </strong>

                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className={styles.success}>
                                <div className={styles.successMark}>
                                    ✓
                                </div>

                                <span>{success}</span>
                            </div>
                        )}

                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span
                                    className={
                                        styles.sectionNumber
                                    }
                                >
                                    01
                                </span>

                                <div>
                                    <h2>Basic Information</h2>

                                    <p>
                                        Give your documentation
                                        a clear title and useful
                                        context.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="title">
                                    Documentation Title
                                    <span>*</span>
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Example: Bill of Entry Documentation Guide"
                                    maxLength={200}
                                />

                                <div
                                    className={
                                        styles.fieldFooter
                                    }
                                >
                                    <span>
                                        Use a clear and specific
                                        title.
                                    </span>

                                    <span>
                                        {form.title.length}/200
                                    </span>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="description">
                                    Short Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    maxLength={500}
                                    placeholder="Briefly explain what readers will learn from this documentation."
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
                                            form.description
                                                .length
                                        }
                                        /500
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span
                                    className={
                                        styles.sectionNumber
                                    }
                                >
                                    02
                                </span>

                                <div>
                                    <h2>Classification</h2>

                                    <p>
                                        Categorise the document
                                        so professionals can
                                        find it easily.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.twoColumn}>
                                <div className={styles.field}>
                                    <label htmlFor="documentType">
                                        Document Type
                                    </label>

                                    <select
                                        id="documentType"
                                        name="documentType"
                                        value={form.documentType}
                                        onChange={handleChange}
                                    >
                                        {documentTypes.map(
                                            (type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="category">
                                        Category
                                        <span>*</span>
                                    </label>

                                    <select
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="hsCode">
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
                                    value={form.hsCode}
                                    onChange={handleChange}
                                    placeholder="Example: 62034200"
                                />

                                <small>
                                    Add an HS Code when the
                                    documentation relates to a
                                    specific product or tariff.
                                </small>
                            </div>

                            <div className={styles.field}>
                                <label>
                                    Relevant Tags
                                    <span>*</span>
                                </label>

                                <div
                                    className={
                                        styles.tagSelectedBox
                                    }
                                >
                                    {form.tags.length > 0 ? (
                                        form.tags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={
                                                    styles.selectedTag
                                                }
                                                onClick={() =>
                                                    removeTag(tag)
                                                }
                                            >
                                                <span>#</span>
                                                {tag}
                                                <span
                                                    className={
                                                        styles.selectedTagRemove
                                                    }
                                                >
                                                    ×
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <span
                                            className={
                                                styles.noTags
                                            }
                                        >
                                            Select one or more
                                            relevant topics below.
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={
                                        styles.tagOptions
                                    }
                                >
                                    {tagOptions.map((tag) => {
                                        const selected =
                                            form.tags.includes(tag);

                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={`${styles.tagOption} ${
                                                    selected
                                                        ? styles.tagOptionSelected
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    toggleTag(tag)
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.tagCheck
                                                    }
                                                >
                                                    {selected
                                                        ? '✓'
                                                        : ''}
                                                </span>

                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>

                                <small>
                                    Select every topic that
                                    genuinely relates to the
                                    documentation.
                                </small>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span
                                    className={
                                        styles.sectionNumber
                                    }
                                >
                                    03
                                </span>

                                <div>
                                    <h2>Documentation Content</h2>

                                    <p>
                                        Write the detailed
                                        information you want to
                                        share.
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
                                    value={form.content}
                                    onChange={handleChange}
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

3. Procedure

Explain the process step by step.

4. Important Notes

Add practical tips or common mistakes to avoid.`}
                                />

                                <div
                                    className={
                                        styles.editorFooter
                                    }
                                >
                                    <span>
                                        Use headings, numbered
                                        steps and bullet points
                                        to make the guide easier
                                        to read.
                                    </span>

                                    <span>
                                        {form.content.length}{' '}
                                        characters
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span
                                    className={
                                        styles.sectionNumber
                                    }
                                >
                                    04
                                </span>

                                <div>
                                    <h2>Attachments</h2>

                                    <p>
                                        File and image uploads
                                        will be available in a
                                        future version.
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
                                    <span />
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
                                        You cannot upload files
                                        or images in the current
                                        version. This feature will
                                        be improved and added in a
                                        later version.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className={styles.guidelines}>
                            <div
                                className={
                                    styles.guidelineMark
                                }
                            >
                                i
                            </div>

                            <div>
                                <strong>
                                    Before publishing
                                </strong>

                                <ul>
                                    <li>
                                        Use a clear and
                                        descriptive title.
                                    </li>

                                    <li>
                                        Choose the most relevant
                                        category.
                                    </li>

                                    <li>
                                        Select all relevant tags.
                                    </li>

                                    <li>
                                        Explain procedures in a
                                        practical order.
                                    </li>

                                    <li>
                                        Do not share confidential
                                        or sensitive information.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.actions}>
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
                                className={styles.submit}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className={
                                                styles.buttonSpinner
                                            }
                                        />
                                        Publishing...
                                    </>
                                ) : (
                                    'Publish Documentation'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}