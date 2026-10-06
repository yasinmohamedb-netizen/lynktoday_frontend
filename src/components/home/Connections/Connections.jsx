'use client';

import { useState } from 'react';
import Network from './Network';
import ConnectionRequests from './ConnectionRequests';
import styles from './Connections.module.css';

export default function Connections() {
    const [activeTab, setActiveTab] = useState('network');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRequestHandled = () => setRefreshKey(prev => prev + 1);

    return (
        <main className={styles.wrapper}>
            <header className={styles.header}>
                <div>
                    <h1>Connections</h1>
                    <p>Build and manage your professional network.</p>
                </div>
            </header>

            <nav className={styles.tabs} aria-label="Connections">
                <button
                    type="button"
                    className={activeTab === 'network' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('network')}
                >
                    My Network
                </button>
                <button
                    type="button"
                    className={activeTab === 'requests' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('requests')}
                >
                    Connection Requests
                </button>
            </nav>

            <div className={styles.panel}>
                {activeTab === 'network' ? (
                    <Network key={refreshKey} />
                ) : (
                    <ConnectionRequests
                        key={refreshKey}
                        onRequestHandled={handleRequestHandled}
                    />
                )}
            </div>
        </main>
    );
}