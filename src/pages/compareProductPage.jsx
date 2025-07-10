import React from "react";
import { useLocation } from "react-router-dom";

const CompareProductPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract all product IDs and URLs from query params
  const products = [];
  for (let i = 1; i <= 3; i++) {
    const id = searchParams.get(`id${i}`);
    const url = searchParams.get(`url${i}`);
    if (id && url) {
      products.push({ id, url });
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
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
