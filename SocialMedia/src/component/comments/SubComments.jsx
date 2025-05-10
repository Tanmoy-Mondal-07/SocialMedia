import React, { useEffect, useState } from 'react'
import getTimeAgo from '../../utils/timeStamp'
import { useNavigate } from 'react-router-dom';
import getProfilesByCache from '../../utils/getProfilesThroughache';

function SubComments({ time, userId, content, replayTo }) {
    const [authorInfo, setAuthorInfo] = useState(null)
    const navigate = useNavigate()

    // the data gose from child to parent
    const sendUsername = () => {
        replayTo(`@${authorInfo?.username} `);
    };

    useEffect(() => {
        getProfilesByCache(userId)
            .then((responce) => setAuthorInfo(responce))
    }, [userId])

    return (
        <div className='p-2'>
            <div className="flex items-center">
                <div onClick={() => navigate(`/profile/${userId}`)} className='w-8 h-8 rounded-full overflow-hidden mr-4 bg-body-200 flex items-center justify-center'>
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
                    <div onClick={() => navigate(`/profile/${userId}`)} className="text-xs font-semibold text-text-color-400">{authorInfo?.username}</div>
                    <div className="text-xs text-text-color-200">{getTimeAgo(time)}</div>
                </div>
            </div>
            <div onClick={sendUsername} className="text-text-color-300 ml-5 text-sm">↳ {content}</div>
        </div>
    )
}

export default SubComments