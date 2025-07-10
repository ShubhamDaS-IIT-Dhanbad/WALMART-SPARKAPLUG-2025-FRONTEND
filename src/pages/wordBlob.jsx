import React from "react";
import { Wordcloud } from "@visx/wordcloud";
import { scaleLog } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const WordBlob = ({ top_mentions }) => {
  const words = top_mentions.map((item) => ({
    text: item.name,
    value: item.count,
  }));

  const fontScale = scaleLog()
    .domain([Math.min(...words.map((d) => d.value)), Math.max(...words.map((d) => d.value))])
    .range([20, 70]);

  return (
    <svg width={800} height={400}>
      <Wordcloud
        words={words}
        width={800}
        height={400}
        font="Impact"
        fontSize={(d) => fontScale(d.value)}
        padding={2}
        spiral="rectangular" // makes layout denser and more blob-like
        rotate={() => (Math.random() > 0.5 ? 0 : 90)}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <text
              key={w.text}
              textAnchor="middle"
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
              fill={schemeCategory10[i % 10]}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {w.text}
            </text>
          ))
        }
      </Wordcloud>
    </svg>
  );
};

export default WordBlob;
