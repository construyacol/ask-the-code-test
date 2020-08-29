import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import actions from '../../actions'
import { createSelector } from "reselect"

const selectWithdrawProviderByType = createSelector(
  state => state.modelData.withdrawProviders,
  withdrawProviders => {
    let result = {}
    for (let provider_id in withdrawProviders) {
      result = {
        ...result,
        [withdrawProviders[provider_id].provider_type]: withdrawProviders[provider_id]
      }
    }
    return result
  }
)

const selectWithdrawAccountsByAddress = createSelector(
  state => state.modelData.withdraw_accounts,
  withdraw_accounts => {
    let result = {}
    for (let w_account_id in withdraw_accounts) {
      if (withdraw_accounts[w_account_id].info.address) {
        result = {
          ...result,
          [withdraw_accounts[w_account_id].info.address]: withdraw_accounts[w_account_id]
        }
      }
    }
    return result
  }
)

const WithdrawViewState = () => {

  const dispatch = useDispatch();
  const { modelData, ui, isLoading, storage } = useSelector(state => state)
  const withdrawProviders = useSelector(state => selectWithdrawProviderByType(state))
  const withdraw_accounts = useSelector(state => selectWithdrawAccountsByAddress(state))
  const { account_id } = useParams()
  const { active_trade_operation } = ui.current_section.params

  const {
    wallets,
    balances,
    user
  } = modelData

  const {
    loader
  } = isLoading

  const {
    activity_for_account
  } = storage

  const current_wallet = wallets[account_id]

  return [
    {
      user,
      current_wallet,
      balance: balances[current_wallet.id],
      withdrawProviders,
      withdraw_accounts,
      active_trade_operation,
      loader,
      withdraws: activity_for_account[account_id] && activity_for_account[account_id].withdraws
    },
    actions,
    dispatch
  ]
}

export default WithdrawViewState
