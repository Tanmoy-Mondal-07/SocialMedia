const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectid: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseid: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

    appwriteUserProfileCollectionid: String(import.meta.env.VITE_APPWRITE_USER_PROFILE_COLLECTION_ID),
    appwritePostCollectionid: String(import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID),
    appwriteFollowStateCollectionid: String(import.meta.env.VITE_APPWRITE_FOLLOW_STATE_COLLECTION_ID),
    appwriteFollowEventCollectionid: String(import.meta.env.VITE_APPWRITE_FOLLOW_EVENT_COLLECTION_ID),
    appwriteCommentCollectionid: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
    appwriteNotificationsCollectionid: String(import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID),
    appwriteReportCollectionid: String(import.meta.env.VITE_APPWRITE_REPORT_COLLECTION_ID),
    appwriteLikeCollectionid: String(import.meta.env.VITE_APPWRITE_LIKE_COLLECTION_ID),

    appwriteAvatarBucketidid: String(import.meta.env.VITE_APPWRITE_BUCKET_AVATAR_ID),

    appwriteFollowFunctionid: String(import.meta.env.VITE_APPWRITE_FOLLOW_FUNCTION_ID),
    appwriteCommentFunctionId: String(import.meta.env.VITE_APPWRITE_COMMENT_FUNCTION_ID)
}

export default conf;