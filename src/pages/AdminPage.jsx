import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  storeFileMeta,
  fetchAllFiles,
  deleteFileMeta,
} from "../../appwrite/appwriteUploadPdf.js";
import "../styles/adminPage.css";

const LIMIT = 10;
import conf from '../config/conf.js'

const server = conf.serverUrl;

const modelCosts = {
  "gpt-4o-mini": "Cheapest",
  "o4-mini": "Cheapest",
  "gpt-3.5-turbo": "Moderate",
  "gpt-4-turbo": "Costly",
  "gpt-4o": "Most Costly",
};

const PDFManager = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [model, setModel] = useState("gpt-4o-mini");
  const [prompt, setPrompt] = useState(""); // New prompt state
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
    formData.append("name", name);
    formData.append("model", model);
    formData.append("prompt", prompt); // Add prompt to formData

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

      const max_id = response.data.max_id || 0;
      const metaResponse = await storeFileMeta(name, max_id);

      setUploadedFiles((prev) => [
        { name, max_id, docId: metaResponse.$id },
        ...prev,
      ]);
      setStatus("✅ Upload successful and metadata saved.");
      setName("");
      setFile(null);
      setPrompt(""); // Clear prompt after upload
    } catch (error) {
      console.error(error);
      setStatus("❌ Upload or saving metadata failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name, max_id) => {
    const confirm = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirm) return;

    try {
      await axios.post(`${server}/delete`, {
        name: `${name}`,
        max_id: parseInt(max_id),
      });

      const fileToDelete = uploadedFiles.find((f) => f.name === name);
      if (fileToDelete?.docId) {
        await deleteFileMeta(fileToDelete.docId);
      }

      setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
      setStatus("🗑️ File deleted from backend and database.");
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("❌ Delete failed.");
    }
  };

  const loadFiles = async (pageNumber) => {
    try {
      const documents = await fetchAllFiles(pageNumber * LIMIT, LIMIT);
      const files = documents.map((doc) => ({
        name: doc.NAME,
        max_id: doc.MAX_SIZE,
        docId: doc.$id,
      }));

      setUploadedFiles(files);
      setHasMore(files.length === LIMIT);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setStatus("❌ Failed to load uploaded files.");
    }
  };

  useEffect(() => {
    loadFiles(page);
  }, [page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 0));

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

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="input-select"
        >
          {Object.entries(modelCosts).map(([modelKey, cost]) => (
            <option key={modelKey} value={modelKey}>
              {modelKey} ({cost})
            </option>
          ))}
        </select>

        <textarea
          placeholder="Enter prompt for processing (use '{{chunk}}' as placeholder for chunk text)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-textarea"
          rows={4}
          style={{ marginTop: "10px", resize: "vertical" }}
        />

        <input
          type="file"
          accept={fileType === "pdf" ? ".pdf" : ".txt"}
          onChange={handleFileChange}
          className="input-file"
        />

        <button onClick={handleUpload} disabled={loading} className="btn-upload">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {status && <p className="status-msg">{status}</p>}

      <div className="uploaded-list">
        {uploadedFiles.length === 0 && <p>No files found.</p>}
        {uploadedFiles.map((file, idx) => (
          <div key={idx} className="file-card">
            <div className="file-info">
              <strong>{file.name}</strong>
              <p>max_id: {file.max_id}</p>
            </div>
            <button
              className="btn-delete"
              onClick={() => handleDelete(file.name, file.max_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 0}>
          ◀ Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page + 1}</span>
        <button onClick={handleNextPage} disabled={!hasMore}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default PDFManager;
