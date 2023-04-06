import React, { useState, useRef, useEffect } from "react";

export default function Sundry({ imageSrc }) {
  const [annotations, setAnnotations] = useState([]);
  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleClick(e) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setAnnotations([...annotations, { x, y, text }]);
    setText("");
    setShowForm(false);
  }

  function handleInputChange(e) {
    setText(e.target.value);
  }

  return (
    <div>
      <img src={imageSrc} alt='My Image' onClick={() => setShowForm(true)} />
      {showForm && (
        <div>
          <input type='text' value={text} onChange={handleInputChange} />
          <button onClick={handleClick}>Add Annotation</button>
        </div>
      )}
      {annotations.map((annotation, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: annotation.x,
            top: annotation.y,
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          <p>{annotation.text}</p>
        </div>
      ))}
    </div>
  );
}
