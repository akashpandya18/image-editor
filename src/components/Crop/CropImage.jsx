import React from "react";
import Heading from "../Common/Heading";
import "./CropImage.css";

const CropImage = ({ aspect, handleToggleAspectClick, imgSrc }) => {
  return (
    <div>
      <div className="crop-tab-main">
        <div className="rectangle-heading-wrapper">
          <Heading label={"Crop Rectangle"} />
        </div>
        <div className="crop-inputs">
          <div className="crop-height-width"></div>
          <div className="crop-aspect-ratio">
            <button onClick={handleToggleAspectClick}>
              Toggle aspect {aspect ? "off" : "on"}
            </button>
          </div>
          <div className="position-heading-wrapper">
            <Heading label={"Crop Position"} />
          </div>
          <div className="position-inputs"></div>
        </div>
        <div className="crop-btns"></div>
      </div>
    </div>
  );
};

export default CropImage;
