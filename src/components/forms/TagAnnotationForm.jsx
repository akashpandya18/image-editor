import React, { useEffect } from "react";

function TagAnnotationForm({ tags, handleInputChange, onSubmit, position }) {
  useEffect(() => {
    console.log(position);
  }, [position]);

  return (
    <div style={{ position: "absolute", top: position.x, left: position.y }}>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          name='tag'
          value={tags}
          onChange={(e) => handleInputChange(e)}
          autoFocus
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default TagAnnotationForm;
