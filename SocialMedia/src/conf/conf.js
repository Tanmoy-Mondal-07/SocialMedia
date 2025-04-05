const conf={
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectid: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseid: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    
    appwriteUserProfileCollectionid: String(import.meta.env.VITE_APPWRITE_USER_PROFILE_COLLECTION_ID),
    appwritePostCollectionid: String(import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID),

    appwriteMediaBucketidid: String(import.meta.env.VITE_APPWRITE_BUCKET_MEDIA_ID),
    appwriteAvatarBucketidid: String(import.meta.env.VITE_APPWRITE_BUCKET_AVATAR_ID)
}

export default conf;