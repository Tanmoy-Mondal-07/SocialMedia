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