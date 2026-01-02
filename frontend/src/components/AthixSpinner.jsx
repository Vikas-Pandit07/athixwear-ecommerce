import React from "react";
import "../assets/AthixSpinner.css";

const AthixSpinner = ({ size = "180px" }) => {
  return (
    <div className="spinner-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="spinning-svg">
        <defs>
          <path id="circlePath" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
        </defs>
        <text className="spinning-text">
          <textPath xlinkHref="#circlePath">
            ATHIXWEAR • PREMIUM QUALITY • EST 2025 • HUSTLE FOR DREAMS •
          </textPath>
        </text>
        <text x="100" y="120" className="center-letter">A</text>
      </svg>
    </div>
  );
};

export default AthixSpinner;