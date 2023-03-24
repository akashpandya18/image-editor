import React from "react";

const Zoom = ({ value, imgSrc, setScale }) => {
  return (
    <div>
      <label htmlFor="scale-input">Scale: </label>
      <input
        id="scale-input"
        type="number"
        step="0.1"
        value={value}
        disabled={!imgSrc}
        onChange={(e) => setScale(Number(e.target.value))}
      />
    </div>
  );
};

export default Zoom;
