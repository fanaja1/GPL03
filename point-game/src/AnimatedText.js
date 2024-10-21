import React, { useEffect } from 'react';
import './styles/AnimatedText.css';

const colorsHex = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFFF00",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#00FFFF",
  "#00FF00",
  "#40E0D0",
  "#808080",
];

function AnimatedText() {
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll('.animated-text span').forEach(span => {
        const randomColor = colorsHex[Math.floor(Math.random() * colorsHex.length)];
        span.style.color = randomColor;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-text">
      {Array.from("Point.Game").map((letter, index) => (
        <span key={index}>{letter}</span>
      ))}
    </div>
  );
}

export default AnimatedText;
