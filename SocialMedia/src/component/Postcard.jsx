import React from 'react'
import '../App.css'
import { profilePicSvg } from '../assets/iconSvg'
import Postfooter from './Postfooter'

function Postcard({ username,
    ProfilePic=null,
    imageUrl=null,
    caption,
    time }) {
    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-pic-placeholder">
                    {ProfilePic ? (
                        <img src={ProfilePic} alt="Profile"/>
                    ) : (
                        profilePicSvg
                    )}
                </div>
                <div className="post-user-info">
                    <strong>{username}</strong>
                    <span>{time}</span>
                </div>
            </div>
            <div className="post-caption">
                <p>{caption}</p>
            </div>
            <div className="post-image">
                {!imageUrl ? <div style={{width:'100%',height:'2px',backgroundColor:'gray'}}/> :<img src={imageUrl} alt="Post" />}
            </div>
        </div>
    )
}

export default Postcard
