import Environment from '../../environment'
// import * as normalizr_services from '../../schemas'
// import { update_normalized_state } from '../dataModelActions'


import {
  ApiGetRequest,
  // generate_headers,
  // ApiPostRequest,
} from './'

// import {
//   update_item_state
// } from '../dataModelActions'


// import {
//   app_loaded,
//   load_label
// } from '../loader'

import {
  update_activity_state,
  normalized_list
} from '../../services'

const {
  WithdrawApiUrl
 } = Environment

// const {
//   normalize_user,
//   normalize_data
// } = normalizr_services



export const get_withdraws = (account_id) => {
// @params:
// account_id

  return async(dispatch, getState) => {

    const user = getState().model_data.user[getState().model_data.user_id]

    let filter = `{"where":{"account_id":"${account_id}"}, "limit":30, "order":"id DESC", "include":{"relation":"user"}}`
    const url_withdraw = `${WithdrawApiUrl}users/${user.id}/withdraws?country=${user.country}&filter=${filter}`

    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }
    const withdraws = await ApiGetRequest(url_withdraw, myHeaders)
    if(!withdraws || withdraws === 465){return false}



    let withdraws_remodeled = await withdraws.map(withdraw => {

      let state
      if(withdraw.currency_type === 'fiat'){
        state = withdraw.state === 'accepted' && !withdraw.sent ? 'confirmed' : withdraw.state
      }
      if(withdraw.currency_type === 'crypto'){
        state = withdraw.state === 'accepted' && !withdraw.proof ? 'confirmed' : withdraw.state
      }

      let new_withdraw = {
        ...withdraw,
        account_id:withdraw.account_id,
        amount:withdraw.amount,
        amount_neto:withdraw.amount_neto,
        comment:"",
        country:withdraw.country,
        currency:withdraw.currency,
        currency_type:withdraw.currency_type,
        cost:withdraw.cost,
        cost_struct:withdraw.cost_struct,
        deposit_provider_id:"",
        expiration_date:new Date(),
        id:withdraw.id,
        state,
        unique_id:withdraw.id,
        userId:withdraw.userId,
        withdraw_account:withdraw.withdraw_account_id,
        withdraw_provider:withdraw.withdraw_provider_id,
        type_order:"withdraw",
        withdraw_proof:withdraw.proof,
        created_at:withdraw.created_at,
      }
      return  new_withdraw
    })


    await dispatch(normalized_list(withdraws_remodeled, 'withdraws'))
    await dispatch(update_activity_state(account_id, 'withdraws', withdraws_remodeled))
    return withdraws_remodeled

  }

}

































//
