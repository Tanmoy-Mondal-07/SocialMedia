import conf from '../conf/conf.js'
import { Client, Account, ID, OAuthProvider } from 'appwrite'


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectid)
        this.account = new Account(this.client)
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                //call another method
                return this.login({ email, password })
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            // alert(`${error}`);
            throw error
        }
    }

    async githubLogin() {
        try {
            this.account.createOAuth2Token(
                OAuthProvider.Github,
                'https://dantemedia.pages.dev/gitlogin',
                'https://dantemedia.pages.dev/login'
            );
        } catch (error) {
            console.error('GitHub login failed:', error);
            throw error;
        }
    }

    async completeOAuthLogin() {
        try {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userId');
            const secret = params.get('secret');

            if (!userId || !secret) throw new Error('Missing OAuth parameters');

            await this.account.createSession(userId, secret);
            return await this.account.get();
        } catch (error) {
            // console.error('OAuth session creation failed:', error);
            // throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            // console.log("current user error");
            throw error
        }
        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions()
            localStorage.setItem("recommendedUserIds", null)
        } catch (error) {
            throw error
        }
    }


}
const authService = new AuthService()


export default authService
