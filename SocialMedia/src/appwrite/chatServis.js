import conf from '../conf/conf.js';
import { Client, ID, Databases } from "appwrite";

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

    async updateSeen(chatId) {
        // console.log('seen hit');
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseid,
                conf.appwriteInboxCollectionid,
                chatId,
                {
                    seen: true
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateSeen :: error", error);
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

    async subscribeToChat(onMessage) {
        try {
            return await this.client.subscribe(
                [`databases.${conf.appwriteDatabaseid}.collections.${conf.appwriteInboxCollectionid}.documents`],
                response => {
                    // console.log('from config', response);
                    if (onMessage) onMessage(response.payload); //pass response to caller
                }
            );
        } catch (error) {
            console.log("Appwrite service :: subscribeToChat :: error", error);
            return false
        }
    }

}


const service = new Service()
export default service