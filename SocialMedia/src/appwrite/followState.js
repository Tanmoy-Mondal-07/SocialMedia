import conf from '../conf/conf.js';
import { Client, Databases, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid);
        this.databases = new Databases(this.client);
    }

    async getFollowState(postId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseid,
                conf.appwriteFollowStateCollectionid,
                postId
            )
        } catch (error) {
            console.log("Appwrite serive :: Follow State Collection :: error", error);
            return false
        }
    }

    async getFollowConnection({followerId,followeeId}) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteFollowEventCollectionid,
                [
                    Query.equal("followerId", followerId),
                    Query.equal("followeeId", followeeId)
                ]

            )
        } catch (error) {
            console.log("Appwrite serive :: Follow Event Collection :: error", error);
            return false
        }
    }

    async getFollowLists(query) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteFollowEventCollectionid,
                query

            )
        } catch (error) {
            console.log("Appwrite serive :: Follow List :: error", error);
            return false
        }
    }
};

const service = new Service()
export default service