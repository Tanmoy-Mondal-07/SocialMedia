import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import getProfilesByCache from '../utils/getProfilesThroughache'
import { useNavigate } from 'react-router-dom'
import { User2 } from 'lucide-react'

function InboxCard({ senderIds }) {
    const navigate = useNavigate()
    const Messages = useSelector((state) => state.inbox.allMessageRead) || null
    const [messageInfo, setMessageInfo] = useState(null)
    const [userInfo, setuserInfo] = useState(null)

    useEffect(() => {
        if (Messages && senderIds && Messages[senderIds]) {
            setMessageInfo(Messages[senderIds])
            getProfilesByCache(senderIds)
                .then((profile) => setuserInfo(profile))
        }
    }, [Messages, senderIds])

    const messageSlice = (messageInfo?.latestMessage?.length < 25) ? messageInfo?.latestMessage : messageInfo?.latestMessage?.slice(0, 25) + "..."

    return messageInfo && (
        <li onClick={() => navigate(`/message/${senderIds}`)}
            className={`flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors ${messageInfo?.count ? 'bg-body-100' : ''}`}
        >
            {userInfo?.profilePic ? <img
                src={userInfo?.profilePic}
                alt={userInfo?.profilePic}
                className="w-10 h-10 rounded-full flex items-center object-cover"
            /> : <User2 className="w-10 h-10 rounded-full flex items-center object-cover" />}
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-text-color-500">{userInfo?.username}</p>
                    <span className="text-xs text-text-color-200">
                        {messageInfo.count} Unseen Message{messageInfo?.count > 1 ? 's' : ''}
                    </span>
                </div>
                <p className="text-sm text-body-600 truncate">{messageSlice}</p>
            </div>
        </li>
    )
}

export default InboxCard