'use client';

import { useState } from 'react';
import styles from './CommentSection.module.css';

export default function CommentSection({ postId }) {

    const [comments, setComments] = useState([]);

    const [text, setText] = useState('');

    const submitComment = () => {

        if (!text.trim()) return;

        const newComment = {

            id: Date.now(),

            author: {

                fullName: 'You',

                profession: 'Freight Professional',

                verificationTier: 'PREMIUM_PARTNER'

            },

            text,

            createdAt: new Date()

        };

        setComments([newComment, ...comments]);

        setText('');

    };

    return (

        <div className={styles.wrapper}>

            <div className={styles.inputArea}>

                <textarea

                    placeholder="Share your thoughts..."

                    value={text}

                    onChange={(e)=>setText(e.target.value)}

                />

                <button

                    onClick={submitComment}

                >

                    Comment

                </button>

            </div>

            {

                comments.length===0 &&

                <div className={styles.empty}>

                    No comments yet.

                </div>

            }

            {

                comments.map(comment=>(

                    <div

                        key={comment.id}

                        className={styles.comment}

                    >

                        <div className={styles.avatar}>

                            {

                                comment.author.fullName
                                .charAt(0)
                                .toUpperCase()

                            }

                        </div>

                        <div className={styles.body}>

                            <div className={styles.header}>

                                <strong>

                                    {comment.author.fullName}

                                </strong>

                                {

                                    comment.author
                                    .verificationTier !==
                                    'BASIC'

                                    &&

                                    <span>

                                        ✔

                                    </span>

                                }

                            </div>

                            <div className={styles.profession}>

                                {comment.author.profession}

                            </div>

                            <p>

                                {comment.text}

                            </p>

                            <div className={styles.actions}>

                                <button>

                                    ❤️ Like

                                </button>

                                <button>

                                    💬 Reply

                                </button>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}