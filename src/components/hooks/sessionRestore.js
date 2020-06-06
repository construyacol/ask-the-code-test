import localForage from 'localforage'
import { useActions } from '../../hooks/useActions'

export const updateLocalForagePersistState = (modelData) => () => {
  const { user, wallets, balances } = modelData
  if (user && wallets && balances) {
    return localForage.setItem('sessionState', JSON.stringify(modelData))
  }
}


const SessionRestore = () => {

  const actions = useActions();

  const tryRestoreSession = async (userToken) => {
    const SESSION = await localForage.getItem('sessionState')
    const SESSION_STATE = JSON.parse(SESSION)
    if (!SESSION_STATE || (SESSION_STATE.user && SESSION_STATE.user.userToken !== userToken)) { return false }
    await actions.appLoadLabelAction("Restaurando datos")
    await actions.set_session_restore(SESSION_STATE)
    return true
  }

  return [tryRestoreSession]

}


export default SessionRestore
