import { Query } from "appwrite";

import {databases } from "../appwrite_config.js";
import conf from '../../src/config/conf.js'

const DATABASE_ID = conf.appwriteDatabaseId;

// fetchDocument.js
export const fetchDocument = async (collectionId, offset = 0, limit = 10) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.equal("is_folder", true),
      Query.offset(offset),
      Query.limit(limit),
    ]);

    const currentPage = Math.floor(offset / limit) + 1;

    return {
      documents: response.documents,
      total: response.total,
      page: currentPage,
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};
