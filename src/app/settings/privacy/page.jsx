'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './privacy.module.css';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001/api/v1';

export default function PrivacySecurityPage() {

    // ======================================================
    // CHANGE PASSWORD STATE
    // ======================================================

    const [showPasswordForm, setShowPasswordForm] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [passwordLoading, setPasswordLoading] =
        useState(false);


    // ======================================================
    // DELETE ACCOUNT STATE
    // ======================================================

    const [showDelete, setShowDelete] =
        useState(false);

    const [deleteText, setDeleteText] =
        useState('');

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    // ======================================================
    // CHANGE PASSWORD
    // ======================================================

    const handleChangePassword = async () => {

        if (!currentPassword || !newPassword || !confirmPassword) {

            alert(
                'Please fill in all password fields.'
            );

            return;

        }


        if (newPassword.length < 6) {

            alert(
                'New password must be at least 6 characters.'
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            alert(
                'New password and confirm password do not match.'
            );

            return;

        }


        const token =
            localStorage.getItem('lynktoday_token');


        if (!token) {

            alert(
                'Your session has expired. Please login again.'
            );

            window.location.href = '/login';

            return;

        }


        try {

            setPasswordLoading(true);


            const response =
                await fetch(
                    `${API_BASE_URL}/profile/change-password`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            currentPassword,

                            newPassword

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    'Failed to change password.'
                );

            }


            alert(
                'Password changed successfully.'
            );


            // Clear fields

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setShowPasswordForm(false);


        } catch (error) {

            console.error(
                'Change password error:',
                error
            );

            alert(
                error.message ||
                'Failed to change password.'
            );

        } finally {

            setPasswordLoading(false);

        }

    };


    // ======================================================
    // DELETE ACCOUNT
    // ======================================================

    const handleDeleteAccount = async () => {

        if (deleteText !== 'DELETE') {

            alert(
                'Please type DELETE to confirm account deletion.'
            );

            return;

        }


        const token =
            localStorage.getItem('lynktoday_token');


        if (!token) {

            alert(
                'Your session has expired. Please login again.'
            );

            window.location.href = '/login';

            return;

        }


        try {

            setDeleteLoading(true);


            const response =
                await fetch(
                    `${API_BASE_URL}/profile/account`,
                    {
                        method: 'DELETE',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    'Failed to delete account.'
                );

            }


            alert(
                'Your account and associated data have been permanently deleted.'
            );


            // ==================================================
            // Remove local session
            // ==================================================

            localStorage.removeItem(
                'lynktoday_user'
            );

            localStorage.removeItem(
                'lynktoday_token'
            );


            // ==================================================
            // Redirect to login
            // ==================================================

            window.location.href =
                '/login';


        } catch (error) {

            console.error(
                'Delete account error:',
                error
            );

            alert(
                error.message ||
                'Failed to delete account.'
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <main className={styles.page}>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className={styles.header}>

                <div>

                    <h1>
                        Privacy & Security
                    </h1>

                    <p>
                        Manage your password and account
                        security.
                    </p>

                </div>


                <Link
                    href="/settings"
                    className={styles.backButton}
                >
                    ← Settings
                </Link>

            </div>


            {/* ==================================================
                CHANGE PASSWORD
            ================================================== */}

            <section className={styles.card}>

                <div className={styles.cardIcon}>
                    🔑
                </div>


                <div className={styles.cardContent}>

                    <h2>
                        Change Password
                    </h2>

                    <p>
                        Update your password to keep your
                        LynkToday account secure.
                    </p>


                    {!showPasswordForm ? (

                        <button
                            type="button"
                            onClick={() =>
                                setShowPasswordForm(true)
                            }
                            className={
                                styles.primaryButton
                            }
                        >
                            Change Password
                        </button>

                    ) : (

                        <div className={styles.passwordForm}>

                            {/* Current Password */}

                            <div className={styles.formGroup}>

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) =>
                                        setCurrentPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                />

                            </div>


                            {/* New Password */}

                            <div className={styles.formGroup}>

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />

                            </div>


                            {/* Confirm Password */}

                            <div className={styles.formGroup}>

                                <label>
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />

                            </div>


                            {/* Password Actions */}

                            <div className={styles.formActions}>

                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowPasswordForm(
                                            false
                                        );

                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');

                                    }}
                                    className={
                                        styles.cancelButton
                                    }
                                    disabled={
                                        passwordLoading
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleChangePassword
                                    }
                                    className={
                                        styles.primaryButton
                                    }
                                    disabled={
                                        passwordLoading
                                    }
                                >

                                    {passwordLoading
                                        ? 'Changing...'
                                        : 'Update Password'}

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </section>


            {/* ==================================================
                ACCOUNT SECURITY
            ================================================== */}

            <section className={styles.card}>

                <div className={styles.cardIcon}>
                    🛡️
                </div>


                <div className={styles.cardContent}>

                    <h2>
                        Account Security
                    </h2>

                    <p>
                        Keep your account credentials private
                        and make sure your account information
                        remains up to date.
                    </p>

                    <p className={styles.securityNote}>
                        We recommend using a strong password
                        that you do not use on other websites.
                    </p>

                </div>

            </section>


            {/* ==================================================
                DELETE ACCOUNT
            ================================================== */}

            <section className={styles.dangerCard}>

                <div>

                    <h2>
                        Delete Account
                    </h2>

                    <p>
                        Permanently delete your LynkToday
                        account and associated account data.
                    </p>

                    <p className={styles.warning}>
                        This action is permanent. Your account
                        and associated data cannot be recovered
                        after deletion.
                    </p>

                </div>


                {!showDelete ? (

                    <button
                        type="button"
                        onClick={() =>
                            setShowDelete(true)
                        }
                        className={
                            styles.deleteButton
                        }
                    >
                        Delete Account
                    </button>

                ) : (

                    <div
                        className={
                            styles.deleteConfirmation
                        }
                    >

                        <strong>
                            Are you sure you want to delete
                            your account?
                        </strong>


                        <p>
                            This will permanently delete your
                            account and associated data.
                        </p>


                        <p>
                            Type <b>DELETE</b> below to
                            confirm.
                        </p>


                        <input
                            type="text"
                            value={deleteText}
                            onChange={(event) =>
                                setDeleteText(
                                    event.target.value
                                )
                            }
                            placeholder="Type DELETE"
                            className={
                                styles.deleteInput
                            }
                            disabled={
                                deleteLoading
                            }
                        />


                        <div
                            className={
                                styles.deleteActions
                            }
                        >

                            <button
                                type="button"
                                onClick={() => {

                                    setShowDelete(
                                        false
                                    );

                                    setDeleteText('');

                                }}
                                className={
                                    styles.cancelButton
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDeleteAccount
                                }
                                className={
                                    styles.confirmDeleteButton
                                }
                                disabled={
                                    deleteLoading ||
                                    deleteText !== 'DELETE'
                                }
                            >

                                {deleteLoading
                                    ? 'Deleting...'
                                    : 'Permanently Delete'}

                            </button>

                        </div>

                    </div>

                )}

            </section>

        </main>

    );

}