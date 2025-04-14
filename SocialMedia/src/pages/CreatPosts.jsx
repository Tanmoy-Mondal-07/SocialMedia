import React from 'react'
import postConfigServices from '../appwrite/postConfig'
import { PostHandler } from '../component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../store/LodingState';

function CreatPosts() {
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()

  const handlePostSubmit = async (data) => {
    dispatch(showLoading());
    try {
      let mediaUrl = null

      if (data.media) {
        const uploadInfo = await postConfigServices.uploadFile(data.media)
        if (uploadInfo) {
          mediaUrl = uploadInfo.$id
        }
      }

      const postinfo = await postConfigServices.createPost({
        userId: userData.$id,
        content: data.content,
        mediaUrl: mediaUrl,
        visibility: data.visibility,
        title: data.title,
      })
      if (postinfo) {
        navigate(`/profile/${userData.$id}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(hideLoading());
    }
  }


  return (
    <>
      <div className="min-h-screen p-6">
        <PostHandler onSubmit={handlePostSubmit} />
      </div>
    </>
  )
}

export default CreatPosts

{/* <PostHandler
          initialtitle="hlo there"
          initialContent="Edit this existing post..."
          initialMedia={null}
          initialVisibility="private"
          onSubmit={handlePostSubmit}
        /> */}

//content:"anranranrtn"
//media:File { name: 'ab67616d0000b273451f108719b7161287731033.jpg', lastModified: 1741010408999, lastModifiedDate: Mon Mar 03 2025 19: 30:08 GMT +0530(India Standard Time), webkitRelativePath: '', size: 93599, … }
//title:"zbaeb"
//visibility:"public"

// const info = await appwriteFunction.callFunction({
//   followeeId:data.title,
// })