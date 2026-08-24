'use client';

import styles from './Feed.module.css';

export default function SharedPost({ post }) {

    if (!post) {
        return null;
    }

    const authorName =
        post.author?.fullName ||
        'Unknown User';

    const initial =
        authorName
            .charAt(0)
            .toUpperCase();

    const profileImage =
        post.author?.profileImage ||
        post.author?.profileImageUrl ||
        post.author?.avatar ||
        '';

    return (

        <div className={styles.sharedPost}>

            {/* =========================================
               AUTHOR
            ========================================= */}

            <div className={styles.sharedHeader}>

                {profileImage ? (

                    <img
                        src={profileImage}
                        alt={authorName}
                        className={styles.sharedAvatarImage}
                    />

                ) : (

                    <div className={styles.sharedAvatar}>
                        {initial}
                    </div>

                )}

                <div className={styles.sharedUserInfo}>

                    <strong>
                        {authorName}
                    </strong>

                    {post.author?.profession && (

                        <p>
                            {post.author.profession}
                        </p>

                    )}

                    {post.author?.companyName && (

                        <span>
                            {post.author.companyName}
                        </span>

                    )}

                </div>

            </div>


            {/* =========================================
               TITLE
            ========================================= */}

            {post.title && (

                <h3
                    className={
                        styles.sharedTitle
                    }
                >
                    {post.title}
                </h3>

            )}


            {/* =========================================
               CONTENT
            ========================================= */}

            {post.content && (

                <p
                    className={
                        styles.sharedContent
                    }
                >
                    {post.content}
                </p>

            )}


            {/* =========================================
               IMAGE
            ========================================= */}

            {Array.isArray(post.mediaUrls) &&
                post.mediaUrls.length > 0 && (

                    <img
                        src={post.mediaUrls[0]}
                        alt={
                            post.title ||
                            'Shared post'
                        }
                        className={
                            styles.sharedImage
                        }
                    />

                )}

        </div>

    );

}