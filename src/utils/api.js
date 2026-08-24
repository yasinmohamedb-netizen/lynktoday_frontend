import axios from 'axios';

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:5001/api/v1',

    headers: {
        'Content-Type': 'application/json',
    },
});

// ==========================================
// Attach JWT Token
// ==========================================

api.interceptors.request.use(
    (config) => {

        if (typeof window !== 'undefined') {

            const token =
                localStorage.getItem(
                    'lynktoday_token'
                );

            if (token) {

                config.headers.Authorization =
                    `Bearer ${token}`;

            }

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }
);

// ==========================================
// Global 401 Handler
// ==========================================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            error.response?.status === 401 &&
            typeof window !== 'undefined'
        ) {

            console.warn(
                'Session expired or unauthorized.'
            );

            localStorage.removeItem(
                'lynktoday_token'
            );

            localStorage.removeItem(
                'lynktoday_user'
            );

            window.location.href = '/login';

        }

        return Promise.reject(error);

    }

);

export default api;