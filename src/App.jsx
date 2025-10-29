import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setJsonData } from "./Store/jsonSlice";
import JsonInput from "./components/JsonInput/JsonInput";
import JsonTree from "./components/JsonTree/JsonTree";
import SearchBar from "./components/JsonSearchBar/JsonSearchBar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const { data, searchMessage } = useSelector((state) => state.json);

  const [jsonText, setJsonText] = useState("");
  const [showTree, setShowTree] = useState(false);

  const handleValidateJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      dispatch(setJsonData(parsed));
      setShowTree(false);
      toast.success("✅ Valid JSON! Visualization ready.", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error(`⚠️ Invalid JSON: ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleShowTree = () => {
    if (data) {
      setShowTree((prev) => !prev);
      toast.info(
        showTree
          ? "🌿 Visualization hidden!"
          : "🌳 JSON Tree visualization generated!",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } else {
      toast.warning("⚠️ Please validate JSON first!");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">JSON Tree Visualizer</h1>

      {/* 🔍 Search Bar (Redux integrated) */}
      <SearchBar />

      <div className="json-flex-container">
        {/* 📝 Input Section */}
        <div className="input-section">
          <JsonInput jsonText={jsonText} setJsonText={setJsonText} />
        </div>

        {/* ✅ Validate JSON */}
        <div className="button-section">
          <button className="visualize-center-btn" onClick={handleValidateJson}>
            Validate JSON →
          </button>
        </div>

        {/* 🧾 Output Section */}
        <div className="output-section">
          {data ? (
            <>
              <pre className="json-output">{JSON.stringify(data, null, 2)}</pre>
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

      {/* 🌳 React Flow Tree */}
      {showTree && data && (
        <div className="tree-section">
          <JsonTree data={data} />
        </div>
      )}

      {/* ✅ Redux Search Feedback */}
      {searchMessage && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          {searchMessage}
        </p>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
