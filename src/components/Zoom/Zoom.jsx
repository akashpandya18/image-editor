import React from "react";
import "./Zoom.css";

const Zoom = ({ value, imgSrc, setScale }) => {
  return (
    <div className="zoom-main">
      <label htmlFor="scale-input">Zoom: </label>
      <input
        id="scale-input"
        type="range"
        step="0.1"
        value={value}
        disabled={!imgSrc}
        min={1}
        max={5}
        onChange={(e) => setScale(Number(e.target.value))}
      />
    </div>
  );
};

export default Zoom;
