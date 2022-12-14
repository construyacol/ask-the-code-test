// import { useState, useEffect } from 'react'
import localForage from "localforage";
import { useActions } from "./useActions";
import { getExpTimeData } from 'utils/handleSession'

export const updateLocalForagePersistState = (payload) => {
  let modelData = JSON.parse(JSON.stringify(payload))
  const { user, wallets, balances } = modelData;
  if (user && wallets && balances) {
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
  // const [ isSessionRestored, setIsSessionRestored ] = useState(false)
  const tryRestoreSession = async () => {
    const {
      currentTime,
      refreshTokenExpirationTime,
    } = await getExpTimeData()
    const SESSION = await localForage.getItem("sessionState");
    const SESSION_STATE = SESSION && Object.keys(SESSION).length && JSON.parse(SESSION);
    if (!SESSION_STATE || currentTime > refreshTokenExpirationTime) {
      await localForage.setItem("CACHED_DATA", {});
      await localForage.setItem("sessionState", {});
      return false;
    }
    await actions.appLoadLabelAction("Restaurando datos");
    await actions.set_session_restore(SESSION_STATE);
    return true;
  };

  // useEffect(() => {
  //     tryRestoreSession()
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return [ tryRestoreSession ];
};

export default SessionRestore;
