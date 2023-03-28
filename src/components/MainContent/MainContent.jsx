import React from "react";
import Crop from "../Crop/Crop";

const MainContent = ({
  imgSrc,
  crop,
  setCrop,
  setCompletedCrop,
  aspect,
  isCrop,
  setIsCrop,
  imgRef,
  scale,
  rotate,
  flipHorizontal,
  flipVertical,
  completedCrop,
  previewCanvasRef,
  onImageLoad,
}) => {
  const handleOnChange = (c, percentCrop) => {
    setCrop(percentCrop);
    setCompletedCrop(c);
  };

  return (
    <div className="Crop-Controls-Main">
      <div className="Crop-Controls">
        <div className="Crop-Controls-Wrapper">
          {!!imgSrc && (
            <div className="Crop-Section-Wrapper">
              <Crop
                crop={crop}
                onChange={(c, percentCrop) => handleOnChange(c, percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                isCrop={isCrop}
                setIsCrop={setIsCrop}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg) scaleX(${
                      flipHorizontal ? -1 : 1
                    }) scaleY(${flipVertical ? -1 : 1})`,
                  }}
                  onLoad={onImageLoad}
                />
              </Crop>
            </div>
          )}

          <div>
            {!!completedCrop && isCrop && (
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
