import React, { useEffect, useState } from 'react'
import { Postcard, Postfooter, ProfileComponent } from '../component'
import { useNavigate, useParams } from 'react-router-dom'
import appwriteUserProfileService from '../appwrite/UserProfile'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../store/LodingState'
import getFile from '../appwrite/getFiles'

function Profile() {
  const [userProfile, setUserProfile] = useState(null)
  const [error, setError] = useState(null)
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(showLoading())
      try {
        if (slug) {
          const profile = await appwriteUserProfileService.getUserProfile(slug)
          if (profile) {
            setUserProfile(profile)
          } else {
            setError("User not found")
          }
        } else {
          navigate('/')
        }
      } catch (err) {
        // console.error(err)
        setError("Something went wrong while fetching the profile.")
      } finally {
        dispatch(hideLoading())
      }
    }

    fetchProfile()
  }, [slug, navigate])

  if (error) {
    return <h1>{error}</h1>
  }

  return userProfile ? (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <ProfileComponent
        profile = {true}
        username={userProfile.username}
        bio={userProfile.bio}
        followersCount={userProfile.followersCount}
        followingCount={userProfile.followingCount}
        imageUrl={getFile(userProfile)}
      />
    </div>
  ) : null
}

export default Profile
