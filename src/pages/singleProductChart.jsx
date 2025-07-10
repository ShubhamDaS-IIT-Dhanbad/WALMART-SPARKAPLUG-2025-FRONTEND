import React from "react";
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
import WordBlob from './wordBlob'
const COLORS = ["#4CAF50", "#F44336"];
const calculateStats = (ratingDist) => {
  const ratings = [];

  for (let i = 0; i < ratingDist.length; i++) {
    const { starts, count } = ratingDist[i];
    for (let j = 0; j < count; j++) {
      ratings.push(Number(starts));
    }
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


const ProductCharts = ({ ratingDist, data }) => {
  const customerReviews = data.customer_reviews || [];
  const sentimentOverTime = data.sentiment_over_time || [];
  const positiveCount = data.positive_reviews || 0;
  const negativeCount = data.negative_reviews || 0;

  const { average, median, mode } = calculateStats(ratingDist);

  const markdownSummary = `
### 📝 Product Summary

- **Average Rating:** ${average}★
- **Median Rating:** ${median}★
- **Mode Rating:** ${mode}★

### 🔍 Highlights
- **${data.reviews_count || 0}** total reviews analyzed
- **${positiveCount}** positive reviews
- **${negativeCount}** negative reviews

### 📦 Features
${(data.specifications || [])
  .map((feature) => `- ${feature.name || feature} : ${feature.value}`)
  .join("\n")}
`;

  const renderTopReviews = (top_positive_review, top_negative_review) => {
    const renderReviewCard = (review, type) => {
      if (!review) return null;
      const isPositive = type === "positive";

      return (
        <div
          style={{
            borderLeft: `6px solid ${isPositive ? "#4CAF50" : "#F44336"}`,
            backgroundColor: isPositive ? "#e8f5e9" : "#ffebee",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ margin: "0 0 0.5rem" }}>
            {isPositive ? "🌟 Top Positive Review" : "⚠️ Top Negative Review"}
          </h4>
          <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
            {review.title}
          </p>
          <p style={{ fontStyle: "italic", margin: "0.25rem 0" }}>
            by {review.user_nickname} on {review.review_submission_time}
          </p>
          <p style={{ margin: "0.5rem 0" }}>{review.text}</p>
          <p style={{ margin: 0 }}>
            👍 {review.positive_feedback} | 👎 {review.negative_feedback}
          </p>
          <p style={{ marginTop: "0.25rem" }}>⭐ {review.rating}</p>
        </div>
      );
    };

    return (
      <div style={{ marginTop: "2rem" }}>
        <h3>🔍 Top Highlighted Reviews</h3>
        {renderReviewCard(top_positive_review, "positive")}
        {renderReviewCard(top_negative_review, "negative")}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ marginTop: "2rem", flex: 1 }}>
        {console.log(ratingDist)}
        <h3>Ratings Distribution</h3>
        <BarChart
  width={600}
  height={300}
  data={ratingDist.map(({ starts, count }) => ({
    star: starts,
    count: count,
  }))}
>
  <XAxis
    dataKey="star"
    label={{ value: "Stars", position: "insideBottom", dy: 10 }}
  />
  <YAxis />
  <Tooltip />
  <Bar dataKey="count" fill="#4CAF50" />
</BarChart>
          

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

        <h3>User Reviews with Sentiment</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {customerReviews.map((review, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "6px",
                backgroundColor:
                  review.sentimentType === "Positive" ? "#e8f5e9" : "#ffebee",
                borderLeft: `5px solid ${
                  review.sentimentType === "Positive" ? "#4CAF50" : "#F44336"
                }`,
              }}
            >
              <p style={{ margin: 0 }}>
                <strong
                  style={{
                    color:
                      review.sentimentType === "Positive"
                        ? "#4CAF50"
                        : "#F44336",
                  }}
                >
                  {review.sentimentType} ({review.confidence}%)
                </strong>
                : {review.text}
              </p>
            </li>
          ))}
        </ul>

        {renderTopReviews(data.top_positive_review, data.top_negative_review)}

      <WordBlob  top_mentions={data.top_mentions}/>
        <h3>📊 Product Markdown Summary</h3>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <ReactMarkdown>{markdownSummary}</ReactMarkdown>
        </div>
      </div>

      <div style={{ flex: 1 }}></div>jkkjkjkj
    </div>
  );
};

export default ProductCharts;
