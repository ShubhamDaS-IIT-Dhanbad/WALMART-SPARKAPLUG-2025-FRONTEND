import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCharts from "./singleProductChart.jsx";
import "../styles/singleProductPage.css";


const server = "https://walmart-sparkaplug-2025-backend-1.onrender.com";

// const server = "http://127.0.0.1:8000";

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
        const res = await axios.post(
          `${server}/singleproduct/analytics `,
          {
            product_id: productId,
            product_url: productUrl,
          }
        );
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

 

  if (loading) return <div>Loading product info...</div>;
  if (!productData) return <div>No product data found.</div>;
  console.log(productData)
  return (
    <>
      
      <>
        <ProductCharts
          ratingDist={productData.ratings_distribution}
          data={productData}
          productData={productData}
        />
      </>
    </>
  );
};

export default SingleProductPage;
