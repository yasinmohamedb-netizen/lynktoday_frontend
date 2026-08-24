'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import api from '@/utils/api';

import { io } from 'socket.io-client';

import NotificationBell from '../Notifications/NotificationBell';
import { useAuthModal } from '@/components/auth/AuthModalProvider/AuthModalProvider';

import styles from './Navbar.module.css';


// ======================================================
// SOCKET URL
// ======================================================

const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    'http://localhost:5001';


// ======================================================
// NAVBAR
// ======================================================

export default function Navbar() {

    const router = useRouter();
    const pathname = usePathname();

    const { requireAuth } = useAuthModal();


    // ==================================================
    // USER
    // ==================================================

    const [user, setUser] = useState(null);


    // ==================================================
    // SEARCH
    // ==================================================

    const [searchQuery, setSearchQuery] =
        useState('');

    const [searchResults, setSearchResults] =
        useState([]);

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [showSearchResults, setShowSearchResults] =
        useState(false);


    // ==================================================
    // UNREAD MESSAGES
    // ==================================================

    const [unreadMessages, setUnreadMessages] =
        useState(0);


    // ==================================================
    // LOAD USER
    // ==================================================

    useEffect(() => {

        const token =
            localStorage.getItem(
                'lynktoday_token'
            );

        const storedUser =
            localStorage.getItem(
                'lynktoday_user'
            );


        if (!token || !storedUser) {

            setUser(null);

            return;

        }


        try {

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);

        } catch (error) {

            console.error(
                'Failed to parse stored user:',
                error
            );

            setUser(null);

        }

    }, [pathname]);


    // ==================================================
    // LOAD UNREAD MESSAGE COUNT
    // ==================================================

    useEffect(() => {

        if (!user?._id) {

            return;

        }


        const loadUnreadMessages =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            'lynktoday_token'
                        );


                    if (!token) {

                        return;

                    }


                    const response =
                        await api.get(
                            '/messages/unread-count'
                        );


                    const data =
                        response.data;


                    if (data?.success) {

                        setUnreadMessages(
                            Number(data.count) || 0
                        );

                    }

                } catch (error) {

                    console.error(
                        'Failed to load unread message count:',
                        error
                    );

                }

            };


        loadUnreadMessages();

    }, [user?._id]);


    // ==================================================
    // REAL-TIME MESSAGE SOCKET
    // ==================================================

    useEffect(() => {

        if (!user?._id) {

            return;

        }


        const socket =
            io(
                SOCKET_URL,
                {
                    transports: [
                        'websocket',
                        'polling'
                    ]
                }
            );


        // ------------------------------------------------
        // CONNECT
        // ------------------------------------------------

        socket.on(
            'connect',
            () => {

                console.log(
                    'Navbar Socket Connected:',
                    socket.id
                );


                socket.emit(
                    'setup',
                    user._id
                );

            }
        );


        // ------------------------------------------------
        // NEW MESSAGE
        // ------------------------------------------------

        const handleNewMessage =
            (message) => {

                const senderId =
                    message?.sender?._id ||
                    message?.sender;


                const currentUserId =
                    user?._id;


                // Ignore messages sent by myself

                if (
                    senderId &&
                    currentUserId &&
                    senderId.toString() ===
                    currentUserId.toString()
                ) {

                    return;

                }


                setUnreadMessages(
                    previousCount =>
                        previousCount + 1
                );

            };


        socket.on(
            'new_message',
            handleNewMessage
        );


        // ------------------------------------------------
        // CLEANUP
        // ------------------------------------------------

        return () => {

            socket.off(
                'new_message',
                handleNewMessage
            );

            socket.disconnect();

        };

    }, [user?._id]);


    // ==================================================
    // LISTEN FOR MESSAGE COUNT CHANGES
    // ==================================================

    useEffect(() => {

        const handleUnreadMessageChange =
            (event) => {

                const count =
                    event?.detail?.count;


                if (
                    typeof count === 'number'
                ) {

                    setUnreadMessages(count);

                }

            };


        window.addEventListener(
            'messages-unread-changed',
            handleUnreadMessageChange
        );


        return () => {

            window.removeEventListener(
                'messages-unread-changed',
                handleUnreadMessageChange
            );

        };

    }, []);


    // ==================================================
    // SEARCH HS CODES
    // ==================================================

    useEffect(() => {

        const query =
            searchQuery.trim();


        if (
            !query ||
            query.length < 2
        ) {

            setSearchResults([]);

            setShowSearchResults(false);

            return;

        }


        const controller =
            new AbortController();


        const searchHSCode =
            async () => {

                try {

                    setSearchLoading(true);

                    setShowSearchResults(true);


                    const response =
                        await api.get(
                            `/hs-codes/search?q=${encodeURIComponent(
                                query
                            )}&limit=5`,
                            {
                                signal:
                                    controller.signal
                            }
                        );


                    const data =
                        response.data;


                    if (
                        data?.success &&
                        Array.isArray(data.hsCodes)
                    ) {

                        setSearchResults(
                            data.hsCodes
                        );

                    } else if (
                        data?.success &&
                        Array.isArray(data.results)
                    ) {

                        setSearchResults(
                            data.results
                        );

                    } else {

                        setSearchResults([]);

                    }

                } catch (error) {

                    if (
                        error.name !==
                        'CanceledError' &&
                        error.name !==
                        'AbortError'
                    ) {

                        console.error(
                            'HS Code search error:',
                            error
                        );

                    }

                    setSearchResults([]);

                } finally {

                    setSearchLoading(false);

                }

            };


        const timer =
            setTimeout(
                searchHSCode,
                300
            );


        return () => {

            clearTimeout(timer);

            controller.abort();

        };

    }, [searchQuery]);


    // ==================================================
    // OPEN SEARCH PAGE
    // ==================================================

    const openSearchPage = () => {

        const query =
            searchQuery.trim();


        if (!query) {

            return;

        }


        setShowSearchResults(false);


        router.push(
            `/search?q=${encodeURIComponent(query)}`
        );

    };


    // ==================================================
    // SEARCH ENTER
    // ==================================================

    const handleSearchKeyDown =
        (event) => {

            if (
                event.key === 'Enter'
            ) {

                event.preventDefault();

                openSearchPage();

            }

        };


    // ==================================================
    // HS CODE CLICK
    // ==================================================

    const handleHSCodeClick =
        (hsCode) => {

            if (!hsCode?._id) {

                return;

            }


            setShowSearchResults(false);


            router.push(
                `/hs-codes/${hsCode._id}`
            );

        };


    // ==================================================
    // MESSAGES CLICK
    // ==================================================

    const handleMessagesClick =
        (event) => {

            if (!user) {

                event.preventDefault();

                requireAuth();

                return;

            }


            setUnreadMessages(0);


            window.dispatchEvent(
                new CustomEvent(
                    'messages-unread-changed',
                    {
                        detail: {
                            count: 0
                        }
                    }
                )
            );

        };


    // ==================================================
    // LOGOUT
    // ==================================================

    const logout = () => {

        localStorage.removeItem(
            'lynktoday_token'
        );

        localStorage.removeItem(
            'lynktoday_user'
        );


        setUser(null);

        setUnreadMessages(0);


        router.push('/login');

    };


    // ==================================================
    // ACTIVE NAV
    // ==================================================

    const isActive = (path) => {

        if (path === '/') {

            return pathname === '/';

        }

        return pathname.startsWith(path);

    };


    // ==================================================
    // PROTECTED NAVIGATION
    // ==================================================

    const handleProtectedNavigation = (
        event,
        path
    ) => {

        if (!user) {

            event.preventDefault();

            requireAuth();

            return;

        }

        router.push(path);

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <header className={styles.navbar}>

            <div className={styles.navbarInner}>


                {/* ======================================
                    LOGO
                ====================================== */}

                <Link
                    href="/"
                    className={styles.logo}
                >

                    Lynk<span>Today</span>

                </Link>


                {/* ======================================
                    SEARCH
                ====================================== */}

                <div
                    className={
                        styles.searchWrapper
                    }
                >

                    <div
                        className={
                            styles.searchBox
                        }
                    >

                        <span
                            className={
                                styles.searchIcon
                            }
                        >
                            ⌕
                        </span>


                        <input
                            type="text"
                            value={searchQuery}
                            onChange={
                                event =>
                                    setSearchQuery(
                                        event.target.value
                                    )
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                            onFocus={() => {

                                if (
                                    searchQuery.trim()
                                        .length >= 2
                                ) {

                                    setShowSearchResults(
                                        true
                                    );

                                }

                            }}
                            placeholder="Search people, companies, questions, HS Codes..."
                            className={
                                styles.searchInput
                            }
                        />


                        {searchQuery && (

                            <button
                                type="button"
                                className={
                                    styles.clearSearch
                                }
                                onClick={() => {

                                    setSearchQuery('');

                                    setSearchResults([]);

                                    setShowSearchResults(
                                        false
                                    );

                                }}
                                aria-label="Clear search"
                            >
                                ×
                            </button>

                        )}

                    </div>


                    {/* ==================================
                        SEARCH RESULTS
                    ================================== */}

                    {showSearchResults && (

                        <div
                            className={
                                styles.searchResults
                            }
                        >

                            {searchLoading ? (

                                <div
                                    className={
                                        styles.searchState
                                    }
                                >
                                    Searching...
                                </div>

                            ) : searchResults.length > 0 ? (

                                <>

                                    <div
                                        className={
                                            styles.searchHeading
                                        }
                                    >
                                        HS CODE RESULTS
                                    </div>


                                    {searchResults.map(
                                        hsCode => (

                                            <button
                                                key={
                                                    hsCode._id
                                                }
                                                type="button"
                                                className={
                                                    styles.searchResult
                                                }
                                                onClick={() =>
                                                    handleHSCodeClick(
                                                        hsCode
                                                    )
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.resultCode
                                                    }
                                                >

                                                    {
                                                        hsCode.code ||
                                                        hsCode.hsCode
                                                    }

                                                </div>


                                                <div
                                                    className={
                                                        styles.resultDescription
                                                    }
                                                >

                                                    {
                                                        hsCode.description
                                                    }

                                                </div>

                                            </button>

                                        )
                                    )}

                                </>

                            ) : (

                                <div
                                    className={
                                        styles.searchState
                                    }
                                >

                                    No results found.

                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* ======================================
                    NAVIGATION
                ====================================== */}

                <nav
                    className={
                        styles.navigation
                    }
                >

                    <Link
                        href="/"
                        className={`
                            ${styles.navItem}
                            ${isActive('/')
                                ? styles.activeNav
                                : ''}
                        `}
                        onClick={(event) =>
                            handleProtectedNavigation(
                                event,
                                '/'
                            )
                        }
                    >

                        <span>Home</span>

                    </Link>


                    <Link
                        href="/discover"
                        className={`
                            ${styles.navItem}
                            ${isActive('/discover')
                                ? styles.activeNav
                                : ''}
                        `}
                        onClick={(event) =>
                            handleProtectedNavigation(
                                event,
                                '/discover'
                            )
                        }
                    >

                        <span>Discover</span>

                    </Link>


                    <Link
                        href="/documentation"
                        className={`
                            ${styles.navItem}
                            ${isActive('/documentation')
                                ? styles.activeNav
                                : ''}
                        `}
                        onClick={(event) =>
                            handleProtectedNavigation(
                                event,
                                '/documentation'
                            )
                        }
                    >

                        <span>Documentation</span>

                    </Link>


                    <Link
                        href="/messages"
                        className={`
                            ${styles.navItem}
                            ${isActive('/messages')
                                ? styles.activeNav
                                : ''}
                        `}
                        onClick={
                            handleMessagesClick
                        }
                    >

                        <span
                            className={
                                styles.messagesNav
                            }
                        >

                            Messages


                            {unreadMessages > 0 && (

                                <span
                                    className={
                                        styles.messageBadge
                                    }
                                >

                                    {
                                        unreadMessages > 99
                                            ? '99+'
                                            : unreadMessages
                                    }

                                </span>

                            )}

                        </span>

                    </Link>


                    <div
                        className={
                            styles.notificationWrapper
                        }
                    >

                        {user ? (

                            <NotificationBell
                                userId={user._id}
                            />

                        ) : (

                            <button
                                type="button"
                                onClick={requireAuth}
                                className={
                                    styles.notificationButton
                                }
                                aria-label="Login to view notifications"
                            >
                                🔔
                            </button>

                        )}

                    </div>

                </nav>


                {/* ======================================
                    RIGHT SECTION
                ====================================== */}

                <div
                    className={
                        styles.rightSection
                    }
                >

                    {user ? (

                        <>

                            <Link
                                href="/profile"
                                className={
                                    styles.profile
                                }
                            >

                                <div
                                    className={
                                        styles.avatar
                                    }
                                >

                                    {
                                        user.fullName
                                            ?.charAt(0)
                                            .toUpperCase()
                                    }

                                </div>


                                <div
                                    className={
                                        styles.userInfo
                                    }
                                >

                                    <strong>
                                        {user.fullName}
                                    </strong>

                                    <span>
                                        {
                                            user.profession ||
                                            'Member'
                                        }
                                    </span>

                                </div>

                            </Link>


                            <button
                                type="button"
                                onClick={logout}
                                className={
                                    styles.logoutBtn
                                }
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <div
                            className={
                                styles.authButtons
                            }
                        >

                            <Link
                                href="/login"
                                className={
                                    styles.loginBtn
                                }
                            >
                                Login
                            </Link>


                            <Link
                                href="/signup"
                                className={
                                    styles.signupBtn
                                }
                            >
                                Join Free
                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}