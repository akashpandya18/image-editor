import React, { useRef, useState, useEffect } from "react";

function TagAnnSRCTEXT({ src, text }) {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Add the annotation text
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText(text, 20, 50);
    };
    img.src = src;
  }, [src, text]);

  return (
    <div>
      <canvas ref={canvasRef} />
      {!imageLoaded && <div>Loading image...</div>}
    </div>
  );
}

export default TagAnnSRCTEXT;
