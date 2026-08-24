'use client';

import { useMemo, useState } from 'react';

import ConversationItem from './ConversationItem';

import styles from './ConversationList.module.css';

export default function ConversationList({
    conversations,
    selectedConversation,
    currentUser,
    loading,
    error,
    onSelect,
    onRefresh
}) {

    const [search, setSearch] =
        useState('');


    const filteredConversations =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {

                return conversations;

            }


            return conversations.filter(
                conversation => {

                    const participant =
                        conversation.participants?.find(
                            user =>
                                user._id !==
                                currentUser?._id
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
                            .includes(query)
                    );

                }
            );

        }, [
            conversations,
            search,
            currentUser?._id
        ]);


    return (

        <aside className={styles.container}>

            <div className={styles.header}>

                <div>

                    <h2>
                        Messages
                    </h2>

                    <p>
                        Your conversations
                    </p>

                </div>


                <button
                    type="button"
                    onClick={onRefresh}
                    className={styles.refresh}
                    title="Refresh"
                >
                    ↻
                </button>

            </div>


            <div className={styles.search}>

                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={
                        event =>
                            setSearch(
                                event.target.value
                            )
                    }
                />

            </div>


            <div className={styles.list}>

                {loading && (

                    <div className={styles.state}>
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

                        <div className={styles.empty}>

                            <div className={styles.emptyIcon}>
                                💬
                            </div>

                            <h3>
                                No conversations
                            </h3>

                            <p>
                                Your messages will appear here.
                            </p>

                        </div>

                    )}


                {!loading &&
                    !error &&
                    filteredConversations.map(
                        conversation => (

                            <ConversationItem
                                key={
                                    conversation._id
                                }

                                conversation={
                                    conversation
                                }

                                currentUser={
                                    currentUser
                                }

                                selected={
                                    selectedConversation?._id ===
                                    conversation._id
                                }

                                onClick={
                                    () =>
                                        onSelect(
                                            conversation
                                        )
                                }

                            />

                        )
                    )}

            </div>

        </aside>

    );

}