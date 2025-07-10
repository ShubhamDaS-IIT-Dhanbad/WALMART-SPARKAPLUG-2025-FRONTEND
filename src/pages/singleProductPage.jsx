import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCharts from "./singleProductChart.jsx";

const SingleProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productUrl = queryParams.get("url");

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.post("http://127.0.0.1:8000/singleproduct/analytics", {
          product_id: productId,
          product_url: productUrl,
        });
        setProductData(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId && productUrl) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId, productUrl]);

  const handleChatClick = () => {
    navigate(`/chat/${productId}`);
  };

  if (loading) return <div>Loading product info...</div>;
  if (!productData) return <div>No product data found.</div>;

  return (
    <div className="product-container" style={{ padding: "2rem" }}>
      <h1>Product EDA: {productData.title}</h1>
      <p><strong>Short Description:</strong> {productData.short_description}</p>
      <p><strong>Product ID:</strong> {productId}</p>
      <p><strong>Price:</strong> {productData.price_map?.priceString || "N/A"}</p>
      <p><strong>Rating:</strong> ⭐ {productData.average_rating}</p>
      <p><strong>Total Reviews:</strong> {productData.reviews_count}</p>
      <p><strong>Satisfaction Score:</strong> {productData.satisfactionScore}%</p>

      <button
        onClick={handleChatClick}
        style={{
          margin: "1rem 0",
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Chat about this product
      </button>

      <ProductCharts ratingDist={productData.ratings_distribution} data={productData} />

      <h3>User Reviews (with Sentiment)</h3>
      {productData.reviews?.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {productData.reviews.map((review, index) => (
            <li
              key={index}
              style={{
                marginBottom: "1rem",
                backgroundColor: review.sentimentType === "Positive" ? "#e8f5e9" : "#ffebee",
                borderLeft: `5px solid ${review.sentimentType === "Positive" ? "#4CAF50" : "#F44336"}`,
                padding: "0.75rem",
                borderRadius: "4px",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>{review.sentimentType} ({review.confidence}%)</strong>: {review.text}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default SingleProductPage;
