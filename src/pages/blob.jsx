import React, { useRef, useEffect, useState } from "react";

const WordBlob = ({ mentions }) => {
  const containerRef = useRef(null);
  const [placedWords, setPlacedWords] = useState([]);

  const maxCount = Math.max(...mentions.map((m) => m.count || 1));

  useEffect(() => {
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const newPlacedWords = [];

    const doesOverlap = (a, b) => {
      return (
        a.left < b.left + b.width &&
        a.left + a.width > b.left &&
        a.top < b.top + b.height &&
        a.top + a.height > b.top
      );
    };

    const tryPlaceWord = (mention, fontSize, maxTries = 100) => {
      const span = document.createElement("span");
      span.style.position = "absolute";
      span.style.fontSize = `${fontSize}px`;
      span.style.fontFamily = "Segoe UI";
      span.style.fontWeight = "bold";
      span.style.whiteSpace = "nowrap";
      span.innerText = mention.name;
      container.appendChild(span);

      const { offsetWidth: wordWidth, offsetHeight: wordHeight } = span;
      container.removeChild(span);

      for (let i = 0; i < maxTries; i++) {
        const left = Math.random() * (containerWidth - wordWidth);
        const top = Math.random() * (containerHeight - wordHeight);

        const wordBox = { left, top, width: wordWidth, height: wordHeight };

        const overlapping = newPlacedWords.some((placed) =>
          doesOverlap(placed, wordBox)
        );

        if (!overlapping) {
          newPlacedWords.push({ ...wordBox, ...mention, fontSize });
          return;
        }
      }

      // Shrink and try again
      if (fontSize > 10) {
        tryPlaceWord(mention, fontSize - 2);
      }
    };

    mentions.forEach((mention) => {
      const fontSize = 14 + (mention.count / maxCount) * 36;
      tryPlaceWord(mention, fontSize);
    });

    setPlacedWords(newPlacedWords);
  }, [mentions]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "700px",
        height: "400px",
        margin: "2rem auto",
        background: "#fdfdfd",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      {placedWords.map((word, index) => (
        <span
          key={index}
          style={{
            position: "absolute",
            left: `${word.left}px`,
            top: `${word.top}px`,
            fontSize: `${word.fontSize}px`,
            color: `hsl(${Math.random() * 360}, 60%, 40%)`,
            fontWeight: 600,
            whiteSpace: "nowrap",
            fontFamily: "Segoe UI, sans-serif",
            transition: "transform 0.2s ease, color 0.3s ease",
            cursor: "default",
            userSelect: "none",
          }}
        >
          {word.name}
        </span>
      ))}
    </div>
  );
};

export default WordBlob;
