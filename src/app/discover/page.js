'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FollowButton from '@/components/home/Profile/FollowButton';
import api from '@/utils/api';
import styles from './discover.module.css';

const professions = ['Freight Forwarder','Customs Broker','Shipping Line','Air Cargo','Importer','Exporter','Warehouse','Transporter','Trade Consultant'];
const countries = ['India','UAE','Saudi Arabia','Singapore','China'];

export default function Discover() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [accountType, setAccountType] = useState('');
    const [profession, setProfession] = useState('');
    const [location, setLocation] = useState('');
    const [showAllIndustries, setShowAllIndustries] = useState(false);
    const [trendingTopics, setTrendingTopics] = useState([]);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('lynktoday_user');
            if (storedUser) setCurrentUser(JSON.parse(storedUser));
        } catch (err) {
            console.error('Failed to load current user:', err);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const loadTrendingTopics = async () => {
            try {
                const response = await api.get('/right-sidebar');
                if (!cancelled && response?.data?.success && Array.isArray(response.data.trendingTopics)) {
                    setTrendingTopics(response.data.trendingTopics.slice(0, 8));
                }
            } catch (err) {
                console.error('Failed to load trending topics:', err);
                if (!cancelled) setTrendingTopics([]);
            }
        };
        loadTrendingTopics();
        return () => { cancelled = true; };
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const params = new URLSearchParams();
            if (search.trim()) params.append('q', search.trim());
            if (accountType) params.append('accountType', accountType);
            if (profession) params.append('profession', profession);
            if (location) params.append('location', location);
            params.append('page', '1');
            params.append('limit', '30');

            const response = await api.get('/users/search?' + params.toString());
            const data = response.data;

            if (!data?.success) {
                setUsers([]);
                setError(data?.message || 'Unable to load professionals.');
                return;
            }

            let fetchedUsers = Array.isArray(data.users) ? data.users : [];
            if (currentUser?._id) {
                fetchedUsers = fetchedUsers.filter(
                    (user) => String(user._id) !== String(currentUser._id)
                );
            }

             setUsers(fetchedUsers);
        } catch (err) {
            console.error('Discover users error:', err);
            setUsers([]);
            setError(err?.response?.data?.message || 'Unable to load professionals.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser) return;
        const timeout = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timeout);
    }, [currentUser, search, accountType, profession, location]);

    const handleFollowChange = (userId, data) => {
        if (!userId || !data) return;
        setUsers((previousUsers) =>
            previousUsers.map((user) =>
                String(user._id) === String(userId)
                    ? {
                        ...user,
                        isFollowing: Boolean(data.following),
                        followersCount: Number(data.followersCount ?? user.followersCount ?? 0),
                        followingCount: Number(data.followingCount ?? user.followingCount ?? 0),
                    }
                    : user
            )
        );
    };

    const clearFilters = () => {
        setSearch('');
        setAccountType('');
        setProfession('');
        setLocation('');
    };

    const getAvatarUrl = (user) => {
        if (!user?.profileImage) return '';
        if (user.profileImage.startsWith('http')) return user.profileImage;
        const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1').replace('/api/v1', '');
        return base + user.profileImage;
    };

    const suggestedUsers = users.slice(0, 5);
    const activeFilters = Boolean(search || accountType || profession || location);

    return (
        <main className={styles.container}>
            <aside className={styles.filtersPanel}>
                <div className={styles.filterHeader}>
                    <h2>Filters</h2>
                    {activeFilters && <button type="button" onClick={clearFilters}>Clear all</button>}
                </div>

                <div className={styles.filterSection}>
                    <h3>Location</h3>
                    <div className={styles.filterSearch}>
                        <span>⌕</span>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search location..." />
                    </div>
                    {countries.map((country) => (
                        <label key={country} className={styles.checkRow}>
                            <input
                                type="checkbox"
                                checked={location === country}
                                onChange={() => setLocation(location === country ? '' : country)}
                            />
                            <span>{country}</span>
                        </label>
                    ))}
                </div>

                <div className={styles.filterSection}>
                    <h3>Industry</h3>
                    {professions.slice(0, showAllIndustries ? professions.length : 7).map((item) => (
                        <label key={item} className={styles.checkRow}>
                            <input
                                type="checkbox"
                                checked={profession === item}
                                onChange={() => setProfession(profession === item ? '' : item)}
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                    <button type="button" className={styles.moreIndustriesButton} onClick={() => setShowAllIndustries((value) => !value)}>
                        {showAllIndustries ? 'Show fewer industries' : 'More industries'}
                    </button>
                </div>

                <div className={styles.filterSection}>
                    <h3>Account</h3>
                    <label className={styles.checkRow}>
                        <input type="checkbox" checked={accountType === 'individual'} onChange={() => setAccountType(accountType === 'individual' ? '' : 'individual')} />
                        <span>People</span>
                    </label>
                    <label className={styles.checkRow}>
                        <input type="checkbox" checked={accountType === 'company'} onChange={() => setAccountType(accountType === 'company' ? '' : 'company')} />
                        <span>Companies</span>
                    </label>
                </div>
            </aside>

            <section className={styles.center}>
                <div className={styles.pageIntro}>
                    <h1>Discover</h1>
                    <p>Find people and companies in global trade and logistics.</p>
                </div>

                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>⌕</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, company, keyword, location or industry..."
                    />
                    <button type="button" onClick={fetchUsers}>Search</button>
                </div>

                <div className={styles.tabs}>
                    <button type="button" className={accountType !== 'company' ? styles.activeTab : ''} onClick={() => setAccountType('individual')}>
                        <span>♙</span> People
                    </button>
                    <button type="button" className={accountType === 'company' ? styles.activeTab : ''} onClick={() => setAccountType('company')}>
                        <span>▦</span> Companies
                    </button>
                </div>

                {!loading && !error && (
                    <div className={styles.resultsHeader}>
                        <span><strong>{users.length}</strong> {users.length === 1 ? 'result' : 'results'}</span>
                        {activeFilters && <button type="button" onClick={clearFilters}>Reset</button>}
                    </div>
                )}

                {loading && (
                    <div className={styles.stateCard}>
                        <div className={styles.loader} />
                        <p>Finding people and companies...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className={styles.stateCard}>
                        <h3>Unable to load Discover</h3>
                        <p>{error}</p>
                        <button type="button" onClick={fetchUsers}>Try again</button>
                    </div>
                )}

                {!loading && !error && users.length === 0 && (
                    <div className={styles.stateCard}>
                        <div className={styles.emptyIcon}>⌕</div>
                        <h3>No results found</h3>
                        <p>Try a different name, company, location or profession.</p>
                        {activeFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}
                    </div>
                )}

                {!loading && !error && users.length > 0 && (
                    <div className={styles.resultsList}>
                        {users.map((user) => (
                            <article key={user._id} className={styles.resultCard}>
                                <div className={styles.avatarWrap}>
                                    {getAvatarUrl(user) ? (
                                        <img src={getAvatarUrl(user)} alt={user.fullName || 'LynkToday member'} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
                                    )}
                                </div>

                                <div className={styles.resultBody}>
                                    <div className={styles.nameLine}>
                                        <Link href={'/profile/' + user._id}>{user.fullName || 'LynkToday Member'}</Link>
                                        {user.isVerified && <span className={styles.verified}>Verified</span>}
                                    </div>
                                    <p className={styles.role}>{user.designation || user.profession || 'Trade & Logistics Professional'}</p>
                                    {user.companyName && <p className={styles.company}>{user.companyName}</p>}
                                    <p className={styles.location}><span>⌖</span> {user.location || 'Location not added'}</p>
                                    <div className={styles.tags}>
                                        {[user.profession, user.designation].filter(Boolean).slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                                    </div>
                                </div>

                                <div className={styles.resultActions}>
                                    <Link href={'/profile/' + user._id} className={styles.viewButton}>View Profile</Link>
                                    {!user.isOwnProfile && (
                                        <FollowButton
                                            userId={user._id}
                                            isFollowing={Boolean(user.isFollowing)}
                                            onFollowChange={(data) => handleFollowChange(user._id, data)}
                                        />
                                    )}
                                </div>

                                <button type="button" className={styles.moreButton} aria-label="More options">⋮</button>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <aside className={styles.rightPanel}>
                <section className={styles.sideCard}>
                    <div className={styles.sideTitle}>
                        <h2>Suggested People</h2>
                        <button type="button" onClick={() => setAccountType('individual')}>View all</button>
                    </div>

                    {suggestedUsers.map((user) => (
                        <div key={user._id} className={styles.suggestedRow}>
                            {getAvatarUrl(user) ? (
                                <img src={getAvatarUrl(user)} alt="" className={styles.smallAvatar} />
                            ) : (
                                <div className={styles.smallAvatarPlaceholder}>{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
                            )}
                            <div className={styles.suggestedInfo}>
                                <Link href={'/profile/' + user._id}>{user.fullName || 'LynkToday Member'}</Link>
                                <span>{user.designation || user.profession || 'Trade Professional'}</span>
                                <small>{user.location || 'India'}</small>
                            </div>
                            <FollowButton
                                userId={user._id}
                                isFollowing={Boolean(user.isFollowing)}
                                onFollowChange={(data) => handleFollowChange(user._id, data)}
                            />
                        </div>
                    ))}

                    {!loading && suggestedUsers.length === 0 && <p className={styles.sideEmpty}>Suggestions will appear here.</p>}
                </section>

                <section className={styles.sideCard}>
                    <div className={styles.sideTitle}>
                        <h2>Trending Topics</h2>
                    </div>

                    {trendingTopics.map((topic, index) => (
                        <Link
                            key={topic.slug || topic.name || index}
                            href={'/topics/' + (topic.slug || '')}
                            className={styles.trendingRow}
                        >
                            <span className={styles.trendingRank}>{index + 1}</span>
                            <span className={styles.trendingTopic}>{topic.name || 'Trending topic'}</span>
                        </Link>
                    ))}

                    {trendingTopics.length === 0 && (
                        <p className={styles.sideEmpty}>Trending topics will appear as the trade community becomes active.</p>
                    )}
                </section>
            </aside>
        </main>
    );
}
