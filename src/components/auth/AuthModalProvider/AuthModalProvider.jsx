'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState
} from 'react';

import LoginRequiredModal from '../LoginRequiredModal/LoginRequiredModal';


// ======================================================
// Context
// ======================================================

const AuthModalContext = createContext(null);


// ======================================================
// Provider
// ======================================================

export default function AuthModalProvider({
    children
}) {

    const [isLoginModalOpen, setIsLoginModalOpen] =
        useState(false);


    // ==================================================
    // Open Login Required Modal
    // ==================================================

    const requireAuth = useCallback(() => {

        setIsLoginModalOpen(true);

    }, []);


    // ==================================================
    // Close Login Required Modal
    // ==================================================

    const closeAuthModal = useCallback(() => {

        setIsLoginModalOpen(false);

    }, []);


    // ==================================================
    // Context Value
    // ==================================================

    const value = useMemo(
        () => ({
            requireAuth,
            closeAuthModal,
            isLoginModalOpen
        }),
        [
            requireAuth,
            closeAuthModal,
            isLoginModalOpen
        ]
    );


    return (

        <AuthModalContext.Provider value={value}>

            {children}


            {/* ==========================================
                GLOBAL LOGIN REQUIRED MODAL
            ========================================== */}

            <LoginRequiredModal
                open={isLoginModalOpen}
                onClose={closeAuthModal}
            />

        </AuthModalContext.Provider>

    );

}


// ======================================================
// Hook
// ======================================================

export function useAuthModal() {

    const context =
        useContext(AuthModalContext);


    if (!context) {

        throw new Error(
            'useAuthModal must be used inside AuthModalProvider'
        );

    }


    return context;

}