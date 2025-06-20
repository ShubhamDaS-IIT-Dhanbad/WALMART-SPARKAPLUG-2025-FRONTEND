import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchDocument } from "../../../appwrite/admin/fetchDocument.js";
import "../../styles/admin/folderPage.css";

const server = "https://bckd.onrender.com";

// const server = "http://127.0.0.1:8000";
const ITEMS_PER_PAGE = 7;

const FolderPage = () => {
  const { folder_id: collection_id } = useParams();
  const location = useLocation();

  const [folders, setFolders] = useState([]);
  const [totalFolders, setTotalFolders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadFolders = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const data = await fetchDocument(collection_id, offset, ITEMS_PER_PAGE);

      setFolders(data.documents || []);
      setTotalFolders(data.total || 0);
      setCurrentPage(data.page || page);
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const baseName = prompt("Enter base folder name:");
    if (!baseName) return;

    setCreating(true);
    try {
      const res = await fetch(`${server}/admin/create-document-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_collection_id: collection_id,
          folder_name: baseName,
        }),
      });

      if (!res.ok) throw new Error("Folder creation failed");
      await loadFolders(currentPage);
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    setDeletingFolderId(folder.$id);
    try {
      const res = await fetch(`${server}/admin/delete-document-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_collection_id: folder.$collectionId,
          folder_collection_id: folder.sub_folder_id,
        }),
      });

      if (!res.ok) throw new Error("Folder deletion failed");
      await loadFolders(currentPage);
    } catch (error) {
      console.error("Error deleting folder:", error);
    } finally {
      setDeletingFolderId(null);
    }
  };

  const getRoutePath = (folder) => {
    const id = folder.sub_folder_id || folder.$id;
    const path = location.pathname.toLowerCase();
    if (path.includes("/raw/")) return `/admin/raw/subfolder/${id}`;
    if (path.includes("/pdf/")) return `/admin/pdf/subfolder/${id}`;
    if (path.includes("/qna/")) return `/admin/qna/subfolder/${id}`;
    return `/admin/subfolder/${id}`;
  };

  const totalPages = Math.ceil(totalFolders / ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) loadFolders(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) loadFolders(currentPage - 1);
  };

  useEffect(() => {
    if (collection_id) loadFolders(1);
  }, [collection_id]);

  return (
    <div className="folder-container">
      <h2>📁 Folder Manager: {collection_id}</h2>

      <button
        className="btn-create"
        onClick={handleCreateFolder}
        disabled={creating}
      >
        {creating ? "⏳ Creating..." : "➕ Create topic wise folder"}
      </button>

      {loading ? (
        <p className="info-text">Loading folders...</p>
      ) : folders.length === 0 ? (
        <p className="info-text">No folders found.</p>
      ) : (
        <>
          <ul className="folder-list">
            {folders.map((folder) => (
              <li key={folder.$id} className="folder-item">
                <Link to={getRoutePath(folder)} className="folder-link">
                  📂 {folder.folder_name}
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteFolder(folder)}
                  disabled={deletingFolderId === folder.$id}
                >
                  {deletingFolderId === folder.$id ? "Deleting..." : "❌ Delete"}
                </button>
              </li>
            ))}
          </ul>

          <div className="pagination-controls">
            <button onClick={goToPrevPage} disabled={currentPage === 1}>
              ⬅️ Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FolderPage;
