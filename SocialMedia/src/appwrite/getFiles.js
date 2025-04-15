import conf from '../conf/conf.js';

export default function getFile(fileId) {

    if (!fileId.avatarUrl) {
        console.error("Error:avtar fileId is missing or undefined");
        return null;
    }
    return `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteAvatarBucketidid}/files/${fileId.avatarUrl}/view?project=${conf.appwriteProjectid}`;
}

export function getPostPic(profilepicfileId) {
    if (!profilepicfileId) {
        console.error("Error:post pic fileId is missing or undefined");
        return null;
    }
    return `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteAvatarBucketidid}/files/${profilepicfileId}/view?project=${conf.appwriteProjectid}`;
}