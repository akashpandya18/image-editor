import React, { useState, useEffect } from "react";

const TagText = () => {
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

  return (
    <div>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            {tag}
            <button onClick={() => handleRemoveTag(tag)}>x</button>
          </li>
        ))}
      </ul>
      <input type='text' placeholder='Add a tag' onKeyDown={handleAddTag} />
    </div>
  );
};

export default TagText;
