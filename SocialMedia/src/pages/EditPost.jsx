import React from 'react'
import { useParams } from 'react-router-dom'

function EditPost() {
    const {postId} = useParams()
    console.log(postId);

  return (
    <div>EditPost</div>
  )
}

export default EditPost

// Query.orderDesc("$createdAt"),