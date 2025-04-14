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
                JSON.stringify({ followeeId }), // Stringify the data
            );//this single function took 2 day wtf 
            console.log("Function execution result:", result);
            return result;
        } catch (error) {
            console.error("Appwrite service :: callFunction :: error", error);
            throw error;
        }
    }
};

const service = new Service();
export default service;
