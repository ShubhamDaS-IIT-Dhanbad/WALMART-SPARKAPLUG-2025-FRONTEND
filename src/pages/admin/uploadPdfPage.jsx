import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchAllFiles } from "../../../appwrite/admin/fetch_from_appwrite.js";
import "../../styles/adminPage.css";

const server = "https://bckd.onrender.com";

// const server = "http://127.0.0.1:8000";

const ITEMS_PER_PAGE = 10;

const PDFManager = () => {
  const { folder_id: collection_id } = useParams();

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      setStatus("❗ Please provide both a file and a name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", name);
    formData.append("collection_id", collection_id);

    setLoading(true);
    setStatus("⏳ Uploading...");

    try {
      const uploadUrl =
        fileType === "pdf"
          ? `${server}/upload/pdf`
          : `${server}/upload/text`;

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = {
        name: name,
        max_id: response.data?.max_id || 0,
        docId: response.data?.docId || null,
      };

      setUploadedFiles((prev) => [uploaded, ...prev]);
      setStatus("✅ Upload successful and metadata saved.");
      setName("");
      setFile(null);
    } catch (error) {
      console.error(error);
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

      setUploadedFiles((prev) => prev.filter((file) => file.docId !== docId));
      setStatus(`✅ "${name}" deleted successfully.`);
    } catch (error) {
      console.error("Delete failed:", error);
      setStatus(`❌ Failed to delete "${name}".`);
    } finally {
      setDeletingId(null);
    }
  };

  const loadFiles = async (page = 1) => {
    setLoadingFiles(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const files = await fetchAllFiles(collection_id, offset, ITEMS_PER_PAGE);
      const normalized = files.map((f) => ({
        name: f.name || f.NAME || "Unnamed",
        max_id: f.max_id || f.MAX_SIZE || 0,
        docId: f.$id || f.docId || null,
      }));
      setUploadedFiles(normalized);
      setCurrentPage(page);
    } catch (error) {
      console.error("Fetch files error:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (collection_id) loadFiles(1);
  }, [collection_id]);

  return (
    <div className="pdf-container">
      <h2>📄 File Upload & Management</h2>

      <div className="upload-box">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-text"
        />

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="input-select"
        >
          <option value="pdf">PDF</option>
          <option value="text">Text</option>
        </select>

        <input
          type="file"
          accept={fileType === "pdf" ? ".pdf" : ".txt"}
          onChange={handleFileChange}
          className="input-file"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-upload"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {status && <p className="status-msg">{status}</p>}

      <div className="uploaded-list">
        {loadingFiles ? (
          <p>Loading files...</p>
        ) : uploadedFiles.length === 0 ? (
          <p>No files found.</p>
        ) : (
          uploadedFiles.map((file, idx) => (
            <div key={file.docId || idx} className="file-card">
              <div className="file-info">
                <strong>{file.name}</strong>
                <p>max_id: {file.max_id}</p>
              </div>
              <button
                className="btn-delete"
                onClick={() =>
                  handleDelete(file.name, file.max_id, file.docId)
                }
                disabled={deletingId === file.docId}
              >
                {deletingId === file.docId ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => loadFiles(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅️ Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => loadFiles(currentPage + 1)}
          disabled={uploadedFiles.length < ITEMS_PER_PAGE}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default PDFManager;
