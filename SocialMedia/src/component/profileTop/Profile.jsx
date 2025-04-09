import React from 'react'
import './ProfileTop.css'
import { Button } from '../index'
import { profilePicSvg } from '../../assets/iconSvg'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { showLoading,hideLoading } from '../../store/LodingState'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'

function Profile({
    imageUrl,
    username,
    bio,
    followersCount,
    followingCount,
    isOwnProfile = true,
    isFollowing = false,
    onFollowClick,
    onMessageClick,
}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const logoutUser = () => {
        dispatch(showLoading())
        authService.logout().then(() => {
            dispatch(logout())
        }).finally(()=>dispatch(hideLoading()))
    }

    return (
        <div className="profile-card">
            <div className='picture-namecard'>
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="profile-pic" />
                ) : (
                    profilePicSvg
                )}
                <div className='username'>
                    <h2>{username}</h2>
                    <div className="username">@{username}</div>
                    {/* <Button >Edit Profile</Button> */}
                </div>
            </div>
            <div className="bio">{bio}</div>
            <div className="stats">
                <div>Followers<br /><strong>{followersCount}</strong></div>
                <div>Following<br /><strong>{followingCount}</strong></div>
            </div>
            <div className="action-buttons">
                {isOwnProfile ? (
                    <>
                        <Button onClick={() => navigate('/editprofile')}>Edit Profile</Button>
                        <Button onClick={logoutUser}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={onMessageClick}>Message</Button>
                        <Button onClick={onFollowClick}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile