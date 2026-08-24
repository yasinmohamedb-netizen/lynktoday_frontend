'use client';

import {
    useEffect,
    useRef,
    useState
} from 'react';

import styles from './MessageInput.module.css';

export default function MessageInput({
    onSend,
    disabled,
    conversationId,
    socket,
    currentUser
}) {

    const [text, setText] =
        useState('');

    const textareaRef =
        useRef(null);


    // ======================================================
    // Send
    // ======================================================

    const submit = () => {

        const value =
            text.trim();


        if (
            !value ||
            disabled
        ) {

            return;

        }


        onSend(
            value
        );

        setText('');


        setTimeout(() => {

            textareaRef.current?.focus();

        }, 50);

    };


    // ======================================================
    // Enter
    // ======================================================

    const handleKeyDown =
        (event) => {

            if (
                event.key === 'Enter' &&
                !event.shiftKey
            ) {

                event.preventDefault();

                submit();

            }

        };


    // ======================================================
    // Typing
    // ======================================================

    useEffect(() => {

        if (
            !socket ||
            !conversationId ||
            !currentUser?._id
        ) {

            return;

        }


        if (
            text.trim()
        ) {

            socket.emit(
                'typing',
                {
                    conversationId,
                    userId:
                        currentUser._id
                }
            );

        } else {

            socket.emit(
                'stop_typing',
                {
                    conversationId,
                    userId:
                        currentUser._id
                }
            );

        }

    }, [
        text,
        socket,
        conversationId,
        currentUser?._id
    ]);


    return (

        <div className={styles.container}>

            <textarea

                ref={
                    textareaRef
                }

                value={
                    text
                }

                onChange={
                    event =>
                        setText(
                            event.target.value
                        )
                }

                onKeyDown={
                    handleKeyDown
                }

                placeholder={
                    'Write a message...'
                }

                disabled={
                    disabled
                }

                rows={1}

            />


            <button

                type="button"

                onClick={
                    submit
                }

                disabled={
                    disabled ||
                    !text.trim()
                }

            >

                {disabled
                    ? 'Sending...'
                    : 'Send'}

            </button>

        </div>

    );

}