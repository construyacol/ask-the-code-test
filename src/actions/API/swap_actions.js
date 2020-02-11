import Environment from '../../environment'
// import * as normalizr_services from '../../schemas'
// import { update_normalized_state } from '../dataModelActions'


import {
  ApiGetRequest,
  // generate_headers,
  // ApiPostRequest,
} from './'

import {
  // UpdateCurrentPair,
  update_item_state
} from '../dataModelActions'


// import {
//   app_loaded,
//   load_label
// } from '../loader'


import {
  update_activity_state,
  normalized_list
} from '../../services'

const { SwapApiUrl } = Environment

// const {
//   normalize_user,
//   normalize_data
// } = normalizr_services


export const get_swaps = (account_id) => {
// @params:
// account_id

  return async(dispatch, getState) => {

    const user = getState().model_data.user[getState().model_data.user_id]
    const { wallets } = getState().model_data

    let filter = `{"where":{"or":[{"account_to":"${account_id}"}, {"account_from":"${account_id}"} ] }, "limit":30, "order":"id DESC", "include":{"relation":"user"}}`
    const url_swaps = `${SwapApiUrl}users/${user.id}/swaps?country=${user.country}&filter=${filter}`

    // let filter = `{"where":{"account_id":"${account_id}"}, "limit":30, "order":"id DESC", "include":{"relation":"user"}}`

    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }
    const swaps = await ApiGetRequest(url_swaps, myHeaders)
    if(!swaps || swaps === 465){return false}

    let remodeled_swaps = []
    swaps.map(async(swap) => {
      let new_swap = {
        account_id:swap.account_from,
        account_to:swap.account_to,
        amount:swap.bought,
        amount_neto:swap.bought,
        pair_id:swap.pair_id,
        comment:"",
        action_price:swap.action_price,
        currency:swap.to_spend_currency,
        currency_type:wallets[swap.account_from] && wallets[swap.account_from].currency_type,
        cost:"",
        deposit_provider_id:"",
        expiration_date:new Date(),
        id:swap.id,
        state:swap.state === 'rejected' ? 'canceled' : swap.state,
        bought:swap.bought,
        currency_bought:swap.to_buy_currency,
        spent:swap.spent,
        type_order:"swap"
      }
      remodeled_swaps.push(new_swap)
    })

    await dispatch(normalized_list(remodeled_swaps, 'swaps'))
    await dispatch(update_activity_state(account_id, 'swaps', remodeled_swaps))

    return remodeled_swaps

  }

}


export const update_current_pair = (query) => {

  return async(dispatch) => {

    // let proof = {
    //   buy_price: amount || '10000',
    //   sell_price: amount || '10000'
    // }

    const url_current_pair = `${SwapApiUrl}pairs?filter=${query}`
    let current_pair = await ApiGetRequest(url_current_pair)
    if(!current_pair || current_pair === 465){return}
    await dispatch(update_item_state({currentPair:{...current_pair[0]}}, 'pairs'))
    await dispatch(update_item_state({[current_pair[0].id]:{...current_pair[0]}}, 'all_pairs'))
    // console.log('=========================================================> currentPair id', current_pair[0].id)
  }

}




























//
