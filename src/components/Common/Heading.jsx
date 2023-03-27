import React from "react";

const Heading = ({ label }) => {
  return (
    <div className="rotate-heading-wrapper">
      <div className="rotate-heading">{label}</div>
    </div>
  );
};

export default Heading;
