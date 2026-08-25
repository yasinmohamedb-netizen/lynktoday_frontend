'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import api from '@/utils/api';

import CommentList from '@/components/home/Comments/CommentList';
import SharedPost from './SharedPost';

import styles from './Feed.module.css';

export default function FeedCard({
    post,
    onDelete,
    onUpdate,
    onShared,
    showOwnerActions = false
}) {

    const [user, setUser] = useState(null);

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [saved, setSaved] = useState(false);

    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingShare, setLoadingShare] = useState(false);

    const [showComments, setShowComments] = useState(false);

    /* =====================================================
       LIKED USERS
    ===================================================== */

    const [showLikes, setShowLikes] = useState(false);
    const [likedUsers, setLikedUsers] = useState([]);
    const [loadingLikedUsers, setLoadingLikedUsers] =
        useState(false);
    const [likesError, setLikesError] = useState('');

    /* =====================================================
       EDIT / DELETE
    ===================================================== */

    const [editing, setEditing] = useState(false);

    const [editTitle, setEditTitle] = useState(
        post?.title || ''
    );

    const [editContent, setEditContent] = useState(
        post?.content || ''
    );

    const [editPostType, setEditPostType] = useState(
        post?.postType ||
        post?.type ||
        'DISCUSSION'
    );

    const [editCategory, setEditCategory] = useState(
        post?.category ||
        'General'
    );

    const [loadingUpdate, setLoadingUpdate] =
        useState(false);

    const [loadingDelete, setLoadingDelete] =
        useState(false);


    /* =====================================================
       LOAD CURRENT USER
    ===================================================== */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );

            if (storedUser) {

                setUser(
                    JSON.parse(storedUser)
                );

            }

        } catch (error) {

            console.error(
                'Failed to load user:',
                error
            );

        }

    }, []);


    /* =====================================================
       CHECK POST OWNER
    ===================================================== */

    const currentUserId =
        user?._id ||
        user?.id;

    const postAuthorId =
        post?.author?._id ||
        post?.author?.id;

    const isPostOwner =
        Boolean(
            currentUserId &&
            postAuthorId &&
            String(currentUserId) ===
            String(postAuthorId)
        );


    /*
     * IMPORTANT
     *
     * Edit/Delete are allowed ONLY when:
     *
     * 1. FeedCard is being rendered with
     *    showOwnerActions={true}
     *
     * AND
     *
     * 2. Current user owns the post.
     *
     * Therefore:
     *
     * Home Feed:
     * showOwnerActions = false
     *
     * My Posts:
     * showOwnerActions = true
     */

    const canManagePost =
        showOwnerActions &&
        isPostOwner;


    /* =====================================================
       INITIAL POST STATE
    ===================================================== */

    useEffect(() => {

        const currentUserId =
            user?._id ||
            user?.id;

        if (!currentUserId) {
            return;
        }

        const postLikes =
            Array.isArray(post?.likes)
                ? post.likes
                : [];

        const likedByCurrentUser =
            postLikes.some((like) => {

                const likeId =
                    typeof like === 'string'
                        ? like
                        : like?._id ||
                          like?.id;

                return (
                    String(likeId) ===
                    String(currentUserId)
                );

            });

        setLiked(
            likedByCurrentUser
        );

        setLikes(
            post?.likesCount ??
            postLikes.length ??
            0
        );

        setSaved(
            Boolean(
                post?.isBookmarked ??
                post?.isSaved ??
                post?.saved
            )
        );

    }, [post, user]);


    /* =====================================================
       SYNC EDIT DATA
    ===================================================== */

    useEffect(() => {

        setEditTitle(
            post?.title || ''
        );

        setEditContent(
            post?.content || ''
        );

        setEditPostType(
            post?.postType ||
            post?.type ||
            'DISCUSSION'
        );

        setEditCategory(
            post?.category ||
            'General'
        );

    }, [post]);


    /* =====================================================
       LIKE POST
    ===================================================== */

    const handleLike = async () => {

        if (loadingLike) {
            return;
        }

        try {

            setLoadingLike(true);

            const { data } =
                await api.post(
                    `/posts/${post._id}/like`
                );

            if (data.success) {

                setLiked(
                    Boolean(data.liked)
                );

                setLikes(
                    data.likes ??
                    data.likesCount ??
                    0
                );

            }

        } catch (error) {

            console.error(
                'Failed to like post:',
                error
            );

        } finally {

            setLoadingLike(false);

        }

    };


    /* =====================================================
       LOAD USERS WHO LIKED
    ===================================================== */

    const fetchLikedUsers = async () => {

        if (loadingLikedUsers) {
            return;
        }

        try {

            setLoadingLikedUsers(true);
            setLikesError('');

            const { data } =
                await api.get(
                    `/posts/${post._id}/likes`
                );

            if (data.success) {

                setLikedUsers(

                    Array.isArray(data.users)

                        ? data.users

                        : Array.isArray(
                            data.likedUsers
                        )

                            ? data.likedUsers

                            : []

                );

            } else {

                setLikesError(
                    data.message ||
                    'Unable to load likes.'
                );

            }

        } catch (error) {

            console.error(
                'Failed to load liked users:',
                error
            );

            setLikesError(
                error.response?.data?.message ||
                'Unable to load likes.'
            );

        } finally {

            setLoadingLikedUsers(false);

        }

    };


    /* =====================================================
       OPEN LIKES
    ===================================================== */

    const handleShowLikes = async () => {

        if (!likes) {
            return;
        }

        setShowLikes(true);

        await fetchLikedUsers();

    };


    /* =====================================================
       CLOSE LIKES
    ===================================================== */

    const closeLikes = () => {

        setShowLikes(false);

    };


    /* =====================================================
       CLOSE LIKES WITH ESCAPE
    ===================================================== */

    useEffect(() => {

        if (!showLikes) {
            return;
        }

        const handleKeyDown = (event) => {

            if (event.key === 'Escape') {

                closeLikes();

            }

        };

        document.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {

            document.removeEventListener(
                'keydown',
                handleKeyDown
            );

        };

    }, [showLikes]);


    /* =====================================================
       SAVE POST
    ===================================================== */

    // =====================================================
