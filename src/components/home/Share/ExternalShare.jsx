'use client';

import styles from './ShareModal.module.css';

export default function ExternalShare({ post }) {

    if (!post) {
        return null;
    }


    // ==================================================
    // POST URL
    // ==================================================

    const postId =
        post.sharedPost?._id ||
        post._id;


    const getPostUrl = () => {

        if (!postId) {
            return '';
        }

        return `${window.location.origin}/posts/${postId}`;

    };


    // ==================================================
    // SHARE TEXT
    // ==================================================

    const shareText = post.title
        ? `${post.title} - Check out this post on LynkToday`
        : 'Check out this post on LynkToday';


    // ==================================================
    // OPEN SHARE WINDOW
    // ==================================================

    const openShare = (url) => {

        if (!url) {
            return;
        }

        window.open(
            url,
            '_blank',
            'width=700,height=650,noopener,noreferrer'
        );

    };


    // ==================================================
    // WHATSAPP
    // ==================================================

    const shareWhatsApp = () => {

        const postUrl = getPostUrl();

        if (!postUrl) {
            return;
        }

        const message =
            `${shareText}\n${postUrl}`;


        openShare(
            `https://wa.me/?text=${encodeURIComponent(
                message
            )}`
        );

    };


    // ==================================================
    // LINKEDIN
    // ==================================================

    const shareLinkedIn = () => {

        const postUrl = getPostUrl();

        if (!postUrl) {
            return;
        }

        openShare(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                postUrl
            )}`
        );

    };


    // ==================================================
    // FACEBOOK
    // ==================================================

    const shareFacebook = () => {

        const postUrl = getPostUrl();

        if (!postUrl) {
            return;
        }

        openShare(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                postUrl
            )}`
        );

    };


    // ==================================================
    // X / TWITTER
    // ==================================================

    const shareTwitter = () => {

        const postUrl = getPostUrl();

        if (!postUrl) {
            return;
        }

        openShare(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
            )}&url=${encodeURIComponent(
                postUrl
            )}`
        );

    };


    // ==================================================
    // EMAIL
    // ==================================================

    const shareEmail = () => {

        const postUrl = getPostUrl();

        if (!postUrl) {
            return;
        }

        window.location.href =
            `mailto:?subject=${encodeURIComponent(
                shareText
            )}&body=${encodeURIComponent(
                postUrl
            )}`;

    };


    // ==================================================
    // COPY LINK
    // ==================================================

    const copyLink = async () => {

        const postUrl = getPostUrl();

        if (!postUrl) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                postUrl
            );

            alert(
                'Post link copied successfully.'
            );

        } catch (error) {

            console.error(
                'Failed to copy post link:',
                error
            );

            alert(
                'Unable to copy link.'
            );

        }

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className={styles.externalSection}>

            <h3>
                Share Externally
            </h3>


            <button
                type="button"
                className={styles.externalButton}
                onClick={shareWhatsApp}
            >
                🟢 WhatsApp
            </button>


            <button
                type="button"
                className={styles.externalButton}
                onClick={shareLinkedIn}
            >
                💼 LinkedIn
            </button>


            <button
                type="button"
                className={styles.externalButton}
                onClick={shareFacebook}
            >
                📘 Facebook
            </button>


            <button
                type="button"
                className={styles.externalButton}
                onClick={shareTwitter}
            >
                🐦 X (Twitter)
            </button>


            <button
                type="button"
                className={styles.externalButton}
                onClick={shareEmail}
            >
                📧 Email
            </button>


            <button
                type="button"
                className={styles.externalButton}
                onClick={copyLink}
            >
                🔗 Copy Link
            </button>

        </div>

    );

}