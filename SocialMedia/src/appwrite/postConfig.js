import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ userId, content, mediaUrl, visibility, title, }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseid,
                conf.appwritePostCollectionid,
                ID.unique(),
                {
                    userId,
                    content,
                    mediaUrl,
                    visibility,
                    title,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(postId, { content, mediaUrl, visibility, title }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseid,
                conf.appwritePostCollectionid,
                postId,
                {
                    content,
                    mediaUrl,
                    visibility,
                    title,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseid,
                conf.appwritePostCollectionid,
                postId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(postId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseid,
                conf.appwritePostCollectionid,
                postId
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("visibility", "public")]) {
        // console.log('server hit for posts');
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwritePostCollectionid,
                queries,

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteAvatarBucketidid,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteAvatarBucketidid,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        if (!fileId) {
            console.error("Error: fileId is missing or undefined");
            return null; // Prevent further execution
        }
        return this.bucket.getFilePreview(conf.appwriteAvatarBucketidid, fileId);
    }
}


const service = new Service()
export default service