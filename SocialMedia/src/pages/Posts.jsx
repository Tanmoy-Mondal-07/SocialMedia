import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { MoreHorizontal, Send, Heart, MessageCircle } from 'lucide-react'
import appwriteUserProfileConfig from '../appwrite/UserProfile'
import appwritePostConfig from '../appwrite/postConfig'
import getFile, { getPostPic } from '../appwrite/getFiles'

// i am sorry

function Posts() {
  const [authorInfo, setAuthorInfo] = useState(null)
  const [postInfo, setPostInfo] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [likes, setLikes] = useState(0)
  const { userId, postId } = useParams()
  const currentUserInfo = useSelector((state) => state.auth.userData)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const { register, handleSubmit, reset } = useForm()

  // load post and user info
  useEffect(() => {
    appwriteUserProfileConfig.getUserProfile(userId)
      .then((response) => setAuthorInfo(response))
      .catch((err) => console.log(err))

    appwritePostConfig.getPost(postId)
      .then((response) => {
        setPostInfo(response)
        // Assuming post has likes count if available
        setLikes(response.likes || 0)
      })
      .catch((err) => console.log(err))
  }, [userId, postId])

  // todo @ comment submit
  const onSubmit = (data) => {
    console.log('Submitted comment:', data.comment)
    reset()
  }

  // share function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Checkout the post by @${authorInfo?.username}`,
          text: postInfo.title,
          url: `/post/${userId}/${postId}`,
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      try {
        navigator.clipboard.writeText(`/post/${userId}/${postId}`)
          .then(() => alert('post link hasbeen copyed to clipbord'))
      } catch (error) {
        alert('error: faild to share')
      }
    }
  };

  // three dot menu
  const toggleMenu = () => setMenuOpen(!menuOpen)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  // todo @ like function
  const handleLike = () => {
    setLikes((prev) => prev + 1)
  
  }

  //dlete post
  function dletePost(postId) {
    if (window.confirm("Please note that this action will permanently remove the post and cannot be undone. Are you certain you wish to proceed")) {
      appwritePostConfig.deletePost(postId)
    }
  }

  if (!authorInfo || !postInfo) return null

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 my-8">

      {/* user header */}
      <div className="flex justify-between items-start mb-4 relative">
        <div className="flex items-center gap-4">
          <img
            src={getFile(authorInfo)}
            alt={authorInfo?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-sm font-semibold">{authorInfo?.username}</h2>
            <p className="text-xs text-gray-500">
              {new Date(postInfo.$createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* three dot meny */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
          >
            <MoreHorizontal />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10">
              {(currentUserInfo.$id == userId) ? (
                <>
                  <button onClick={handleShare} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Share
                  </button>

                  <button onClick={() => navigate(`/editpost/${postId}`)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Edit Post
                  </button>

                  <button onClick={() => dletePost(postId)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500">
                    Delete
                  </button>

                </>
              ) : (
                <>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Report
                  </button>

                  <button onClick={handleShare} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Share
                  </button>

                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* post content */}
      <h3 className="text-xl font-bold mb-2 text-gray-800">
        {postInfo.title}
      </h3>

      {postInfo.content && (
        <p className="text-gray-700 mb-3 whitespace-pre-line">
          {postInfo.content}
        </p>
      )}

      {postInfo.mediaUrl && (
        <div className="mt-2">
          <img
            src={getPostPic(postInfo.mediaUrl)}
            alt="Post"
            className="w-full rounded-xl object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Like & Comments */}
      <div className="flex items-center  mt-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-red-500 hover:text-red-600"
        >
          <Heart size={20}
          // className="fill-current" 
          />
          <span className="text-sm">{likes}</span>
        </button>
        <button
          onClick={handleLike}
          className="pl-2 flex items-center space-x-1 text-fground-100"
        >
          <MessageCircle size={20} />
          <span className="text-sm">{likes}</span>
        </button>
      </div>

      {/* comment form */}
      <div className="mt-6 border-t pt-4">
        <h4 className="text-md font-semibold ml-2 mb-2">Leave a comment</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <input
            type="text"
            {...register('comment', { required: true })}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-mground-100"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-mground-100 hover:text-fground-100"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Posts