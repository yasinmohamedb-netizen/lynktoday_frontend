"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./page.module.css";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001/api/v1";

const INITIAL_FORM = {
    hsCode: "",
    description: "",
    section: "",
    sectionNumber: "",
    chapter: "",
    chapterNumber: "",
    heading: "",
    subHeading: "",
    unit: "",
    basicDuty: "",
    igst: "",
    cess: "",
    importPolicy: "",
    exportPolicy: "",
    country: "India",
    keywords: "",
    notes: ""
};

export default function EditHSCodePage() {
    const params = useParams();
    const router = useRouter();

    const id = params?.id;

    const [form, setForm] = useState(INITIAL_FORM);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // AUTH
    // =========================================================

    const getToken = () => {
        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem("lynktoday_token");
    };

    // =========================================================
    // LOAD HS CODE
    // =========================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadHSCode = async () => {
            setLoading(true);
            setError("");

            try {
                const token = getToken();

                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(
                    `${API_BASE}/hs-codes/id/${encodeURIComponent(id)}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const contentType =
                    response.headers.get("content-type") || "";

                const data = contentType.includes("application/json")
                    ? await response.json()
                    : await response.text();

                if (!response.ok) {
                    const message =
                        typeof data === "object"
                            ? data?.message
                            : data;

                    throw new Error(
                        message || "Failed to load HS Code."
                    );
                }

                const item = data?.hsCode;

                if (!item) {
                    throw new Error(
                        "HS Code data was not returned."
                    );
                }

                setForm({
                    hsCode: item.hsCode || "",
                    description: item.description || "",

                    section: item.section || "",

                    sectionNumber:
                        item.sectionNumber !== null &&
                        item.sectionNumber !== undefined
                            ? String(item.sectionNumber)
                            : "",

                    chapter: item.chapter || "",

                    chapterNumber:
                        item.chapterNumber !== null &&
                        item.chapterNumber !== undefined
                            ? String(item.chapterNumber)
                            : "",

                    heading: item.heading || "",
                    subHeading: item.subHeading || "",

                    unit: item.unit || "",
                    basicDuty: item.basicDuty || "",
                    igst: item.igst || "",
                    cess: item.cess || "",

                    importPolicy: item.importPolicy || "",
                    exportPolicy: item.exportPolicy || "",

                    country: item.country || "India",

                    keywords: Array.isArray(item.keywords)
                        ? item.keywords.join(", ")
                        : "",

                    notes: item.notes || ""
                });
            } catch (err) {
                console.error(
                    "Load HS Code error:",
                    err
                );

                if (
                    err?.message ===
                    "Authentication required."
                ) {
                    router.push("/login");
                    return;
                }

                setError(
                    err?.message ||
                        "Unable to load HS Code."
                );
            } finally {
                setLoading(false);
            }
        };

        loadHSCode();
    }, [id, router]);

    // =========================================================
    // INPUT HANDLER
    // =========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // BASIC VALIDATION
        // -----------------------------------------------------

        const normalizedHSCode =
            String(form.hsCode || "")
                .trim()
                .replace(/\s+/g, "");

        const description =
            String(form.description || "").trim();

        if (!normalizedHSCode) {
            setError("HS Code is required.");
            return;
        }

        if (!/^\d{4,10}$/.test(normalizedHSCode)) {
            setError(
                "HS Code must contain only numbers and be between 4 and 10 digits."
            );
            return;
        }

        if (!description) {
            setError("Description is required.");
            return;
        }

        if (!id) {
            setError("HS Code ID is missing.");
            return;
        }

        // -----------------------------------------------------
        // AUTHENTICATION
        // -----------------------------------------------------

        const token = getToken();

        if (!token) {
            router.push("/login");
            return;
        }

        // -----------------------------------------------------
        // PAYLOAD
        // -----------------------------------------------------

        const payload = {
            hsCode: normalizedHSCode,

            description,

            section:
                String(form.section || "").trim(),

            sectionNumber:
                form.sectionNumber === ""
                    ? null
                    : Number(form.sectionNumber),

            chapter:
                String(form.chapter || "").trim(),

            chapterNumber:
                form.chapterNumber === ""
                    ? null
                    : Number(form.chapterNumber),

            heading:
                String(form.heading || "").trim(),

            subHeading:
                String(form.subHeading || "").trim(),

            unit:
                String(form.unit || "").trim(),

            basicDuty:
                String(form.basicDuty || "").trim(),

            igst:
                String(form.igst || "").trim(),

            cess:
                String(form.cess || "").trim(),

            importPolicy:
                String(form.importPolicy || "").trim(),

            exportPolicy:
                String(form.exportPolicy || "").trim(),

            country:
                String(form.country || "India").trim(),

            keywords:
                String(form.keywords || "")
                    .split(",")
                    .map((keyword) =>
                        keyword.trim()
                    )
                    .filter(Boolean),

            notes:
                String(form.notes || "").trim()
        };

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        setSaving(true);

        try {
            const response = await fetch(
                `${API_BASE}/hs-codes/${encodeURIComponent(id)}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            const data = contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(
                        "lynktoday_token"
                    );

                    router.push("/login");
                    return;
                }

                if (response.status === 403) {
                    throw new Error(
                        typeof data === "object"
                            ? data?.message ||
                                  "You are not allowed to edit this HS Code."
                            : "You are not allowed to edit this HS Code."
                    );
                }

                if (response.status === 404) {
                    throw new Error(
                        typeof data === "object"
                            ? data?.message ||
                                  "HS Code not found."
                            : "HS Code not found."
                    );
                }

                if (response.status === 409) {
                    throw new Error(
                        typeof data === "object"
                            ? data?.message ||
                                  "Another HS Code with this code already exists."
                            : "Another HS Code with this code already exists."
                    );
                }

                throw new Error(
                    typeof data === "object"
                        ? data?.message ||
                              "Failed to update HS Code."
                        : data ||
                              "Failed to update HS Code."
                );
            }

            const updatedHSCode = data?.hsCode;

            setSuccess(
                data?.message ||
                    "HS Code updated successfully."
            );

            // -------------------------------------------------
            // REDIRECT TO ACTUAL HS CODE PAGE
            // -------------------------------------------------

            const updatedCode =
                updatedHSCode?.hsCode?.trim() ||
                normalizedHSCode;

            setTimeout(() => {
                router.push(
                    `/hs-codes/${encodeURIComponent(
                        updatedCode
                    )}`
                );
            }, 700);
        } catch (err) {
            console.error(
                "Update HS Code error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to update HS Code."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {
        return (
            <main className={styles.container}>
                <div className={styles.stateCard}>
                    <div className={styles.spinner} />

                    <h2>
                        Loading HS Code...
                    </h2>

                    <p>
                        Please wait while we load the
                        HS Code details.
                    </p>
                </div>
            </main>
        );
    }

    // =========================================================
    // ERROR STATE
    // =========================================================

    if (error && !form.hsCode) {
        return (
            <main className={styles.container}>
                <div className={styles.stateCard}>
                    <div className={styles.stateIcon}>
                        ⚠️
                    </div>

                    <h2>
                        Unable to load HS Code
                    </h2>

                    <p>
                        {error}
                    </p>

                    <Link
                        href="/hs-codes"
                        className={styles.primaryButton}
                    >
                        Back to HS Codes
                    </Link>
                </div>
            </main>
        );
    }

    // =========================================================
    // FORM
    // =========================================================

    return (
        <main className={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className={styles.header}>

                <Link
                    href="/hs-codes"
                    className={styles.backButton}
                >
                    ← Back to HS Codes
                </Link>

                <div className={styles.headingBlock}>

                    <span className={styles.eyebrow}>
                        HS CODES / EDIT
                    </span>

                    <h1>
                        Edit HS Code
                    </h1>

                    <p>
                        Update the details of this
                        HS Code.
                    </p>

                </div>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className={styles.form}
            >

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className={styles.error}>
                        <strong>
                            Update failed
                        </strong>

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div className={styles.success}>
                        {success}
                    </div>
                )}

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <div>

                            <span
                                className={styles.sectionNumber}
                            >
                                01
                            </span>

                            <div>
                                <h2>
                                    Basic Information
                                </h2>

                                <p>
                                    Core HS Code
                                    classification
                                    details.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className={styles.grid}>

                        {/* HS CODE */}

                        <div className={styles.field}>

                            <label htmlFor="hsCode">
                                HS Code
                                <span>*</span>
                            </label>

                            <input
                                id="hsCode"
                                name="hsCode"
                                type="text"
                                value={form.hsCode}
                                onChange={handleChange}
                                placeholder="e.g. 08051010"
                                inputMode="numeric"
                                maxLength={10}
                                required
                            />

                            <small>
                                4–10 digits
                            </small>

                        </div>

                        {/* DESCRIPTION */}

                        <div
                            className={`${styles.field} ${styles.fullWidth}`}
                        >

                            <label htmlFor="description">
                                Description
                                <span>*</span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter HS Code description"
                                rows={4}
                                required
                            />

                        </div>

                    </div>
                </section>

                {/* =================================================
                    CLASSIFICATION
                ================================================= */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <div>

                            <span
                                className={styles.sectionNumber}
                            >
                                02
                            </span>

                            <div>
                                <h2>
                                    Classification
                                </h2>

                                <p>
                                    Section, chapter,
                                    heading and
                                    sub-heading details.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className={styles.grid}>

                        {/* SECTION */}

                        <div className={styles.field}>

                            <label htmlFor="section">
                                Section
                            </label>

                            <input
                                id="section"
                                name="section"
                                type="text"
                                value={form.section}
                                onChange={handleChange}
                                placeholder="e.g. VEGETABLE PRODUCTS"
                            />

                        </div>

                        {/* SECTION NUMBER */}

                        <div className={styles.field}>

                            <label htmlFor="sectionNumber">
                                Section Number
                            </label>

                            <input
                                id="sectionNumber"
                                name="sectionNumber"
                                type="number"
                                value={form.sectionNumber}
                                onChange={handleChange}
                                placeholder="e.g. 2"
                                min="1"
                            />

                        </div>

                        {/* CHAPTER */}

                        <div className={styles.field}>

                            <label htmlFor="chapter">
                                Chapter
                            </label>

                            <input
                                id="chapter"
                                name="chapter"
                                type="text"
                                value={form.chapter}
                                onChange={handleChange}
                                placeholder="e.g. Chapter 08"
                            />

                        </div>

                        {/* CHAPTER NUMBER */}

                        <div className={styles.field}>

                            <label htmlFor="chapterNumber">
                                Chapter Number
                            </label>

                            <input
                                id="chapterNumber"
                                name="chapterNumber"
                                type="number"
                                value={form.chapterNumber}
                                onChange={handleChange}
                                placeholder="e.g. 8"
                                min="1"
                                max="98"
                            />

                        </div>

                        {/* HEADING */}

                        <div className={styles.field}>

                            <label htmlFor="heading">
                                Heading
                            </label>

                            <input
                                id="heading"
                                name="heading"
                                type="text"
                                value={form.heading}
                                onChange={handleChange}
                                placeholder="e.g. 0805 - Citrus fruit"
                            />

                        </div>

                        {/* SUB HEADING */}

                        <div className={styles.field}>

                            <label htmlFor="subHeading">
                                Sub-heading
                            </label>

                            <input
                                id="subHeading"
                                name="subHeading"
                                type="text"
                                value={form.subHeading}
                                onChange={handleChange}
                                placeholder="e.g. 080510 - Oranges"
                            />

                        </div>

                    </div>
                </section>

                {/* =================================================
                    DUTY & TAX
                ================================================= */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <div>

                            <span
                                className={styles.sectionNumber}
                            >
                                03
                            </span>

                            <div>
                                <h2>
                                    Duty & Tax
                                </h2>

                                <p>
                                    Applicable customs
                                    duties and taxes.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className={styles.grid}>

                        {/* UNIT */}

                        <div className={styles.field}>

                            <label htmlFor="unit">
                                Unit
                            </label>

                            <input
                                id="unit"
                                name="unit"
                                type="text"
                                value={form.unit}
                                onChange={handleChange}
                                placeholder="e.g. KGS"
                            />

                        </div>

                        {/* BASIC DUTY */}

                        <div className={styles.field}>

                            <label htmlFor="basicDuty">
                                Basic Duty
                            </label>

                            <input
                                id="basicDuty"
                                name="basicDuty"
                                type="text"
                                value={form.basicDuty}
                                onChange={handleChange}
                                placeholder="e.g. 35%"
                            />

                        </div>

                        {/* IGST */}

                        <div className={styles.field}>

                            <label htmlFor="igst">
                                IGST
                            </label>

                            <input
                                id="igst"
                                name="igst"
                                type="text"
                                value={form.igst}
                                onChange={handleChange}
                                placeholder="e.g. 5%"
                            />

                        </div>

                        {/* CESS */}

                        <div className={styles.field}>

                            <label htmlFor="cess">
                                Cess
                            </label>

                            <input
                                id="cess"
                                name="cess"
                                type="text"
                                value={form.cess}
                                onChange={handleChange}
                                placeholder="e.g. 1%"
                            />

                        </div>

                    </div>
                </section>

                {/* =================================================
                    TRADE POLICY
                ================================================= */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <div>

                            <span
                                className={styles.sectionNumber}
                            >
                                04
                            </span>

                            <div>
                                <h2>
                                    Trade Policy
                                </h2>

                                <p>
                                    Import and export
                                    policy information.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className={styles.grid}>

                        {/* IMPORT POLICY */}

                        <div className={styles.field}>

                            <label htmlFor="importPolicy">
                                Import Policy
                            </label>

                            <input
                                id="importPolicy"
                                name="importPolicy"
                                type="text"
                                value={form.importPolicy}
                                onChange={handleChange}
                                placeholder="e.g. Free"
                            />

                        </div>

                        {/* EXPORT POLICY */}

                        <div className={styles.field}>

                            <label htmlFor="exportPolicy">
                                Export Policy
                            </label>

                            <input
                                id="exportPolicy"
                                name="exportPolicy"
                                type="text"
                                value={form.exportPolicy}
                                onChange={handleChange}
                                placeholder="e.g. Free"
                            />

                        </div>

                        {/* COUNTRY */}

                        <div className={styles.field}>

                            <label htmlFor="country">
                                Country
                            </label>

                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={form.country}
                                onChange={handleChange}
                                placeholder="India"
                            />

                        </div>

                        {/* KEYWORDS */}

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
                                value={form.keywords}
                                onChange={handleChange}
                                placeholder="orange, oranges, fresh oranges, citrus"
                            />

                            <small>
                                Separate keywords
                                with commas.
                            </small>

                        </div>

                    </div>
                </section>

                {/* =================================================
                    NOTES
                ================================================= */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <div>

                            <span
                                className={styles.sectionNumber}
                            >
                                05
                            </span>

                            <div>
                                <h2>
                                    Notes
                                </h2>

                                <p>
                                    Additional
                                    classification
                                    information.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className={styles.grid}>

                        <div
                            className={`${styles.field} ${styles.fullWidth}`}
                        >

                            <label htmlFor="notes">
                                Notes
                            </label>

                            <textarea
                                id="notes"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Enter any additional notes"
                                rows={5}
                            />

                        </div>

                    </div>
                </section>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className={styles.actions}>

                    <Link
                        href="/hs-codes"
                        className={styles.cancelButton}
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

                <p className={styles.disclaimer}>
                    Changes will be saved to this HS Code
                    immediately.
                </p>

            </form>
        </main>
    );
}