// appwriteConfig.js
import { Client, Account, Databases, Storage } from "appwrite";

import conf from '../src/config/conf.js'

const APPWRITE_PROJECT_ID =conf.appwriteProjectId;
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject(APPWRITE_PROJECT_ID);              

// Services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
