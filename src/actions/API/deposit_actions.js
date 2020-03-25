import Environment from '../../environment'
import * as normalizr_services from '../../schemas'
import { updateNormalizedDataAction } from '../dataModelActions'

import {
  update_activity_state,
  normalized_list
} from '../../services'

import {
  ApiGetRequest,
  generate_headers,
  ApiPostRequest,
} from './'

// import {
//   update_item_state
// } from '../dataModelActions'

import {
  success_sound
} from '../soundActions'

import {
  // app_loaded,
  appLoadLabelAction
} from '../loader'



const { DepositApiUrl } = Environment

const {
  normalizeUser,
  // normalize_data
} = normalizr_services



export const get_deposits = (account_id) => {
// @params:
// account_id

  return async(dispatch, getState) => {

    const user = getState().modelData.user[getState().modelData.user_id]

    let filter = `{"where":{"account_id":"${account_id}"}, "limit":30, "order":"id DESC", "include":{"relation":"user"}}`
    const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}&filter=${filter}`

    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }

    const deposits = await ApiGetRequest(url_deposit, myHeaders)
    if(!deposits || deposits === 465){return false}

    let remodeled_deposits = await deposits.map(item => {
      let new_item = {
        ...item,
        type_order:"deposit",
        // paymentProof:item.paymentProof && item.paymentProof.proof_of_payment
      }
      return new_item
    })

    // console.log('|||||||||||||||||| get deposits', remodeled_deposits)

    await dispatch(normalized_list(remodeled_deposits, 'deposits'))
    await dispatch(update_activity_state(account_id, 'deposits', remodeled_deposits))
    return remodeled_deposits
  }

}




// export const get_deposit_list = (user) =>{
//
//   return async(dispatch) => {
//
//     await dispatch(appLoadLabelAction('Obteniendo tus registros de deposito'))
//     // 5bea1f01ba84493018b7528c
//     // const url_deposit = `${ApiUrl}deposits?filter={"where": {"userId": "${user.id}"}}`
//
//     // const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}&filter[include]=paymentProof`
//     const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}`
//     let myHeaders = {
//       'Authorization': `Bearer ${user.TokenUser}`,
//     }
//
//     const deposits = await ApiGetRequest(url_deposit, myHeaders)
//     if(!deposits || deposits === 465){return false}
//
//
//     let remodeled_deposits = await deposits.map(item => {
//       let new_item = {
//         ...item,
//         type_order:"deposit",
//         paymentProof:item.paymentProof && item.paymentProof.proof_of_payment
//       }
//       return new_item
//     })
//
//     await remodeled_deposits.reverse()
//
//     let user_update = {
//       ...user,
//       deposits:[
//         ...remodeled_deposits
//       ]
//     }
//
//
//     let normalizeUser = await normalizeUser(user_update)
//     await dispatch(updateNormalizedDataAction(normalizeUser))
//     return normalizeUser
//
//     // return console.log('SERVICE: : get_deposit_list - - ', normalizeUser)
//
//
//     // const url_deposit = `${ApiUrl}accounts?filter={"where": {"userId": "5bea1f01ba84493018b7528c", "account_id":"5c19d6ed89c42e352f1297ff"}}`
//
//     // const wallet = await ApiGetRequest(url_wallet)
//     // console.log('get_deposit_list')
//   }
// }


export const create_deposit_provider = (account_id, country) => {

  return async(dispatch, getState) => {

    const user = getState().modelData.user[getState().modelData.user_id]
    // const {  } = getState().modelData
    let body = {
      "data": {
        account_id,
        country
      }
    }

    const url_deposit_prov = `${DepositApiUrl}depositProviders/create-deposit-provider-by-account-id`
    const deposit_prov = await ApiPostRequest(url_deposit_prov, body, user.TokenUser)

    if(!deposit_prov || deposit_prov === 465){return false}

    const { data } = deposit_prov
    dispatch(success_sound())

    return data[0].id


  }

}


// {
//  "currency_from": "BTC",
//  "currency_to": "USD",
//  "amount_days": 45
// }
//
// /api/cryptoCompares/get-daily-historical-data

// OBTENER DEPOSIT_PROVIDERS

export const get_deposit_providers = (user) => {

return async(dispatch) => {

    await dispatch(appLoadLabelAction('Obteniendo proveedores de deposito'))
    // const url_dep_prov = `${ApiUrl}depositProviders?filter={"where": {"userId": "${user.id}"}}`
    // const url_dep_prov = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}`
    let myHeaders = await dispatch(generate_headers())
    // const deposit_providers = await ApiGetRequest(url_dep_prov, myHeaders)
    // if(!deposit_providers || deposit_providers === 404){return false}

    const deposit_providersDA_url = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}&filter[include]=depositAccount`
    const depositAccounts = await ApiGetRequest(deposit_providersDA_url, myHeaders)
    if(!depositAccounts || depositAccounts === 404){return false}

    let modelDAUpgrade = []
    let indexDA = 0

    depositAccounts.map(depositAccount => {
      // let account = Object.assign({}, depositAccount.depositAccount.account, deposit_providers[indexDA].account);
      // console.log('||||||||| account =>', account)
      let new_deposit_provider = {
        ...depositAccount,
        provider:{
          ...depositAccount.depositAccount,
          account:{
            ...depositAccount.depositAccount.account
          }
        }
      }
      modelDAUpgrade.push(new_deposit_provider)
      return indexDA++
    })

    let user_update = {
      ...user,
      deposit_providers:[
        ...modelDAUpgrade,
        // ...deposit_provider_fiat
      ]
    }

    let dep_provs = await normalizeUser(user_update)
    dispatch(updateNormalizedDataAction(dep_provs))
    return dep_provs.entities.deposit_providers
  }

}



export const get_one_deposit = (deposit_id) =>{

  return async(dispatch, getState) => {

    const { user_id }  = getState().modelData
    const user = getState().modelData.user[user_id]

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
    // let normalizeUser = await normalizeUser(user_update)
    // await dispatch(Update_normalized_state(normalizeUser))
    // return normalizeUser
  }
}


export const validate_address = (address) =>{

  return async(dispatch, getState) => {

    const { user_id }  = getState().modelData
    const user = getState().modelData.user[user_id]

    const url_address = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}&filter={"where":{"account.account_id.account_id":"${address}" }}`
    let myHeaders = await dispatch(generate_headers(user.TokenUser))

    const Raddress = await ApiGetRequest(url_address, myHeaders)
    if(!Raddress || Raddress === 465 || !Raddress.length){return false}
    console.log(Raddress)
    if(address === Raddress[0].account.account_id.account_id){
      return true
    }
    return false

  }
}
