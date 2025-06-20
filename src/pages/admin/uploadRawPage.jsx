import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchAllFiles } from "../../../appwrite/admin/fetch_from_appwrite.js";
import "../../styles/adminPage.css";

const server = "https://bckd.onrender.com";
// const server = "http://127.0.0.1:8000";
// const server = "http://localhost:8000";
const ITEMS_PER_PAGE = 5;

const PDFManager = () => {
  const { folder_id: collection_id } = useParams();

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [drivelink, setDrivelink] = useState(""); // ✅ NEW state for Drive link
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [collection_id, page]);

  const loadFiles = async () => {
    setFetchingFiles(true);
    try {
      const files = await fetchAllFiles(
        collection_id,
        page * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE
      );

      const normalized = files.map((f) => ({
        name: f.name || f.NAME,
        max_id: parseInt(f.max_id || f.MAX_SIZE),
        docId: f.docId || f.$id,
        drive: f.drive || f.DRIVE_LINK, // optionally fetched
      }));

      setUploadedFiles(normalized);
      setHasMoreFiles(normalized.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Fetch files error:", error);
      setStatus("❌ Failed to fetch files.");
    } finally {
      setFetchingFiles(false);
    }
  };

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => setStatus(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.toLowerCase() === "application/json") {
      setFile(selectedFile);
      setStatus("");
    } else {
      setStatus("❗ Only JSON files are allowed.");
      setFile(null);
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      setStatus("❗ Please provide both a file and a name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", name.trim());
    formData.append("collection_id", collection_id);
    formData.append("drivelink", drivelink.trim()); // ✅ Add Drive link to upload

    setLoading(true);
    setStatus("⏳ Uploading...");

    try {
      await axios.post(`${server}/upload/raw`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("✅ Upload successful and metadata saved.");
      setName("");
      setDrivelink("");
      setFile(null);
      document.querySelector(".input-file").value = null;

      // Reload first page to reflect new file
      setPage(0);
    } catch (error) {
      console.error("Upload or metadata error:", error);
      setStatus("❌ Upload or saving metadata failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name, max_id, docId) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(docId);
    setStatus(`🗑️ Deleting "${name}"...`);

    try {
      const form = new FormData();
      form.append("file_name", name);
      form.append("max_id", parseInt(max_id));
      form.append("doc_id", docId);
      form.append("collection_id", collection_id);

      await axios.post(`${server}/delete/document/delete`, form);

      setStatus(`✅ "${name}" deleted successfully.`);
      loadFiles(); // Refresh current page after deletion
    } catch (error) {
      console.error("Delete failed:", error);
      setStatus(`❌ Failed to delete "${name}".`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pdf-container">
      <h2>📄 Raw Data Upload</h2>

      {drivelink && (
        <p>
          🔗 Drive Link:{" "}
          <a href={drivelink} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        </p>
      )}

      <div className="upload-box">
        <input
          type="text"
          placeholder="Enter file name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-text"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Enter drive link (optional)"
          value={drivelink}
          onChange={(e) => setDrivelink(e.target.value)}
          className="input-text"
          disabled={loading}
        />
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="input-file"
          disabled={loading}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-upload"
        >
          {loading ? "⏳ Uploading..." : "📤 Upload"}
        </button>
      </div>

      {status && <p className="status-msg">{status}</p>}

      <div className="uploaded-list">
        {fetchingFiles ? (
          <p>Loading files...</p>
        ) : uploadedFiles.length === 0 ? (
          <p>No uploaded files found.</p>
        ) : (
          uploadedFiles.map((file) => (
            <div key={file.docId} className="file-card">
              <div className="file-info">
                <strong>{file.name}</strong>
                <p>Entries: {file.max_id}</p>
                {file.drive && (
                  <a href={file.drive} target="_blank" rel="noopener noreferrer">
                    📁 View Drive
                  </a>
                )}
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDelete(file.name, file.max_id, file.docId)}
                disabled={loading || deletingId === file.docId}
              >
                {deletingId === file.docId ? "🗑️ Deleting..." : "Delete"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pagination-controls">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          ◀ Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page + 1}</span>
        <button onClick={() => setPage(page + 1)} disabled={!hasMoreFiles}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default PDFManager;
