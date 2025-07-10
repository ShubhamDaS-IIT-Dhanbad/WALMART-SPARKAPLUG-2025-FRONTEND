import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/linkInputForm.css";

const LinkInputForm = ({ onSubmit, onChat }) => {
  const [links, setLinks] = useState([""]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
  };

  const handleAddInput = () => {
    if (links.length < 3) {
      setLinks([...links, ""]);
    }
  };

  const handleRemove = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
  };

  const extractProductId = (url) => {
    const match = url.match(/\/(\d+)(\?|$)/);
    return match ? match[1] : null;
  };

  const nonEmptyLinks = links.filter((link) => link.trim() !== "");

  const handleCompare = (e) => {
    e.preventDefault();
    if (nonEmptyLinks.length) {
      const params = new URLSearchParams();
      nonEmptyLinks.forEach((link, index) => {
        const productId = extractProductId(link);
        if (productId) {
          params.append(`id${index + 1}`, productId);
          params.append(`url${index + 1}`, link);
        }
      });window.open(`/compare?${params.toString()}`, "_blank");

    }
  };

  const handleChat = (e) => {
    e.preventDefault();
    if (nonEmptyLinks.length) {
      onChat(nonEmptyLinks);
    }
  };

  return (
    <form className="link-form">
      <h2 className="form-heading">Enter Walmart Product Links</h2>

      {links.map((link, index) => {
        const productId = extractProductId(link);
        const encodedUrl = encodeURIComponent(link);

        return (
          <div key={index} className="input-row">
            <input
              type="url"
              required
              placeholder={`Enter Link #${index + 1}`}
              value={link}
              onChange={(e) => handleChange(index, e.target.value)}
              className="link-input"
            />
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="remove-btn"
              >
                ✕
              </button>
            )}
            {productId && (
              <a
                href={`/single/product/${productId}?url=${encodedUrl}`}
                className="eda-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visual EDA of product {index + 1}
              </a>
            )}
          </div>
        );
      })}

      {links.length < 3 && (
        <button type="button" onClick={handleAddInput} className="add-btn">
          + Add another link
        </button>
      )}

      <button
        type="button"
        className="submit-btn"
        disabled={nonEmptyLinks.length === 0}
        onClick={handleCompare}
      >
        COMPARE AGGREGATION
      </button>

      <button
        type="button"
        className="submit-btn"
        disabled={nonEmptyLinks.length === 0}
        onClick={handleChat}
      >
        CHAT ABOUT PRODUCT
      </button>
    </form>
  );
};

export default LinkInputForm;
