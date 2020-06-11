import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useActions } from '../../hooks/useActions'
import { useCoinsendaServices } from '../../services/useCoinsendaServices'
import { convertToObjectWithCustomIndex } from '../../utils'



const UseTxState = (order_id) => {

    const actions = useActions()
    const state = useSelector(state => state)
    const params = useParams()
    const [ orderState, setOrderState ] = useState()
    const [ coinsendaServices ] = useCoinsendaServices()
    const { primary_path, tx_path, account_id, path  } = params
    const { currencies } = state.modelData


    const { activity_for_account } = state.storage
    let pending_index = `pending_${tx_path}`
    let lastPendingOrderId = activity_for_account[account_id] && activity_for_account[account_id][pending_index] && activity_for_account[account_id][pending_index].lastPending


    return {
        ...params,
        lastPendingOrderId:lastPendingOrderId === order_id ? lastPendingOrderId : null,
        new_order_style:state.ui.current_section.params.new_order_style && lastPendingOrderId === order_id,
        coinsendaServices,
        currencies:currencies && convertToObjectWithCustomIndex(currencies, 'currency'),
        actions:{...actions}
      }
}

export default UseTxState
