import React, { useCallback, useRef } from "react";
import { useState } from "react";
import Heading from "../Common/Heading";
import "./CropImage.css";
import { defaultCrop } from "../../constant/utils";
import { useEffect } from "react";

const CropImage = ({
  aspect,
  handleToggleAspectClick,
  completedCrop,
  setCompletedCrop,
}) => {
  const initialCrops = {
    width: defaultCrop.width,
    height: defaultCrop.height,
    x: defaultCrop.x,
    y: defaultCrop.y,
    unit: defaultCrop.unit,
  };

  const [cropValues, setCropValues] = useState(initialCrops);
  const prevCropValues = useRef(initialCrops);

  useEffect(() => {
    const { width, height, x, y } = completedCrop;

    setCropValues((prev) => ({
      ...prev,
      width: Math.floor(width),
      height: Math.floor(height),
      x: Math.floor(x),
      y: Math.floor(y),
    }));
  }, [completedCrop]);

  // useEffect(() => {
  //   if (cropValues !== prevCropValues.current) {
  //     setCompletedCrop(cropValues);
  //     prevCropValues.current = cropValues;
  //   }
  // }, [cropValues, setCompletedCrop]);

  const handleChange = (e) => {
    setCropValues((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value),
    }));
  };

  return (
    <div>
      <div className="crop-tab-main">
        <div className="rectangle-heading-wrapper">
          <Heading label={"Crop Rectangle"} />
        </div>
        <div className="crop-inputs">
          <div className="crop-height-width">
            <div className="crop-input-container">
              <div className="crop-input-wrapper">
                <div className="crop-input-label">
                  <span>Width</span>
                </div>
                <input
                  name="width"
                  type="number"
                  className="crop-input-box select-all"
                  min={0}
                  onChange={handleChange}
                  value={cropValues.width}
                />
              </div>
              <div className="crop-input-wrapper">
                <div className="crop-input-label">
                  <span>Height</span>
                </div>
                <input
                  name="height"
                  type="number"
                  className="crop-input-box select-all"
                  min={0}
                  onChange={handleChange}
                  value={cropValues.height}
                />
              </div>
            </div>
          </div>
          <div className="crop-aspect-ratio">
            <button onClick={handleToggleAspectClick}>
              Toggle aspect {aspect ? "off" : "on"}
            </button>
          </div>
          <div className="position-heading-wrapper">
            <Heading label={"Crop Position"} />
          </div>
          <div className="position-inputs">
            <div className="crop-input-container">
              <div className="crop-input-wrapper">
                <div className="crop-input-label">
                  <span>Position (X)</span>
                </div>
                <input
                  name="x"
                  type="number"
                  className="crop-input-box select-all"
                  min={0}
                  onChange={handleChange}
                  value={cropValues.x}
                />
              </div>
              <div className="crop-input-wrapper">
                <div className="crop-input-label">
                  <span>Position (Y)</span>
                </div>
                <input
                  name="y"
                  type="number"
                  className="crop-input-box select-all"
                  min={0}
                  onChange={handleChange}
                  value={cropValues.y}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="crop-btns"></div>
      </div>
    </div>
  );
};

export default CropImage;
