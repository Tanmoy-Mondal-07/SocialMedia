import { getUserProfile, setUserProfile } from './userProfileCache';
import appwriteUserProfileService from '../appwrite/UserProfile'
import getFile from '../appwrite/getFiles';

export default async function getProfilesByCache(userId) {

    const profileInfo = await getUserProfile(userId)
    if (profileInfo) return profileInfo

    const authorProfileInfo = await appwriteUserProfileService.getUserProfile(userId)
    const profilePic = getFile(authorProfileInfo);
    const userData = { ...authorProfileInfo, profilePic }
    setUserProfile(userId, userData)
    return userData
}