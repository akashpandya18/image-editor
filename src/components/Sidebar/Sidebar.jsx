import React, { useState } from "react";
import { useEffect } from "react";
import Heading from "../Common/Heading";
import CropImage from "../Crop/CropImage";
import Flip from "../Flip/Flip";
import Rotate from "../Rotate/Rotate";
import CropTab from "../Tabs/CropTab";
import FlipRotateTab from "../Tabs/FlipRotateTab";
import ResizeTab from "../Tabs/ResizeTab";
import Zoom from "../Zoom/Zoom";
import "./Sidebar.css";

const Sidebar = ({
  imgSrc,
  scaleValue,
  setScale,
  rotateValue,
  setRotate,
  flipVertical,
  setFlipVertical,
  flipHorizontal,
  setFlipHorizontal,
  aspect,
  handleToggleAspectClick,
  setIsCrop,
  completedCrop,
  setCompletedCrop,
}) => {
  const [activeTab, setActiveTab] = useState("resize");

  useEffect(() => {
    if (activeTab === "crop") {
      setIsCrop(true);
    } else {
      setIsCrop(false);
    }
  }, [activeTab]);

  return (
    <div className="sider-bar-main">
      <div className="sider-bar-wrapper">
        <div>
          <div className="tabs-main">
            <div className="tabs-wrapper">
              {/* Resize */}
              <div
                className={`tab ${activeTab === "resize" ? "active" : ""}`}
                data-testid="resize"
                onClick={() => setActiveTab("resize")}
              >
                <ResizeTab />
              </div>

              {/* Crop */}
              <div
                className={`tab ${activeTab === "crop" ? "active" : ""}`}
                data-testid="crop"
                onClick={() => setActiveTab("crop")}
              >
                <CropTab />
              </div>

              {/* Flip & Rotate */}
              <div
                className={`tab ${activeTab === "flip" ? "active" : ""}`}
                data-testid="flip"
                onClick={() => setActiveTab("flip")}
              >
                <FlipRotateTab />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="tab-contents">
          <div className="tab-contents-main">
            <div className="tab-contents-inner">
              {activeTab === "resize" ? (
                <>
                  <Zoom
                    value={scaleValue}
                    imgSrc={imgSrc}
                    setScale={setScale}
                  />
                  <p>Zoom x {scaleValue}</p>
                </>
              ) : activeTab === "crop" ? (
                <CropImage
                  aspect={aspect}
                  handleToggleAspectClick={handleToggleAspectClick}
                  completedCrop={completedCrop}
                  setCompletedCrop={setCompletedCrop}
                />
              ) : (
                <div className="tab-rotate-wrapper">
                  <div className="rotate-main">
                    <Heading label={"Flip Image"} />
                    <div className="rotate-btns">
                      <Flip
                        flipVertical={flipVertical}
                        setFlipVertical={setFlipVertical}
                        flipHorizontal={flipHorizontal}
                        setFlipHorizontal={setFlipHorizontal}
                      />
                    </div>
                  </div>

                  <div className="rotate-main">
                    <Heading label={"Rotate Image"} />
                    <div className="rotate-btns">
                      <Rotate
                        value={rotateValue}
                        imgSrc={imgSrc}
                        setRotate={setRotate}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
