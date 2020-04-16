import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { mainService } from "./MainService"

export const useCoinsendaServices = () => {
    const dispatch = useDispatch()
    const reduxState = useSelector(state => state)
    mainService.initialize(dispatch, reduxState, reduxState.modelData.authData.userToken)

    useEffect(() => {
        mainService.setGlobalState(reduxState)
    }, [reduxState.modelData])

    return [mainService, reduxState];
}