import React from "react";
import "./index.css";
import CropApp from "./cropApp";

const Canvas = (props) => {
  return (
    <div className='canvas-main'>
      <div className='canvas-card'>
        <CropApp />
      </div>
    </div>
  );
};

export default Canvas;
