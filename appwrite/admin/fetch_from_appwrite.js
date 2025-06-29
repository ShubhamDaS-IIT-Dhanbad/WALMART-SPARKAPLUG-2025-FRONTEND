// src/appwrite/appwriteUploadRaw.js
import { account,databases } from "../appwrite_config.js";
import { ID, Query } from "appwrite";
import conf from '../../src/config/conf.js'

const DATABASE_ID = conf.appwriteDatabaseId;
export { DATABASE_ID };

// ✅ Fetch all files (with pagination)
export const fetchAllFiles = async (collection_id, offset = 0, limit = 10) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collection_id,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt")
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Appwrite Error (fetchAllFiles):", error);
    throw error;
  }
};




// Fetch all folders with pagination
export const fetchAllFolder = async (offset = 0, limit = 10) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID,"684aabc7001935c2de11", [
      Query.equal("is_folder", true),
      Query.offset(offset),
      Query.limit(limit)
    ]);
    return response.documents;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};
