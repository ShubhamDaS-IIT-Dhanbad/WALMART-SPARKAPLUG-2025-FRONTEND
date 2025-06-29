import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllFolder
} from "../../../appwrite/admin/fetch_from_appwrite.js";

const MainPage = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFolders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFolder();
      setFolders(data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
    setLoading(false);
  };

  const getRoutePath = (folder) => {
    const name = folder.folder_name.toUpperCase();
    const id = folder.sub_folder_id;

    if (name.includes("RAW")) return `/admin/raw/${id}`;
    if (name.includes("PDF")) return `/admin/pdf/${id}`;
    if (name.includes("QNA")) return `/admin/qna/${id}`;
    return `/admin/${id}`; // fallback/default
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 Folder Manager</h2>
      
      {loading ? (
        <p>Loading folders...</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.$id}>
              <Link
                to={getRoutePath(folder)}
                style={{ textDecoration: "none", color: "blue" }}
              >
                {folder.folder_name}
              </Link>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainPage;
