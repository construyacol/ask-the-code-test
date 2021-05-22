import { applyMiddleware } from "redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import soundsMiddleware from "redux-sounds";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { mainService } from "./services/MainService";
import soundData from "./sounds";
import { updateLocalForagePersistState } from "./components/hooks/sessionRestore";

const loadedSoundsMiddleware = soundsMiddleware(soundData);

export function _createStore() {
  // Grab the state from a global variable injected into the server-generated HTML
  const preloadedState = window.__PRELOADED_STATE__;

  // Allow the passed state to be garbage-collected
  delete window.__PRELOADED_STATE__;

  let store;
  if (process.env.NODE_ENV === "production") {
    store = createStore(
      reducer,
      preloadedState || {},
      applyMiddleware(logger, thunk, loadedSoundsMiddleware)
    );
  } else {
    store = createStore(
      reducer,
      {},
      composeWithDevTools(
        applyMiddleware(logger, thunk, loadedSoundsMiddleware)
      )
    );
  }

  // Tell react-snap how to save Redux state
  window.snapSaveState = () => ({
    __PRELOADED_STATE__: store.getState(),
  });

  store.subscribe(() => {
    if (store.getState().modelData.authData.userToken) {
      mainService.setGlobalState(store.getState());
    }
    window.onbeforeunload = updateLocalForagePersistState(store.getState().modelData);
  });

  return store;

}
