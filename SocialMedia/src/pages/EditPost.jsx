import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import postConfigServices from '../appwrite/postConfig'
import { PostHandler } from '../component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../store/LodingState';

function EditPost() {
  const [prevData, setprevData] = useState(null)
  const { postId } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(showLoading())
    postConfigServices.getPost(postId)
      .then((data) => setprevData(data))
      .catch((error) => console.log('error: eadit post : get post'))
      .finally(dispatch(hideLoading()))
  }, [])


  const handlePostSubmit = async (data) => {
    dispatch(showLoading());
    try {
      let mediaUrl = null

      if (data.media) {
        const uploadInfo = await postConfigServices.uploadFile(data.media)
        if (uploadInfo) {
          mediaUrl = uploadInfo.$id
        }
      } else {
        mediaUrl = data.media
      }
      // console.log(data);
      const postinfo = await postConfigServices.updatePost(postId, {
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

  return prevData ? (
    <div className="min-h-screen p-6">
      <PostHandler
        initialtitle={prevData?.title}
        initialContent={prevData?.content}
        initialMedia={prevData?.mediaUrl}
        initialVisibility={prevData?.visibility}
        onSubmit={handlePostSubmit}
      />
    </div>
  ) : null
}

export default EditPost