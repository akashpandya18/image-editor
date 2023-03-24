import React from "react";
import PropTypes from "prop-types";
import "./index.css";

export default function Title(props) {
  return (
    <div>
      <p className='title'>
        Welcome to the Image Editor{" "}
        <span className='highlight'>{props.name}</span>
      </p>
    </div>
  );
}

Title.propTypes = {
  name: PropTypes.string,
};
