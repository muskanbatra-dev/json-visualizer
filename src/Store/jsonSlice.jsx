import { createSlice } from "@reduxjs/toolkit";
import { JSONPath } from "jsonpath-plus";

const normalizePathToId = (p) =>
  "root-" +
  p
    .toString()
    .replace(/[\$\.\[\]\'\"]/g, "-") 
    .replace(/-+/g, "-") 
    .replace(/(^-|-$)/g, ""); 

const jsonSlice = createSlice({
  name: "json",
  initialState: {
    data: null,
    searchPath: "",
    matchedNodeIds: [],
    searchMessage: "",
  },
  reducers: {
    setJsonData: (state, action) => {
      state.data = action.payload;
      state.matchedNodeIds = [];
      state.searchMessage = "";
      state.searchPath = "";
    },
    setSearchPath: (state, action) => {
      state.searchPath = action.payload;
    },
  
    searchJsonPath: (state) => {
      if (!state.data || !state.searchPath) {
        state.matchedNodeIds = [];
        state.searchMessage = "⚠️ Please load valid JSON and enter a query.";
        return;
      }

      try {
        const result = JSONPath({
          path: state.searchPath,
          json: state.data,
          resultType: "path", 
        });

        if (result.length > 0) {
          state.matchedNodeIds = result.map((p) => normalizePathToId(p));
          state.searchMessage = "✅ Match found!";
        } else {
          state.matchedNodeIds = [];
          state.searchMessage = "❌ No match found.";
        }
      } catch (err) {
        state.matchedNodeIds = [];
        state.searchMessage = "⚠️ Invalid JSONPath syntax.";
      }
    },
    setMatchedNodeIds: (state, action) => {
      state.matchedNodeIds = action.payload;
    },
    clearSearch: (state) => {
      state.matchedNodeIds = [];
      state.searchMessage = "";
      state.searchPath = "";
    },
  },
});

export const {
  setJsonData,
  setSearchPath,
  searchJsonPath,
  setMatchedNodeIds,
  clearSearch,
} = jsonSlice.actions;

export default jsonSlice.reducer;
