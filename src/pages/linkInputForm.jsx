import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/linkInputForm.css";

const LinkInputForm = ({ onSubmit, onChat }) => {
  const [productLinks, setProductLinks] = useState([""]);
  const navigate = useNavigate();

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...productLinks];
    updatedLinks[index] = value;
    setProductLinks(updatedLinks);
  };

  const handleAddLink = () => {
    if (productLinks.length < 3) {
      setProductLinks([...productLinks, ""]);
    }
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = productLinks.filter((_, i) => i !== index);
    setProductLinks(updatedLinks);
  };

  const extractProductId = (url) => {
    const match = url.match(/\/(\d+)(\?|$)/);
    return match ? match[1] : null;
  };

  const validLinks = productLinks.filter((link) => link.trim() !== "");

  const handleCompareProducts = (e) => {
    e.preventDefault();
    if (validLinks.length) {
      const params = new URLSearchParams();
      validLinks.forEach((link, index) => {
        const productId = extractProductId(link);
        if (productId) {
          params.append(`id${index + 1}`, productId);
          params.append(`url${index + 1}`, link);
        }
      });
      window.open(`/compare?${params.toString()}`, "_blank");
    }
  };

  const handleChatAboutProducts = (e) => {
  e.preventDefault();

  if (validLinks.length) {
    const params = new URLSearchParams();

    validLinks.forEach((link, index) => {
      const productId = extractProductId(link);
      if (productId) {
        params.append(`id${index + 1}`, productId);
        params.append(`url${index + 1}`, link);
      }
    });

    window.open(`/compare/chat?${params.toString()}`, "_blank");

    // Optional: trigger any additional chat logic
    onChat(validLinks);
  }
};


  return (
    <form className="link-input-form">
      <h2 className="form-title">Walmart Product Link Analyzer</h2>

      {productLinks.map((link, index) => {
        const productId = extractProductId(link);
        const encodedUrl = encodeURIComponent(link);

        return (
          <div key={index} className="link-input-group">
            <input
              type="url"
              required
              placeholder={`Product Link #${index + 1}`}
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              className="product-link-input"
            />
            {productLinks.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="remove-link-btn"
              >
                ✕
              </button>
            )}
            {productId && (
              <a
                href={`/single/product/${productId}?url=${encodedUrl}`}
                className="eda-visual-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visual EDA #{index + 1}
              </a>
            )}
          </div>
        );
      })}

      {productLinks.length < 3 && (
        <button type="button" onClick={handleAddLink} className="add-link-btn">
          + Add Link
        </button>
      )}

      <div className="form-action-buttons">
        <button
          type="button"
          className="action-btn"
          disabled={validLinks.length === 0}
          onClick={handleCompareProducts}
        >
          Compare Products
        </button>

        <button
          type="button"
          className="action-btn"
          disabled={validLinks.length === 0}
          onClick={handleChatAboutProducts}
        >
          Chat About Products
        </button>
      </div>
    </form>
  );
};

export default LinkInputForm;
