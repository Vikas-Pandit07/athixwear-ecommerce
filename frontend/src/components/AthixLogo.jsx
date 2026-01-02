import React from "react";

const AthixLogo = ({ color = "#D4AF37", width = "250" }) => {
  return (
    <svg
      width={width}
      viewBox="0 0 400 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fill: color,
          fontSize: "42px",
          fontWeight: "900",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "12px",
          textTransform: "uppercase",
        }}
      >
        Athixwear
      </text>
    </svg>
  );
};

export default AthixLogo;
