import React from "react";

const Title = (props) => {
  return (
    <div>
      <p className='title'>
        Welcome to the Image Editor{" "}
        <span className='highlight'>{props.name}</span>
      </p>
    </div>
  );
};

export default Title;
