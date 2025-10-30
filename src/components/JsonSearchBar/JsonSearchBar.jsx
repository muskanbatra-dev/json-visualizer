import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchPath,
  searchJsonPath,
  clearSearch,
} from "../../Store/jsonSlice";
import { toast } from "react-toastify";
import "./SearchBar.css"; 

const SearchBar = () => {
  const dispatch = useDispatch();
  const jsonData = useSelector((state) => state.json.data);
  const reduxSearchPath = useSelector((state) => state.json.searchPath);
  const searchMessage = useSelector((state) => state.json.searchMessage);

  const [localQuery, setLocalQuery] = useState(reduxSearchPath || "");

  const handleSearch = () => {
    if (!jsonData) {
      toast.warn("⚠️ Please load valid JSON before searching!", {
        position: "top-right",
      });
      return;
    }

    if (!localQuery.trim()) {
      toast.warn("⚠️ Please enter a valid JSONPath query!", {
        position: "top-right",
      });
      return;
    }

    dispatch(setSearchPath(localQuery.trim()));
    dispatch(searchJsonPath());
  };

  const handleClear = () => {
    setLocalQuery("");
    dispatch(clearSearch());
    toast.info("Search cleared.", { position: "top-right" });
  };

  useEffect(() => {
    if (!searchMessage) return;

    if (searchMessage.includes("✅")) {
      toast.success(searchMessage, { position: "top-right" });
    } else if (searchMessage.includes("❌")) {
      toast.error(searchMessage, { position: "top-right" });
    } else if (searchMessage.includes("⚠️")) {
      toast.warn(searchMessage, { position: "top-right" });
    }
  }, [searchMessage]);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 12,
        alignItems: "center",
      }}
    >
      <input
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Enter JSONPath, e.g. $.user.address.city"
        style={{
          flex: 1,
          padding: "8px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <button onClick={handleSearch} className="search-btn">
        Search
      </button>

      <button
        onClick={handleClear}
        disabled={!localQuery.trim()}
        className="clear-btn"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBar;
