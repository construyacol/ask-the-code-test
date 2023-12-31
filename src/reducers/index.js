import modelData from "./model-data";
import isLoading from "./is-loading";
import ui from "./ui";
import auth from "./auth";
import storage from "./storage";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  modelData,
  isLoading,
  ui,
  auth,
  storage,
});

export default rootReducer;
