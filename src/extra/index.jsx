import React, { useRef, useState, useEffect } from "react";

function AnnoRedDot({ imageSrc }) {
  const canvasRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [tags, setTags] = useState([]);

  const handleAddTag = (event) => {
    if (event.key === "Enter") {
      const newTag = event.target.value.trim();
      if (newTag !== "" && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        event.target.value = "";
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setAnnotations([...annotations, { x, y }]);
    // console.log("canvas click");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, image.width, image.height);
      annotations.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });
    };
  }, [annotations, imageSrc]);

  return <canvas ref={canvasRef} onClick={handleCanvasClick} />;
}

export default AnnoRedDot;
