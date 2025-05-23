import React, { useState, useEffect } from 'react'
import getProfilesByCache from '../utils/getProfilesThroughache'
import { Image } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ProfileList({ userId }) {
  const [profileDats, setProfileDats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getProfilesByCache(userId)
      .then((res) => setProfileDats(res))
      .catch((err) => console.log(err))
  }, [userId])

  if (!profileDats) return null

  return (
    <div
      onClick={() => navigate(`/profile/${userId}`)}
      className="
        flex items-center space-x-4
        max-w-xl mx-auto
        p-4
        bg-body-0
        rounded-lg
        shadow-md
        hover:shadow-lg
        transition-opacity duration-300 ease-in-out animate-fade-slide-in-fromtop
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      role="button"
      tabIndex={0}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-body-100 flex items-center justify-center">
          {profileDats?.profilePic ? (
            <img
              src={profileDats.profilePic}
              alt="User avatar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Image className="w-6 h-6 text-body-400" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-color-500 truncate">
          {profileDats?.username || 'Unknown User'}
        </p>
        <p className="text-xs text-text-color-200 truncate">
          @{profileDats?.username || 'username'}
        </p>
      </div>
    </div>
  )
}

export default ProfileList