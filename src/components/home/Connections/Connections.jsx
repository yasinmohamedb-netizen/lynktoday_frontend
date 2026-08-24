'use client';

import { useState } from 'react';

import Network from './Network';
import ConnectionRequests
    from './ConnectionRequests';


export default function Connections() {

    const [activeTab, setActiveTab] =
        useState('network');

    const [refreshKey, setRefreshKey] =
        useState(0);


    // ==========================================
    // Request Handled
    // ==========================================

    const handleRequestHandled = () => {

        setRefreshKey(
            prev => prev + 1
        );

    };


    return (

        <main>

            {/* ==================================
                Header
            ================================== */}

            <div>

                <h1>
                    Connections
                </h1>

                <p>
                    Manage your professional network.
                </p>

            </div>


            {/* ==================================
                Tabs
            ================================== */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            'network'
                        )
                    }
                >

                    My Network

                </button>


                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            'requests'
                        )
                    }
                >

                    Connection Requests

                </button>

            </div>


            {/* ==================================
                Content
            ================================== */}

            {
                activeTab === 'network' ? (

                    <Network
                        key={refreshKey}
                    />

                ) : (

                    <ConnectionRequests

                        key={refreshKey}

                        onRequestHandled={
                            handleRequestHandled
                        }

                    />

                )
            }

        </main>

    );

}