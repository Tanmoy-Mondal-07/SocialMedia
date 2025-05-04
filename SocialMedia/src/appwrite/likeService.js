import conf from '../conf/conf.js';
import { Client, ID, Databases, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid);
        this.databases = new Databases(this.client);
    }

    async createLike({ userId, postId, commentId }) {
        try {
            // console.log('creat like hit');
            return await this.databases.createDocument(
                conf.appwriteDatabaseid,
                conf.appwriteLikeCollectionid,
                ID.unique(),
                {
                    userId,
                    postId,
                    commentId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createLike :: error", error);
        }
    }

    async deleteLike(likeId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseid,
                conf.appwriteLikeCollectionid,
                likeId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteLike :: error", error);
            return false
        }
    }

    async getLikes(queries = [Query.equal("visibility", "public")]) {
        // console.log('server hit for like info');
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteLikeCollectionid,
                queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getLikes :: error", error);
            return false
        }
    }
}


const service = new Service()
export default service