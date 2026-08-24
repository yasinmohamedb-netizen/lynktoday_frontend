'use client';

import Link from 'next/link';

import ConnectionButton
    from './ConnectionButton';


export default function UserCard({
    user,
    connectionStatus = 'ACCEPTED',
    onStatusChange
}) {

    if (!user) {
        return null;
    }


    const imageUrl =
        user.profileImage
            ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
            : null;


    return (

        <div>

            {/* ==================================
                Profile Image
            ================================== */}

            <Link
                href={`/profile/${user._id}`}
            >

                {
                    imageUrl ? (

                        <img
                            src={imageUrl}
                            alt={user.fullName}
                            width={60}
                            height={60}
                        />

                    ) : (

                        <div>

                            {
                                user.fullName
                                    ?.charAt(0)
                                    .toUpperCase()
                            }

                        </div>

                    )
                }

            </Link>


            {/* ==================================
                User Information
            ================================== */}

            <div>

                <Link
                    href={`/profile/${user._id}`}
                >

                    <strong>

                        {user.fullName}

                    </strong>

                </Link>


                {
                    user.isVerified && (

                        <span>
                            ✔ Verified
                        </span>

                    )
                }


                <p>

                    {
                        user.designation ||
                        user.profession ||
                        'Professional'
                    }

                </p>


                {
                    user.companyName && (

                        <p>
                            {user.companyName}
                        </p>

                    )
                }


                {
                    user.location && (

                        <p>
                            📍 {user.location}
                        </p>

                    )
                }

            </div>


            {/* ==================================
                Connection Button
            ================================== */}

            {
                connectionStatus !== 'ACCEPTED' && (

                    <ConnectionButton

                        userId={user._id}

                        initialStatus={
                            connectionStatus
                        }

                        onStatusChange={
                            onStatusChange
                        }

                    />

                )
            }

        </div>

    );

}