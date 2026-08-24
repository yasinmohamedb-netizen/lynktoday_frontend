'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import api from '@/utils/api';
import ConversationItem from './ConversationItem';

import styles from './ConversationList.module.css';

export default function ConversationList({
    conversations = [],
    selectedConversation,
    currentUser,
    loading,
    error,
    onSelect,
    onRefresh
}) {
    const [search, setSearch] = useState('');
    const [following, setFollowing] = useState([]);
    const [followingLoading, setFollowingLoading] = useState(false);
    const [followingError, setFollowingError] = useState('');

    /*
    ======================================================
    LOAD FOLLOWING
    ======================================================
    */

    const loadFollowing = useCallback(async () => {
        if (!currentUser?._id) {
            setFollowing([]);
            return;
        }

        try {
            setFollowingLoading(true);
            setFollowingError('');

            const response = await api.get(
                `/follow/following/${currentUser._id}`
            );

            const data = response?.data;

            let people = [];

            if (Array.isArray(data)) {
                people = data;
            } else if (Array.isArray(data?.following)) {
                people = data.following;
            } else if (Array.isArray(data?.users)) {
                people = data.users;
            } else if (Array.isArray(data?.data)) {
                people = data.data;
            }

            people = people.filter(
                person =>
                    String(person?._id) !==
                    String(currentUser._id)
            );

            setFollowing(people);
        } catch (err) {
            console.error(
                'Unable to load people you follow:',
                err
            );

            setFollowing([]);

            setFollowingError(
                err?.response?.data?.message ||
                'Unable to load people you follow.'
            );
        } finally {
            setFollowingLoading(false);
        }
    }, [currentUser?._id]);

    useEffect(() => {
        loadFollowing();
    }, [loadFollowing]);

    /*
    ======================================================
    SEARCH
    ======================================================
    */

    const query = search.trim().toLowerCase();

    /*
    ======================================================
    FILTER CONVERSATIONS
    ======================================================
    */

    const filteredConversations = useMemo(() => {
        if (!query) {
            return conversations;
        }

        return conversations.filter(conversation => {
            const participant =
                conversation.participants?.find(
                    user =>
                        String(user?._id) !==
                        String(currentUser?._id)
                );

            return (
                participant?.fullName
                    ?.toLowerCase()
                    .includes(query) ||

                participant?.companyName
                    ?.toLowerCase()
                    .includes(query) ||

                participant?.profession
                    ?.toLowerCase()
                    .includes(query) ||

                conversation.lastMessage?.content
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [
        conversations,
        currentUser?._id,
        query
    ]);

    /*
    ======================================================
    FILTER FOLLOWING
    ======================================================
    */

    const filteredFollowing = useMemo(() => {
        if (!query) {
            return following;
        }

        return following.filter(person => {
            return (
                person?.fullName
                    ?.toLowerCase()
                    .includes(query) ||

                person?.companyName
                    ?.toLowerCase()
                    .includes(query) ||

                person?.profession
                    ?.toLowerCase()
                    .includes(query) ||

                person?.designation
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [following, query]);

    /*
    ======================================================
    FIND EXISTING CONVERSATION
    ======================================================
    */

    const getConversationForPerson = useCallback(
        person => {
            return conversations.find(conversation =>
                conversation.participants?.some(
                    participant =>
                        String(participant?._id) ===
                        String(person?._id)
                )
            );
        },
        [conversations]
    );

    /*
    ======================================================
    FOLLOWING PERSON CLICK
    ======================================================
    */

    const handleFollowingClick = person => {
        const existingConversation =
            getConversationForPerson(person);

        if (existingConversation) {
            onSelect(existingConversation);
            return;
        }

        /*
         * No conversation exists yet.
         *
         * We don't create a fake conversation.
         * Connect this later to your create-conversation
         * endpoint.
         */

        console.log(
            'Start conversation with:',
            person
        );
    };

    /*
    ======================================================
    REFRESH
    ======================================================
    */

    const handleRefresh = async () => {
        setSearch('');

        onRefresh?.();

        await loadFollowing();
    };

    /*
    ======================================================
    RENDER
    ======================================================
    */

    return (
        <aside className={styles.container}>

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className={styles.header}>

                <div>
                    <h2>Messages</h2>

                    <p>
                        Your conversations
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className={styles.refresh}
                    title="Refresh"
                    aria-label="Refresh messages"
                >
                    ↻
                </button>

            </div>


            {/* ==========================================
                SEARCH
            ========================================== */}

            <div className={styles.search}>

                <div className={styles.searchBox}>

                    <span>
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search people or conversations..."
                        value={search}
                        onChange={event =>
                            setSearch(event.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className={styles.clearSearch}
                            onClick={() => setSearch('')}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}

                </div>

            </div>


            {/* ==========================================
                CONVERSATIONS
                THIS SECTION SCROLLS
            ========================================== */}

            <section className={styles.conversationsSection}>

                <div className={styles.sectionHeader}>

                    <div>

                        <h3>
                            CONVERSATIONS
                        </h3>

                        <p>
                            Your recent chats
                        </p>

                    </div>

                    <span className={styles.count}>
                        {filteredConversations.length}
                    </span>

                </div>


                <div className={styles.conversationScroll}>

                    {loading && (
                        <div className={styles.state}>

                            <div className={styles.smallSpinner} />

                            Loading conversations...

                        </div>
                    )}


                    {!loading && error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}


                    {!loading &&
                        !error &&
                        filteredConversations.length === 0 && (

                            <div className={styles.emptyConversation}>

                                <div>
                                    💬
                                </div>

                                <strong>
                                    {query
                                        ? 'No conversations found'
                                        : 'No conversations yet'}
                                </strong>

                                <p>
                                    {query
                                        ? 'Try another name or search term.'
                                        : 'Your recent conversations will appear here.'}
                                </p>

                            </div>
                        )}


                    {!loading &&
                        !error &&
                        filteredConversations.map(
                            conversation => (
                                <ConversationItem
                                    key={conversation._id}
                                    conversation={conversation}
                                    currentUser={currentUser}
                                    selected={
                                        selectedConversation?._id ===
                                        conversation._id
                                    }
                                    onClick={() =>
                                        onSelect(
                                            conversation
                                        )
                                    }
                                />
                            )
                        )}

                </div>

            </section>


            {/* ==========================================
                PEOPLE YOU FOLLOW
                STAYS ACCESSIBLE
            ========================================== */}

            <section className={styles.followingSection}>

                <div className={styles.followingHeader}>

                    <div>

                        <div className={styles.followingTitleRow}>

                            <span className={styles.peopleIcon}>
                                👥
                            </span>

                            <h3>
                                PEOPLE YOU FOLLOW
                            </h3>

                        </div>

                        <p>
                            Start a conversation
                        </p>

                    </div>

                    <span className={styles.followingCount}>
                        {filteredFollowing.length}
                    </span>

                </div>


                {/* Following list has its OWN scroll */}

                <div className={styles.followingScroll}>

                    {followingLoading && (
                        <div className={styles.followingState}>

                            <div className={styles.smallSpinner} />

                            Loading people...

                        </div>
                    )}


                    {!followingLoading &&
                        followingError && (

                            <div className={styles.followingError}>

                                <span>
                                    !
                                </span>

                                <p>
                                    {followingError}
                                </p>

                                <button
                                    type="button"
                                    onClick={loadFollowing}
                                >
                                    Try again
                                </button>

                            </div>
                        )}


                    {!followingLoading &&
                        !followingError &&
                        filteredFollowing.length === 0 && (

                            <div className={styles.emptyFollowing}>

                                <div className={styles.emptyFollowingIcon}>
                                    👥
                                </div>

                                <strong>
                                    {query
                                        ? 'No people found'
                                        : 'No one to message yet'}
                                </strong>

                                <p>
                                    {query
                                        ? 'Try another name or profession.'
                                        : 'People you follow will appear here.'}
                                </p>

                            </div>
                        )}


                    {!followingLoading &&
                        !followingError &&
                        filteredFollowing.map(person => {

                            const existingConversation =
                                getConversationForPerson(person);

                            const fullName =
                                person?.fullName ||
                                'Unknown User';

                            const initials =
                                fullName
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase();

                            const profession =
                                person?.profession ||
                                person?.designation ||
                                person?.companyName ||
                                'Professional';

                            return (
                                <button
                                    type="button"
                                    key={person?._id}
                                    className={
                                        styles.followingPerson
                                    }
                                    onClick={() =>
                                        handleFollowingClick(
                                            person
                                        )
                                    }
                                >

                                    <div
                                        className={
                                            styles.followingAvatar
                                        }
                                    >

                                        {person?.profileImage ? (
                                            <img
                                                src={
                                                    person.profileImage
                                                }
                                                alt=""
                                            />
                                        ) : (
                                            initials
                                        )}

                                    </div>


                                    <div
                                        className={
                                            styles.followingInfo
                                        }
                                    >

                                        <strong>
                                            {fullName}
                                        </strong>

                                        <span>
                                            {profession}
                                        </span>

                                    </div>


                                    <span
                                        className={
                                            existingConversation
                                                ? styles.openButton
                                                : styles.messageButton
                                        }
                                    >
                                        {existingConversation
                                            ? 'Message'
                                            : 'Message'}
                                    </span>

                                </button>
                            );
                        })}

                </div>

            </section>

        </aside>
    );
}