import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import appwriteUserProfileConfig from '../appwrite/UserProfile'
import appwritePostConfig from '../appwrite/postConfig'
import getFile from '../appwrite/getFiles'
import { getPostPic } from '../appwrite/getFiles'

function Posts() {
  const [authorInfo, setauthorInfo] = useState(null)
  const [postInfo, setpostInfo] = useState(null)

  const { userId, postId } = useParams()
  // console.log(userId, postId);

  // const handleShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: `Checkout the post by ${postUserName}`,
  //         text: { postTitle },
  //         url: `/post/${userId}/${postId}`,
  //       });
  //     } catch (err) {
  //       console.error('Sharing failed', err);
  //     }
  //   } else {
  //     try {
  //       navigator.clipboard.writeText(`/post/${userId}/${postId}`)
  //         .then(() => alert('post link hasbeen copyed to clipbord'))
  //     } catch (error) {
  //       alert('error: faild to share')
  //     }
  //   }
  // };

  useEffect(() => {
    appwriteUserProfileConfig.getUserProfile(userId)
      .then((responce) => setauthorInfo(responce))
      .catch((err) => console.log(err))
    appwritePostConfig.getPost(postId)
      .then((responce) => setpostInfo(responce))
      .catch((err) => console.log(err))
      .finally(() => console.log(authorInfo, postInfo))

  }, [userId, postId],)


  if (authorInfo && postInfo) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-4 my-6">

        <div className="flex items-center space-x-4 mb-4">
          <img
            src={getFile(authorInfo)}
            alt={authorInfo?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-sm font-semibold">{authorInfo?.username}</h2>
            <p className="text-xs text-gray-500">{new Date(postInfo.$createdAt).toLocaleString()}</p>
          </div>
        </div>

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
      </div>
    )
  }
}

export default Posts