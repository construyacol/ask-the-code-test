import Environment from '../../environment'
import * as normalizr_services from '../../schemas'
import { updateNormalizedDataAction } from '../dataModelActions'

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
  // isAppLoaded,
  appLoadLabelAction
} from '../loader'



const { DepositApiUrl } = Environment

const {
  normalizeUser,
  // normalize_data
} = normalizr_services

export const create_deposit_provider = (account_id, country) => {

  return async(dispatch, getState) => {

    const user = getState().modelData.user
    // const {  } = getState().modelData
    let body = {
      "data": {
        account_id,
        country
      }
    }

    // return console.log('|||||||||| create_deposit_provider ', body)

    const url_deposit_prov = `${DepositApiUrl}depositProviders/create-deposit-provider-by-account-id`
    const deposit_prov = await ApiPostRequest(url_deposit_prov, body, user.userToken)

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

return async(dispatch, state) => {

    await dispatch(appLoadLabelAction('Obteniendo proveedores de deposito'))
    // const url_dep_prov = `${ApiUrl}depositProviders?filter={"where": {"userId": "${user.id}"}}`
    // const url_dep_prov = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}`
    let myHeaders = generate_headers(null, state)
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
    const user = getState().modelData.user

    const url_deposit = `${DepositApiUrl}users/${user.id}/deposits?country=${user.country}&filter={"where": {"id":"${deposit_id}"}, "include":{"relation":"paymentProof"}}`

    let myHeaders = generate_headers(user.userToken, getState)

    const deposit = await ApiGetRequest(url_deposit, myHeaders)
    if(!deposit || deposit === 465){return false}

    return deposit[0]
  }
}


export const validate_address = (address) =>{

  return async(dispatch, getState) => {
    const user = getState().modelData.user

    const url_address = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}&filter={"where":{"account.account_id.account_id":"${address}" }}`
    let myHeaders = generate_headers(user.userToken, getState)

    const Raddress = await ApiGetRequest(url_address, myHeaders)
    if(!Raddress || Raddress === 465 || !Raddress.length){return false}

    if(address === Raddress[0].account.account_id.account_id){
      return true
    }
    return false

  }
}
