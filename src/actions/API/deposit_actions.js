import Environment from '../../environment'
import * as normalizr_services from '../../schemas'
import { Update_normalized_state } from '../dataModelActions'


import {
  ApiGetRequest,
  generate_headers,
  // ApiPostRequest,
} from './'

import {
  update_item_state
} from '../dataModelActions'


import {
  app_loaded,
  load_label
} from '../loader'


const { DepositApiUrl } = Environment

const {
  normalize_user,
  normalize_data
} = normalizr_services


export const get_deposit_list = (user) =>{

  return async(dispatch) => {

    await dispatch(load_label('Obteniendo tus registros de deposito'))
    // 5bea1f01ba84493018b7528c
    // const url_deposit = `${ApiUrl}deposits?filter={"where": {"userId": "${user.id}"}}`

    // const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}&filter[include]=paymentProof`
    const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}`
    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }

    const deposits = await ApiGetRequest(url_deposit, myHeaders)
    if(!deposits || deposits === 465){return false}


    let remodeled_deposits = await deposits.map(item => {
      let new_item = {
        ...item,
        type_order:"deposit",
        paymentProof:item.paymentProof && item.paymentProof.proof_of_payment
      }
      return new_item
    })

    await remodeled_deposits.reverse()

    let user_update = {
      ...user,
      deposits:[
        ...remodeled_deposits
      ]
    }


    let normalizeUser = await normalize_user(user_update)
    await dispatch(Update_normalized_state(normalizeUser))
    return normalizeUser

    // return console.log('SERVICE: : get_deposit_list - - ', normalizeUser)


    // const url_deposit = `${ApiUrl}accounts?filter={"where": {"userId": "5bea1f01ba84493018b7528c", "account_id":"5c19d6ed89c42e352f1297ff"}}`

    // const wallet = await ApiGetRequest(url_wallet)
    // console.log('get_deposit_list')
  }
}


export const get_one_deposit = (deposit_id) =>{

  return async(dispatch, getState) => {

    const { user_id }  = getState().model_data
    const user = getState().model_data.user[user_id]

    const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}&filter={"where": {"id":"${deposit_id}"}, "include":{"relation":"paymentProof"}}`

    let myHeaders = await dispatch(generate_headers(user.TokenUser))

    const deposit = await ApiGetRequest(url_deposit, myHeaders)
    if(!deposit || deposit === 465){return false}

    return deposit[0]

    // update_item_state

    // console.log('______________- ==============================>>> - ________________- get_one_deposit', deposit)

    // actualizar el modelo del estado

    //
    // let remodeled_deposits = await deposits.map(item => {
    //   let new_item = {
    //     ...item,
    //     type_order:"deposit",
    //     paymentProof:item.paymentProof && item.paymentProof.proof_of_payment
    //   }
    //   return new_item
    // })
    //
    // await remodeled_deposits.reverse()
    //
    // let user_update = {
    //   ...user,
    //   deposits:[
    //     ...remodeled_deposits
    //   ]
    // }
    //
    //
    // let normalizeUser = await normalize_user(user_update)
    // await dispatch(Update_normalized_state(normalizeUser))
    // return normalizeUser
  }
}
