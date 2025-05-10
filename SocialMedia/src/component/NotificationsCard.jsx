import React from 'react'
import getTimeAgo from '../utils/timeStamp'
import { Eye, X, } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
  frowredMarkAsRead,
  senddeleteNotification,
  relatedUserId
}) {

  const markAsRead = () => {
    const data = notificationsId
    frowredMarkAsRead(data)
  }

  const deleteNotification = () => {
    const data = notificationsId
    senddeleteNotification(data)
  }

  const navigate = useNavigate();
  // const dispatch = useDispatch()

  const commentSlice = (commentText?.length < 25) ? commentText : commentText?.slice(0, 25) + "..."

  return (
    <ul>
      <li
        className={`flex items-start space-x-3 p-3 rounded-lg mb-2 transition-all duration-200 ease-in-out 
      hover:bg-body-100 ${seen ? 'bg-body-0' : 'bg-body-300'}
      transition-opacity duration-300 ease-in-out animate-fade-slide-in-fromtop
      `}
      >
        <img
          onClick={() => navigate(`/profile/${relatedUserId}`)}
          src={relatedUserAvatar}
          alt={relatedUserName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div onClick={markAsRead} className="flex-1">
          <div className="flex justify-between items-start">
            <h5 className="text-sm text-text-color-300 leading-relaxed">
              {contentType === 'follow' && (
                <span className="font-semibold text-text-color-400">
                  <div
                    className='hover:underline cursor-pointer'
                    onClick={() => navigate(`/profile/${relatedUserId}`)}>{relatedUserName}</div> started following you
                </span>
              )}

              {contentType === 'comment' && (
                <span className="font-semibold text-text-color-400">
                  <div
                    className='hover:underline cursor-pointer'
                    onClick={() => navigate(`/profile/${relatedUserId}`)}>{relatedUserName}</div> commented "{commentSlice}" on your post{' '}
                  <span
                    onClick={() =>
                      navigate(`/post/${relatedPostAuthorId}/${relatedPostId}`)
                    }
                    className="font-medium text-inputbox-active hover:underline cursor-pointer transition-colors duration-150"
                  >
                    {relatedPostTitle}
                  </span>
                </span>
              )}

              {contentType === 'replay' && (
                <span className="font-semibold text-text-color-400">
                  <div
                    className='hover:underline cursor-pointer'
                    onClick={() => navigate(`/profile/${relatedUserId}`)}>{relatedUserName}</div> replied "{commentSlice}" on the post{' '}
                  <span
                    onClick={() =>
                      navigate(`/post/${relatedPostAuthorId}/${relatedPostId}`)
                    }
                    className="font-medium text-inputbox-active hover:underline cursor-pointer transition-colors duration-150"
                  >
                    {relatedPostTitle}
                  </span>
                </span>
              )}
            </h5>
            <span className="text-xs text-text-color-200 ml-2">
              {getTimeAgo(time)}
            </span>
          </div>

          {!seen && (
            <div className="mt-2 flex space-x-4 text-text-color-200">
              <button
                onClick={markAsRead}
                className="flex items-center text-xs hover:text-text-color-300 transition-colors duration-150"
              >
                <Eye className="h-4 w-4 mr-1" /> Read
              </button>
            </div>
          )}
        </div>

        <button
          onClick={deleteNotification}
          className="text-body-400 hover:text-body-600 transition-colors duration-150"
        >
          <X className="h-5 w-5" />
        </button>
      </li>
    </ul>
  )
}

export default NotificationsCard