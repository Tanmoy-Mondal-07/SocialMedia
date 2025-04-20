import React from 'react'
import getTimeAgo from '../../conf/timeStamp'

function SubComments({ time, userId, content, replayTo }) {

    // the data gose from child to parent
    const sendUsername = () => {
        replayTo(`@${userId} `);
    };

    return (
        <div className='p-2'>
            <div className="flex items-center">
                <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${userId}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-800">{userId}</div>
                    <div className="text-xs text-gray-500">{getTimeAgo(time)}</div>
                </div>
            </div>
            <div onClick={sendUsername} className="text-gray-700 ml-5 text-sm">↳ {content}</div>
        </div>
    )
}

export default SubComments