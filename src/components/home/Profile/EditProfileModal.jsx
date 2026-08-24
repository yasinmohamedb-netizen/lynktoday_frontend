'use client';

import { useState } from 'react';
import api from '@/utils/api';

import styles from './Profile.module.css';

export default function EditProfileModal({
    user,
    onClose,
    onUpdated
}) {
    const isCompany = user?.accountType === 'company';

    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        headline: user?.headline || '',
        bio: user?.bio || '',
        profession: user?.profession || '',
        companyName: user?.companyName || '',
        designation: user?.designation || '',
        location: user?.location || '',
        phone: user?.phone || '',
        website: user?.website || '',
        linkedin: user?.linkedin || '',
        tradeIntent: user?.tradeIntent || 'Both',
        skills: (user?.skills || []).join(', '),
        languages: (user?.languages || []).join(', ')
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const normalizeUrl = (value) => {
        if (!value) {
            return '';
        }

        const trimmed = value.trim();

        if (!trimmed) {
            return '';
        }

        if (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://')
        ) {
            return trimmed;
        }

        return `https://${trimmed}`;
    };

    const isValidUrl = (value) => {
        if (!value) {
            return true;
        }

        try {
            const url = new URL(normalizeUrl(value));

            return (
                url.protocol === 'http:' ||
                url.protocol === 'https:'
            );
        } catch {
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (
            form.website &&
            !isValidUrl(form.website)
        ) {
            setError('Please enter a valid website URL.');
            return;
        }

        if (
            form.linkedin &&
            !isValidUrl(form.linkedin)
        ) {
            setError('Please enter a valid LinkedIn URL.');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...form,

                website: normalizeUrl(form.website),
                linkedin: normalizeUrl(form.linkedin),

                skills: form.skills
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),

                languages: form.languages
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
            };

            const { data } = await api.put(
                '/profile',
                payload
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to update profile.'
                );
            }

            try {
                const storedUser =
                    localStorage.getItem(
                        'lynktoday_user'
                    );

                if (storedUser) {
                    const currentUser =
                        JSON.parse(storedUser);

                    localStorage.setItem(
                        'lynktoday_user',
                        JSON.stringify({
                            ...currentUser,
                            ...data.user
                        })
                    );
                }
            } catch (storageError) {
                console.error(
                    'Failed to update local user:',
                    storageError
                );
            }

            onUpdated(data.user);
        } catch (error) {
            console.error(
                'Profile update error:',
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to update profile.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <div>
                        <h2>Edit Profile</h2>

                        <p
                            style={{
                                margin: '4px 0 0',
                                color: '#64748b',
                                fontSize: '13px'
                            }}
                        >
                            {isCompany
                                ? 'Manage your company profile information.'
                                : 'Manage your professional profile information.'
                            }
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div
                        style={{
                            margin: '0 24px 18px',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            fontSize: '14px'
                        }}
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                >
                    <div className={styles.formGrid}>
                        {!isCompany && (
                            <div className={styles.formGroup}>
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {isCompany && (
                            <div className={styles.formGroup}>
                                <label>Company Name</label>

                                <input
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>
                                {isCompany
                                    ? 'Company Headline'
                                    : 'Professional Headline'
                                }
                            </label>

                            <input
                                type="text"
                                name="headline"
                                value={form.headline}
                                onChange={handleChange}
                                placeholder={
                                    isCompany
                                        ? 'Reliable Customs & Trade Solutions'
                                        : 'Senior Freight Forwarder'
                                }
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                {isCompany
                                    ? 'Business Type'
                                    : 'Profession'
                                }
                            </label>

                            <select
                                name="profession"
                                value={form.profession}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select
                                </option>

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

                                <option value="Student">
                                    Student
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {!isCompany && (
                            <div className={styles.formGroup}>
                                <label>Company</label>

                                <input
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>
                                {isCompany
                                    ? 'Contact Person'
                                    : 'Designation'
                                }
                            </label>

                            <input
                                type="text"
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder={
                                    isCompany
                                        ? 'Primary contact person'
                                        : 'Operations Executive'
                                }
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Chennai, India"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                {isCompany
                                    ? 'Business Phone'
                                    : 'Phone'
                                }
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Website</label>

                            <input
                                type="text"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="www.example.com"
                            />

                            <small className={styles.helpText}>
                                You can enter www.example.com or https://www.example.com
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label>LinkedIn</label>

                            <input
                                type="text"
                                name="linkedin"
                                value={form.linkedin}
                                onChange={handleChange}
                                placeholder="linkedin.com/company/example"
                            />

                            <small className={styles.helpText}>
                                You can enter the LinkedIn address without https://
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Trade Intent</label>

                            <select
                                name="tradeIntent"
                                value={form.tradeIntent}
                                onChange={handleChange}
                            >
                                <option value="Import">
                                    Import
                                </option>

                                <option value="Export">
                                    Export
                                </option>

                                <option value="Both">
                                    Both
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            {isCompany
                                ? 'Company Description'
                                : 'About'
                            }
                        </label>

                        <textarea
                            name="bio"
                            rows="5"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder={
                                isCompany
                                    ? 'Tell the community about your company, services and expertise...'
                                    : 'Tell the community about yourself...'
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            {isCompany
                                ? 'Services & Expertise'
                                : 'Skills'
                            }
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={form.skills}
                            onChange={handleChange}
                            placeholder={
                                isCompany
                                    ? 'Customs Clearance, Import Documentation, HS Classification'
                                    : 'Sea Freight, Air Freight, Customs Clearance'
                            }
                        />

                        <small className={styles.helpText}>
                            Separate multiple items with commas.
                        </small>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Languages</label>

                        <input
                            type="text"
                            name="languages"
                            value={form.languages}
                            onChange={handleChange}
                            placeholder="English, Tamil, Hindi"
                        />

                        <small className={styles.helpText}>
                            Separate multiple languages with commas.
                        </small>
                    </div>

                    <div
                        style={{
                            padding: '12px 14px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            color: '#64748b',
                            fontSize: '13px',
                            lineHeight: 1.5
                        }}
                    >
                        Profile photo and document uploads
                        will be added in a later version.
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading}
                        >
                            {loading
                                ? 'Saving...'
                                : 'Save Changes'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}