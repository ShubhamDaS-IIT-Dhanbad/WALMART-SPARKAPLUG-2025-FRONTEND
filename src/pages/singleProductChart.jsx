import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from "recharts";
import ReactMarkdown from "react-markdown";
// import WordBlob from "./wordBlob";
import "../styles/productChart.css";

const COLORS = ["#4CAF50", "#F44336"];

const calculateStats = (ratingDist) => {
  const ratings = [];
  for (let i = 0; i < ratingDist.length; i++) {
    const { starts, count } = ratingDist[i];
    for (let j = 0; j < count; j++) ratings.push(Number(starts));
  }

  ratings.sort((a, b) => a - b);
  const total = ratings.length;
  if (total === 0) return { average: "-", median: "-", mode: "-" };

  const sum = ratings.reduce((a, b) => a + b, 0);
  const average = (sum / total).toFixed(2);
  const median =
    total % 2 === 0
      ? ((ratings[total / 2 - 1] + ratings[total / 2]) / 2).toFixed(2)
      : ratings[Math.floor(total / 2)].toFixed(2);

  const modeMap = {};
  let mode = ratings[0],
    maxCount = 0;
  for (let r of ratings) {
    modeMap[r] = (modeMap[r] || 0) + 1;
    if (modeMap[r] > maxCount) {
      maxCount = modeMap[r];
      mode = r;
    }
  }

  return { average, median, mode };
};

