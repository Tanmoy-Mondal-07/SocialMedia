import React from 'react'
import './ProfileTop.css'
import { Button } from '../index'
import { profilePicSvg } from '../../assets/iconSvg'

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
    onLogoutClick,
    onEditProfileClick
}) {

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
                        <Button onClick={onEditProfileClick}>Edit Profile</Button>
                        <Button onClick={onLogoutClick}>Logout</Button>
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