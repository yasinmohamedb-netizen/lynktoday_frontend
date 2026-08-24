'use client';

import {
    useEffect,
    useState,
    useCallback
} from 'react';

import { io } from 'socket.io-client';

import api from '@/utils/api';

import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

import styles from './MessagingPage.module.css';


const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    'http://localhost:5001';


export default function MessagingPage() {

    const [conversations, setConversations] =
        useState([]);

    const [
        selectedConversation,
        setSelectedConversation
    ] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [socket, setSocket] =
        useState(null);

    const [currentUser, setCurrentUser] =
        useState(null);


    // ======================================================
    // URL CONVERSATION ID
    // ======================================================

    const [
        requestedConversationId,
        setRequestedConversationId
    ] = useState(null);


    // ======================================================
    // CURRENT USER
    // ======================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem(
                    'lynktoday_user'
                );


            if (!storedUser) {

                return;

            }


            const parsedUser =
                JSON.parse(
                    storedUser
                );


            setCurrentUser(
                parsedUser
            );

        } catch (error) {

            console.error(
                'Unable to load user:',
                error
            );

        }

    }, []);


    // ======================================================
    // READ CONVERSATION ID FROM URL
    // ======================================================

    useEffect(() => {

        if (
            typeof window ===
            'undefined'
        ) {

            return;

        }


        const params =
            new URLSearchParams(
                window.location.search
            );


        const conversationId =
            params.get(
                'conversationId'
            );


        if (conversationId) {

            setRequestedConversationId(
                conversationId
            );

        }

    }, []);


    // ======================================================
    // SOCKET CONNECTION
    // ======================================================

    useEffect(() => {

        if (
            !currentUser?._id
        ) {

            return;

        }


        console.log(
            'Connecting messaging socket for:',
            currentUser._id
        );


        const newSocket =
            io(
                SOCKET_URL,
                {
                    transports: [
                        'websocket'
                    ],

                    withCredentials: true,

                    autoConnect: true
                }
            );


        // --------------------------------------------------
        // CONNECT
        // --------------------------------------------------

        newSocket.on(
            'connect',
            () => {

                console.log(
                    'Messaging socket connected:',
                    newSocket.id
                );


                newSocket.emit(
                    'setup',
                    currentUser._id
                );

            }
        );


        // --------------------------------------------------
        // DISCONNECT
        // --------------------------------------------------

        newSocket.on(
            'disconnect',
            () => {

                console.log(
                    'Messaging socket disconnected'
                );

            }
        );


        // --------------------------------------------------
        // ERROR
        // --------------------------------------------------

        newSocket.on(
            'connect_error',
            (error) => {

                console.error(
                    'Messaging socket error:',
                    error
                );

            }
        );


        setSocket(
            newSocket
        );


        // --------------------------------------------------
        // CLEANUP
        // --------------------------------------------------

        return () => {

            console.log(
                'Disconnecting messaging socket'
            );


            newSocket.disconnect();

        };

    }, [
        currentUser?._id
    ]);


    // ======================================================
    // LOAD CONVERSATIONS
    // ======================================================

    const fetchConversations =
        useCallback(
            async () => {

                try {

                    setLoading(
                        true
                    );

                    setError('');


                    const { data } =
                        await api.get(
                            '/messages/conversations'
                        );


                    if (
                        data.success
                    ) {

                        const loadedConversations =
                            Array.isArray(
                                data.conversations
                            )
                                ? [
                                    ...data.conversations
                                ]
                                : [];


                        // ------------------------------------------
                        // Sort newest conversation first
                        // ------------------------------------------

                        loadedConversations.sort(
                            (a, b) => {

                                const dateA =
                                    new Date(
                                        a.lastMessageAt ||
                                        a.updatedAt ||
                                        a.createdAt ||
                                        0
                                    );


                                const dateB =
                                    new Date(
                                        b.lastMessageAt ||
                                        b.updatedAt ||
                                        b.createdAt ||
                                        0
                                    );


                                return (
                                    dateB.getTime() -
                                    dateA.getTime()
                                );

                            }
                        );


                        setConversations(
                            loadedConversations
                        );

                    } else {

                        setError(
                            'Unable to load conversations.'
                        );

                    }

                } catch (error) {

                    console.error(
                        'Conversation error:',
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        'Unable to load conversations.'
                    );

                } finally {

                    setLoading(
                        false
                    );

                }

            },
            []
        );


    // ======================================================
    // LOAD CONVERSATIONS AFTER USER LOADS
    // ======================================================

    useEffect(() => {

        if (
            !currentUser?._id
        ) {

            return;

        }


        fetchConversations();

    }, [
        currentUser?._id,
        fetchConversations
    ]);


    // ======================================================
    // AUTO OPEN REQUESTED CONVERSATION
    // ======================================================

    useEffect(() => {

        if (
            !requestedConversationId
        ) {

            return;

        }


        if (
            loading
        ) {

            return;

        }


        // --------------------------------------------------
        // Find conversation in loaded list
        // --------------------------------------------------

        const existingConversation =
            conversations.find(
                conversation =>
                    conversation._id?.toString() ===
                    requestedConversationId.toString()
            );


        if (
            existingConversation
        ) {

            setSelectedConversation(
                existingConversation
            );

            return;

        }


        // --------------------------------------------------
        // Conversation wasn't returned in list.
        // Fetch it directly.
        // --------------------------------------------------

        const loadRequestedConversation =
            async () => {

                try {

                    const { data } =
                        await api.get(
                            `/messages/conversations/${requestedConversationId}`
                        );


                    if (
                        data?.success &&
                        data?.conversation
                    ) {

                        const conversation =
                            data.conversation;


                        setSelectedConversation(
                            conversation
                        );


                        // Add it to the conversation list
                        setConversations(
                            previous => {

                                const alreadyExists =
                                    previous.some(
                                        item =>
                                            item._id?.toString() ===
                                            conversation._id?.toString()
                                    );


                                if (
                                    alreadyExists
                                ) {

                                    return previous;

                                }


                                return [
                                    conversation,
                                    ...previous
                                ];

                            }
                        );

                    }

                } catch (error) {

                    console.error(
                        'Unable to open requested conversation:',
                        error.response?.data ||
                        error
                    );

                }

            };


        loadRequestedConversation();

    }, [
        requestedConversationId,
        conversations,
        loading
    ]);


    // ======================================================
    // SELECT CONVERSATION
    // ======================================================

    const handleSelectConversation =
        (conversation) => {

            setSelectedConversation(
                conversation
            );


            // Keep URL in sync
            if (
                typeof window !==
                'undefined'
            ) {

                const url =
                    `/messages?conversationId=${conversation._id}`;


                window.history.replaceState(
                    null,
                    '',
                    url
                );

            }

        };


    // ======================================================
    // NEW INCOMING MESSAGE
    // ======================================================

    useEffect(() => {

        if (
            !socket
        ) {

            return;

        }


        const handleIncomingMessage =
            (message) => {

                console.log(
                    'NEW MESSAGE RECEIVED:',
                    message
                );


                if (
                    !message
                ) {

                    return;

                }


                const conversationId =
                    message.conversation?.toString();


                if (
                    !conversationId
                ) {

                    return;

                }


                setConversations(
                    previous => {

                        const existingConversation =
                            previous.find(
                                conversation =>
                                    conversation._id?.toString() ===
                                    conversationId
                            );


                        // --------------------------------------
                        // Existing conversation
                        // --------------------------------------

                        if (
                            existingConversation
                        ) {

                            const updatedConversation = {

                                ...existingConversation,

                                lastMessage:
                                    message,

                                lastMessageAt:
                                    message.createdAt

                            };


                            // ----------------------------------
                            // Update unread count
                            // ----------------------------------

                            if (
                                currentUser?._id &&
                                message.sender?._id?.toString() !==
                                currentUser._id.toString()
                            ) {

                                const unreadCounts = {

                                    ...(
                                        existingConversation
                                            .unreadCounts ||
                                        {}
                                    )

                                };


                                const currentCount =
                                    unreadCounts[
                                        currentUser._id
                                    ] || 0;


                                unreadCounts[
                                    currentUser._id
                                ] =
                                    currentCount + 1;


                                updatedConversation.unreadCounts =
                                    unreadCounts;

                            }


                            const remaining =
                                previous.filter(
                                    conversation =>
                                        conversation._id?.toString() !==
                                        conversationId
                                );


                            return [

                                updatedConversation,

                                ...remaining

                            ];

                        }


                        return previous;

                    }
                );


                // ==================================================
                // UPDATE SELECTED CHAT
                // ==================================================

                if (
                    selectedConversation?._id?.toString() ===
                    conversationId
                ) {

                    window.dispatchEvent(
                        new CustomEvent(
                            'lynktoday:new-message',
                            {
                                detail:
                                    message
                            }
                        )
                    );

                }

            };


        // ==================================================
        // RECEIVE MESSAGE
        // ==================================================

        socket.on(
            'receive_message',
            handleIncomingMessage
        );


        // ==================================================
        // NEW MESSAGE
        // ==================================================

        socket.on(
            'new_message',
            handleIncomingMessage
        );


        // ==================================================
        // MESSAGE SENT
        // ==================================================

        const handleMessageSent =
            (message) => {

                console.log(
                    'MESSAGE SENT:',
                    message
                );


                if (
                    !message
                ) {

                    return;

                }


                const conversationId =
                    message.conversation?.toString();


                if (
                    !conversationId
                ) {

                    return;

                }


                setConversations(
                    previous => {

                        const existingConversation =
                            previous.find(
                                conversation =>
                                    conversation._id?.toString() ===
                                    conversationId
                            );


                        if (
                            !existingConversation
                        ) {

                            return previous;

                        }


                        const updatedConversation = {

                            ...existingConversation,

                            lastMessage:
                                message,

                            lastMessageAt:
                                message.createdAt

                        };


                        const remaining =
                            previous.filter(
                                conversation =>
                                    conversation._id?.toString() !==
                                    conversationId
                            );


                        return [

                            updatedConversation,

                            ...remaining

                        ];

                    }
                );

            };


        socket.on(
            'message_sent',
            handleMessageSent
        );


        // ==================================================
        // CLEANUP
        // ==================================================

        return () => {

            socket.off(
                'receive_message',
                handleIncomingMessage
            );


            socket.off(
                'new_message',
                handleIncomingMessage
            );


            socket.off(
                'message_sent',
                handleMessageSent
            );

        };

    }, [
        socket,
        selectedConversation?._id,
        currentUser?._id
    ]);


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div
            className={
                styles.wrapper
            }
        >

            <ConversationList

                conversations={
                    conversations
                }

                selectedConversation={
                    selectedConversation
                }

                currentUser={
                    currentUser
                }

                loading={
                    loading
                }

                error={
                    error
                }

                onSelect={
                    handleSelectConversation
                }

                onRefresh={
                    fetchConversations
                }

            />


            <ChatWindow

                conversation={
                    selectedConversation
                }

                currentUser={
                    currentUser
                }

                socket={
                    socket
                }

                onConversationUpdated={
                    fetchConversations
                }

            />

        </div>

    );

}