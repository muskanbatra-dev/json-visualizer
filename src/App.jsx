import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import JsonInput from "./components/JsonInput/JsonInput";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [jsonText, setJsonText] = useState("");

  // ✅ Validate JSON when clicking Visualize
  const handleValidateJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonData(parsed);
      toast.success("✅ Valid JSON! Visualization ready.", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      setJsonData(null);
      toast.error(`⚠️ Invalid JSON: ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">JSON Tree Visualizer</h1>

      <div className="json-flex-container">
        {/* Left side — Input */}
        <div className="input-section">
          <JsonInput jsonText={jsonText} setJsonText={setJsonText} />
        </div>

        {/* Middle — Button */}
        <div className="button-section">
          <button className="visualize-center-btn" onClick={handleValidateJson}>
            Validate JSON →
          </button>
        </div>

        {/* Right side — Output */}
        <div className="output-section">
          {jsonData ? (
            <pre className="json-output">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          ) : (
            <p className="placeholder-text">
              Your parsed JSON will appear here 👇
            </p>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default App;
