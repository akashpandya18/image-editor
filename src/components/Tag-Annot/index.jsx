import React, { useState, useEffect, useRef } from "react";

// const TagText = () => {
//   const [tags, setTags] = useState([]);

//   const handleAddTag = (event) => {
//     if (event.key === "Enter") {
//       const newTag = event.target.value.trim();
//       if (newTag !== "" && !tags.includes(newTag)) {
//         setTags([...tags, newTag]);
//         event.target.value = "";
//       }
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   return (
//     <div>
//       <ul>
//         {tags.map((tag) => (
//           <li key={tag}>
//             {tag}
//             <button onClick={() => handleRemoveTag(tag)}>x</button>
//           </li>
//         ))}
//       </ul>
//       <input type='text' placeholder='Add a tag' onKeyDown={handleAddTag} />
//     </div>
//   );
// };

// export default TagText;

const AnnotationCanvas = ({ imageUrl, annotations }) => {
  const canvasRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasLoaded, setCanvasLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      setCanvasWidth(image.width);
      setCanvasHeight(image.height);
      context.drawImage(image, 0, 0);
      annotations.forEach((annotation) => {
        context.font = `${annotation.fontSize}px ${annotation.fontFamily}`;
        context.fillStyle = annotation.color;
        context.fillText(annotation.text, annotation.x, annotation.y);
      });
      setCanvasLoaded(true);
    };
    image.src = imageUrl;
  }, [imageUrl, annotations]);

  return (
    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}>
      {canvasLoaded ? null : "Loading..."}
    </canvas>
  );
};

export default AnnotationCanvas;
