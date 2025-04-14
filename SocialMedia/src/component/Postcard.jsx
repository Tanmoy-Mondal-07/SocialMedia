import React, { useState } from 'react'
import Postfooter from './Postfooter'
import appwriteUserProfileService from '../appwrite/UserProfile'
import getFile from '../appwrite/getFiles';
import { Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom'


function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    const times = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 },
    ];

    for (const { unit, seconds } of times) {
        const value = Math.floor(diff / seconds);
        if (value >= 1) {
            return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-value, unit);
        }
    }

    return 'just now';
}

function Postcard({
    userId,
    userInfo,
    imageUrl = null,
    caption,
    time,
    title
}) {
    const navigate = useNavigate();

    if (!userInfo) return null; // Or a fallback/loading state

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 w-full max-w-md mx-auto">
            {/* Header: Profile pic + username */}
            <div onClick={() => navigate(`/profile/${userId}`)} className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
                    {userInfo.profilePic ? (
                        <img
                            src={userInfo.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-6 h-6"><Image /></div>
                    )}
                </div>
                <div>
                    <strong className="block text-gray-800">{userInfo.username}</strong>
                    <span className="text-xs text-gray-500">{getTimeAgo(time)}</span>
                </div>
            </div>

            {/* Title */}
            {title && (
                <div className="px-4 pb-1">
                    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                </div>
            )}

            {/* Caption */}
            <div className="px-4 pb-2">
                <p className="text-sm text-gray-800">{caption}</p>
            </div>

            {/* Image */}
            <div className="w-full">
                {!imageUrl ? (
                    <div className="w-full h-1 bg-gray-300" />
                ) : (
                    <img
                        src={imageUrl}
                        alt="Post"
                        className="w-full object-cover max-h-[800px]"
                        loading="lazy"
                    />
                )}
            </div>

            {/* Optional footer */}
            <Postfooter />
        </div>
    );
}


export default Postcard
