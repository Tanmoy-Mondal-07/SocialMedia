import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, CornerUpLeft } from 'lucide-react';
import { SubComments, Button } from '../index';
import getTimeAgo from '../../utils/timeStamp';
import { useNavigate } from 'react-router-dom';
import getProfilesByCache from '../../utils/getProfilesThroughache';

export default function CommentCard({
  userId,
  content,
  time,
  commentId,
  subComments = [],
  onLike = () => { },
  onSubmit = () => { },
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [authorInfo, setAuthorInfo] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm();
  const inputRef = useRef()
  const navigate = useNavigate()

  const formattedTime = useMemo(() => getTimeAgo(time), [time]);

  const handleReplyClick = useCallback(() => {
    setIsReplying(prev => !prev);
  }, []);

  const toggleReplies = useCallback(() => {
    setShowReplies(prev => !prev);
  }, []);

  const replayToSubReplay = async (data) => {
    await setValue('comment', data)
    await setIsReplying(true)
    inputRef.current?.focus();
  }

  const submitReply = useCallback(
    (data) => {
      onSubmit(data, commentId);
      reset();
      setIsReplying(false);
    },
    [commentId, onSubmit, reset]
  );

  useEffect(() => {
    getProfilesByCache(userId)
      .then((responce) => setAuthorInfo(responce))
  }, [userId, content])

  return (
    <div
      className={`border shadow-md rounded-lg overflow-hidden mb-6 max-w-xl mx-auto p-4 bg-white ${subComments.length > 0 ? 'border-gray-300' : 'border-gray-200'
        }`}
    >
      <div onClick={() => navigate(`/profile/${userId}`)} className="flex items-center mb-3">
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
          <div className="font-semibold text-gray-800">{authorInfo?.username}</div>
          <div className="text-xs text-gray-500">{formattedTime}</div>
        </div>
      </div>
      <div className="text-gray-700 mb-3">{content}</div>

      <div className="flex space-x-4 text-sm text-gray-500 mb-3">
        <button
          type="button"
          onClick={() => onLike(commentId)}
          className="flex items-center hover:text-blue-600 transition"
        >
          <Heart className="w-4 h-4 mr-1" /> Like
        </button>
        <button
          type="button"
          onClick={handleReplyClick}
          className="flex items-center hover:text-blue-600 transition"
        >
          <CornerUpLeft className="w-4 h-4 mr-1" /> Reply
        </button>
        {subComments.length > 0 && (
          <button
            type="button"
            onClick={toggleReplies}
            className="flex items-center hover:text-blue-600 transition"
          >
            {showReplies ? 'Hide Replies' : `Show Replies (${subComments.length})`}
          </button>
        )}
      </div>

      {isReplying && (
        <form onSubmit={handleSubmit(submitReply)} className="mt-3 flex items-center">
          <input
            {...register('comment', { required: true })}
            placeholder="Write a reply..."
            ref={(e) => {
              register('comment').ref(e);
              inputRef.current = e; // store the ref
            }}
            className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-mground-100"
          />
          <Button type="submit" classNameActive="ml-2 px-4 py-2.5">
            Reply
          </Button>
        </form>
      )}

      {showReplies && subComments.length > 0 && (
        <div className="mt-4 ml-6 border-l border-gray-200 pl-4">
          {subComments.map(reply => (
            <SubComments
              key={reply.$id || reply.commentId}
              userId={reply.authorId}
              content={reply.content}
              time={reply.$createdAt}
              replayTo={replayToSubReplay}
            />
          ))}
        </div>
      )}
    </div>
  );
}