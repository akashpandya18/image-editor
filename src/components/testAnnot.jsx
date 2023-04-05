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

  const handleAnnotationSubmit = () => {
    if (currentAnnotation && currentDotPosition) {
      setAnnotations([...annotations, currentAnnotation]);
      setDotPosition([...dotPosition, currentDotPosition]);
      setCurrentAnnotation(null);
      setCurrentDotPosition(null);
    }
  };

  const handleClearTags = () => {
    setAnnotations([]);
    setDotPosition([]);
    setCurrentAnnotation(null);
    setCurrentDotPosition(null);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(tags, currentAnnotation.x, currentAnnotation.y);
    setTags("");
  };

  // const handleRemoveTag = (tagToRemove) => {
  //   setTags(tags.filter((tag) => tag !== tagToRemove));
  // };

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

  //for updating canvas when annotations happen
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, image.width, image.height);
      dotPosition.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
      });
    };
  }, [annotations, dotPosition]);

  return (
    <div>
      <canvas ref={canvasRef} onClick={(e) => handleCanvasClick(e)} />
      <button onClick={(e) => handleClearTags(e)}>Clear</button>
      {showInput && (
        <TagAnnotationForm
          tags={tags}
          handleInputChange={handleInputChange}
          onSubmit={handleAddTag}
        />
      )}

      {currentAnnotation && (
        <div>
          <p>
            Click submit to annotate at ({currentAnnotation.x},{" "}
            {currentAnnotation.y})
          </p>
          <button onClick={(e) => handleAnnotationSubmit(e)}>Submit</button>
        </div>
      )}
      {annotations.length > 0 && (
        <div>
          <h3>Annotations</h3>
          <ul>
            {annotations.map((annotation, index) => (
              <li key={index}>
                ({annotation.x}, {annotation.y})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageAnnot;
