import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import appwriteUserAuthInfo from '../appwrite/auth';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import appwriteUserProfileService from '../appwrite/UserProfile';
import { MoonLoader } from 'react-spinners';

function GithubLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle OAuth flow and session
    useEffect(() => {
        ; (async () => {

            const userData = await appwriteUserAuthInfo.completeOAuthLogin();

            if (userData) {
                await dispatch(login({ userData }));

                const existing = await appwriteUserProfileService.getUserProfile(userData.$id);
                if (existing) {
                    if (existing) { navigate(`/profile/${existing.$id}`) }
                } else {
                    const created = await appwriteUserProfileService.createUserProfile({
                        userId: userData.$id,
                        username: userData.name,
                        bio: null,
                        avatarUrl: null,
                    });
                    if (created) { navigate(`/profile/${created.$id}`) }
                }
            }

        })();
    }, []);

    return (
        <div className="flex justify-center items-center min-w-50 w-full h-25">
            <MoonLoader size={30} speedMultiplier={1.5} color="red" />
        </div>
    );
}

export default GithubLogin;