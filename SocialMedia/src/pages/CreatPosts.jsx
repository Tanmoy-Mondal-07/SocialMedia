import React from 'react'
import postConfigServices from '../appwrite/postConfig'
import { PostHandler } from '../component';

function CreatPosts() {

  const handlePostSubmit = async (data) => {
    console.log(data);
    // try {
    //   const postinfo = await postConfigServices.createPost({
    //     userId:'100',
    //     content:'is it working',
    //   })
    //   console.log(postinfo);
    // } catch (error) {
    //   console.log(error);
    // }
  }


  return (
    <>
      <div className="min-h-screen p-6">
      <PostHandler onSubmit={handlePostSubmit}/>
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