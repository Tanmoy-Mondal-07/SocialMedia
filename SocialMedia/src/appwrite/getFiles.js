import conf from '../conf/conf.js';

export default function getFile(userProfile) {
    if (!userProfile.avatarUrl) {
        console.error("Error: fileId is missing or undefined");
        return null;
    }
    const fileId=userProfile.avatarUrl
    return `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteAvatarBucketidid}/files/${fileId}/view?project=${conf.appwriteProjectid}`;
}    
