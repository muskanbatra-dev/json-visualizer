import { configureStore } from "@reduxjs/toolkit";
import jsonReducer from "./jsonSlice";

const store = configureStore({
  reducer: {
    json: jsonReducer,
  },
});

export default store;
