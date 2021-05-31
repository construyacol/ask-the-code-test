import localForage from "localforage";
import { useActions } from "../../hooks/useActions";
import { getExpTimeData } from '../utils'


export const updateLocalForagePersistState = (modelData) => async() => {
  const { user, wallets, balances } = modelData;
  if (user && wallets && balances) {
    localForage.setItem("sessionState", JSON.stringify(modelData));
    return null
  }
};

const SessionRestore = () => {
  const actions = useActions();

  const tryRestoreSession = async (userToken) => {
    
    const {
      currentTime,
      REFRESH_TOKEN_EXP_TIME
    } = await getExpTimeData()

    const SESSION = await localForage.getItem("sessionState");
    const SESSION_STATE = SESSION && Object.keys(SESSION).length && JSON.parse(SESSION);
    // if (!SESSION_STATE || (SESSION_STATE.user && SESSION_STATE.user.userToken !== userToken)) {
    if (!SESSION_STATE || currentTime > REFRESH_TOKEN_EXP_TIME) {
      await localForage.setItem("CACHED_DATA", {});
      await localForage.setItem("sessionState", {});
      return false;
    }
    await actions.appLoadLabelAction("Restaurando datos");
    await actions.set_session_restore(SESSION_STATE);
    return true;
  };

  return [tryRestoreSession];
};

export default SessionRestore;
