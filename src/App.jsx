import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setJsonData } from "./Store/jsonSlice";
import JsonInput from "./components/JsonInput/JsonInput";
import JsonTree from "./components/JsonTree/JsonTree";
import SearchBar from "./components/JsonSearchBar/JsonSearchBar";
import { useTheme } from "./Theme/ThemeContext";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ToggleButton from "./components/Button/ToggleButton";

const App = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.json);
  const [jsonText, setJsonText] = useState("");

  const { isDarkMode, toggleTheme } = useTheme();

  const handleValidateJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      dispatch(setJsonData(parsed));
      toast.success("✅ Valid JSON! Tree generated.", {
        position: "top-right",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
      });
    } catch (err) {
      toast.error(`⚠️ Invalid JSON: ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };
  const handleClear = () => {
    setJsonText("");
    dispatch(setJsonData(null));
    toast.info("🧹 Cleared JSON and tree view", {
      position: "top-right",
      autoClose: 2000,
      theme: isDarkMode ? "dark" : "light",
    });
  };

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="visualizer-container">
        <header className="header">
          <h1>JSON Tree Visualizer</h1>

          <ToggleButton value={isDarkMode} onChange={toggleTheme} />
        </header>

        <div className="search-bar-wrapper">
          <SearchBar />
        </div>

        <div className="main-layout">
          <div className="left-section">
            <p className="section-title">Enter JSON</p>
            <JsonInput jsonText={jsonText} setJsonText={setJsonText} />
          </div>

          <div className="center-section">
            <div className="button-group">
              <button className="generate-btn" onClick={handleValidateJson}>
                Generate Tree
              </button>
              <button
                className="clear-btn"
                onClick={handleClear}
                disabled={!jsonText && !data}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          <div className="right-section">
            {data ? (
              <div className="tree-section">
                <JsonTree data={data} />
              </div>
            ) : (
              <p className="placeholder-text">
                Paste valid JSON and click “Generate Tree” 👇
              </p>
            )}
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme={isDarkMode ? "dark" : "light"}
        />
      </div>
    </div>
  );
};

export default App;
