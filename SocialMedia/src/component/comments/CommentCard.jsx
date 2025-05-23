import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, CornerUpLeft } from 'lucide-react';
import { SubComments, Button } from '../index';
import getTimeAgo from '../../utils/timeStamp';
import { useNavigate } from 'react-router-dom';
import getProfilesByCache from '../../utils/getProfilesThroughache';
import { commentLikes, ifNotLikedThenLike, singlePostTotalLikes } from '../../utils/likeHandler';
import { useSelector } from 'react-redux';

export default function CommentCard({
  postId,
  userId,
  content,
  time,
  commentId,
  subComments = [],
  onSubmit = () => { },
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [authorInfo, setAuthorInfo] = useState(null)
  const [currentUserLiked, setcurrentUserLiked] = useState(false)
  const [likeInfo, setlikeInfo] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm();
  const inputRef = useRef()
  const navigate = useNavigate()
  const currentUserId = useSelector((state) => state.auth.userData?.$id) || null

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

  async function onLikeClick() {
    if (currentUserId) {
      setcurrentUserLiked((prev) => !prev)
      try {
        const exicuted = await ifNotLikedThenLike({ commentId, postId, currentUserId })
        if (exicuted) {
          singlePostTotalLikes({ postId, currentUserId, commentIdProvided: commentId })
            .then(async () => {
              const responce = await commentLikes({ postId, currentUserId, commentIdProvided: commentId })
              setlikeInfo(responce)
              if (responce?.userLiked.length > 0) {
                setcurrentUserLiked(true)
              }
            })
        }
      } catch (error) {
        setcurrentUserLiked((prev) => !prev)
        console.log(error);
      }
    }
  }

  useEffect(() => {
    singlePostTotalLikes({ postId, currentUserId, commentIdProvided: commentId })
      .then(() => {
        commentLikes({ postId, currentUserId, commentIdProvided: commentId })
          .then((e) => {
            setlikeInfo(e)
            setcurrentUserLiked(e?.userLiked.length > 0)
          })
      })
    getProfilesByCache(userId)
      .then((responce) => setAuthorInfo(responce))
  }, [userId, content])

  // console.log(likeInfo);

  return (
    <div
      className={`border shadow-md rounded-lg overflow-hidden mb-6 max-w-xl mx-auto p-4 bg-body-0 ${subComments.length > 0 ? 'border-body-300' : 'border-body-200'
        }transition-opacity duration-300 ease-in-out animate-fade-slide-in-fromtop`}
    >
      <div onClick={() => navigate(`/profile/${userId}`)} className="flex items-center mb-3">
        <div className='w-8 h-8 rounded-full overflow-hidden mr-4 bg-body-200 flex items-center justify-center'>
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
          <div className="font-semibold text-text-color-400">{authorInfo?.username}</div>
          <div className="text-xs text-text-color-200">{formattedTime}</div>
        </div>
      </div>
      <div className="text-text-color-300 mb-3">{content}</div>

      <div className="flex space-x-4 text-sm text-text-color-200 mb-3">

        {likeInfo && <button
          type="button"
          onClick={onLikeClick}
          className="flex items-center gap-1 text-sm font-medium text-text-color-300 hover:text-inputbox-active transition-colors duration-200"
        >
          <span>{likeInfo?.likesCount}</span>
          {currentUserLiked ? (
            <Heart fill="red" color="red" className="w-4 h-4" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
          <span>Like</span>
        </button>}

        <button
          type="button"
          onClick={handleReplyClick}
          className="flex items-center hover:text-inputbox-active transition"
        >
          <CornerUpLeft className="w-4 h-4 mr-1" /> Reply
        </button>
        {subComments.length > 0 && (
          <button
            type="button"
            onClick={toggleReplies}
            className="flex items-center hover:text-inputbox-active transition"
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
            className="flex-1 border border-body-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-body-500"
          />
          <Button type="submit" classNameActive="ml-2 px-4 py-2.5">
            Reply
          </Button>
        </form>
      )}

      {showReplies && subComments.length > 0 && (
        <div className="mt-4 ml-6 border-l border-body-200 pl-4 
        transition-opacity duration-500 ease-in-out opacity-0 animate-fade-slide-in">
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