// SAVE / UNSAVE POST
// =====================================================

const handleSave = async () => {

    if (loadingSave) {
        return;
    }

    // Current state
    const previousSavedState = saved;

    // Immediately toggle UI
    const newSavedState = !saved;

    // Update button immediately
    setSaved(newSavedState);

    // Update parent immediately
    if (onUpdate) {

        onUpdate({
            ...post,
            isBookmarked: newSavedState,
            isSaved: newSavedState
        });

    }

    try {

        setLoadingSave(true);

        const { data } = await api.post(
            `/posts/${post._id}/bookmark`
        );

        if (!data?.success) {

            throw new Error(
                data?.message ||
                'Unable to save post.'
            );

        }

        // =================================================
        // USE BACKEND RESULT IF AVAILABLE
        // =================================================

        const serverSavedState =
            typeof data.saved === 'boolean'
                ? data.saved
                : newSavedState;


        // Keep UI synchronized with backend
        setSaved(serverSavedState);


        // Keep parent synchronized
        if (onUpdate) {

            onUpdate({
                ...post,
                isBookmarked: serverSavedState,
                isSaved: serverSavedState
            });

        }

    } catch (error) {

        console.error(
            'Failed to save post:',
            error
        );


        // =================================================
        // ROLLBACK IF API FAILED
        // =================================================

        setSaved(previousSavedState);


        if (onUpdate) {

            onUpdate({
                ...post,
                isBookmarked:
                    previousSavedState,
                isSaved:
                    previousSavedState
            });

        }


        alert(
            error.response?.data?.message ||
            error.message ||
            'Unable to save post.'
        );

    } finally {

        setLoadingSave(false);

    }

};
// =====================================================
// SHARE POST
// =====================================================

