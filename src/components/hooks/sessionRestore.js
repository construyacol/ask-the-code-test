import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import localForage from 'localforage'
import { set_session_restore } from '../../actions/dataModelActions'
import { doLogout } from '../utils'
import { useActions } from '../../hooks/useActions'


const SessionRestore = () => {

  const actions = useActions();
  const modelData = useSelector(state => state.modelData)

  const tryRestoreSession = async (userToken) => {
    const SESSION = await localForage.getItem('sessionState')
    const SESSION_STATE = JSON.parse(SESSION)
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||| SESSION STATE :', SESSION_STATE)
    if (!SESSION_STATE || (SESSION_STATE.user && SESSION_STATE.user.userToken !== userToken)) { return false }
    await actions.appLoadLabelAction("Restaurando datos")
    await actions.set_session_restore(SESSION_STATE)
    return true
  }

  const onUnmount = () => {
    const { user, wallets, balances, authData } = modelData
    if (user && wallets && balances && authData) {
      delete modelData.authData
      return localForage.setItem('sessionState', JSON.stringify(modelData))
    }
  }

  // useEffect(()=>{
  //   getSessionState()
  // }, [])

  useEffect(() => {
    window.onbeforeunload = onUnmount
  }, [modelData])

  return [tryRestoreSession]

}


export default SessionRestore
