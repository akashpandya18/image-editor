import React, { useState, useEffect, useRef } from "react";
import TagAnnotationForm from "./forms/TagAnnotationForm";

function ImageAnnot({ imageSrc }) {
  const canvasRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [dotPosition, setDotPosition] = useState([]);
  const [currentDotPosition, setCurrentDotPosition] = useState(null);
  const [tags, setTags] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const annotation = { x, y };
    setCurrentAnnotation(annotation);
    setCurrentDotPosition(annotation);
    setShowInput(true);
    context.beginPath();
    context.fillStyle = "red";
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fill();
  };

  const handleInputChange = (event) => {
    setTags(event.target.value);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(tags, currentAnnotation.x, currentAnnotation.y);
    setTags("");
    setShowInput(false);
    setCurrentAnnotation(null);
    setCurrentDotPosition(null);
  };

  //for initial image load
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
    };
  }, [imageSrc]);

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} onClick={(e) => handleCanvasClick(e)} />
      {showInput && (
        <TagAnnotationForm
          tags={tags}
          handleInputChange={handleInputChange}
          onSubmit={handleAddTag}
          position={currentAnnotation}
        />
      )}
    </div>
  );
}

export default ImageAnnot;
