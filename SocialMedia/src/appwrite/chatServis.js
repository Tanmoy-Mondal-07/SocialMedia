import conf from '../conf/conf.js';
import { Client, ID, Databases, Query, Permission, Role } from "appwrite";

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid);
        this.databases = new Databases(this.client);
    }

    async writeChat({ senderid, resiverid, message }) {
        console.log(senderid, resiverid, message);
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseid,
                conf.appwriteInboxCollectionid,
                ID.unique(),
                {
                    senderid,
                    resiverid,
                    message
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: writeChat :: error", error);
        }
    }

    async deleteChat(chatId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseid,
                conf.appwriteInboxCollectionid,
                chatId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteChat :: error", error);
            return false
        }
    }

    async getChats(queries) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseid,
                conf.appwriteInboxCollectionid,
                queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getChats :: error", error);
            return false
        }
    }

    subscribeToChat(callback) {
        return this.client.subscribe(
            [`databases.${conf.appwriteDatabaseid}.collections.${conf.appwriteInboxCollectionid}.documents`],
            response => {
                // console.log("Realtime update:", response);
                callback(response);
            }
        );
    }
}


const service = new Service()
export default service