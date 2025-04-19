import conf from '../conf/conf.js';
import { Client, Functions } from "appwrite";

export class Service {
    client = new Client();
    functions;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid);
        this.functions = new Functions(this.client);
    }

    async callFunction({ followeeId }) {
        try {
            const result = await this.functions.createExecution(
                conf.appwriteFollowFunctionid,
                JSON.stringify({ followeeId }), // stringify the data
            );//this single function took 2 day uggggg 
            if (result?.responseStatusCode !== 200) {
                alert("somthing went wrong")
            }
            return result;
        } catch (error) {
            console.error("Appwrite service :: followFunction :: error", error);
            throw error;
        }
    }

    async commentFunction({ postId, commentId, content }) {
        try {
            const result = await this.functions.createExecution(
                conf.appwriteCommentFunctionId,
                JSON.stringify({ postId, commentId, content }), // stringify the data
            );
            if (result?.responseStatusCode !== 200) {
                alert("somthing went wrong")
            }
            return result;
        } catch (error) {
            console.error("Appwrite service :: commentFunction :: error", error);
            throw error;
        }
    }
};

const service = new Service();
export default service;
