import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MoreHorizontal, Send, Heart, MessageCircle } from 'lucide-react';
import appwriteUserProfileConfig from '../appwrite/UserProfile';
import appwritePostConfig from '../appwrite/postConfig';
import getFile, { getPostPic } from '../appwrite/getFiles';
import appwriteFunctions from '../appwrite/functions';
const Comments = React.lazy(() => import('../component/comments/Comments'));
import { setUserProfile } from '../utils/userProfileCache';
import { hideLoading, showLoading } from '../store/LodingState';
import { MoonLoader } from 'react-spinners';
import { ifNotLikedThenLike, postsTotalLikes } from '../utils/likeHandler';

function Posts() {
  const dispatch = useDispatch();
  const [authorInfo, setAuthorInfo] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [postLikesInfo, setpostLikesInfo] = useState(null)
  const [userLiked, setuserLiked] = useState(false)
  const { userId, postId } = useParams();
  const currentUserInfo = useSelector((state) => state.auth.userData);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  if (authorInfo) {
    const profilePic = getFile(authorInfo);
    const userData = { ...authorInfo, profilePic }
    setUserProfile(userId, userData)
  }

  async function likeClicked() {
    if (currentUserInfo?.$id) {
      setuserLiked((prev) => !prev)
      try {
        const exicuted = await ifNotLikedThenLike({ postId, currentUserId: currentUserInfo?.$id })
        if (exicuted) {
          const responce = await postsTotalLikes({ postId, currentUserId: currentUserInfo?.$id })
          setpostLikesInfo(responce)
          if (responce.userLiked.length > 0) {
            setuserLiked(true)
          }
        }
      } catch (error) {
        setuserLiked((prev) => !prev)
        console.log(error);
      }
    }
  }

  // load post and user info
  useEffect(() => {
    dispatch(showLoading());
    window.scrollTo(0, 0);

    ; (async () => {
      const responce = await postsTotalLikes({ postId, currentUserId: currentUserInfo?.$id })
      setpostLikesInfo(responce)
      if (responce.userLiked.length > 0) {
        setuserLiked(true)
      }
      // console.log(responce)
    })();

    appwriteUserProfileConfig.getUserProfile(userId)
      .then((response) => setAuthorInfo(response))
      .catch((err) => console.log(err));

    appwritePostConfig.getPost(postId)
      .then((response) => {
        setPostInfo(response);
      })
      .catch((err) => console.log(err))
      .finally(() => dispatch(hideLoading()))
  }, [userId, postId, currentUserInfo]);

  const onSubmit = async (data, commentId = null) => {
    dispatch(showLoading());
    const content = data.comment.trim();
    try {
      await appwriteFunctions.commentFunction({ postId, content, commentId });
      reset();
      dispatch(hideLoading());
    } catch (error) {
      alert(error.message);
      dispatch(hideLoading());
    }
  };

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
          .then(() => alert('Post link has been copied to clipboard'));
      } catch (error) {
        alert('Error: failed to share');
      }
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  function dletePost(postId) {
    if (window.confirm("This action will permanently delete the post. Are you sure?")) {
      appwritePostConfig.deletePost(postId);
    }
  }

  if (!authorInfo || !postInfo) return null;

  return (
    <>
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 my-8
      transition-opacity duration-300 ease-in-out animate-fade-slide-in-fromtop">
        {/* user header */}
        <div className="flex justify-between items-start mb-4 relative">
          <div onClick={() => navigate(`/profile/${authorInfo.$id}`)} className="flex items-center gap-4">
            <img
              src={getFile(authorInfo)}
              alt={authorInfo?.username}
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{authorInfo?.username}</h2>
              <p className="text-xs text-gray-500">
                {new Date(postInfo.$createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* three dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
            >
              <MoreHorizontal />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10">
                {(currentUserInfo?.$id === userId) ? (
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
                    <button onClick={() => navigate(`/report/${postId}`)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
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
        <h3 className="text-2xl font-semibold mb-2 text-gray-800">{postInfo.title}</h3>

        {postInfo.content && (
          <p className="text-gray-700 mb-4 whitespace-pre-line">{postInfo.content}</p>
        )}

        {postInfo.mediaUrl && (
          <div className="mt-2">
            <img
              src={getPostPic(postInfo.mediaUrl)}
              alt="Post"
              className="w-full rounded-xl object-cover max-h-[500px] mb-4"
            />
          </div>
        )}

        {/* Like & Comments */}
        <div className="flex items-center mt-4 gap-4">
          <button
            onClick={likeClicked}
            className="flex items-center space-x-1 text-red-500 hover:text-red-600"
          >
            {userLiked ? <Heart fill='red' size={20} /> : <Heart size={20} />}
            <span className="text-sm">{postLikesInfo?.likeCount}</span>
          </button>
          <button
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
          >
            <MessageCircle size={20} />
            <span className="text-sm">{postInfo.commentsCount}</span>
          </button>
        </div>

        {/* comment form */}
        {currentUserInfo?.$id ? <div className="mt-6 border-t pt-4">
          <h4 className="text-md font-semibold ml-2 mb-2">Leave a comment</h4>
          <form onSubmit={handleSubmit((data) => onSubmit(data, null))} className="relative">
            <div className="relative">
              <textarea
                {...register('comment', { required: true })}
                name="comment"
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-2 pr-12 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
              <div className="absolute right-2 top-2 z-10">
                <button
                  type="submit"
                  className="p-1 text-blue-500 hover:text-blue-700"
                >
                  <Send size={25} />
                </button>
              </div>
            </div>
          </form>
        </div> : <h1>Please Login to Comment</h1>
        }
      </div>
      <Suspense fallback={
        <div className="flex justify-center items-center w-full h-50">
          <MoonLoader size={40} speedMultiplier={2} color="red" />
        </div>
      }>
        <Comments
          postId={postId}
          userId={userId}
          onSubmit={(data, commentId) => onSubmit(data, commentId)}
        />
      </Suspense>
    </>
  );
}

export default Posts;