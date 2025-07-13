import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CompareProductPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const products = [];
  for (let i = 1; i <= 3; i++) {
    const id = searchParams.get(`id${i}`);
    const url = searchParams.get(`url${i}`);
    if (id && url) {
      products.push({ id, url });
    }
  }

  const LinkInputForm = ({ onChat }) => {
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
        window.open(`/compare/chat?${params.toString()}`, "_blank");
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
        onChat && onChat(validLinks);
      }
    };

    return (
      <form className="link-input-form" style={{ marginBottom: "2rem" }}>
        <h2 className="form-title">Walmart Product Link Analyzer</h2>

        {productLinks.map((link, index) => {
          const productId = extractProductId(link);
          const encodedUrl = encodeURIComponent(link);

          return (
            <div key={index} className="link-input-group" style={{ marginBottom: "1rem" }}>
              <input
                type="url"
                required
                placeholder={`Product Link #${index + 1}`}
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className="product-link-input"
                style={{ padding: "0.5rem", width: "60%" }}
              />
              {productLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="remove-link-btn"
                  style={{ marginLeft: "0.5rem" }}
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
                  style={{ marginLeft: "1rem" }}
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

        <div className="form-action-buttons" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="action-btn"
            disabled={validLinks.length === 0}
            onClick={handleCompareProducts}
            style={{ marginRight: "1rem" }}
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

  return (
    <div style={{ padding: "2rem" }}>
      <LinkInputForm />

      <h1>Compare Products</h1>
      {products.length === 0 ? (
        <p>No products to compare.</p>
      ) : (
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {products.map((product, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "10px",
                width: "300px",
              }}
            >
              <h3>Product #{index + 1}</h3>
              <p>
                <strong>Product ID:</strong> {product.id}
              </p>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
              >
                View on Walmart
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompareProductPage;
