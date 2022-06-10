import { LOADER, IS_APP_LOADED, APP_LOAD_LABEL } from "../actions/action_types";

const initialState = {
  loader: false,
  isAppLoaded: false,
  appLoadLabel: "Iniciando",
};

const isLoading = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        loader: action.payload,
      };
    case IS_APP_LOADED:
      return {
        ...state,
        isAppLoaded: action.payload,
      };
    case APP_LOAD_LABEL:
      return {
        ...state,
        appLoadLabel: action.payload,
      };
    default:
      return state;
  }
};

export default isLoading;
