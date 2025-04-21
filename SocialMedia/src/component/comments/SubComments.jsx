import React, { useEffect, useState } from 'react'
import getTimeAgo from '../../conf/timeStamp'
import { getUserProfile, setUserProfile } from '../../utils/userProfileCache';
import appwriteUserProfileService from '../../appwrite/UserProfile'
import getFile from '../../appwrite/getFiles';

function SubComments({ time, userId, content, replayTo }) {
    const [authorInfo, setAuthorInfo] = useState(null)

    // the data gose from child to parent
    const sendUsername = () => {
        replayTo(`@${authorInfo?.username} `);
    };

    useEffect(() => {
        ; (async () => {
            const authorInfo = await getUserProfile(userId)
            if (authorInfo) setAuthorInfo(authorInfo)

            if (!authorInfo) {
                const authorProfileInfo = await appwriteUserProfileService.getUserProfile(userId)
                const profilePic = getFile(authorProfileInfo);
                const userData = { ...authorProfileInfo, profilePic }
                setUserProfile(userId, userData)
                setAuthorInfo(userData)
            }
        }
        )();
    }, [userId])

    return (
        <div className='p-2'>
            <div className="flex items-center">
                <div className='w-8 h-8 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center'>
                    {authorInfo?.profilePic ?
                        <img
                            src={`${authorInfo.profilePic}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        :
                        <img
                            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${userId}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />}
                </div>
                <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-800">{authorInfo?.username}</div>
                    <div className="text-xs text-gray-500">{getTimeAgo(time)}</div>
                </div>
            </div>
            <div onClick={sendUsername} className="text-gray-700 ml-5 text-sm">↳ {content}</div>
        </div>
    )
}

export default SubComments