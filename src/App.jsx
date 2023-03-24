import React, { useState, useRef } from "react";
import { canvasPreview } from "./components/canvasPreview";
import {
  makeAspectCrop,
  centerCrop,
  useDebounceEffect,
} from "./constant/utils";
import Crop from "./components/Crop/Crop";
import "./styles/index.css";
import Rotate from "./components/Rotate/Rotate";
import Zoom from "./components/Zoom/Zoom";

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

  // make and center a % aspect crop
  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
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
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      console.log("previewCanvasRef", previewCanvasRef);
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

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  }

  function downloadImage(image) {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="App">
      <div className="Crop-Controls">
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <Zoom value={scale} imgSrc={imgSrc} setScale={setScale} />
        <Rotate value={rotate} imgSrc={imgSrc} setRotate={setRotate} />
        <div>
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? "off" : "on"}
          </button>
          <button onClick={() => setIsCrop(true)} disabled={!imgSrc}>
            Crop
          </button>
        </div>
      </div>

      {!!imgSrc && (
        <Crop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          isCrop={isCrop}
          setIsCrop={setIsCrop}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </Crop>
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
  );
}

export default App;
