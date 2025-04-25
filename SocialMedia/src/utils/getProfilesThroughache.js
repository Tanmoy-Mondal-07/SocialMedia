import { getUserProfile, setUserProfile } from './userProfileCache';
import appwriteUserProfileService from '../appwrite/UserProfile'
import getFile from '../appwrite/getFiles';
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../store/LodingState';

export default async function getProfilesByCache(userId) {

    const profileInfo = await getUserProfile(userId)
    if (profileInfo) return profileInfo

    // const dispatch = useDispatch()

    // dispatch(showLoading())
    const authorProfileInfo = await appwriteUserProfileService.getUserProfile(userId)
    const profilePic = getFile(authorProfileInfo);
    const userData = { ...authorProfileInfo, profilePic }
    setUserProfile(userId, userData)
    // dispatch(hideLoading())
    return userData
}