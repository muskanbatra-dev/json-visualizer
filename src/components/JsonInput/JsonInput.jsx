import React from "react";
import "./JsonInput.css"; // make sure this file contains your CSS

const JsonInput = ({ jsonText, setJsonText, onVisualize }) => {
  return (
    <div className="json-input-container">
      <textarea
        className="json-textarea"
        placeholder='Paste your JSON here (e.g., {"name": "Muskan"})'
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
    </div>
  );
};

export default JsonInput;
