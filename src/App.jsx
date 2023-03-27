import React, { useState, useRef } from "react";
import { canvasPreview } from "./components/canvasPreview";
import {
  makeAspectCrop,
  centerCrop,
  useDebounceEffect,
} from "./constant/utils";
import "./styles/index.css";
import FileUpload from "./components/FileUpload/FileUpload";
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/MainContent/MainContent";

function App() {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isCrop, setIsCrop] = useState(false);
  const [aspect, setAspect] = useState(16 / 9);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  // make and center a % aspect crop
  const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate, isCrop]
  );

  const handleToggleAspectClick = () => {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  };

  return (
    <div className="App">
      <div className="main-layout">
        {!!imgSrc ? (
          <>
            <Sidebar
              imgSrc={imgSrc}
              scaleValue={scale}
              setScale={setScale}
              rotateValue={rotate}
              setRotate={setRotate}
              flipHorizontal={flipHorizontal}
              setFlipHorizontal={setFlipHorizontal}
              flipVertical={flipVertical}
              setFlipVertical={setFlipVertical}
              aspect={aspect}
              handleToggleAspectClick={handleToggleAspectClick}
              setIsCrop={setIsCrop}
            />
            <MainContent
              scale={scale}
              rotate={rotate}
              setFlipHorizontal={setFlipHorizontal}
              setFlipVertical={setFlipVertical}
              crop={crop}
              setCrop={setCrop}
              setCompletedCrop={setCompletedCrop}
              imgSrc={imgSrc}
              aspect={aspect}
              isCrop={isCrop}
              setIsCrop={setIsCrop}
              imgRef={imgRef}
              flipHorizontal={flipHorizontal}
              flipVertical={flipVertical}
              completedCrop={completedCrop}
              previewCanvasRef={previewCanvasRef}
              onImageLoad={onImageLoad}
            />
          </>
        ) : (
          <FileUpload onSelectFile={onSelectFile} />
        )}
      </div>
    </div>
  );
}

export default App;
