import React, { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Link as LinkIcon, MoreVertical } from 'lucide-react'
import Button from '../Button'
import { useNavigate } from 'react-router-dom'
import appwritePostConfig from '../../appwrite/postConfig'
import { ifNotLikedThenLike, postsTotalLikes } from '../../utils/likeHandler'
import { useSelector } from 'react-redux'

function Postfooter({
    currentUserId,
    userPost = false,
    postId,
    userId,
    postUserName,
    postTitle,
    commentCount = 0
}) {
    const [showMenu, setShowMenu] = useState(false)
    const [postLikesInfo, setpostLikesInfo] = useState(null)
    const [userLiked, setuserLiked] = useState(false)
    const menuRef = useRef(null)
    const buttonRef = useRef(null)
    const navigate = useNavigate()
    currentUserId = useSelector((state) => (state.auth.userData?.$id))

    // if (currentUserId) setuserLiked(false)

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Checkout the post by @${postUserName}`,
                    text: postTitle,
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

    async function likeClicked() {
        if (currentUserId) {
            setuserLiked((prev) => !prev)
            try {
                const exicuted = await ifNotLikedThenLike({ postId, currentUserId })
                if (exicuted) {
                    const responce = await postsTotalLikes({ postId, currentUserId })
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

    useEffect(() => {

        ; (async () => {
            const responce = await postsTotalLikes({ postId, currentUserId })
            setpostLikesInfo(responce)
            // console.log(responce);
            if (responce.userLiked.length > 0) {
                setuserLiked(true)
            }
        })();

        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setShowMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function dletePost(postId) {
        if (window.confirm("Please note that this action will permanently remove the post and cannot be undone. Are you certain you wish to proceed")) {
            appwritePostConfig.deletePost(postId)
        }
    }

    return (
        <div className="relative flex items-center justify-between px-4 py-3 bg-body-0 border-t border-body-200">
            {/* Left side actions */}
            <div className="flex items-center space-x-5">
                {postLikesInfo &&
                    <div className="transition-opacity duration-500 ease-in-out opacity-0 animate-fade-slide-in">
                        <Button
                            onClick={likeClicked}
                            className="flex items-center justify-center w-8 h-8 hover:text-text-denger transition-transform duration-200 ease-in-out transform hover:scale-110"
                        >
                            <div className="flex items-center">
                                {userLiked ?
                                    <Heart fill='red' color='red' className="w-5 h-5 mr-1" /> :
                                    <Heart className="w-5 h-5 mr-1" />}
                                {postLikesInfo.likeCount > 0 && (
                                    <span className="text-sm font-medium">{postLikesInfo.likeCount}</span>
                                )}
                            </div>
                        </Button>
                    </div>}

                {postLikesInfo &&
                    <div className="transition-opacity duration-500 ease-in-out opacity-0 animate-fade-slide-in">
                        <Button onClick={() => navigate(`/post/${userId}/${postId}`)}
                            className="flex items-center hover:text-inputbox-active transition-transform duration-200 ease-in-out transform hover:scale-110">
                            <div className="flex items-center">
                                <MessageCircle className="w-5 h-5 mr-1" />
                                {commentCount > 0 && (
                                    <span className="text-sm font-medium">{commentCount}</span>
                                )}
                            </div>
                        </Button>
                    </div>}
                    
                <div className="transition-opacity duration-300 ease-in-out opacity-0 animate-fade-slide-in">
                    <Button onClick={handleShare}
                        className="flex items-center justify-center w-8 h-8 hover:text-green-500 transition-transform duration-200 ease-in-out transform hover:scale-110">
                        <LinkIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* 3-dot menu button */}
            <div className="relative" ref={menuRef}>
                <Button
                    ref={buttonRef}
                    className="flex items-center justify-center w-8 h-8 hover:text-body-600 transition"
                    onClick={() => setShowMenu((prev) => !prev)}
                >
                    <MoreVertical className="w-5 h-5" />
                </Button>

                {/* Dropdown */}
                {showMenu && (
                    <div className="absolute right-0 bottom-1 mt-1 w-36 bg-body-0 border border-body-200 rounded-md shadow-lg z-10 text-sm">
                        <ul className="py-1">
                            {userPost ? (
                                <>
                                    <li>
                                        <button onClick={() => navigate(`/editpost/${postId}`)} className="w-full text-left px-4 py-2 hover:bg-body-100">
                                            Edit Post
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => dletePost(postId)} className="w-full text-left px-4 py-2 text-text-denger hover:bg-red-50">
                                            Delete
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <button
                                            onClick={() => navigate(`/report/${postId}`)}
                                            className="w-full text-left px-4 py-2 hover:bg-body-100">
                                            Report
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={handleShare} className="w-full text-left px-4 py-2 hover:bg-body-100">
                                            Share
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Postfooter