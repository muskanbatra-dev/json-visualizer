import React from "react";
import "./ToggleButton.css";

const ToggleButton = ({ value, onChange }) => {
  return (
    <div className={`toggle-btn ${value ? "toggled" : ""}`} onClick={onChange}>
      <div className="thumb"></div>
    </div>
  );
};

export default ToggleButton;
