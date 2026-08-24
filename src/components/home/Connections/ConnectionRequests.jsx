'use client';

import { useEffect, useState } from 'react';

import api from '@/utils/api';

import UserCard from './UserCard';


export default function ConnectionRequests({
    onRequestHandled
}) {

    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [processingId, setProcessingId] =
        useState(null);


    // ==========================================
    // Load Requests
    // ==========================================

    const loadRequests = async () => {

        try {

            setLoading(true);

            const { data } =
                await api.get(
                    '/connections/requests/pending'
                );

            if (data.success) {

                setRequests(
                    data.requests || []
                );

            }

        } catch (error) {

            console.error(
                'Load connection requests error:',
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRequests();

    }, []);


    // ==========================================
    // Respond
    // ==========================================

    const respond = async (
        requestId,
        action
    ) => {

        try {

            setProcessingId(requestId);

            const { data } =
                await api.put(
                    '/connections/respond',
                    {
                        requestId,
                        action
                    }
                );

            if (data.success) {

                setRequests(
                    prev =>
                        prev.filter(
                            request =>
                                request._id !==
                                requestId
                        )
                );


                if (onRequestHandled) {

                    onRequestHandled(
                        data
                    );

                }

            }

        } catch (error) {

            console.error(
                'Respond connection request error:',
                error
            );

            alert(
                error.response?.data?.message ||
                'Unable to process request.'
            );

        } finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (
            <div>
                Loading connection requests...
            </div>
        );

    }


    // ==========================================
    // Empty
    // ==========================================

    if (!requests.length) {

        return (

            <div>

                <h2>
                    Connection Requests
                </h2>

                <p>
                    No pending connection requests.
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
                Connection Requests
            </h2>


            {
                requests.map(
                    request => {

                        const sender =
                            request.sender;

                        if (!sender) {
                            return null;
                        }


                        return (

                            <div
                                key={
                                    request._id
                                }
                            >

                                <UserCard

                                    user={sender}

                                    connectionStatus="NONE"

                                />


                                <div>

                                    <button
                                        type="button"
                                        disabled={
                                            processingId ===
                                            request._id
                                        }
                                        onClick={() =>
                                            respond(
                                                request._id,
                                                'ACCEPTED'
                                            )
                                        }
                                    >

                                        {
                                            processingId ===
                                            request._id
                                                ? 'Please wait...'
                                                : 'Accept'
                                        }

                                    </button>


                                    <button
                                        type="button"
                                        disabled={
                                            processingId ===
                                            request._id
                                        }
                                        onClick={() =>
                                            respond(
                                                request._id,
                                                'REJECTED'
                                            )
                                        }
                                    >

                                        Reject

                                    </button>

                                </div>

                            </div>

                        );

                    }
                )
            }

        </section>

    );

}