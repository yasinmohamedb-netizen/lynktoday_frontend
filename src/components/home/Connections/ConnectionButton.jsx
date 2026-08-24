'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function ConnectionButton({
    userId,
    initialStatus = 'NONE',
    onStatusChange
}) {

    const [status, setStatus] =
        useState(initialStatus);

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // Update when parent changes status
    // ==========================================

    useEffect(() => {

        setStatus(initialStatus);

    }, [initialStatus]);


    // ==========================================
    // Send Connection Request
    // ==========================================

    const sendRequest = async () => {

        if (!userId || loading) {
            return;
        }

        try {

            setLoading(true);

            const { data } =
                await api.post(
                    '/connections/request',
                    {
                        receiverId: userId
                    }
                );

            if (data.success) {

                setStatus('PENDING');

                if (onStatusChange) {

                    onStatusChange(
                        'PENDING',
                        data
                    );

                }

            }

        } catch (error) {

            console.error(
                'Connection request error:',
                error
            );

            const message =
                error.response?.data?.message ||
                'Unable to send connection request.';

            alert(message);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Cancel Request
    // ==========================================

    const cancelRequest = async () => {

        if (!userId || loading) {
            return;
        }

        // We don't have the request ID here.
        // Parent components should handle cancellation
        // when the request ID is available.

        console.log(
            'Cancel request requires request ID.'
        );

    };


    // ==========================================
    // Render
    // ==========================================

    if (status === 'ACCEPTED') {

        return (

            <button
                type="button"
                disabled
            >
                Connected
            </button>

        );

    }


    if (status === 'PENDING') {

        return (

            <button
                type="button"
                disabled
            >
                Request Sent
            </button>

        );

    }


    if (status === 'REJECTED') {

        return (

            <button
                type="button"
                onClick={sendRequest}
                disabled={loading}
            >
                {loading
                    ? 'Sending...'
                    : 'Connect'}
            </button>

        );

    }


    return (

        <button
            type="button"
            onClick={sendRequest}
            disabled={loading}
        >

            {loading
                ? 'Sending...'
                : 'Connect'}

        </button>

    );

}