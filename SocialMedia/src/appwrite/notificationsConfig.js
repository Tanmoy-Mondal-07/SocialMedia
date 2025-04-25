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

    async updateNotification(notificationId, { read = true }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseid,
                conf.appwriteNotificationsCollectionid,
                notificationId,
                {
                    read
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateNotification :: error", error);
        }
    }

    async deleteNotification(notificationId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseid,
                conf.appwriteNotificationsCollectionid,
                notificationId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteNotification :: error", error);
            return false
        }
    }

    async getNotifications({ userId }) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteNotificationsCollectionid,
                [
                    Query.orderDesc('$createdAt'),
                    Query.equal("userId", userId),
                    Query.equal("seen", false),
                    Query.limit(50),
                ],

            )
        } catch (error) {
            console.log("Appwrite serive :: getNotification :: error", error);
            return false
        }
    }

}


const service = new Service()
export default service