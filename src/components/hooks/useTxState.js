import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { useParams, useLocation } from "react-router-dom"
import { useActions } from '../../hooks/useActions'
import { useCoinsendaServices } from '../../services/useCoinsendaServices'
import { convertToObjectWithCustomIndex } from '../../utils'
import { useHistory } from "react-router-dom";



const UseTxState = (current_order_id) => {

    const history = useHistory()
    const location = useLocation()
    const actions = useActions()
    const state = useSelector(state => state)
    const params = useParams()
    const [ orderState, setOrderState ] = useState()
    const [ coinsendaServices ] = useCoinsendaServices()
    const { primary_path, tx_path, account_id, path, order_id  } = params
    const { currencies } = state.modelData

    const getPaymentProof = async() => {
      const order = state.modelData[tx_path][order_id]
    }


    const { activity_for_account } = state.storage
    let pending_index = `pending_${tx_path}`
    let lastPendingOrderId = activity_for_account[account_id] && activity_for_account[account_id][pending_index] && activity_for_account[account_id][pending_index].lastPending


    return {
        ...params,
        history,
        lastPendingOrderId:lastPendingOrderId === current_order_id ? lastPendingOrderId : null,
        new_order_style:state.ui.current_section.params.new_order_style && lastPendingOrderId === current_order_id,
        coinsendaServices,
        currencies:currencies && convertToObjectWithCustomIndex(currencies, 'currency'),
        actions:{...actions},
        currentOrder:state.modelData[tx_path] && state.modelData[tx_path][order_id],
        getPaymentProof
      }
}

export default UseTxState
