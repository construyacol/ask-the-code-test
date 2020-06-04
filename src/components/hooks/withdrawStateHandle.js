import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import actions from '../../actions'

const WithdrawViewState = () => {

    const dispatch = useDispatch();
    const state = useSelector(state => state)
    const { account_id } = useParams()
    const { active_trade_operation } = state.ui.current_section.params

    const {
      wallets,
      withdraw_accounts,
      withdrawProviders,
      balances,
      user
    } = state.modelData

    const {
      loader
    } = state.isLoading

    const {
      activity_for_account
    } = state.storage

    const current_wallet = wallets[account_id]

    const withdrawProvidersByType = () => {
        let result = {}
        for (let provider_id in withdrawProviders) {
          // if(withdrawProviders[provider_id].provider_type === 'bitcoin_testnet'){return result}
            result = {
             ...result,
             [withdrawProviders[provider_id].provider_type]: withdrawProviders[provider_id]
            }
        }
        return result
    }

    const withdrawAccountsByAddress = () => {
        let result = {}
        for (let w_account_id in withdraw_accounts) {
          if(withdraw_accounts[w_account_id].info.address){
                result = {
                  ...result,
                  [withdraw_accounts[w_account_id].info.address]: withdraw_accounts[w_account_id]
                }
          }
        }
        return result
    }
    // useEffect(()=>{
    //   console.log('||||||| current_wallet', actions)
    // }, [])

    return [
      {
        user,
        current_wallet,
        balance:balances[current_wallet.id],
        withdrawProviders: withdrawProvidersByType(),
        withdraw_accounts: withdrawAccountsByAddress(),
        active_trade_operation,
        loader,
        withdraws:activity_for_account[account_id] && activity_for_account[account_id].withdraws
      },
        actions,
        dispatch
    ]
}

export default WithdrawViewState
