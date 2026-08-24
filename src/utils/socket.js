import { io } from "socket.io-client";

// ======================================================
// Socket Server URL
// ======================================================

const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    "http://localhost:5001";

// ======================================================
// Socket.IO Client
// ======================================================

export const socket = io(SOCKET_URL, {
    autoConnect: false,

    transports: [
        "websocket",
        "polling"
    ],

    reconnection: true,

    reconnectionAttempts: 10,

    reconnectionDelay: 1000,

    reconnectionDelayMax: 5000,

    timeout: 10000
});

// ======================================================
// Connect Socket
// ======================================================

export const connectSocket = (userId) => {

    if (!userId) {

        console.warn(
            "Socket connection skipped: userId is missing."
        );

        return;

    }

    socket.userId = userId;

    if (!socket.connected) {

        socket.connect();

    }

    const registerUser = () => {

        socket.emit(
            "setup",
            userId
        );

    };

    if (socket.connected) {

        registerUser();

    } else {

        socket.once(
            "connect",
            registerUser
        );

    }

};


// ======================================================
// Disconnect Socket
// ======================================================

export const disconnectSocket = () => {

    if (socket.connected) {

        socket.disconnect();

    }

    socket.userId = null;

};


// ======================================================
// Join Conversation
// ======================================================

export const joinConversation = (
    conversationId
) => {

    if (!conversationId) {
        return;
    }

    if (!socket.connected) {
        return;
    }

    socket.emit(
        "join_room",
        conversationId
    );

};


// ======================================================
// Leave Conversation
// ======================================================

export const leaveConversation = (
    conversationId
) => {

    if (!conversationId) {
        return;
    }

    if (!socket.connected) {
        return;
    }

    socket.emit(
        "leave_room",
        conversationId
    );

};


// ======================================================
// Send Real-Time Message
// ======================================================

export const emitMessage = (
    message
) => {

    if (!message) {
        return;
    }

    const roomId =
        message.inquiryRoomId ||
        message.roomId ||
        message.conversationId;

    if (!roomId) {

        console.warn(
            "Cannot send socket message: conversation ID missing."
        );

        return;

    }

    socket.emit(
        "send_message",
        {
            ...message,
            conversationId: roomId
        }
    );

};


// ======================================================
// Typing
// ======================================================

export const startTyping = (
    conversationId,
    userId
) => {

    if (!conversationId) {
        return;
    }

    socket.emit(
        "typing",
        {
            conversationId,
            userId
        }
    );

};


export const stopTyping = (
    conversationId,
    userId
) => {

    if (!conversationId) {
        return;
    }

    socket.emit(
        "stop_typing",
        {
            conversationId,
            userId
        }
    );

};


// ======================================================
// Message Read
// ======================================================

export const emitMessageRead = (
    conversationId,
    userId
) => {

    if (!conversationId) {
        return;
    }

    socket.emit(
        "message_read",
        {
            conversationId,
            userId
        }
    );

};


// ======================================================
// User Online
// ======================================================

export const emitUserOnline = (
    conversationId,
    userId
) => {

    if (!conversationId) {
        return;
    }

    socket.emit(
        "user_online",
        {
            conversationId,
            userId
        }
    );

};


// ======================================================
// User Offline
// ======================================================

export const emitUserOffline = (
    conversationId,
    userId
) => {

    if (!conversationId) {
        return;
    }

    socket.emit(
        "user_offline",
        {
            conversationId,
            userId
        }
    );

};


// ======================================================
// Socket Status
// ======================================================

export const isSocketConnected = () => {

    return socket.connected;

};


// ======================================================
// Connection Events
// ======================================================

socket.on(
    "connect",
    () => {

        console.log(
            "Socket connected:",
            socket.id
        );

        if (socket.userId) {

            socket.emit(
                "setup",
                socket.userId
            );

        }

    }
);


// ======================================================
// Disconnect
// ======================================================

socket.on(
    "disconnect",
    (reason) => {

        console.log(
            "Socket disconnected:",
            reason
        );

    }
);


// ======================================================
// Connection Error
// ======================================================

socket.on(
    "connect_error",
    (error) => {

        console.error(
            "Socket connection error:",
            error.message
        );

    }
);


// ======================================================
// Default Export
// ======================================================

export default socket;