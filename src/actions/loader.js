import { LOADER, IS_APP_LOADED, APP_LOAD_LABEL } from "./action_types";

export const isAppLoading = (payload) => {
  return {
    type: LOADER,
    payload,
  };
};

export const isAppLoaded = (payload) => {
  return {
    type: IS_APP_LOADED,
    payload,
  };
};

export const appLoadLabelAction = (payload) => {
  return {
    type: APP_LOAD_LABEL,
    payload,
  };
};

export default isAppLoading;
