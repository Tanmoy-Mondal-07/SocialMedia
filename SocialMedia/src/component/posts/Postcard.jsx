import React, { useEffect, useState } from 'react'
import Postfooter from './Postfooter'
import { Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import getTimeAgo from '../../utils/timeStamp'
import { useSelector } from 'react-redux'
import { getPostPic } from '../../appwrite/getFiles';
import getProfilesByCache from '../../utils/getProfilesThroughache';

function Postcard({
    postId,
    userId,
    imageUrl = null,
    caption,
    time,
    title = '',
    commentCount
}) {
    const navigate = useNavigate();
    const [profileDats, setProfileDats] = useState(null)
    const currentprofileDats = useSelector((state) => state.auth.userData)
    if (imageUrl) imageUrl = getPostPic(imageUrl)

    useEffect(() => {
        getProfilesByCache(userId)
            .then((res) => setProfileDats(res))
            .catch((err) => console.log(err))
    }, [userId])

    // console.log(profileDats);

    if (!profileDats) return null;

    return (
        <div
            className="bg-body-0 shadow-md rounded-lg overflow-hidden mb-6 max-w-xl mx-auto 
        transition-opacity duration-500 ease-in-out opacity-0 animate-fade-slide-in">

            <div onClick={() => navigate(`/profile/${userId}`)} className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-body-200 flex items-center justify-center">
                    {profileDats.profilePic ? (
                        <img
                            src={profileDats.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-6 h-6"><Image /></div>
                    )}
                </div>
                <div>
                    <strong className="block text-text-color-400">{profileDats.username}</strong>
                    <span className="text-xs text-text-color-200">{getTimeAgo(time)}</span>
                </div>
            </div>

            <div onClick={() => navigate(`/post/${userId}/${postId}`)}>
                {title && (
                    <div className="px-4 pb-1">
                        <h2 className="text-sm font-semibold text-text-color-500">{title}</h2>
                    </div>
                )}

                <div className="px-4 pb-2">
                    <p className="text-sm text-text-color-400 whitespace-pre-line">{caption}</p>
                </div>

                <div className="w-full">
                    {!imageUrl ? (
                        <div className="w-full h-1 bg-body-300" />
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
                userPost={currentprofileDats?.$id === userId}
                currentUserId={currentprofileDats?.$id}
                postId={postId}
                userId={userId}
                postUserName={profileDats.username}
                postTitle={title}
                commentCount={commentCount}
            />
        </div>
    );
}


export default Postcard
