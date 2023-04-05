import React from "react";

function TagAnnotationForm({ tags, handleInputChange, onSubmit }) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          name='tag'
          value={tags}
          onChange={(e) => handleInputChange(e)}
        />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
}

export default TagAnnotationForm;
