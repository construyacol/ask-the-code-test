import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import localForage from 'localforage'
import { set_session_restore } from '../../actions/dataModelActions'
import { doLogout } from '../utils'


const SessionRestore = () => {

  const dispatch = useDispatch();
  const state = useSelector(state => state)
  const [ session, setSession ] = useState()


  const getSessionState = async () => {
    const SESSION = await localForage.getItem('sessionState')
    const SESSION_STATE = JSON.parse(SESSION)
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||| SESSION STATE :', SESSION_STATE)
    if(!SESSION_STATE){return setSession({})}
    await dispatch(set_session_restore(SESSION_STATE))
    return setSession(SESSION_STATE)
  }

  const onUnmount = () => {
    const { user, wallets, balances, authData } = state.modelData
    if(user && wallets && balances && authData ){
      return localForage.setItem('sessionState', JSON.stringify({
        user,
        wallets,
        balances,
        authData,
        userId:authData.userId
      }))
    }
  }

  useEffect(()=>{
    getSessionState()
  }, [])

  useEffect(()=>{
    // return window.onbeforeunload = function() {
    //   const { user, wallets, balances } = state.modelData
    //   if(user && wallets && balances ){
    //     return localForage.setItem('sessionState', JSON.stringify({
    //       user,
    //       wallets,
    //       balances
    //     }))
    //   }
    //  // return localStorage.setItem('sessionState', state.modelData.user)
    // }
    return onUnmount
  }, [state.modelData])

  return [ session ]

}


export default SessionRestore
