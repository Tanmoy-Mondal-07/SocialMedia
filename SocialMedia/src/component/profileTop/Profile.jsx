import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Image, Minimize2 } from 'lucide-react';
import { Button } from '../index';
import authService from '../../appwrite/auth';
import { showLoading, hideLoading } from '../../store/LodingState';
import { logout } from '../../store/authSlice';

function Profile({
  imageUrl,
  username,
  bio,
  followersCount = 0,
  followingCount = 0,
  isOwnProfile = false,
  isFollowing = false,
  onFollowClick,
  onMessageClick,
  userId
}) {
  // console.log(imageUrl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);

  const logoutUser = () => {
    dispatch(showLoading());
    authService
      .logout()
      .then(() => dispatch(logout()))
      .finally(() => dispatch(hideLoading()));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-bground-100 rounded-lg text-fground-200 space-y-6 shadow-lg
    transition-opacity duration-300 ease-in-out animate-fade-slide-in-fromtop">
      <div className="flex items-center space-x-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            onClick={() => setModalOpen(true)}
            className="w-24 h-24 rounded-full object-cover border-2 border-fground-200 shadow-sm cursor-pointer hover:opacity-90 transition"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-fground-200 shadow-sm bg-gray-100">
            <Image className="text-fground-200 w-8 h-8" />
          </div>
        )}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold leading-tight">{username}</h2>
          <p className="text-sm text-bground-200 font-mono">@{username}</p>
        </div>
      </div>

      {bio && (
        <div className="text-base text-left text-fground-100 leading-relaxed">
          {bio}
        </div>
      )}

      <div className="flex justify-between text-center border-y border-fground-200 py-4">
        <div onClick={() => navigate(`/followers/${userId}`)} className='hover:cursor-pointer'>
          <p className="text-sm tracking-wide">Followers</p>
          <p className="font-semibold text-xl">{followersCount}</p>
        </div>
        <div onClick={() => navigate(`/following/${userId}`)} className='hover:cursor-pointer'>
          <p className="text-sm tracking-wide">Following</p>
          <p className="font-semibold text-xl">{followingCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isOwnProfile ? (
          <>
            <Button onClick={() => navigate('/editprofile')} classNameActive="w-full">
              Edit Profile
            </Button>
            <Button onClick={logoutUser} classNameActive="w-full">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onFollowClick}
              className={`w-full flex items-center justify-center gap-2
        px-4 py-2 rounded-md  ${isFollowing ? 'bg-bground-100 text-fground-200 border border-fground-200' : 'bg-fground-200 text-bground-100'}`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
            <Button onClick={()=>navigate('/inbox')} classNameActive="w-full">
              Message
            </Button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative">
            <img src={imageUrl} alt="Full Profile" className="max-w-[90vw] max-h-[90vh]" />
            <button
              className="absolute top-1 right-1 bg-bground-100 text-fground-200 rounded-full p-1 hover:bg-bground-200"
              onClick={() => setModalOpen(false)}
            >
              <Minimize2 size='20' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
