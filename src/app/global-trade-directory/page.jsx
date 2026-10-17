'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import resources from '@/data/globalTradeDirectory.json';
import styles from './global-trade-directory.module.css';

const countries = [
    { code: 'IN', label: '🇮🇳 India' },
    { code: 'US', label: '🇺🇸 United States' },
    { code: 'CN', label: '🇨🇳 China' },
];
const categories = ['All categories', ...new Set(resources.map((item) => item.category))];

export default function GlobalTradeDirectoryPage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All categories');
    const [country, setCountry] = useState('IN');

    const filteredResources = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return resources.filter((resource) => {
            const matchesCategory =
                category === 'All categories' || resource.category === category;

            const searchableText = [
                resource.name,
                resource.fullName,
                resource.category,
                resource.description,
                resource.audience,
            ].join(' ').toLowerCase();

            return resource.country === country && matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
        });
    }, [query, category, country]);

    const groupedCategories = useMemo(() => {
        return categories.slice(1).map((item) => ({
            name: item,
            count: resources.filter((resource) => resource.country === country && resource.category === item).length,
        })).filter((item) => item.count > 0);
    }, [country]);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroGlow} aria-hidden="true" />
                <div className={styles.heroContent}>
                    <Link href="/" className={styles.backLink}>← Back to LynkToday</Link>
                    <div className={styles.eyebrow}>LYNKTODAY · GLOBAL TRADE</div>
                    <h1>Global Trade Directory</h1>
                    <p className={styles.heroDescription}>
                        Find official customs, import-export, shipping and government resources
                        for your logistics work — all in one place.
                    </p>
                    <div className={styles.searchPanel}>
                        <label className={styles.searchLabel} htmlFor="directory-search">
                            Search official resources
                        </label>
                        <div className={styles.searchRow}>
                            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
                            <input
                                id="directory-search"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Try “customs”, “food export”, “shipping”…"
                            />
                            {query && (
                                <button type="button" onClick={() => setQuery('')} className={styles.clearButton}>
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className={styles.filters}>
                            <label className={styles.selectLabel} htmlFor="directory-country">Country</label>
                            <select
                                id="directory-country"
                                value={country}
                                onChange={(event) => { setCountry(event.target.value); setCategory('All categories'); }}
                                aria-label="Select country"
                            >
                                {countries.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                            </select>
                            <label className={styles.selectLabel} htmlFor="directory-category">Category</label>
                            <select
                                id="directory-category"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            >
                                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={styles.heroStats}>
                        <div><strong>{resources.filter((item) => item.country === country).length}</strong><span>curated resources</span></div>
                        <div><strong>{categories.length - 1}</strong><span>categories</span></div>
                        <div><strong>{countries.find((item) => item.code === country)?.label.split(' ').slice(1).join(' ')}</strong><span>selected directory</span></div>
                    </div>
                </div>
                <div className={styles.heroArt} aria-hidden="true">
                    <div className={`${styles.orbit} ${styles.orbitOne}`} />
                    <div className={`${styles.orbit} ${styles.orbitTwo}`} />
                    <div className={styles.globe}>◎</div>
                    <div className={`${styles.route} ${styles.routeOne}`} />
                    <div className={`${styles.route} ${styles.routeTwo}`} />
                    <span className={styles.floatCard + ' ' + styles.floatCardBottom}>▤ Customs · Trade · Ports</span>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.sectionHeading}>
                    <div>
                        <span className={styles.sectionEyebrow}>EXPLORE BY CATEGORY</span>
                        <h2>Find the right official resource</h2>
                        <p>Start with a category or search by agency, service or trade activity.</p>
                    </div>
                    <span className={styles.resultCount}>{filteredResources.length} resources</span>
                </div>

                <div className={styles.categoryGrid}>
                    {groupedCategories.map((item) => (
                        <button
                            key={item.name}
                            type="button"
                            className={category === item.name ? styles.categoryCardActive : styles.categoryCard}
                            onClick={() => setCategory(category === item.name ? 'All categories' : item.name)}
                        >
                            <span className={styles.categoryIcon} aria-hidden="true">{getCategoryIcon(item.name)}</span>
                            <span className={styles.categoryName}>{item.name}</span>
                            <span className={styles.categoryCount}>{item.count} resources</span>
                        </button>
                    ))}
                </div>

                <div className={styles.resourcesHeader}>
                    <div>
                        <h2>{category === 'All categories' ? `Official ${countries.find((item) => item.code === country)?.label.split(' ').slice(1).join(' ')} resources` : category}</h2>
                        <p>Open the source website for the latest rules, forms and notices.</p>
                    </div>
                    {category !== 'All categories' && (
                        <button className={styles.resetButton} type="button" onClick={() => setCategory('All categories')}>
                            View all categories
                        </button>
                    )}
                </div>

                {filteredResources.length ? (
                    <div className={styles.resourceGrid}>
                        {filteredResources.map((resource) => (
                            <article className={styles.resourceCard} key={resource.id}>
                                <div className={styles.resourceTop}>
                                    <span className={styles.resourceIcon} aria-hidden="true">{getCategoryIcon(resource.category)}</span>
                                    <span className={styles.officialBadge}><span aria-hidden="true">✓</span> Official resource</span>
                                </div>
                                <span className={styles.resourceCategory}>{resource.category}</span>
                                <h3>{resource.name}</h3>
                                <p className={styles.resourceFullName}>{resource.fullName}</p>
                                <p className={styles.resourceDescription}>{resource.description}</p>
                                <div className={styles.audience}><strong>Useful for:</strong> {resource.audience}</div>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className={styles.visitLink}>
                                    Visit official website <span aria-hidden="true">↗</span>
                                </a>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span aria-hidden="true">⌕</span>
                        <h3>No resources found</h3>
                        <p>Try a different keyword or choose another category.</p>
                        <button type="button" onClick={() => { setQuery(''); setCategory('All categories'); }}>
                            Clear filters
                        </button>
                    </div>
                )}

                <aside className={styles.disclaimer}>
                    <span aria-hidden="true">ⓘ</span>
                    <p>
                        <strong>Important:</strong> LynkToday is an independent directory, not a government authority.
                        Resource descriptions are provided for discovery only. Rules and requirements can change;
                        always confirm current requirements with the relevant official agency before acting.
                        Links are curated and should be checked periodically.
                    </p>
                </aside>
            </section>
        </main>
    );
}

function getCategoryIcon(category) {
    if (category.includes('Customs')) return '⚓';
    if (category.includes('Import')) return '⇄';
    if (category.includes('Product')) return '✓';
    if (category.includes('Ports')) return '🚢';
    if (category.includes('Air')) return '✈';
    if (category.includes('Tax')) return '▤';
    if (category.includes('Trade')) return '🌐';
    return '⌘';
}
