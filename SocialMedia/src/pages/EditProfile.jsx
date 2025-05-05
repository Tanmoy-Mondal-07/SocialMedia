import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EditComponent } from '../component';
import { showLoading, hideLoading } from '../store/LodingState';
import appwriteUserProfileService from '../appwrite/UserProfile';
import getFile from '../appwrite/getFiles';
import { deleteUserProfile } from '../utils/userProfileCache';

function EditProfile() {
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?.$id;
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
        if (!userId) return;

        const fetchProfile = async () => {
            dispatch(showLoading());
            try {
                const profile = await appwriteUserProfileService.getUserProfile(userId);
                if (profile) {
                    setUserProfile(profile);
                } else {
                    setError('Profile not found');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                dispatch(hideLoading());
                deleteUserProfile(userId)
            }
        };

        fetchProfile();
    }, [userId, dispatch]);

    const handleProfileSubmit = async (data) => {
        dispatch(showLoading());

        try {
            let avatarUrl = userProfile.avatar;
            // console.log(data);
            if (data.profilePic) {
                // console.log(data.profilePic);
                const uploadRes = await appwriteUserProfileService.uploadAvatar(data.profilePic);
                appwriteUserProfileService.deleteAvatar(userProfile?.avatarUrl)
                if (uploadRes) {
                    avatarUrl = uploadRes.$id;
                }
            }

            const updateRes = await appwriteUserProfileService.updateUserProfile(userProfile.$id, {
                username: data.name,
                bio: data.bio,
                avatarUrl,
            });

            if (updateRes) {
                navigate(`/profile/${userId}`)
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.log("Submit Error:", error);
            alert("An error occurred while updating your profile.");
        } finally {
            dispatch(hideLoading());
        }
    };


    if (error) return <h1>{error}</h1>;
    if (!userProfile) return null;

    return (
        <EditComponent
            username={userProfile?.username}
            avatarUrl={getFile(userProfile)}
            bio={userProfile?.bio}
            onSubmit={handleProfileSubmit}
        />
    );
}

export default EditProfile;
