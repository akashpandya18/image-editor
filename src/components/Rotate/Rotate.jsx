import React from "react";

const Rotate = ({ value, imgSrc, setRotate }) => {
  return (
    <div>
      <label htmlFor="rotate-input">Rotate: </label>
      <input
        id="rotate-input"
        type="number"
        value={value}
        disabled={!imgSrc}
        onChange={(e) =>
          setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
        }
      />
    </div>
  );
};

export default Rotate;
