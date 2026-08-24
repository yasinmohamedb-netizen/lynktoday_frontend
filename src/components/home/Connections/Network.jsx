'use client';

import { useEffect, useState } from 'react';

import api from '@/utils/api';

import UserCard from './UserCard';


export default function Network() {

    const [network, setNetwork] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // Load Network
    // ==========================================

    const loadNetwork = async () => {

        try {

            setLoading(true);

            const { data } =
                await api.get(
                    '/connections'
                );

            if (data.success) {

                setNetwork(
                    data.network || []
                );

            }

        } catch (error) {

            console.error(
                'Load network error:',
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadNetwork();

    }, []);


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (
            <div>
                Loading your network...
            </div>
        );

    }


    // ==========================================
    // Empty
    // ==========================================

    if (!network.length) {

        return (

            <div>

                <h2>
                    My Network
                </h2>

                <p>
                    You don't have any connections yet.
                </p>

            </div>

        );

    }


    // ==========================================
    // Render
    // ==========================================

    return (

        <section>

            <h2>
                My Network
            </h2>


            <p>
                {network.length} connection
                {network.length !== 1
                    ? 's'
                    : ''}
            </p>


            {
                network.map(user => (

                    <UserCard

                        key={user._id}

                        user={user}

                        connectionStatus="ACCEPTED"

                    />

                ))
            }

        </section>

    );

}