'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import api from '@/utils/api';

import styles from './ChatWindow.module.css';


// ======================================================
// Helpers
// ======================================================

const getUserId = (user) => {
    if (!user) return '';

    return (
        user._id ||
        user.id ||
        ''
    ).toString();
};


const getMessageId = (message) => {
    if (!message) return '';

    return (
        message._id ||
        message.id ||
        ''
    ).toString();
};


const getOtherParticipant = (
    conversation,
    currentUser
) => {

    if (
        !conversation?.participants ||
        !Array.isArray(
            conversation.participants
        )
    ) {
        return null;
    }

    const currentUserId =
        getUserId(currentUser);

    return conversation.participants.find(
        participant =>
            getUserId(participant) !==
            currentUserId
    ) || null;
};


const getInitials = (name = '') => {

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 0) {
        return 'U';
    }

    if (parts.length === 1) {
        return parts[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();

};


const formatTime = (date) => {

    if (!date) {
        return '';
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return '';
    }

    return parsedDate.toLocaleTimeString(
        [],
        {
            hour: 'numeric',
            minute: '2-digit'
        }
    );

};


const getMessagePreview = (message) => {

    if (!message) {
        return '';
    }

    if (
        message.isDeleted
    ) {
        return 'Message deleted';
    }

    if (
        message.content &&
        message.content.trim()
    ) {
        return message.content;
    }

    if (
        Array.isArray(
            message.attachments
        ) &&
        message.attachments.length > 0
    ) {
        return 'Attachment';
    }

    return '';
};


// ======================================================
// Component
// ======================================================

export default function ChatWindow({
    conversation,
    currentUser,
    socket,
    onConversationUpdated
}) {

    // --------------------------------------------------
    // State
    // --------------------------------------------------

    const [messages, setMessages] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingMore, setLoadingMore] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [input, setInput] =
        useState('');

    const [error, setError] =
        useState('');

    const [sendError, setSendError] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);


    // --------------------------------------------------
    // Refs
    // --------------------------------------------------

    const messagesContainerRef =
        useRef(null);

    const inputRef =
        useRef(null);

    const shouldScrollToBottom =
        useRef(true);

    const previousConversationId =
        useRef(null);


    // ==================================================
    // Conversation information
    // ==================================================

    const otherParticipant =
        useMemo(
            () =>
                getOtherParticipant(
                    conversation,
                    currentUser
                ),
            [
                conversation,
                currentUser
            ]
        );


    const conversationId =
        conversation?._id
            ? conversation._id.toString()
            : '';


    const currentUserId =
        getUserId(currentUser);


    // ==================================================
    // Scroll to bottom
    // ==================================================

    const scrollToBottom =
        useCallback(
            (smooth = true) => {

                const container =
                    messagesContainerRef.current;

                if (!container) {
                    return;
                }

                container.scrollTo({
                    top:
                        container.scrollHeight,
                    behavior:
                        smooth
                            ? 'smooth'
                            : 'auto'
                });

            },
            []
        );


    // ==================================================
    // Add message safely
    // ==================================================

    const addMessage =
        useCallback(
            (incomingMessage) => {

                if (!incomingMessage) {
                    return;
                }

                const incomingId =
                    getMessageId(
                        incomingMessage
                    );

                const incomingConversationId =
                    incomingMessage.conversation
                        ? incomingMessage.conversation.toString()
                        : '';


                // Ignore messages belonging
                // to another conversation
                if (
                    conversationId &&
                    incomingConversationId &&
                    incomingConversationId !==
                        conversationId
                ) {
                    return;
                }


                setMessages(
                    previousMessages => {

                        // ------------------------------------------------
                        // IMPORTANT:
                        // Never use an undefined "message" variable here.
                        // Always use incomingMessage.
                        // ------------------------------------------------

                        if (incomingId) {

                            const alreadyExists =
                                previousMessages.some(
                                    existingMessage =>
                                        getMessageId(
                                            existingMessage
                                        ) ===
                                        incomingId
                                );

                            if (
                                alreadyExists
                            ) {
                                return previousMessages;
                            }

                        }


                        return [
                            ...previousMessages,
                            incomingMessage
                        ];

                    }
                );


                shouldScrollToBottom.current =
                    true;

            },
            [
                conversationId
            ]
        );


    // ==================================================
    // Load messages
    // ==================================================

    const fetchMessages =
        useCallback(
            async (
                requestedPage = 1,
                append = false
            ) => {

                if (!conversationId) {
                    return;
                }


                try {

                    if (append) {

                        setLoadingMore(true);

                    } else {

                        setLoading(true);
                        setError('');

                    }


                    const response =
                        await api.get(
                            `/messages/conversations/${conversationId}/messages`,
                            {
                                params: {
                                    page:
                                        requestedPage,
                                    limit: 30
                                }
                            }
                        );


                    const data =
                        response.data;


                    if (!data?.success) {

                        throw new Error(
                            data?.message ||
                            'Unable to load messages.'
                        );

                    }


                    const loadedMessages =
                        Array.isArray(
                            data.messages
                        )
                            ? data.messages
                            : [];


                    const pagination =
                        data.pagination ||
                        {};


                    setTotalPages(
                        Number(
                            pagination.totalPages
                        ) || 1
                    );


                    setPage(
                        Number(
                            pagination.currentPage
                        ) ||
                        requestedPage
                    );


                    if (append) {

                        setMessages(
                            previousMessages => {

                                const existingIds =
                                    new Set(
                                        previousMessages.map(
                                            message =>
                                                getMessageId(
                                                    message
                                                )
                                        )
                                    );


                                const uniqueMessages =
                                    loadedMessages.filter(
                                        message =>
                                            !existingIds.has(
                                                getMessageId(
                                                    message
                                                )
                                            )
                                    );


                                return [
                                    ...uniqueMessages,
                                    ...previousMessages
                                ];

                            }
                        );

                    } else {

                        setMessages(
                            loadedMessages
                        );

                        shouldScrollToBottom.current =
                            true;

                    }

                } catch (fetchError) {

                    console.error(
                        'Fetch messages error:',
                        fetchError
                    );


                    if (!append) {

                        setError(
                            fetchError
                                ?.response
                                ?.data
                                ?.message ||
                            fetchError?.message ||
                            'Unable to load messages.'
                        );

                    }

                } finally {

                    setLoading(false);
                    setLoadingMore(false);

                }

            },
            [
                conversationId
            ]
        );


    // ==================================================
    // Load conversation messages whenever conversation
    // changes
    // ==================================================

    useEffect(() => {

        if (!conversationId) {

            setMessages([]);
            setPage(1);
            setTotalPages(1);
            setError('');

            previousConversationId.current =
                null;

            return;

        }


        if (
            previousConversationId.current !==
            conversationId
        ) {

            previousConversationId.current =
                conversationId;

            setMessages([]);
            setPage(1);
            setTotalPages(1);
            setInput('');
            setError('');
            setSendError('');

            shouldScrollToBottom.current =
                true;


            fetchMessages(
                1,
                false
            );

        }

    }, [
        conversationId,
        fetchMessages
    ]);


    // ==================================================
    // Mark messages as read
    // ==================================================

    const markAsRead =
        useCallback(
            async () => {

                if (!conversationId) {
                    return;
                }

                try {

                    await api.patch(
                        `/messages/conversations/${conversationId}/read`
                    );

                } catch (readError) {

                    console.error(
                        'Mark as read error:',
                        readError
                    );

                }

            },
            [
                conversationId
            ]
        );


    useEffect(() => {

        if (
            conversationId &&
            messages.length > 0
        ) {

            markAsRead();

        }

    }, [
        conversationId,
        messages.length,
        markAsRead
    ]);


    // ==================================================
    // Socket.IO
    // ==================================================

    useEffect(() => {

        if (!socket) {
            return;
        }


        // ------------------------------------------------
        // Incoming message from receiver
        // ------------------------------------------------

        const handleNewMessage =
            (incomingMessage) => {

                console.log(
                    'ChatWindow - new_message:',
                    incomingMessage
                );


                if (
                    !incomingMessage
                ) {
                    return;
                }


                const incomingConversationId =
                    incomingMessage.conversation
                        ? incomingMessage.conversation.toString()
                        : '';


                if (
                    incomingConversationId !==
                    conversationId
                ) {
                    return;
                }


                addMessage(
                    incomingMessage
                );


                // Mark immediately as read
                // because the conversation is open
                markAsRead();

            };


        // ------------------------------------------------
        // Sender confirmation
        // ------------------------------------------------

        const handleMessageSent =
            (sentMessage) => {

                console.log(
                    'ChatWindow - message_sent:',
                    sentMessage
                );


                if (
                    !sentMessage
                ) {
                    return;
                }


                const sentConversationId =
                    sentMessage.conversation
                        ? sentMessage.conversation.toString()
                        : '';


                if (
                    sentConversationId !==
                    conversationId
                ) {
                    return;
                }


                addMessage(
                    sentMessage
                );

            };


        socket.on(
            'new_message',
            handleNewMessage
        );


        socket.on(
            'message_sent',
            handleMessageSent
        );


        return () => {

            socket.off(
                'new_message',
                handleNewMessage
            );


            socket.off(
                'message_sent',
                handleMessageSent
            );

        };

    }, [
        socket,
        conversationId,
        addMessage,
        markAsRead
    ]);


    // ==================================================
    // Also support MessagingPage custom event
    // ==================================================
    //
    // This prevents problems if MessagingPage is already
    // forwarding socket messages to ChatWindow.
    //
    // Duplicate messages are automatically ignored.
    //

    useEffect(() => {

        const handleCustomMessage =
            (event) => {

                const incomingMessage =
                    event.detail;


                if (
                    !incomingMessage
                ) {
                    return;
                }


                const incomingConversationId =
                    incomingMessage.conversation
                        ? incomingMessage.conversation.toString()
                        : '';


                if (
                    incomingConversationId !==
                    conversationId
                ) {
                    return;
                }


                addMessage(
                    incomingMessage
                );


                markAsRead();

            };


        window.addEventListener(
            'lynktoday:new-message',
            handleCustomMessage
        );


        return () => {

            window.removeEventListener(
                'lynktoday:new-message',
                handleCustomMessage
            );

        };

    }, [
        conversationId,
        addMessage,
        markAsRead
    ]);


    // ==================================================
    // Auto scroll when messages change
    // ==================================================

    useEffect(() => {

        if (
            !shouldScrollToBottom.current
        ) {
            return;
        }


        const timer =
            setTimeout(
                () => {

                    scrollToBottom(
                        false
                    );

                    shouldScrollToBottom.current =
                        false;

                },
                50
            );


        return () => {
            clearTimeout(timer);
        };

    }, [
        messages,
        scrollToBottom
    ]);


    // ==================================================
    // Load older messages
    // ==================================================

    const handleLoadMore =
        async () => {

            if (
                loadingMore ||
                page >= totalPages
            ) {
                return;
            }


            const container =
                messagesContainerRef.current;


            const previousScrollHeight =
                container
                    ?.scrollHeight || 0;


            const previousScrollTop =
                container
                    ?.scrollTop || 0;


            await fetchMessages(
                page + 1,
                true
            );


            // Preserve scroll position
            requestAnimationFrame(
                () => {

                    if (!container) {
                        return;
                    }


                    const newScrollHeight =
                        container.scrollHeight;


                    container.scrollTop =
                        newScrollHeight -
                        previousScrollHeight +
                        previousScrollTop;

                }
            );

        };


    // ==================================================
    // Send message
    // ==================================================

    const handleSend =
        async () => {

            const content =
                input.trim();


            if (
                !content ||
                !conversationId ||
                sending
            ) {
                return;
            }


            try {

                setSending(true);
                setSendError('');


                // Clear input immediately
                setInput('');


                shouldScrollToBottom.current =
                    true;


                const response =
                    await api.post(
                        `/messages/conversations/${conversationId}/messages`,
                        {
                            content,
                            messageType:
                                'TEXT',
                            attachments: []
                        }
                    );


                const data =
                    response.data;


                if (
                    !data?.success ||
                    !data?.message
                ) {

                    throw new Error(
                        data?.message ||
                        'Unable to send message.'
                    );

                }


                // ------------------------------------------------
                // Add API response immediately.
                //
                // Socket "message_sent" may also arrive.
                // addMessage() prevents duplicates by _id.
                // ------------------------------------------------

                addMessage(
                    data.message
                );


                shouldScrollToBottom.current =
                    true;


                if (
                    onConversationUpdated
                ) {

                    onConversationUpdated();

                }


                setTimeout(
                    () => {

                        inputRef.current
                            ?.focus();

                    },
                    0
                );

            } catch (sendErrorValue) {

                console.error(
                    'Send message error:',
                    sendErrorValue
                );


                // Restore message if sending failed
                setInput(content);


                setSendError(
                    sendErrorValue
                        ?.response
                        ?.data
                        ?.message ||
                    sendErrorValue?.message ||
                    'Unable to send message.'
                );

            } finally {

                setSending(false);

            }

        };


    // ==================================================
    // Enter key
    // ==================================================

    const handleKeyDown =
        (event) => {

            if (
                event.key === 'Enter' &&
                !event.shiftKey
            ) {

                event.preventDefault();

                handleSend();

            }

        };


    // ==================================================
    // Delete message
    // ==================================================

    const handleDeleteMessage =
        async (messageId) => {

            if (!messageId) {
                return;
            }


            const confirmed =
                window.confirm(
                    'Delete this message?'
                );


            if (!confirmed) {
                return;
            }


            try {

                await api.delete(
                    `/messages/${messageId}`
                );


                setMessages(
                    previousMessages =>
                        previousMessages.map(
                            message => {

                                if (
                                    getMessageId(
                                        message
                                    ) !==
                                    messageId
                                ) {

                                    return message;

                                }


                                return {
                                    ...message,

                                    isDeleted:
                                        true,

                                    content:
                                        'Message deleted'
                                };

                            }
                        )
                );


                if (
                    onConversationUpdated
                ) {

                    onConversationUpdated();

                }

            } catch (deleteError) {

                console.error(
                    'Delete message error:',
                    deleteError
                );


                alert(
                    deleteError
                        ?.response
                        ?.data
                        ?.message ||
                    'Unable to delete message.'
                );

            }

        };


    // ==================================================
    // Empty state
    // ==================================================

    if (!conversation) {

        return (

            <section
                className={
                    styles.emptyWindow
                }
            >

                <div>

                    <div
                        className={
                            styles.emptyIcon
                        }
                    >
                        💬
                    </div>

                    <h2>
                        Select a conversation
                    </h2>

                    <p>
                        Choose a conversation
                        from the left to start
                        messaging.
                    </p>

                </div>

            </section>

        );

    }


    // ==================================================
    // Render
    // ==================================================

    return (

        <section
            className={
                styles.container
            }
        >

            {/* ==========================================
                Header
            ========================================== */}

            <header
                className={
                    styles.header
                }
            >

                <div
                    className={
                        styles.userInfo
                    }
                >

                    <div
                        className={
                            styles.avatar
                        }
                    >

                        {otherParticipant
                            ?.profileImage ? (

                            <img
                                src={
                                    otherParticipant.profileImage
                                }
                                alt={
                                    otherParticipant.fullName ||
                                    'User'
                                }
                            />

                        ) : (

                            getInitials(
                                otherParticipant
                                    ?.fullName
                            )

                        )}

                    </div>


                    <div>

                        <h2>

                            {
                                otherParticipant
                                    ?.fullName ||
                                'User'
                            }

                        </h2>


                        <p>

                            {
                                otherParticipant
                                    ?.profession ||
                                otherParticipant
                                    ?.companyName ||
                                'User'
                            }

                        </p>

                    </div>

                </div>

            </header>


            {/* ==========================================
                Messages
            ========================================== */}

            <div
                ref={
                    messagesContainerRef
                }
                className={
                    styles.messages
                }
            >

                {/* Load older */}

                {page < totalPages && (

                    <button
                        type="button"
                        className={
                            styles.loadMore
                        }
                        onClick={
                            handleLoadMore
                        }
                        disabled={
                            loadingMore
                        }
                    >

                        {loadingMore
                            ? 'Loading...'
                            : 'Load older messages'}

                    </button>

                )}


                {/* Loading */}

                {loading && (

                    <div
                        className={
                            styles.state
                        }
                    >
                        Loading messages...
                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div
                        className={
                            styles.error
                        }
                    >
                        {error}
                    </div>

                )}


                {/* No messages */}

                {!loading &&
                    !error &&
                    messages.length === 0 && (

                        <div
                            className={
                                styles.noMessages
                            }
                        >

                            <div>
                                💬
                            </div>

                            <h3>
                                No messages yet
                            </h3>

                            <p>
                                Start the conversation.
                            </p>

                        </div>

                    )}


                {/* Message list */}

                {!loading &&
                    messages.map(
                        (message) => {

                            const messageId =
                                getMessageId(
                                    message
                                );


                            const senderId =
                                getUserId(
                                    message.sender
                                );


                            const isOwn =
                                senderId ===
                                currentUserId;


                            const senderName =
                                message.sender
                                    ?.fullName ||
                                'User';


                            const deleted =
                                message.isDeleted;


                            return (

                                <div
                                    key={
                                        messageId ||
                                        `${message.createdAt}-${Math.random()}`
                                    }
                                    className={
                                        `${styles.messageRow} ${
                                            isOwn
                                                ? styles.own
                                                : styles.other
                                        }`
                                    }
                                >

                                    {/* Receiver avatar */}

                                    {!isOwn && (

                                        <div
                                            className={
                                                styles.messageAvatar
                                            }
                                        >

                                            {message.sender
                                                ?.profileImage ? (

                                                <img
                                                    src={
                                                        message.sender.profileImage
                                                    }
                                                    alt={
                                                        senderName
                                                    }
                                                />

                                            ) : (

                                                getInitials(
                                                    senderName
                                                )

                                            )}

                                        </div>

                                    )}


                                    <div
                                        className={
                                            styles.messageContent
                                        }
                                    >

                                        <div
                                            className={
                                                `${styles.bubble} ${
                                                    isOwn
                                                        ? styles.ownBubble
                                                        : styles.otherBubble
                                                } ${
                                                    deleted
                                                        ? styles.deletedBubble
                                                        : ''
                                                }`
                                            }
                                        >

                                            {deleted
                                                ? 'Message deleted'
                                                : getMessagePreview(
                                                    message
                                                )}

                                        </div>


                                        <div
                                            className={
                                                `${styles.messageMeta} ${
                                                    isOwn
                                                        ? styles.ownMeta
                                                        : ''
                                                }`
                                            }
                                        >

                                            <time>
                                                {
                                                    formatTime(
                                                        message.createdAt
                                                    )
                                                }
                                            </time>


                                            {/* Own message controls */}

                                            {isOwn &&
                                                !deleted && (

                                                    <>

                                                        {message.isRead && (
                                                            <span
                                                                className={
                                                                    styles.readStatus
                                                                }
                                                                title="Read"
                                                            >
                                                                ✓✓
                                                            </span>
                                                        )}


                                                        {!message.isRead &&
                                                            message.isDelivered && (

                                                                <span
                                                                    className={
                                                                        styles.deliveredStatus
                                                                    }
                                                                    title="Delivered"
                                                                >
                                                                    ✓✓
                                                                </span>

                                                            )}


                                                        {!message.isDelivered && (

                                                            <span
                                                                className={
                                                                    styles.sentStatus
                                                                }
                                                                title="Sent"
                                                            >
                                                                ✓
                                                            </span>

                                                        )}


                                                        <button
                                                            type="button"
                                                            className={
                                                                styles.deleteButton
                                                            }
                                                            onClick={() =>
                                                                handleDeleteMessage(
                                                                    messageId
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </>

                                                )}

                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )}

            </div>


            {/* ==========================================
                Send error
            ========================================== */}

            {sendError && (

                <div
                    className={
                        styles.sendError
                    }
                >
                    {sendError}
                </div>

            )}


            {/* ==========================================
                Composer
            ========================================== */}

            <div
                className={
                    styles.composer
                }
            >

                <textarea
                    ref={
                        inputRef
                    }
                    value={
                        input
                    }
                    onChange={
                        event =>
                            setInput(
                                event.target.value
                            )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                    placeholder="Write a message..."
                    rows={1}
                    disabled={
                        sending
                    }
                />


                <button
                    type="button"
                    onClick={
                        handleSend
                    }
                    disabled={
                        sending ||
                        !input.trim()
                    }
                    className={
                        styles.sendButton
                    }
                >

                    {sending
                        ? 'Sending...'
                        : 'Send'}

                </button>

            </div>

        </section>

    );

}