const ProductCharts = ({ productData, ratingDist, data }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const handleChatClick = () => {
    
    window.open(`/compare/chat?id1=${productId}`, "_blank");

    // navigate(`/chat/${productId}?title=${productData.title}`);
  };

  const customerReviews = data.customer_reviews || [];
  const sentimentOverTime =
    data.customer_reviews?.reduce((acc, review) => {
      const date = new Date(review.review_submission_time)
        .toISOString()
        .split("T")[0];
      const existing = acc.find((item) => item.date === date);
      if (!existing) {
        acc.push({
          date,
          positive: review.sentiment === "positive" ? 1 : 0,
          negative: review.sentiment === "negative" ? 1 : 0,
        });
      } else {
        if (review.sentiment === "positive") existing.positive++;
        if (review.sentiment === "negative") existing.negative++;
      }
      return acc;
    }, []) || [];

  const positiveCount = customerReviews.filter(
    (x) => x.sentiment === "positive"
  ).length;
  const negativeCount = customerReviews.filter(
    (x) => x.sentiment === "negative"
  ).length;

  const { average, median, mode } = calculateStats(ratingDist);

  const renderReviewCard = (review, isPositive) => {
    if (!review) return null;
    return (
      <div className={`review-card ${isPositive ? "positive" : "negative"}`}>
        <h4>
          {isPositive ? "🌟 Top Positive Review" : "⚠️ Top Negative Review"}
        </h4>
        <p className="review-title">{review.title}</p>
        <p className="review-meta">
          by {review.user_nickname} on {review.review_submission_time}
        </p>
        <p>{review.text}</p>
        <p>
          👍 {review.positive_feedback} | 👎 {review.negative_feedback}
        </p>
        <p>⭐ {review.rating}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="product-container">
        <div className="pc1">PRODUCT ANALYSIS BOARD FOR USER</div>
        <div className="pc2">
          <div className="pc2-l">
            <div className="pc2-l1">{productData.title}</div>
            <div className="pc2-l2">
              <p className="pc2-l2-t">Product ID</p>
              <p className="pc2-l2-d">{productId}</p>
            </div>
            <div className="pc2-l2">
              <p className="pc2-l2-t">SUMMARIZED DESCRIPTION</p>
              <p className="pc2-l2-d">
                <ReactMarkdown>{productData.short_description}</ReactMarkdown>
              </p>
            </div>
            <div className="pc2-l2">
              <p className="pc2-l2-t">PRICE</p>
              <p className="pc2-l2-d">
                {productData.price_map[1] || "N/A"}{" "}
                {productData.price_map[2].price || "N/A"}
              </p>
            </div>

            <div className="pc2-l2-rd-p">
              <div className="pc2-l2-rd">
                <p className="pc2-l2-t-rd">AVERAGE RATING</p>
                <p className="pc2-l2-d-rd">⭐ {average}</p>
              </div>
              <div className="pc2-l2-rd">
                <p className="pc2-l2-t-rd">MEDIAN RATING</p>
                <p className="pc2-l2-d-rd">⭐ {median}</p>
              </div>
              <div className="pc2-l2-rd">
                <p className="pc2-l2-t-rd">MODE RATING</p>
                <p className="pc2-l2-d-rd">⭐ {mode}</p>
              </div>
            </div>

            <div className="pc2-l2-rd-p" style={{ marginTop: "30px" }}>
              <div className="pc2-l2-rd">
                <p className="pc2-l2-t-rd">TOTAL REVIEWS ON THIS PRODUCT</p>
                <p className="pc2-l2-d-rd">{productData.reviews_count}</p>
              </div>
              <div className="pc2-l2-rd">
                <p className="pc2-l2-t-rd">TOTAL POSITIVE REVIEW</p>
                <p className="pc2-l2-d-rd">40</p>
              </div>
              <div className="pc2-l2-rd">
                <p className="pc2-l2-t-rd">TOTAL NEGATIVE REVIEW</p>
                <p className="pc2-l2-d-rd">60</p>
              </div>
            </div>

            <div className="pc2-l2">
              <p className="pc2-l2-t">SATISFACTION SCORE</p>
              <p className="pc2-l2-d">90 %</p>
            </div>

            <button className="chat-button" onClick={handleChatClick}>
              💬 Chat about this product
            </button>
          </div>
          <div className="pc2-r">
            <img className="pc2-r-i" src={productData.images[0]} />
          </div>
        </div>
      </div>

      <div className="pc3-l2">
        <div className="spec-title">FEATURES</div>
        <ul className="spec-list">
          {(data.specifications[0].value?.split(",") || []).map(
            (feature, index) => (
              <li key={index} className="spec-item">
                <span className="spec-name">✔️ {feature.trim()}</span>
              </li>
            )
          )}
        </ul>
      </div>

      <div className="charts-column">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="cc1">
            <h3>Ratings Distribution</h3>
            <BarChart width={600} height={300} data={ratingDist}>
              <XAxis
                dataKey="starts"
                label={{ value: "Stars", position: "insideBottom", dy: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f3fa29ff" />
            </BarChart>
          </div>

          <div className="cc1">
            <h3>Price vs Sentiment</h3>
            <BarChart
              width={500}
              height={300}
              data={[
                {
                  price: data.price_map?.price || "N/A",
                  Positive: positiveCount,
                  Negative: negativeCount,
                },
              ]}
            >
              <XAxis
                dataKey="price"
                label={{ value: "Price ($)", position: "insideBottom", dy: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Positive" fill="#4CAF50" />
              <Bar dataKey="Negative" fill="#F44336" />
            </BarChart>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="cc1" style={{ marginTop: "60px" }}>
            <h3>Sentiment Pie Chart</h3>

            <PieChart width={300} height={300}>
              <Pie
                data={[
                  { name: "Positive", value: positiveCount },
                  { name: "Negative", value: negativeCount },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                <Cell fill="#4CAF50" />
                <Cell fill="#F44336" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="cc1">
            <h3>Sentiment Over Time</h3>
            <LineChart width={600} height={300} data={sentimentOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#4CAF50"
                name="Positive Reviews"
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#F44336"
                name="Negative Reviews"
              />
            </LineChart>
          </div>
        </div>

        <div className="review-highlight">
          {renderReviewCard(data.top_positive_review, true)}
          {renderReviewCard(data.top_negative_review, false)}
        </div>

        {/* <div className="wb">
          <WordBlob top_mentions={data.top_mentions} />
        </div> */}

        <div className="urs"> 
          <div className="urs-1">USER REVIEW WITH SENTIMENT</div>
          <ul className="reviews-list">
            {customerReviews.map((review, idx) => (
              <li
                key={idx}
                className={`review-item ${
                  review.sentiment === "positive" ? "positive" : "negative"
                }`}
              >
                <p>
                  <strong>
                    {review.sentimentType} ({review.confidence}%)
                  </strong>
                  : {review.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductCharts;
