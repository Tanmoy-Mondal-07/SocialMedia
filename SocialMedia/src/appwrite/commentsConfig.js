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

    async getPostComments(queries) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteCommentCollectionid,
                queries,
            );
        } catch (error) {
            console.log("Appwrite service :: getPostComments :: error", error);
            return false;
        }
    }

    subscribeToComments(callback) {
        return this.client.subscribe(
            [`databases.${conf.appwriteDatabaseid}.collections.${conf.appwriteCommentCollectionid}.documents`],
            response => {
                console.log("Realtime update:", response);
                callback(response);
            }
        );
    }
}

const service = new Service();
export default service;