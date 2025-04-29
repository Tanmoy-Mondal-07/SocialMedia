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

    async createReports({ userId, postId, reporttext }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseid,
                conf.appwriteReportCollectionid,
                ID.unique(),
                {
                    userId,
                    postId,
                    reporttext
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createReport :: error", error);
        }
    }

    async deleteReports(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseid,
                conf.appwriteReportCollectionid,
                postId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteReport :: error", error);
            return false
        }
    }

    async getReports(queries = [Query.equal("", "")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteReportCollectionid,
                queries,

            )
        } catch (error) {
            console.log("Appwrite serive :: getReport :: error", error);
            return false
        }
    }
}


const service = new Service()
export default service