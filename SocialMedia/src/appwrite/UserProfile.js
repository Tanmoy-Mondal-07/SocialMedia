import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage} from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectid);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createUserProfile({userId,username,bio,avatarUrl}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseid,
                conf.appwriteUserProfileCollectionid,
                userId,
                {
                    username,
                    bio,
                    avatarUrl,
                    // followersCount,
                    // followingCount,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createUserProfile :: error", error);
        }
    }

    async updateUserProfile(userId,{username,bio,avatarUrl}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseid,
                conf.appwriteUserProfileCollectionid,
                userId,
                {
                    username,
                    bio,
                    avatarUrl,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateUserProfile :: error", error);
        }
    }

    async getUserProfile(userId){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseid,
                conf.appwriteUserProfileCollectionid,
                userId
            )
        } catch (error) {
            console.log("Appwrite serive :: getUserProfile :: error", error);
            return false
        }
    }
    // file upload service

    async uploadAvatar(Avatar){
        try {
            return await this.bucket.createFile(
                conf.appwriteAvatarBucketidid,
                ID.unique(),
                Avatar
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadAvatar :: error", error);
            return false
        }
    }

    async deleteFile(AvatarId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteAvatarBucketidid,
                AvatarId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteAvatar :: error", error);
            return false
        }
    }

    getFilePreview(AvatarId) {
        if (!AvatarId) {
            console.error("Error: AvatarId is missing or undefined");
            return null; // Prevent further execution
        }
        return this.bucket.getFilePreview(conf.appwriteAvatarBucketidid, AvatarId);
    }    
}
const service = new Service()


export default service