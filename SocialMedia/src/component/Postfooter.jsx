import React, { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Link as LinkIcon, MoreVertical } from 'lucide-react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import appwritePostConfig from '../appwrite/postConfig'

function Postfooter({
    userPost = false,
    postId,
    likeColor = ''
}) {
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)
    const buttonRef = useRef(null)
    const navigate = useNavigate()
    // console.log(postId);

    useEffect(() => {
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
        <div className="relative flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            {/* Left side actions */}
            <div className="flex items-center space-x-5">
                <Button
                    style={{ color: likeColor }}
                    className="flex items-center justify-center w-8 h-8 hover:text-red-500 transition"
                >
                    <Heart className="w-5 h-5" />
                </Button>

                <Button className="flex items-center justify-center w-8 h-8 hover:text-blue-500 transition">
                    <MessageCircle className="w-5 h-5" />
                </Button>

                <Button className="flex items-center justify-center w-8 h-8 hover:text-green-500 transition">
                    <LinkIcon className="w-5 h-5" />
                </Button>
            </div>

            {/* 3-dot menu button */}
            <div className="relative" ref={menuRef}>
                <Button
                    ref={buttonRef}
                    className="flex items-center justify-center w-8 h-8 hover:text-gray-600 transition"
                    onClick={() => setShowMenu((prev) => !prev)}
                >
                    <MoreVertical className="w-5 h-5" />
                </Button>

                {/* Dropdown */}
                {showMenu && (
                    <div className="absolute right-0 bottom-1 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm">
                        <ul className="py-1">
                            {userPost ? (
                                <>
                                    <li>
                                        <button onClick={()=>navigate(`/editpost/${postId}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                            Edit Post
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={()=>dletePost(postId)} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                                            Delete
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                            Report
                                        </button>
                                    </li>
                                    <li>
                                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
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
