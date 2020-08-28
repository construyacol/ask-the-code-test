import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useActions } from '../../hooks/useActions'
import { useCoinsendaServices } from '../../services/useCoinsendaServices'
import { convertToObjectWithCustomIndex } from '../../utils'
import { useHistory } from "react-router-dom";
import { createSelector } from 'reselect'

const selectWithConvertToObjectWithCustomIndex = createSelector(
  ({ modelData }) => modelData.currencies,
  currencies => currencies && convertToObjectWithCustomIndex(currencies, 'currency')
)

const selectCurrentOrder = createSelector(
  ({ modelData }) => modelData,
  (_, current_order_id) => current_order_id,
  (modelData, current_order_id) => {
    const { tx_path, order_id } = useParams()
    return modelData[tx_path] && modelData[tx_path][order_id || current_order_id]
  }
)

const selectLastPendingOrderId = createSelector(
  ({ storage }) => storage.activity_for_account,
  (_, current_order_id) => current_order_id,
  (activity_for_account, current_order_id) => {
    const { account_id, tx_path } = useParams()
    const pending_index = `pending_${tx_path}`
    const lastPendingOrderId = activity_for_account[account_id] && activity_for_account[account_id][pending_index] && activity_for_account[account_id][pending_index].lastPending

    return lastPendingOrderId === current_order_id ? lastPendingOrderId : null
  }
)



const UseTxState = (current_order_id) => {

  const history = useHistory()
  const actions = useActions()
  // const state = useSelector(state => state)
  const isModalOpen = useSelector(state => state.ui.modal_confirmation.visible)
  const deposit_providers = useSelector(state => state.modelData.deposit_providers)
  const loader = useSelector(state => state.isLoading)
  const currencies = useSelector(state => selectWithConvertToObjectWithCustomIndex(state))
  const currentOrder = useSelector(state => selectCurrentOrder(state, current_order_id))
  const lastPendingOrderId = useSelector(state => selectLastPendingOrderId(state, current_order_id))
  const new_order_style = useSelector(state => state.ui.current_section.params.new_order_style)
  const params = useParams()
  const [coinsendaServices] = useCoinsendaServices()
  // const { tx_path, order_id } = params

  // verificar esta funcion
  // const getPaymentProof = async () => {
  //   return
  //   // const order = state.modelData[tx_path][order_id]
  // }
  const resp = {
    ...params,
    history,
    lastPendingOrderId,
    new_order_style: new_order_style && lastPendingOrderId === current_order_id,
    coinsendaServices,
    currencies,
    actions,
    currentOrder,
    loader,
    deposit_providers,
    isModalOpen
  }

  // console.log(resp + ' ============================RESP')

  return resp
}

export default UseTxState
