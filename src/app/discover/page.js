'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import api from '@/utils/api';

import LeftSidebar from '@/components/home/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/home/RightSidebar/RightSidebar';
import FollowButton from '@/components/home/Profile/FollowButton';

import styles from './discover.module.css';

export default function Discover() {

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [accountType, setAccountType] = useState('');
    const [profession, setProfession] = useState('');


    // ======================================================
    // GET CURRENT USER
    // ======================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem('lynktoday_user');

            if (storedUser) {

                const parsedUser =
                    JSON.parse(storedUser);

                setCurrentUser(parsedUser);

            }

        } catch (error) {

            console.error(
                'Failed to load current user:',
                error
            );

        }

    }, []);


    // ======================================================
    // FETCH USERS
    // ======================================================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError('');

            const params =
                new URLSearchParams();

            if (search.trim()) {

                params.append(
                    'q',
                    search.trim()
                );

            }

            if (accountType) {

                params.append(
                    'accountType',
                    accountType
                );

            }

            if (profession) {

                params.append(
                    'profession',
                    profession
                );

            }

            params.append('page', '1');
            params.append('limit', '20');

            const queryString =
                params.toString();

            const url =
                queryString
                    ? `/users/search?${queryString}`
                    : '/users/search';

            const response =
                await api.get(url);

            const data =
                response.data;

            if (!data?.success) {

                setUsers([]);

                setError(
                    data?.message ||
                    'Unable to load professionals.'
                );

                return;

            }

            let fetchedUsers =
                Array.isArray(data.users)
                    ? data.users
                    : [];


            // Remove logged-in user
            if (currentUser?._id) {

                fetchedUsers =
                    fetchedUsers.filter(
                        (user) =>
                            String(user._id) !==
                            String(currentUser._id)
                    );

            }

            setUsers(fetchedUsers);

        } catch (err) {

            console.error(
                'Discover users error:',
                err
            );

            setUsers([]);

            setError(
                err?.response?.data?.message ||
                'Unable to load professionals.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // SEARCH / FILTER
    // ======================================================

    useEffect(() => {

        if (!currentUser) {
            return;
        }

        const timeout =
            setTimeout(() => {

                fetchUsers();

            }, 300);

        return () => {

            clearTimeout(timeout);

        };

    }, [
        currentUser,
        search,
        accountType,
        profession
    ]);


    // ======================================================
    // FOLLOW CHANGE
    // ======================================================

    const handleFollowChange = (
        userId,
        data
    ) => {

        if (!userId || !data) {
            return;
        }

        setUsers(
            (previousUsers) => {

                return previousUsers.map(
                    (user) => {

                        if (
                            String(user._id) !==
                            String(userId)
                        ) {

                            return user;

                        }

                        return {

                            ...user,

                            isFollowing:
                                Boolean(
                                    data.following
                                ),

                            followersCount:
                                Number(
                                    data.followersCount ??
                                    user.followersCount ??
                                    0
                                ),

                            followingCount:
                                Number(
                                    data.followingCount ??
                                    user.followingCount ??
                                    0
                                )

                        };

                    }
                );

            }
        );

    };


    // ======================================================
    // CLEAR FILTERS
    // ======================================================

    const clearFilters = () => {

        setSearch('');
        setAccountType('');
        setProfession('');

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <main className={styles.container}>

            {/* LEFT SIDEBAR */}

            <aside className={styles.left}>

                <LeftSidebar />

            </aside>


            {/* CENTER */}

            <section className={styles.center}>

                {/* PAGE HEADER */}

                <div className={styles.pageHeader}>

                    <div>

                        <h1>
                            Discover
                        </h1>

                        <p>
                            Find professionals and companies
                            across the trade and logistics industry.
                        </p>

                    </div>

                </div>


                {/* SEARCH */}

                <div className={styles.searchCard}>

                    <div className={styles.searchWrapper}>

                        <svg
                            className={styles.searchIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >

                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                            />

                            <path
                                d="m20 20-4-4"
                            />

                        </svg>

                        <input
                            type="text"
                            placeholder="Search professionals, companies or roles"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className={styles.searchInput}
                        />

                    </div>


                    {/* FILTERS */}

                    <div className={styles.filters}>

                        <div className={styles.filterGroup}>

                            <label>
                                Account
                            </label>

                            <select
                                value={accountType}
                                onChange={(e) =>
                                    setAccountType(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All accounts
                                </option>

                                <option value="individual">
                                    Individuals
                                </option>

                                <option value="company">
                                    Companies
                                </option>

                            </select>

                        </div>


                        <div className={styles.filterGroup}>

                            <label>
                                Profession
                            </label>

                            <select
                                value={profession}
                                onChange={(e) =>
                                    setProfession(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All professions
                                </option>

                                <option value="Freight Forwarder">
                                    Freight Forwarder
                                </option>

                                <option value="Customs Broker">
                                    Customs Broker
                                </option>

                                <option value="Shipping Line">
                                    Shipping Line
                                </option>

                                <option value="Air Cargo">
                                    Air Cargo
                                </option>

                                <option value="Importer">
                                    Importer
                                </option>

                                <option value="Exporter">
                                    Exporter
                                </option>

                                <option value="Warehouse">
                                    Warehouse
                                </option>

                                <option value="Transporter">
                                    Transporter
                                </option>

                                <option value="Trade Consultant">
                                    Trade Consultant
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* CLEAR FILTERS */}

                    {
                        (
                            search ||
                            accountType ||
                            profession
                        ) && (

                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={clearFilters}
                            >
                                Clear filters
                            </button>

                        )
                    }

                </div>


                {/* RESULTS COUNT */}

                {
                    !loading &&
                    !error &&
                    users.length > 0 && (

                        <div className={styles.resultsHeader}>

                            <span>

                                <strong>
                                    {users.length}
                                </strong>{' '}

                                {
                                    users.length === 1
                                        ? 'professional'
                                        : 'professionals'
                                }

                                {' '}found

                            </span>

                        </div>

                    )
                }


                {/* LOADING */}

                {
                    loading && (

                        <div className={styles.stateCard}>

                            <div className={styles.loader} />

                            <p>
                                Loading professionals...
                            </p>

                        </div>

                    )
                }


                {/* ERROR */}

                {
                    !loading &&
                    error && (

                        <div className={styles.errorCard}>

                            <h3>
                                Unable to load professionals
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchUsers}
                                className={styles.retryButton}
                            >
                                Try again
                            </button>

                        </div>

                    )
                }


                {/* EMPTY */}

                {
                    !loading &&
                    !error &&
                    users.length === 0 && (

                        <div className={styles.emptyCard}>

                            <div className={styles.emptyIcon}>
                                Search
                            </div>

                            <h3>
                                No professionals found
                            </h3>

                            <p>
                                Try changing your search
                                or filter criteria.
                            </p>

                            {
                                (
                                    search ||
                                    accountType ||
                                    profession
                                ) && (

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className={
                                            styles.clearEmptyButton
                                        }
                                    >
                                        Clear filters
                                    </button>

                                )
                            }

                        </div>

                    )
                }


                {/* USER GRID */}

                {
                    !loading &&
                    !error &&
                    users.length > 0 && (

                        <div className={styles.userGrid}>

                            {
                                users.map(
                                    (user) => (

                                        <article
                                            key={user._id}
                                            className={styles.userCard}
                                        >

                                            {/* PROFILE */}

                                            <div
                                                className={
                                                    styles.profileSection
                                                }
                                            >

                                                {
                                                    user.profileImage
                                                        ? (

                                                            <img
                                                                src={
                                                                    user.profileImage.startsWith(
                                                                        'http'
                                                                    )
                                                                        ? user.profileImage
                                                                        : `${(
                                                                            process
                                                                                .env
                                                                                .NEXT_PUBLIC_API_URL ||
                                                                            'http://localhost:5001/api/v1'
                                                                        ).replace(
                                                                            '/api/v1',
                                                                            ''
                                                                        )}${user.profileImage}`
                                                                }
                                                                alt={
                                                                    user.fullName ||
                                                                    'User'
                                                                }
                                                                className={
                                                                    styles.avatar
                                                                }
                                                            />

                                                        )
                                                        : (

                                                            <div
                                                                className={
                                                                    styles.avatarPlaceholder
                                                                }
                                                            >

                                                                {
                                                                    user.fullName
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() ||
                                                                    'U'
                                                                }

                                                            </div>

                                                        )
                                                }


                                                {
                                                    user.isVerified && (

                                                        <span
                                                            className={
                                                                styles.verifiedBadge
                                                            }
                                                        >
                                                            Verified
                                                        </span>

                                                    )
                                                }

                                            </div>


                                            {/* BODY */}

                                            <div
                                                className={
                                                    styles.cardBody
                                                }
                                            >

                                                <h3>

                                                    {
                                                        user.fullName ||
                                                        'LynkToday Member'
                                                    }

                                                </h3>


                                                {
                                                    (
                                                        user.designation ||
                                                        user.profession
                                                    ) && (

                                                        <p
                                                            className={
                                                                styles.profession
                                                            }
                                                        >
                                                            {
                                                                user.designation ||
                                                                user.profession
                                                            }
                                                        </p>

                                                    )
                                                }


                                                {
                                                    user.headline && (

                                                        <p
                                                            className={
                                                                styles.headline
                                                            }
                                                        >
                                                            {user.headline}
                                                        </p>

                                                    )
                                                }


                                                {
                                                    user.companyName && (

                                                        <div
                                                            className={
                                                                styles.detail
                                                            }
                                                        >

                                                            <span>
                                                                Company
                                                            </span>

                                                            <strong>
                                                                {
                                                                    user.companyName
                                                                }
                                                            </strong>

                                                        </div>

                                                    )
                                                }


                                                {
                                                    user.location && (

                                                        <div
                                                            className={
                                                                styles.detail
                                                            }
                                                        >

                                                            <span>
                                                                Location
                                                            </span>

                                                            <strong>
                                                                {
                                                                    user.location
                                                                }
                                                            </strong>

                                                        </div>

                                                    )
                                                }


                                                {/* STATS */}

                                                <div
                                                    className={
                                                        styles.stats
                                                    }
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                user.followersCount ||
                                                                0
                                                            }
                                                        </strong>

                                                        <span>
                                                            Followers
                                                        </span>

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {
                                                                user.postsCount ||
                                                                0
                                                            }
                                                        </strong>

                                                        <span>
                                                            Posts
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* FOOTER */}

                                            <div
                                                className={
                                                    styles.cardFooter
                                                }
                                            >

                                                <Link
                                                    href={`/profile/${user._id}`}
                                                    className={
                                                        styles.viewProfileButton
                                                    }
                                                >
                                                    View Profile
                                                </Link>


                                                {
                                                    !user.isOwnProfile && (

                                                        <FollowButton
                                                            userId={
                                                                user._id
                                                            }
                                                            isFollowing={
                                                                Boolean(
                                                                    user.isFollowing
                                                                )
                                                            }
                                                            onFollowChange={(
                                                                data
                                                            ) =>
                                                                handleFollowChange(
                                                                    user._id,
                                                                    data
                                                                )
                                                            }
                                                        />

                                                    )
                                                }

                                            </div>

                                        </article>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </section>


            {/* RIGHT SIDEBAR */}

            <aside className={styles.right}>

                <RightSidebar />

            </aside>

        </main>

    );

}