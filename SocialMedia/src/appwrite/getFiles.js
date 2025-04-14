import conf from '../conf/conf.js';

export default function getFile(fileId) {

    if (!fileId.avatarUrl) {
        console.error("Error: fileId is missing or undefined");
        return null;
    }
    return `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteAvatarBucketidid}/files/${fileId.avatarUrl}/view?project=${conf.appwriteProjectid}`;
}

export function getPostPic(fileId) {
    if (!fileId.mediaUrl) {
        console.error("Error: fileId is missing or undefined");
        return null;
    }
    return `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteAvatarBucketidid}/files/${fileId.mediaUrl}/view?project=${conf.appwriteProjectid}`;
}