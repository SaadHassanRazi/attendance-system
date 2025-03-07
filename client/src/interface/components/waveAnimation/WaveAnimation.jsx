import React from "react";
import "../css/waveAnimation.css"; // Assuming the CSS is in this file

const WaveAnimation = () => {
  return (
    <div className="wave-animation wrap">
      <svg
        width="100%"
        height="300px"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          className="curve"
          stroke="#D6EFBA"
          fill="none"
          fillRule="evenodd"
          transform="translate(0,90)"
        >
          <path
            id="glowPath"
            d="M 0, 60 S 300, -60, 600, 60, 800, -120, 1200 60"
          />
          <path d="M 0, 60 S 200, -60, 400, 60, 900, -120, 1200 60" />
          <path d="M 0, 60 S 200, -70, 400, 70, 800, -120, 1200 60" />
          <path d="M 0, 60 S 200, -60, 400, 80, 600, -120, 1200 60" />
          <path d="M 0, 60 S 300, -60, 600, 60, 800, -120, 1200 60" />
          <path d="M 0, 60 S 200, -70, 400, 60, 800, -120, 1200 60" />
        </g>
      </svg>
      <svg
        width="100%"
        height="200px"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          className="curve"
          stroke="#D6EFBA"
          fill="none"
          fillRule="evenodd"
          transform="translate(0,90)"
        >
          <path
            id="glowPath"
            d="M 0, 60 S 300, -60, 600, 60, 800, -120, 1200 60"
          />
          <path d="M 0, 60 S 200, -60, 400, 60, 900, -120, 1200 60" />
          <path d="M 0, 60 S 200, -70, 400, 70, 800, -120, 1200 60" />
          <path d="M 0, 60 S 200, -60, 400, 80, 600, -120, 1200 60" />
          <path d="M 0, 60 S 300, -60, 600, 60, 800, -120, 1200 60" />
          <path d="M 0, 60 S 200, -70, 400, 60, 800, -120, 1200 60" />
        </g>
      </svg>
    </div>
  );
};

export default WaveAnimation;
