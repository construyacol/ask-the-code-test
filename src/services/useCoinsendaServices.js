import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { mainService } from "./MainService"
import actions from '../actions'
import { useParams } from "react-router-dom"


export const useCoinsendaServices = () => {
  const dispatch = useDispatch()
  const reduxState = useSelector(state => state)
  const { account_id } = useParams()

  mainService.initialize(dispatch, reduxState, reduxState.modelData.authData.userToken)

  useEffect(() => {
    mainService.setGlobalState(reduxState)
  }, [reduxState.modelData])

  return [
    mainService,
    {
      ...reduxState,
      current_wallet: reduxState.modelData.wallets && reduxState.modelData.wallets[account_id]
    }, actions, dispatch
  ]
}