const handleShare = async () => {

    if (loadingShare) {
        return;
    }

    try {

        setLoadingShare(true);

        const shareUrl =
            `${window.location.origin}/posts/${post._id}`;


        // =================================================
        // NATIVE SHARE
        // =================================================

        if (navigator.share) {

            await navigator.share({

                title:
                    post.title ||
                    'LynkToday Post',

                text:
                    post.content ||
                    '',

                url: shareUrl

            });

        } else {

            // =================================================
            // FALLBACK: COPY LINK
            // =================================================

            await navigator.clipboard.writeText(
                shareUrl
            );

            alert(
                'Post link copied.'
            );

        }


        // =================================================
        // UPDATE PARENT
        // =================================================

        if (onShared) {

            onShared(post);

        }

    } catch (error) {

        // User closing the native share dialog
        // is not an actual error.

        if (
            error?.name !==
            'AbortError'
        ) {

            console.error(
                'Failed to share post:',
                error
            );

        }

    } finally {

        setLoadingShare(false);

    }

};

    /* =====================================================
       START EDIT
    ===================================================== */

    const handleEdit = () => {

        if (!canManagePost) {
            return;
        }

        setEditTitle(
            post?.title || ''
        );

        setEditContent(
            post?.content || ''
        );

        setEditPostType(
            post?.postType ||
            post?.type ||
            'DISCUSSION'
        );

        setEditCategory(
            post?.category ||
            'General'
        );

        setEditing(true);

    };


    /* =====================================================
       CANCEL EDIT
    ===================================================== */

    const handleCancelEdit = () => {

        setEditTitle(
            post?.title || ''
        );

        setEditContent(
            post?.content || ''
        );

        setEditPostType(
            post?.postType ||
            post?.type ||
            'DISCUSSION'
        );

        setEditCategory(
            post?.category ||
            'General'
        );

        setEditing(false);

    };


    /* =====================================================
       UPDATE POST
    ===================================================== */

    const handleUpdate = async (event) => {

        event.preventDefault();

        if (
            !canManagePost ||
            loadingUpdate
        ) {
            return;
        }

        if (
            !editTitle.trim() ||
            !editContent.trim()
        ) {
            return;
        }

        try {

            setLoadingUpdate(true);

            const { data } =
                await api.put(
                    `/posts/${post._id}`,
                    {
                        title:
                            editTitle.trim(),

                        content:
                            editContent.trim(),

                        postType:
                            editPostType,

                        category:
                            editCategory
                    }
                );

            if (data.success) {

                const updatedPost =
                    data.post ||
                    data.updatedPost;

                if (
                    updatedPost &&
                    onUpdate
                ) {

                    onUpdate(
                        updatedPost
                    );

                }

                setEditing(false);

            }

        } catch (error) {

            console.error(
                'Failed to update post:',
                error
            );

            alert(
                error.response?.data?.message ||
                'Unable to update post.'
            );

        } finally {

            setLoadingUpdate(false);

        }

    };


    /* =====================================================
       DELETE POST
    ===================================================== */

    const handleDelete = async () => {

        if (
            !canManagePost ||
            loadingDelete
        ) {
            return;
        }

        const confirmed =
            window.confirm(
                'Are you sure you want to delete this post?'
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoadingDelete(true);

            const { data } =
                await api.delete(
                    `/posts/${post._id}`
                );

            if (
                data.success !== false
            ) {

                if (onDelete) {

                    onDelete(
                        post._id
                    );

                }

            }

        } catch (error) {

            console.error(
                'Failed to delete post:',
                error
            );

            alert(
                error.response?.data?.message ||
                'Unable to delete post.'
            );

        } finally {

            setLoadingDelete(false);

        }

    };


    /* =====================================================
       HELPERS
    ===================================================== */

    const authorName =
        post?.author?.fullName ||
        'Unknown User';

    const authorInitial =
        authorName
            .charAt(0)
            .toUpperCase();

    const postType =
        post?.postType ||
        post?.type ||
        'DISCUSSION';




    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <article className={styles.feedCard}>

            {/* =================================================
               HEADER
            ================================================= */}

            <div className={styles.cardHeader}>

                <div className={styles.userSection}>

                    <div className={styles.avatar}>
                        {authorInitial}
                    </div>

                    <div className={styles.userInfo}>

                        <h3>

                            {authorName}

                            {post?.author?.isVerified && (

                                <span
                                    className={
                                        styles.verifyBadge
                                    }
                                >
                                    ✓
                                </span>

                            )}

                        </h3>

                        {post?.author?.profession && (

                            <p>
                                {post.author.profession}
                            </p>

                        )}

                        {post?.author?.companyName && (

                            <span>
                                {post.author.companyName}
                            </span>

                        )}

                    </div>

                </div>

                <span className={styles.badge}>

                    {postType.replaceAll(
                        '_',
                        ' '
                    )}

                </span>

            </div>


            {/* =================================================
               EDIT FORM
            ================================================= */}

            {editing && canManagePost ? (

                <form
                    className={styles.editForm}
                    onSubmit={handleUpdate}
                >

                    <input
                        type="text"
                        value={editTitle}
                        onChange={(event) =>
                            setEditTitle(
                                event.target.value
                            )
                        }
                        className={
                            styles.editInput
                        }
                        placeholder="Post title"
                        required
                    />

                    <select
                        value={editPostType}
                        onChange={(event) =>
                            setEditPostType(
                                event.target.value
                            )
                        }
                        className={
                            styles.editSelect
                        }
                    >

                        <option value="DISCUSSION">
                            Discussion
                        </option>

                        <option value="QUESTION">
                            Question
                        </option>

                        <option value="NEWS">
                            News
                        </option>

                        <option value="CASE_STUDY">
                            Case Study
                        </option>

                        <option value="JOB">
                            Job
                        </option>

                        <option value="DOCUMENTATION">
                            Documentation
                        </option>

                        <option value="ANNOUNCEMENT">
                            Announcement
                        </option>

                    </select>

                    <select
                        value={editCategory}
                        onChange={(event) =>
                            setEditCategory(
                                event.target.value
                            )
                        }
                        className={
                            styles.editSelect
                        }
                    >

                        <option value="General">
                            General
                        </option>

                        <option value="Import">
                            Import
                        </option>

                        <option value="Export">
                            Export
                        </option>

                        <option value="Sea Freight">
                            Sea Freight
                        </option>

                        <option value="Air Freight">
                            Air Freight
                        </option>

                        <option value="Customs">
                            Customs
                        </option>

                        <option value="Documentation">
                            Documentation
                        </option>

                        <option value="GST">
                            GST
                        </option>

                        <option value="DGFT">
                            DGFT
                        </option>

                        <option value="HS Code">
                            HS Code
                        </option>

                    </select>

                    <textarea
                        value={editContent}
                        onChange={(event) =>
                            setEditContent(
                                event.target.value
                            )
                        }
                        className={
                            styles.editTextarea
                        }
                        rows={6}
                        placeholder="Write your post..."
                        required
                    />

                    <div
                        className={
                            styles.editActions
                        }
                    >

                        <button
                            type="submit"
                            className={
                                styles.updateButton
                            }
                            disabled={
                                loadingUpdate
                            }
                        >

                            {loadingUpdate
                                ? 'Saving...'
                                : 'Save Changes'}

                        </button>

                        <button
                            type="button"
                            className={
                                styles.cancelButton
                            }
                            onClick={
                                handleCancelEdit
                            }
                            disabled={
                                loadingUpdate
                            }
                        >

                            Cancel

                        </button>

                    </div>

                </form>

            ) : (

                <>

                    {/* =================================================
                       TITLE
                    ================================================= */}

                    {post?.title && (

                        <h2 className={styles.title}>

                            {post.title}

                        </h2>

                    )}


                    {/* =================================================
                       CONTENT
                    ================================================= */}

                    {post?.content && (

                        <div className={styles.content}>

                            {post.content}

                        </div>

                    )}


                    {/* =================================================
                       MEDIA
                    ================================================= */}

                    {/* Post media is intentionally disabled.
                        Image uploads will be added in a later version. */}


                    {/* =================================================
                       SHARED POST
                    ================================================= */}

                    {post?.sharedPost && (

                        <>

                            <div
                                className={
                                    styles.shareMessage
                                }
                            >

                                <strong>
                                    {authorName}
                                </strong>

                                {' shared a post'}

                            </div>

                            <SharedPost
                                post={
                                    post.sharedPost
                                }
                            />

                        </>

                    )}


                    {/* =================================================
                       TAGS
                    ================================================= */}

                    {Array.isArray(post?.tags) &&
                        post.tags.length > 0 && (

                            <div
                                className={
                                    styles.tags
                                }
                            >

                                {post.tags.map(
                                    (tag, index) => (

                                        <span
                                            key={
                                                `${tag}-${index}`
                                            }
                                            className={
                                                styles.tag
                                            }
                                        >

                                            #{tag}

                                        </span>

                                    )
                                )}

                            </div>

                        )}

                </>

            )}


            {/* =================================================
               FOOTER ACTIONS
            ================================================= */}

            {!editing && (

                <div className={styles.footer}>

                    {/* =================================================
                       LIKE + NUMBER
                       
                       IMPORTANT:
                       The number itself opens the
                       "Liked by" modal.
                       
                       There is NO second
                       "1 Like" / "2 Likes".
                    ================================================= */}

                    <div
                        className={
                            styles.likeActionWrapper
                        }
                    >

                        <button
                            type="button"
                            className={
                                `${styles.actionButton} ${
                                    liked
                                        ? styles.actionActive
                                        : ''
                                }`
                            }
                            onClick={
                                handleLike
                            }
                            disabled={
                                loadingLike
                            }
                        >

                            <span
                                className={
                                    styles.actionLabel
                                }
                            >

                                {liked
                                    ? 'Liked'
                                    : 'Like'}

                            </span>

                        </button>

                        {likes > 0 && (

                            <button
                                type="button"
                                className={
                                    styles.likeNumberButton
                                }
                                onClick={
                                    handleShowLikes
                                }
                                aria-label="View people who liked this post"
                            >

                                {likes}

                            </button>

                        )}

                    </div>


                    {/* =================================================
                       COMMENTS
                    ================================================= */}

                    <button
                        type="button"
                        className={
                            styles.actionButton
                        }
                        onClick={() =>
                            setShowComments(
                                previous =>
                                    !previous
                            )
                        }
                    >

                        <span
                            className={
                                styles.actionLabel
                            }
                        >
                            Comments
                        </span>

                        <span
                            className={
                                styles.actionCount
                            }
                        >
                            {post?.commentsCount ?? 0}
                        </span>

                    </button>


                    {/* =================================================
                       SHARE
                    ================================================= */}

                    <button
                        type="button"
                        className={
                            `${styles.actionButton} ${styles.shareAction}`
                        }
                        onClick={
                            handleShare
                        }
                        disabled={
                            loadingShare
                        }
                    >

                        {loadingShare
                            ? 'Sharing...'
                            : 'Share'}

                    </button>


                    {/* =================================================
                       SAVE
                    ================================================= */}

<button
    type="button"
    className={
        `${styles.actionButton} ${
            saved
                ? styles.actionActive
                : ''
        }`
    }
    onClick={handleSave}
    disabled={loadingSave}
>
    {saved ? 'Saved' : 'Save'}
</button>


                    {/* =================================================
                       EDIT + DELETE
                       
                       ONLY:
                       - My Posts page
                       - AND current user owns post
                       
                       Home Feed has showOwnerActions=false
                    ================================================= */}

                    {canManagePost && (

                        <>

                            <button
                                type="button"
                                className={
                                    styles.actionButton
                                }
                                onClick={
                                    handleEdit
                                }
                            >

                                Edit

                            </button>

                            <button
                                type="button"
                                className={
                                    `${styles.actionButton} ${styles.deleteAction}`
                                }
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    loadingDelete
                                }
                            >

                                {loadingDelete
                                    ? 'Deleting...'
                                    : 'Delete'}

                            </button>

                        </>

                    )}

                </div>

            )}


            {/* =================================================
               COMMENTS
            ================================================= */}

            {showComments && (

                <div
                    className={
                        styles.commentsSection
                    }
                >

                    <CommentList
                        postId={
                            post._id
                        }
                    />

                </div>

            )}


            {/* =================================================
               LIKES MODAL
            ================================================= */}

            {showLikes && (

                <div
                    className={
                        styles.likesOverlay
                    }
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            closeLikes();

                        }

                    }}
                >

                    <div
                        className={
                            styles.likesModal
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={
                            `likes-title-${post._id}`
                        }
                    >

                        <div
                            className={
                                styles.likesHeader
                            }
                        >

                            <div>

                                <h3
                                    id={
                                        `likes-title-${post._id}`
                                    }
                                >
                                    Liked by
                                </h3>

                                <p>

                                    {likes}{' '}

                                    {likes === 1
                                        ? 'person'
                                        : 'people'}

                                </p>

                            </div>

                            <button
                                type="button"
                                className={
                                    styles.likesClose
                                }
                                onClick={
                                    closeLikes
                                }
                                aria-label="Close"
                            >

                                ×

                            </button>

                        </div>


                        <div
                            className={
                                styles.likesList
                            }
                        >

                            {loadingLikedUsers && (

                                <div
                                    className={
                                        styles.likesState
                                    }
                                >

                                    Loading...

                                </div>

                            )}


                            {!loadingLikedUsers &&
                                likesError && (

                                    <div
                                        className={
                                            styles.likesError
                                        }
                                    >

                                        {likesError}

                                    </div>

                                )}


                            {!loadingLikedUsers &&
                                !likesError &&
                                likedUsers.length === 0 && (

                                    <div
                                        className={
                                            styles.likesState
                                        }
                                    >

                                        No likes found.

                                    </div>

                                )}


                            {!loadingLikedUsers &&
                                !likesError &&
                                likedUsers.map(
                                    (likedUser, index) => {

                                        const name =
                                            likedUser?.fullName ||
                                            likedUser?.name ||
                                            'User';

                                        const initial =
                                            name
                                                .charAt(0)
                                                .toUpperCase();



                                        const userId =
                                            likedUser?._id ||
                                            likedUser?.id;

                                        return (

                                            <Link
                                                key={
                                                    userId ||
                                                    `${name}-${index}`
                                                }
                                                href={
                                                    userId
                                                        ? `/profile/${userId}`
                                                        : '#'
                                                }
                                                className={
                                                    styles.likedUser
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.likedUserPlaceholder
                                                    }
                                                >
                                                    {initial}
                                                </div>

                                                <div
                                                    className={
                                                        styles.likedUserInfo
                                                    }
                                                >

                                                    <strong>
                                                        {name}
                                                    </strong>

                                                    {likedUser?.profession && (

                                                        <span>
                                                            {
                                                                likedUser.profession
                                                            }
                                                        </span>

                                                    )}

                                                </div>

                                            </Link>

                                        );

                                    }
                                )}

                        </div>

                    </div>

                </div>

            )}

        </article>

    );

}