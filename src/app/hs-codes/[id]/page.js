'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import styles from './page.module.css';


// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';


// ======================================================
// HS CODE DETAILS PAGE
// ======================================================

export default function HSCodeDetailsPage() {

    // ==================================================
    // GET DYNAMIC ROUTE PARAMETER
    // ==================================================

    const params = useParams();

    const code = params?.id;


    // ==================================================
    // STATE
    // ==================================================

    const [hsCode, setHSCode] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');


    // ==================================================
    // LOAD HS CODE
    // ==================================================

    useEffect(() => {

        const loadHSCode = async () => {

            try {

                setLoading(true);

                setError('');

                setHSCode(null);


                // ==========================================
                // CHECK ROUTE PARAMETER
                // ==========================================

                if (!code) {

                    throw new Error(
                        'HS Code is missing from the URL.'
                    );

                }


                console.log(
                    'Loading HS Code:',
                    code
                );


                // ==========================================
                // BUILD API URL
                //
                // Frontend:
                // /hs-codes/08051010
                //
                // Backend:
                // /hs-codes/code/08051010
                // ==========================================

                const apiUrl =
                    `${API_BASE_URL}/hs-codes/code/${encodeURIComponent(
                        String(code).trim()
                    )}`;


                console.log(
                    'HS Code API URL:',
                    apiUrl
                );


                // ==========================================
                // API REQUEST
                // ==========================================

                const response =
                    await fetch(
                        apiUrl,
                        {
                            method: 'GET',

                            headers: {
                                Accept:
                                    'application/json'
                            },

                            cache: 'no-store'
                        }
                    );


                // ==========================================
                // CONTENT TYPE
                // ==========================================

                const contentType =
                    response.headers.get(
                        'content-type'
                    ) || '';


                // ==========================================
                // NON JSON RESPONSE
                // ==========================================

                if (
                    !contentType.includes(
                        'application/json'
                    )
                ) {

                    const text =
                        await response.text();


                    console.error(
                        'HS Code API returned non-JSON response:',
                        {
                            status:
                                response.status,

                            contentType,

                            response:
                                text.substring(
                                    0,
                                    500
                                )
                        }
                    );


                    throw new Error(
                        `Server returned ${response.status}. Please check the API URL.`
                    );

                }


                // ==========================================
                // PARSE JSON
                // ==========================================

                const data =
                    await response.json();


                console.log(
                    'HS Code API response:',
                    data
                );


                // ==========================================
                // API ERROR
                // ==========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        'HS Code not found.'
                    );

                }


                // ==========================================
                // GET HS CODE DATA
                // ==========================================

                const result =
                    data.hsCode ||
                    data.data ||
                    null;


                if (!result) {

                    throw new Error(
                        'HS Code data was not returned by the server.'
                    );

                }


                // ==========================================
                // SAVE DATA
                // ==========================================

                setHSCode(result);


            } catch (err) {

                console.error(
                    'HS Code details error:',
                    err
                );


                setError(
                    err?.message ||
                    'Unable to load HS Code.'
                );


            } finally {

                setLoading(false);

            }

        };


        loadHSCode();


    }, [code]);


    // ======================================================
    // LOADING STATE
    // ======================================================

    if (loading) {

        return (

            <main
                className={
                    styles.container
                }
            >

                <div
                    className={
                        styles.loading
                    }
                >

                    Loading HS Code...

                </div>

            </main>

        );

    }


    // ======================================================
    // ERROR STATE
    // ======================================================

    if (
        error ||
        !hsCode
    ) {

        return (

            <main
                className={
                    styles.container
                }
            >

                <div
                    className={
                        styles.error
                    }
                >

                    <h1>
                        HS Code Not Found
                    </h1>


                    <p>
                        {
                            error ||
                            'The requested HS Code could not be found.'
                        }
                    </p>


                    <div
                        className={
                            styles.errorActions
                        }
                    >

                        <Link
                            href="/"
                            className={
                                styles.backButton
                            }
                        >

                            ← Back to Home

                        </Link>


                        <Link
                            href="/hs-codes"
                            className={
                                styles.backButton
                            }
                        >

                            Search HS Codes

                        </Link>

                    </div>

                </div>

            </main>

        );

    }


    // ======================================================
    // MAIN DETAILS PAGE
    // ======================================================

    return (

        <main
            className={
                styles.container
            }
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className={
                    styles.header
                }
            >

                <Link
                    href="/hs-codes"
                    className={
                        styles.backButton
                    }
                >

                    ← Back to HS Codes

                </Link>

            </div>


            {/* ==================================================
                MAIN CARD
            ================================================== */}

            <section
                className={
                    styles.card
                }
            >


                {/* ==================================================
                    HS CODE HEADER
                ================================================== */}

                <div
                    className={
                        styles.hero
                    }
                >

                    <div>

                        <span
                            className={
                                styles.label
                            }
                        >

                            HS CODE

                        </span>


                        <h1>

                            {
                                hsCode.hsCode ||
                                '—'
                            }

                        </h1>


                        <p
                            className={
                                styles.description
                            }
                        >

                            {
                                hsCode.description ||
                                'No description available.'
                            }

                        </p>

                    </div>


                    {/* ==================================================
                        ACTIVE STATUS
                    ================================================== */}

                    <span
                        className={
                            hsCode.isActive
                                ? styles.active
                                : styles.inactive
                        }
                    >

                        {
                            hsCode.isActive
                                ? 'Active'
                                : 'Inactive'
                        }

                    </span>

                </div>


                {/* ==================================================
                    CLASSIFICATION
                ================================================== */}

                <div
                    className={
                        styles.section
                    }
                >

                    <h2>
                        Classification
                    </h2>


                    <div
                        className={
                            styles.grid
                        }
                    >

                        <Info
                            label="Section"
                            value={
                                hsCode.section
                            }
                        />


                        <Info
                            label="Section Number"
                            value={
                                hsCode.sectionNumber
                            }
                        />


                        <Info
                            label="Chapter"
                            value={
                                hsCode.chapter
                            }
                        />


                        <Info
                            label="Chapter Number"
                            value={
                                hsCode.chapterNumber
                            }
                        />


                        <Info
                            label="Heading"
                            value={
                                hsCode.heading
                            }
                        />


                        <Info
                            label="Sub Heading"
                            value={
                                hsCode.subHeading
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    TARIFF INFORMATION
                ================================================== */}

                <div
                    className={
                        styles.section
                    }
                >

                    <h2>
                        Tariff Information
                    </h2>


                    <div
                        className={
                            styles.grid
                        }
                    >

                        <Info
                            label="Unit"
                            value={
                                hsCode.unit
                            }
                        />


                        <Info
                            label="Basic Duty"
                            value={
                                hsCode.basicDuty
                            }
                        />


                        <Info
                            label="IGST"
                            value={
                                hsCode.igst
                            }
                        />


                        <Info
                            label="Cess"
                            value={
                                hsCode.cess
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    TRADE INFORMATION
                ================================================== */}

                <div
                    className={
                        styles.section
                    }
                >

                    <h2>
                        Trade Information
                    </h2>


                    <div
                        className={
                            styles.grid
                        }
                    >

                        <Info
                            label="Import Policy"
                            value={
                                hsCode.importPolicy
                            }
                        />


                        <Info
                            label="Export Policy"
                            value={
                                hsCode.exportPolicy
                            }
                        />


                        <Info
                            label="Country"
                            value={
                                hsCode.country
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    KEYWORDS
                ================================================== */}

                {
                    Array.isArray(
                        hsCode.keywords
                    ) &&
                    hsCode.keywords.length > 0 && (

                        <div
                            className={
                                styles.section
                            }
                        >

                            <h2>
                                Keywords
                            </h2>


                            <div
                                className={
                                    styles.tags
                                }
                            >

                                {
                                    hsCode.keywords.map(
                                        (
                                            keyword,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    `${keyword}-${index}`
                                                }
                                                className={
                                                    styles.tag
                                                }
                                            >

                                                {
                                                    keyword
                                                }

                                            </span>

                                        )
                                    )
                                }

                            </div>

                        </div>

                    )
                }


                {/* ==================================================
                    NOTES
                ================================================== */}

                {
                    hsCode.notes && (

                        <div
                            className={
                                styles.section
                            }
                        >

                            <h2>
                                Notes
                            </h2>


                            <p
                                className={
                                    styles.notes
                                }
                            >

                                {
                                    hsCode.notes
                                }

                            </p>

                        </div>

                    )
                }


                {/* ==================================================
                    ADDITIONAL INFORMATION
                ================================================== */}

                <div
                    className={
                        styles.section
                    }
                >

                    <h2>
                        Additional Information
                    </h2>


                    <div
                        className={
                            styles.grid
                        }
                    >

                        <Info
                            label="Created At"
                            value={
                                formatDate(
                                    hsCode.createdAt
                                )
                            }
                        />


                        <Info
                            label="Updated At"
                            value={
                                formatDate(
                                    hsCode.updatedAt
                                )
                            }
                        />

                    </div>

                </div>

            </section>

        </main>

    );

}


// ======================================================
// INFO COMPONENT
// ======================================================

function Info({
    label,
    value
}) {

    return (

        <div
            className={
                styles.info
            }
        >

            <span
                className={
                    styles.infoLabel
                }
            >

                {
                    label
                }

            </span>


            <span
                className={
                    styles.infoValue
                }
            >

                {
                    value !== null &&
                    value !== undefined &&
                    value !== ''
                        ? value
                        : '—'
                }

            </span>

        </div>

    );

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {

    if (!date) {

        return '—';

    }


    try {

        return new Date(
            date
        ).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    } catch {

        return '—';

    }

}