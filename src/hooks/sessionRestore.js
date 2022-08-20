import localForage from "localforage";
import { useActions } from "./useActions";
import { getExpTimeData } from 'utils/handleSession'


export const updateLocalForagePersistState = (payload) => {
  let modelData = JSON.parse(JSON.stringify(payload))
  const { user, wallets, balances } = modelData;
  if (user && wallets && balances) {
  // alert('updateLocalForagePersistState')
  delete modelData.withdraws
  delete modelData.deposits
  delete modelData.swaps
  modelData.user.withdraws = []
  modelData.user.swaps = []
  modelData.user.deposits = []
  return localForage.setItem("sessionState", JSON.stringify(modelData));
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
    // if (!SESSION_STATE || (SESSION_STATE.user && SESSION_STATE.authData.userToken !== userToken)) {
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
