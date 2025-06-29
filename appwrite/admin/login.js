import { Query } from "appwrite";
import { databases } from "../appwrite_config.js";
import conf from "../../src/config/conf.js";

const DATABASE_ID = conf.appwriteDatabaseId;
const COLLECTION_ID = conf.appwriteAdminLoginCollectionId;

export async function login(username, password) {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userName", username),
      Query.equal("password", password),
    ]);

    if (response.total > 0) {
      console.log("Login successful", response.documents[0]);
      return response.documents[0];
    } else {
      console.log("Invalid credentials");
      return null;
    }
  } catch (err) {
    console.error("Login error", err);
    return null;
  }
}
