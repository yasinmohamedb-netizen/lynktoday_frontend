'use client';

import { useState } from 'react';

import ShareModal from './ShareModal';


export default function ShareButton({
    post,
    onShared
}) {

    const [open, setOpen] = useState(false);


    // ==================================================
    // OPEN SHARE MODAL
    // ==================================================

    const handleOpen = () => {

        if (!post?._id) {
            return;
        }

        setOpen(true);

    };


    // ==================================================
    // CLOSE SHARE MODAL
    // ==================================================

    const handleClose = () => {

        setOpen(false);

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <>

            <button
                type="button"
                onClick={handleOpen}
            >
                🔄 Share
            </button>


            <ShareModal
                post={post}
                open={open}
                onClose={handleClose}
                onShared={onShared}
            />

        </>

    );

}