'use client';

import { useState } from 'react';

import api from '@/utils/api';

import styles from './CreatePost.module.css';

const POST_TYPES = [
    { value: 'DISCUSSION', label: 'Discussion' },
    { value: 'QUESTION', label: 'Question' },
    { value: 'NEWS', label: 'News' },
    { value: 'CASE_STUDY', label: 'Case Study' },
    { value: 'DOCUMENTATION', label: 'Documentation' },
    { value: 'ANNOUNCEMENT', label: 'Announcement' }
];

const CATEGORIES = [
    'General',
    'Import',
    'Export',
    'Sea Freight',
    'Air Freight',
    'Customs',
    'Documentation',
    'GST',
    'DGFT',
    'HS Code'
];

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

export default function CreatePost({
    onPostCreated
}) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postType, setPostType] = useState('DISCUSSION');
    const [category, setCategory] = useState('General');
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanTitle = title.trim();
        const cleanContent = content.trim();

        if (!cleanTitle || !cleanContent) {
            setError(
                'Please enter a title and content.'
            );
            return;
        }

        if (
            cleanTitle.length >
            MAX_TITLE_LENGTH
        ) {
            setError(
                `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`
            );
            return;
        }

        if (
            cleanContent.length >
            MAX_CONTENT_LENGTH
        ) {
            setError(
                `Content cannot exceed ${MAX_CONTENT_LENGTH} characters.`
            );
            return;
        }

        try {
            setLoading(true);
            setError('');

            const formData = new FormData();

            formData.append(
                'title',
                cleanTitle
            );

            formData.append(
                'content',
                cleanContent
            );

            formData.append(
                'postType',
                postType
            );

            formData.append(
                'category',
                category
            );

            if (file) {
                formData.append(
                    'file',
                    file
                );
            }

            const { data } = await api.post(
                '/posts',
                formData
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    'Unable to publish the post.'
                );
            }

            setTitle('');
            setContent('');
            setPostType('DISCUSSION');
            setCategory('General');
            setFile(null);

            if (
                typeof onPostCreated ===
                'function' &&
                data.post
            ) {
                onPostCreated(data.post);
            }
        } catch (error) {
            console.error(
                'Failed to create post:',
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to publish the post. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files?.[0] || null;

        setFile(selectedFile);
    };

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.heading}>
                        Create a Post
                    </h2>

                    <p className={styles.subheading}>
                        Share knowledge with the
                        freight forwarding community.
                    </p>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div className={styles.topRow}>
                    <div className={styles.field}>
                        <label
                            htmlFor="post-title"
                            className={styles.label}
                        >
                            Title
                        </label>

                        <input
                            id="post-title"
                            type="text"
                            className={styles.input}
                            placeholder="Enter your post title"
                            value={title}
                            onChange={(event) => {
                                setTitle(
                                    event.target.value
                                );

                                if (error) {
                                    setError('');
                                }
                            }}
                            maxLength={
                                MAX_TITLE_LENGTH
                            }
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor="post-type"
                            className={styles.label}
                        >
                            Post Type
                        </label>

                        <select
                            id="post-type"
                            className={styles.select}
                            value={postType}
                            onChange={(event) =>
                                setPostType(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        >
                            {POST_TYPES.map(
                                (type) => (
                                    <option
                                        key={
                                            type.value
                                        }
                                        value={
                                            type.value
                                        }
                                    >
                                        {type.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor="post-category"
                            className={styles.label}
                        >
                            Category
                        </label>

                        <select
                            id="post-category"
                            className={styles.select}
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        >
                            {CATEGORIES.map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                <div className={styles.field}>
                    <label
                        htmlFor="post-content"
                        className={styles.label}
                    >
                        Content
                    </label>

                    <textarea
                        id="post-content"
                        className={styles.textarea}
                        rows={6}
                        placeholder="Share your knowledge, experience, question, or industry update..."
                        value={content}
                        onChange={(event) => {
                            setContent(
                                event.target.value
                            );

                            if (error) {
                                setError('');
                            }
                        }}
                        maxLength={
                            MAX_CONTENT_LENGTH
                        }
                        disabled={loading}
                        required
                    />

                    <span
                        className={
                            styles.characterCount
                        }
                    >
                        {content.length}/
                        {MAX_CONTENT_LENGTH}
                    </span>
                </div>

                <div className={styles.footer}>
                    <div
                        className={
                            styles.fileSection
                        }
                    >
                        <label
                            htmlFor="post-file"
                            className={styles.upload}
                        >
                            Attach File
                        </label>

                        <input
                            id="post-file"
                            type="file"
                            className={
                                styles.fileInput
                            }
                            onChange={
                                handleFileChange
                            }
                            disabled={loading}
                        />

                        {file && (
                            <span
                                className={
                                    styles.fileName
                                }
                                title={file.name}
                            >
                                {file.name}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading
                            ? 'Publishing...'
                            : 'Publish'}
                    </button>
                </div>
            </form>
        </section>
    );
}