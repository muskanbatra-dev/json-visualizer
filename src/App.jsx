import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import JsonInput from "./components/JsonInput/JsonInput";
import JsonTree from "./components/JsonTree/JsonTree";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [jsonText, setJsonText] = useState("");
  const [showTree, setShowTree] = useState(false);

  const handleValidateJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonData(parsed);
      setShowTree(false);
      toast.success("✅ Valid JSON! Visualization ready.", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      setJsonData(null);
      setShowTree(false);
      toast.error(`⚠️ Invalid JSON: ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  // ✅ Show React Flow tree when button clicked
  const handleShowTree = () => {
    if (jsonData) {
      setShowTree((prev) => !prev); // toggle state
      toast.info(
        showTree
          ? "🌿 Visualization hidden!"
          : "🌳 JSON Tree visualization generated!",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">JSON Tree Visualizer</h1>

      <div className="json-flex-container">
        <div className="input-section">
          <JsonInput jsonText={jsonText} setJsonText={setJsonText} />
        </div>

        <div className="button-section">
          <button className="visualize-center-btn" onClick={handleValidateJson}>
            Validate JSON →
          </button>
        </div>

        <div className="output-section">
          {jsonData ? (
            <>
              <pre className="json-output">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
              <button
                className="show-tree-btn"
                onClick={handleShowTree}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: "500",
                  marginTop: "10px",
                  cursor: "pointer",
                }}
              >
                🌿 Show React Flow Tree
              </button>
            </>
          ) : (
            <p className="placeholder-text">
              Your parsed JSON will appear here 👇
            </p>
          )}
        </div>
      </div>

      {showTree && jsonData && (
        <div className="tree-section">
          <JsonTree data={jsonData} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
