import React, { useState } from 'react'
import Postfooter from './Postfooter'
import { Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import getTimeAgo from '../../conf/timeStamp'
import { useSelector } from 'react-redux'
import { getPostPic } from '../../appwrite/getFiles';

function Postcard({
    postId,
    userId,
    userInfo,
    imageUrl = null,
    caption,
    time,
    title
}) {
    const navigate = useNavigate();
    const currentUserInfo = useSelector((state) => state.auth.userData)
    if (imageUrl) imageUrl = getPostPic(imageUrl)

    if (!userInfo) return null;

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 max-w-xl mx-auto">

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

            <div onClick={() => navigate(`/post/${userId}/${postId}`)}>
                {title && (
                    <div className="px-4 pb-1">
                        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                    </div>
                )}

                <div className="px-4 pb-2">
                    <p className="text-sm text-gray-800">{caption}</p>
                </div>

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
            </div>
            <Postfooter
                userPost={currentUserInfo?.$id === userId}
                postId={postId}
                userId={userId}
                postUserName={userInfo.username}
                postTitle={title}
            />
        </div>
    );
}


export default Postcard
