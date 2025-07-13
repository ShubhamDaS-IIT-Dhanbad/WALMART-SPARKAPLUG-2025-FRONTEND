import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/linkInputForm.css';

const App = () => {
  const [productLinks, setProductLinks] = useState(['']);
  const navigate = useNavigate();

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...productLinks];
    updatedLinks[index] = value;
    setProductLinks(updatedLinks);
  };

  const handleAddLink = () => {
    if (productLinks.length < 5) {
      setProductLinks([...productLinks, '']);
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

  const validLinks = productLinks.filter((link) => link.trim() !== '');

  const handleAction = (e, actionType) => {
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
      if (actionType === 'chat') {
        window.open(`/compare/chat?${params.toString()}`, '_blank');
      } else if (actionType === 'compare') {
        window.open(`/compare?${params.toString()}`, '_blank');
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">WALMART NEURO CART</h1>
          <p className="header-subtitle">
           Next‑Gen AI Insights for Walmart Products—Compare, Analyze, Decide.
          </p>
        </div>
      </header>

      <main className="main-content">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">Enter Product Links</h2>
            <p className="form-description">
              Add up to 3 Walmart product links to compare or chat with our AI
            </p>
          </div>

          <form className="link-form">
            {productLinks.map((link, index) => {
              const productId = extractProductId(link);
              const encodedUrl = encodeURIComponent(link);

              return (
                <div key={index} className="link-input-wrapper">
                  <div className="link-input-group">
                    <input
                      type="url"
                      placeholder={`Walmart Product Link #${index + 1}`}
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      className="link-input"
                      required
                    />
                    {productLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="remove-btn"
                        title="Remove Link"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {productId && (
                    // <a
                    //   href={`/single/product/${productId}?url=${encodedUrl}`}
                    //   className="visual-link"
                    //   target="_blank"
                    //   rel="noopener noreferrer"
                    // >
                    //   View Visual Analysis #{index + 1}
                    // </a>
                    <a
                    href={`/single/product/${productId}?url=${encodedUrl}`}
                target="_blank"
                className="action-btn chat-btn"
                disabled={validLinks.length === 0}
              >
                 View Visual Analysis #{index + 1}
              </a>
                  )}
                </div>
              );
            })}

            {productLinks.length < 5 && (
              <button
                type="button"
                onClick={handleAddLink}
                className="add-link-btn"
              >
                <span className="add-icon">+</span> Add Another Link
              </button>
            )}

            <div className="action-buttons">
              <button
                type="button"
                className="action-btn chat-btn"
                disabled={validLinks.length === 0}
                onClick={(e) => handleAction(e, 'chat')}
              >
                Chat with AI
              </button>
              <button
                type="button"
                className="action-btn compare-btn"
                disabled={validLinks.length < 5}
                onClick={(e) => handleAction(e, 'compare')}
              >
                Compare Products
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="footer">
        <p>Walmart Sparkathon</p>
      </footer>
    </div>
  );
};

export default App;