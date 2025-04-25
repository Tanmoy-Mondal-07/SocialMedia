import React, { useEffect, useState } from 'react'
import getProfilesByCache from '../utils/getProfilesThroughache'
import getTimeAgo from '../utils/timeStamp'
import appwritePostConfigService from '../appwrite/postConfig'
import { Eye, X, } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function NotificationsCard({
  notificationsId,
  relatedUserAvatar,
  contentType,
  relatedUserName,
  relatedPostId,
  relatedPostAuthorId,
  relatedPostTitle,
  commentText,
  time,
  seen,
  markAsRead = () => { },
  deleteNotification = () => { }
}) {
  const navigate = useNavigate();
  // const dispatch = useDispatch()

  const commentSlice = (commentText?.length < 25) ? commentText : commentText?.slice(0, 25) + "..."

  return (
    <ul>
      <li
        className={`flex items-start space-x-3 p-3 rounded-lg mb-2 transition-all duration-200 ease-in-out 
      hover:bg-gray-100 ${seen ? 'bg-gray-50' : 'bg-white'}`}
      >
        <img
          src={relatedUserAvatar}
          alt={relatedUserName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-700 leading-relaxed">
              {contentType === 'follow' && (
                <span className="font-semibold text-gray-800">
                  {relatedUserName} started following you
                </span>
              )}

              {contentType === 'comment' && (
                <span className="font-semibold text-gray-800">
                  {relatedUserName} commented "{commentSlice}" on your post{' '}
                  <span
                    onClick={() =>
                      navigate(`/post/${relatedPostAuthorId}/${relatedPostId}`)
                    }
                    className="font-medium text-blue-600 hover:underline cursor-pointer transition-colors duration-150"
                  >
                    {relatedPostTitle}
                  </span>
                </span>
              )}

              {contentType === 'replay' && (
                <span className="font-semibold text-gray-800">
                  {relatedUserName} replied "{commentSlice}" on the post{' '}
                  <span
                    onClick={() =>
                      navigate(`/post/${relatedPostAuthorId}/${relatedPostId}`)
                    }
                    className="font-medium text-blue-600 hover:underline cursor-pointer transition-colors duration-150"
                  >
                    {relatedPostTitle}
                  </span>
                </span>
              )}
            </p>
            <span className="text-xs text-gray-400 ml-2">
              {getTimeAgo(time)}
            </span>
          </div>

          {!seen && (
            <div className="mt-2 flex space-x-4 text-gray-500">
              <button
                onClick={() => markAsRead(notificationsId)}
                className="flex items-center text-xs hover:text-gray-700 transition-colors duration-150"
              >
                <Eye className="h-4 w-4 mr-1" /> Read
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => deleteNotification(notificationsId)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <X className="h-5 w-5" />
        </button>
      </li>
    </ul>
  )
}

export default NotificationsCard