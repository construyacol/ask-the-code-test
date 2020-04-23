import Environment from '../environment'
import * as data_model_actions from './dataModelActions'
import * as services from '../utils'
import { IncreaseStep, ReduceStep } from './formActions'
import { toast } from 'react-toastify';
import convertCurrencies from '../utils/convert_currency'
import moment from 'moment'
import 'moment/locale/es'
// import * as Sentry from '@sentry/browser';

import { coins } from '../components/api/ui/api.json'
import user_source from '../components/api'

// MODELOS DE PARA HACER PRUEBAS EN CASO DE QUE EL API ESTE INACCESIBLE
// import pairs from '../components/api/ui/modelo_pairs.json'
// import deposit_providers from '../components/api/ui/deposit_providers.json'
// import deposits from '../components/api/ui/deposits.json'
// import withdraw_providersJSON from '../components/api/ui/withdraw_provider.json'
// import withdraw_accountsJSON from '../components/api/ui/withdrawAccounts/withdraw_accounts.json'
import * as normalizr_services from '../schemas'

import {
  ApiGetRequest,
  ApiPostRequest,
  ApiDelete,
  generate_headers
} from './API'

import {
  toast_sound,
  show_sound,
  add_coin_sound
} from './soundActions'

import {
  // update_activity,
  pending_activity
} from './storage'

import {
  isAppLoaded,
  appLoadLabelAction
} from './loader'

import {
  current_section_params,
  pairsForAccount,
  verificationStateAction
  // new_fiat_deposit
} from './uiActions'
// import { MainService } from '../services/MainService';

const {
  normalizeUser,
  // normalize_data
} = normalizr_services

const {
  loadLocalPairsAction,
  getAllPairsAction,
  searchCurrentPairAction,
  loadLocalCurrencyAction,
  UserPairs,
  updateNormalizedDataAction,
  resetModelData,
  updateAllCurrenciesAction,
  manageBalanceAction,
  // all_pairs_landing
} = data_model_actions

const {
  matchItem,
  desNormalizedList,
  withdrawProvidersByType,
  addIndexToRootObject,
  objectToArray,
  serve_orders,
  update_activity_state
} = services

const { ApiUrl, IdentityApIUrl, CountryApIUrl, AccountApiUrl, DepositApiUrl, WithdrawApiUrl, SwapApiUrl } = Environment

let local_currency
moment.locale('es')
// Sentry.init({dsn: "https://5cae2e853bb1487cbd40c223556d3760@sentry.io/1478048"});


// const sentryCaptureMessage = (title, msg) => {
//   console.log('||||| =======> sentryCaptureMessage', 'title: ', title, 'message', msg)
//   Sentry.captureMessage(title, msg);
//   // alert('enviando mensaje a sentry')
// }

export const loadFirstEschema = () => {
  return async (dispatch) => {
    const dataNormalized = await normalizeUser(user_source)
    dispatch(updateNormalizedDataAction(dataNormalized))
  }
}

// export const inicializarClasses = (country, callback) => async(dispatch, state) => {
//   alert()
//   return new MainService(dispatch, state(), state().modelData.authData.userToken).init(country, callback)
// }

export const mensaje = (msg, type, position) => {
  return async (dispatch) => {

    setTimeout(() => {
      dispatch(toast_sound())
    }, 300)

    toast(msg, {
      position: toast.POSITION[!position ? 'BOTTOM_RIGHT' : position],
      pauseOnFocusLoss: false,
      draggablePercent: 60,
      className: `${type === 'error' ? 'toastError' : type === 'success' ? 'DCfondo' : 'DCfondoDefault'}`,
      bodyClassName: `${type === 'error' ? 'toastErrorText' : type === 'success' ? 'DCTtext' : 'DCTtextDefault'}`,
      progressClassName: `${type === 'error' ? 'ErroProgressBar' : type === 'success' ? 'DCProgress' : 'DCProgress'}`,
      autoClose: 4000
    })
  }
}





export const get_historical_price = (currency, amount_days, api_key) => {

  return async (dispatch, getState) => {

    // let url = `https://min-api.cryptocompare.com/data/histoday?fsym=${currency}&tsym=USD&limit=${amount_days}&api_key={${api_key}}`
    // let res = await ApiGetRequest(url) //fetch
    // if(res.Response === 'Error'){return false} //Error message
    // // console.log(res)
    // // alert()
    // if(res.Data && !res.Data.length){return false} //Error message
    //
    // let days = res.Data.length - 1
    // let price_date = []
    // let data_price = []
    //
    // res.Data.map(item => {
    //     let date_ago = moment().subtract(days, 'days').calendar()
    //     price_date.push(date_ago)
    //     data_price.push(item.close)
    //     return days--
    // })
    //
    // return {
    //   price_date,
    //   data_price
    // }

    // const { user, user_id } = getState().modelData


    const body = {
      "data": {
        "currency_from": "BTC",
        "currency_to": "USD",
        "amount_days": 45
      }
    }

    let price_list = [], date_list = []
    
    const url_historical_price = `https://info1.devsertec.com/api/cryptoCompares/get-daily-historical-data`
    // const url_historical_price = `${CountryApIUrl}cryptoCompares/get-daily-historical-data`
    let prices = await ApiPostRequest(url_historical_price, body)

    if (prices === 465 || !prices) { return false }

    const { historical_data } = prices.data

    for (let data of historical_data) {
      price_list.push(data.close_price)
      date_list.push(data.date)
    }

    return { price_list: price_list.reverse(), date_list }

  }

}



// export const get_all_pairs = (token, country) => {
//   return async (dispatch, getState) => {
    // const test = new MainService(dispatch, getState(), token)
//     return test.fetchAllPairs()
//   }
// }


const addSymboltoLocalCollections = async (cop_pairs, local_currency, currencies) => {
  let new_cop_pairs = []

  cop_pairs.map(pair => {
    let secondaryShortName = matchItem(currencies, { primary: local_currency }, 'currency')
    let primaryShortName = matchItem(currencies, { primary: pair.primary_currency.currency }, 'currency')
    if (!primaryShortName || !secondaryShortName) { return false }
    return new_cop_pairs.push({
      ...pair,
      secondaryShortName: secondaryShortName[0].symbol,
      primaryShortName: primaryShortName[0].symbol
    })
  })
  return new_cop_pairs
}



const getLocalCurrency = async country => {

  // https://sendatx.ngrok.io/

  const get_data_country = `${ApiUrl}countries?filter={"where": {"name": "${country}"}}`
  const data_country = await ApiGetRequest(get_data_country)
  if ((!data_country || data_country) && data_country.length < 1) { return false }
  // console.log('||||||||||| get_local_COUNTRY', data_country)
  let local_currency_id = data_country[0].currency_id

  const result = `${ApiUrl}currencies?filter={"where": {"id": "${local_currency_id}"}}`
  const local_currency_data = await ApiGetRequest(result)
  if ((!local_currency_data || local_currency_data) && local_currency_data.length < 1) { return false }


  let local_currency

  await local_currency_data.map(currency => {
    return local_currency = {
      currency: currency.currency,
      currency_type: currency.currency_type,
      localCurrency: currency.symbol.toLowerCase(),
      country
    }
  })


  return local_currency
  //
  //
  // const url_result = `${ApiUrl}currencies?filter={"where":{"currency_type":"fiat"},"include":{"relation":"countrys","scope":{"where":{"name":"${country}"}}}}`
  // const currencies = await ApiGetRequest(url_result)
  // // console.log('|||||| CurrencyList =========> ', country, currencies)
  // // alert('')
  // if(!currencies || currencies.length < 1){return false}
  //
  // let local_currency
  //
  //  await currencies.map(currency => {
  //       let belongs_to_country = matchItem( currency.countrys, {primary:country}, 'name')
  //       if(!belongs_to_country){return false}
  //       return local_currency = {
  //         currency:currency.currency,
  //         currency_type:currency.currency_type,
  //         localCurrency:currency.symbol.toLowerCase(),
  //         country
  //         }
  //     })
  // return local_currency
}


export const getPairsByCountry = (country, user_collection) => {
  return async (dispatch, getState) => {
    // return console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||| getPairsByCountry', getState())
    // return new MainService(dispatch, getState(), getState().modelData.authData.userToken).getPairsByCountry(country)
  }

}








export const get_user_pairs = async (user_collection, dispatch, data) => {
  const result = []
  // Bitcoin vendra por defecto en la primer posición del user_collection, asi que:
  // buscamos si hay una coincidencia de 'bitcoin' en user_collection no hacemos nada,
  let bitcoin = await matchItem(user_collection, { primary: 'bitcoin' }, 'primary')
  // si no hay coincidencia lo agregamos en la primer posición
  if (!bitcoin) { user_collection.unshift({ primary: 'bitcoin' }) }

  user_collection.map(async item => {
    //comparamos cada item de los pares que provee el usuario(user_collection)
    // si existen dentro de las colecciones de las vistas(coins)
    let coinView = await matchItem(coins, item, 'view')
    // y al mismo tiempo en los pares de las cotizaciones disponibles en el servidor(data)
    let coinQuote = await matchItem(data, item, 'quote')
    // si no existe en las dos listas entonces no se actualiza el estado "pairs.user_collection"
    if (coinView && coinQuote) {
      await result.push(coinView)
      await dispatch(UserPairs(result))
    } else { return console.log(`El par del usuario no estan disponibles en el server`) } //Handle error
  })
}





export const getPairs = (primary, secondary, all) => {

  return async (dispatch) => {
    if (primary && !secondary) {
      // consulte todos los pares disponibles donde la moneda primaria es "primary"
      // let query = `{"where": {"primary_currency":{"eq": {"currency" : "${primary}", "is_token" : false}} }}`
      let query = `{"where": {"primary_currency.currency": "${primary}"}}`
      let res = await get_this_pair(query)

      if (all) { return res }
      return res[0]
    }

    if (!primary && secondary) {
      // consulte todos los pares disponibles donde la moneda secundaria  es "secondary"
      let query = `{"where": {"secondary_currency.currency": "${secondary}"}}`
      let res = await get_this_pair(query)
      if (all) { return res }
      return res[0]
    }

    if (!primary || !secondary) { return false }

    const query = `{"where": {"primary_currency.currency": "${primary}", "secondary_currency.currency": "${secondary}"}}`
    let res = await get_this_pair(query)
    return res[0]
  }

}



export const get_this_pair = async (query) => {

  const url = `${SwapApiUrl}pairs?filter=${query}`
  const pairs = await ApiGetRequest(url)
  if (pairs && pairs.length < 1) { return false }
  return pairs
}

// export const currency_calculator_exported = (currency, amount_spend , pair_id) =>{
//   return async(dispatch) => {
//     return currency_calculator(currency, amount_spend , pair_id)
//   }
// }
//
//
// const currency_calculator = async(currency, amount_spend , pair_id) =>{
//   // return async(dispatch) => {
//
//    const body = {
//      "data":{
//          "to_spend_currency":currency,
//       "want_to_spend":amount_spend,
//          "pair_id":pair_id
//        }
//     }
//
//     const url_convert_currency = `${ApiUrl}swaps/convert-currencies`
//     const converted = await ApiPostRequest(url_convert_currency, body)
//     return converted
//   // }
// }


export const get_pair_default = (current_wallet, local_currency, current_pair) => {
  return async (dispatch) => {


    if ((current_pair && current_pair.pair_id) || !current_wallet) { return false }
    let currency = current_wallet.currency.currency
    let pair;
    // buscamos los pares, por defecto primero buscara el par de la moneda de la cuenta actual cotizando en la moneda fiat local, si no, buscara la cotización en bitcoin, si no la que encuentre ya sea como moneda primaria o secundaria
    pair = await getPairs(currency, local_currency)()
    !pair && (pair = await getPairs('bitcoin', currency)())
    !pair && (pair = await getPairs(currency)())
    !pair && (pair = await getPairs(null, currency)())


    if (!pair) { return false }

    let pair_id = pair.id

    const data = await convertCurrencies(current_wallet.currency, '1', pair_id)


    // console.log('====>  convertCurrencies res =>', data)


    if (data) {
      const { to_spend_currency } = data
      return dispatch(pairsForAccount(current_wallet.id, {
        current_pair: {
          pair_id: pair_id,
          currency: to_spend_currency.currency,
          currency_value: data.want_to_spend
        }
      }))
    }

  }
}





export const get_account_balances = user => {

  return async (dispatch, state) => {

    await dispatch(appLoadLabelAction('Obteniendo tus balances'))
    const url_balance = `${AccountApiUrl}users/${user.id}/accounts`
    // IMPORTANT: This cause undefined action call
    let myHeaders = generate_headers(null, state)

    let balances = await ApiGetRequest(url_balance, myHeaders)
    // console.log('===========> BALANCES:', balances)
    if (!balances || balances === 465 || balances.length < 1) { return false }
    let balance_list = balances.map(balance => {
      return {
        id: balance.id,
        currency: balance.currency.currency,
        reserved: balance.reserved,
        available: balance.available,
        total: parseFloat(balance.reserved) + parseFloat(balance.available),
        lastAction: null,
        actionAmount: 0
      }
    })


    let user_update = {
      ...user,
      balances: [
        ...balance_list
      ]
    }
    // return console.log('========> BALANCES', user_update)

    let list_user_balances = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(list_user_balances))
    return list_user_balances

  }

}



export const ManageBalance = (account_id, action, amount) => {

  return async (dispatch, getState) => {
    const { user_id } = getState().modelData
    let user = getState().modelData.user


    const url_balance = `${AccountApiUrl}users/${user.id}/accounts`
    let myHeaders = {
      'Authorization': `Bearer ${user.userToken}`,
    }
    let balances_res = await ApiGetRequest(url_balance, myHeaders)
    if (!balances_res || balances_res === 465) { return false }
    let balance_list = balances_res.map(balance => {
      return {
        id: balance.id,
        currency: balance.currency.currency,
        reserved: balance.reserved,
        available: balance.available,
        total: parseFloat(balance.reserved) + parseFloat(balance.available),
        lastAction: null,
        actionAmount: 0
      }
    })

    let user_update = {
      ...user,
      balances: [
        ...balance_list
      ]
    }

    let list_user_balances = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(list_user_balances))

    dispatch(manageBalanceAction(account_id, action, amount))


  }
}








// ACCOUNTS SERVICES --------------------------------------------------------------------------------------

export const get_list_user_wallets = (user) => {
  // console.log('||||||||||||||°°°°--------get_list_user_wallets--------°°°°|||||||||||||', user)

  return async (dispatch, state) => {

    await dispatch(appLoadLabelAction('Obteniendo tus billeteras'))
    // const url_wallets = `${ApiUrl}accounts?filter={"where": {"userId": "${user.id}"}}`

    const url_wallets = `${AccountApiUrl}users/${user.id}/accounts`
    let myHeaders = generate_headers(null, state)
    let wallets = await ApiGetRequest(url_wallets, myHeaders)
    // return console.log('________________________________', wallets)
    // if(!wallets){wallets = walletsJSON}
    if (!wallets || wallets === 404) { return false }
    if (wallets && wallets.length < 1) {
      await dispatch(resetModelData({ wallets: [] }))
    }


    // let visible_wallets = wallets
    let visible_wallets = []
    wallets.map(wallet => {
      // if(wallet.currency.currency === 'usd' || wallet.currency.currency === 'bitcoin_testnet'){return false}
      // console.log('|||||||||||||||||||||||||||||||||||||| wallet ===> ', (wallet.currency.currency === 'bitcoin' && wallet.available !== 0) && wallet)
      if (!wallet.visible || wallet.currency.currency === 'usd') { return false }
      // if(wallet.currency.currency === 'usd' || wallet.currency.currency === 'bitcoin' || (wallet.currency.currency === 'bitcoin_testnet' && wallet.name !== 'Default_name_bitcoin_testnet')){return false}
      return visible_wallets.push({ ...wallet, visible: true })
    })

    let user_update = {
      ...user,
      wallets: [
        ...visible_wallets
      ]
    }

    let list_user_wallets = await normalizeUser(user_update)
    console.log('list_user_wallets', list_user_wallets)
    await dispatch(updateNormalizedDataAction(list_user_wallets))
    return list_user_wallets
  }
}



// Agregar deposit provider a cuenta crypto
// /api/accounts/add-deposit-provider

// {
//   "access_token": {{access_token}},
//   "data": {
//     "account_id": "5ba6f987176b6a7c40fb8190"
//   }
// }



// export const temporaryFetchDepositProviders = () => {
//   return async (dispatch, getState) => {
//     const test = new MainService(dispatch, getState(), getState().modelData.authData.userToken)
//     await test.initialize(dispatch, getState(), getState().modelData.authData.userToken)
//     return test.fetchDepositProviders()
//   }
//
// }
//
//
// export const temporaryFetchWithdrawProviders = () => {
//   return async (dispatch, getState) => {
//     const test = new MainService(dispatch, getState(), getState().modelData.authData.userToken)
//     await test.initialize(dispatch, getState(), getState().modelData.authData.userToken)
//     await test.fetchWithdrawProviders()
//   }
// }
//
//
// export const temporaryFetchWithdrawAccounts = () => {
//   return async (dispatch, getState) => {
//     const test = new MainService(dispatch, getState(), getState().modelData.authData.userToken)
//     await test.initialize(dispatch, getState(), getState().modelData.authData.userToken)
//     // alert('fetch api action')
//     return test.fetchWithdrawAccounts()
//   }
// }


// ACCOUNTS SERVICES BY ID --------------------------------------------------------------------------------------

export const getWalletsById = (wallet_id) => {
  return async (dispatch, getState) => {
    const user = getState().modelData.user
    // 1consultamos la wallet
    // const url_wallet = `${AccountApiUrl}accounts?filter={"where": {"id": "${wallet_id}"}}`
    let myHeaders = generate_headers(null, getState)
    const url_wallet = `${AccountApiUrl}users/${user.id}/accounts?filter={"where": {"id": "${wallet_id}"}}`
    const wallet = await ApiGetRequest(url_wallet, myHeaders)

    if ((wallet && wallet.length < 1) || !wallet || wallet === 404) { return false }
    let deposit_provider = null

    if (wallet[0].dep_prov.length > 0) {
      // 2 si la wallet tiene deposit providers consultamos el ultimo disponible y lo modelamos
      let id_provider = await wallet[0].dep_prov[wallet[0].dep_prov.length - 1]
      // console.log('||||||||||___________deposit_provider VERIFY', id_provider)
      const url_dep_prov = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}&filter={"where": {"id":"${id_provider}"}}`
      // const url_dep_prov = `${AccountApiUrl}depositProviders?filter={"where": {"id": "${id_provider}"}}`
      // console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°| getWalletsById :', url_dep_prov)
      deposit_provider = await ApiGetRequest(url_dep_prov, myHeaders)
    }
    // console.log('||||||||||___________deposit_provider', deposit_provider)
    const model_wallet = {
      ...wallet[0],
      deposit_provider: !deposit_provider ? null : { ...deposit_provider[0] }
    }

    return model_wallet

  }
}



// CREATE NEW ACCOUNT (WALLET) ----------------------------------------------------------------------------------------

export const create_new_wallet = (body) => {
  return async (dispatch, getState) => {
    const { user, user_id } = getState().modelData
    const url_new_account = `${AccountApiUrl}accounts/add-new-account`
    return ApiPostRequest(url_new_account, body, user.userToken)
    // get_list_user_wallets()
    // console.log('|||||||||||°°°°°°° - -  create_new_wallet -  - -°°°°°°°|||||||||||', new_wallet)
  }
}


// DELETE ACCOUNT (WALLET - WITHDRAW)--------------------------------------------------------------------------------------------------

export const delete_account = (account, type) => {
  return async (dispatch, getState) => {

    const { id, country } = account

    // let url_delet_account
    const { user, user_id } = getState().modelData
    const url_delet_account = `${AccountApiUrl}accounts/update-visibility`

    let body = {
      data: {
        account_id: id,
        country,
        visible: false
      }
    }
    let deleteAccount = await ApiPostRequest(url_delet_account, body, user.userToken)
    // console.log('||||| _________________________ deleteAccount', deleteAccount)
    if (!deleteAccount || deleteAccount === 404 || deleteAccount === 465) { return false }
    return deleteAccount










    // let url_delet_account
    // // if(type === 'withdraw_accounts'){
    // //   const { user, user_id, withdraw_accounts } = getState().modelData
    // //   url_delet_account = `${WithdrawApiUrl}withdrawAccounts/update-visibility`
    // //   let body = {
    // //     "data": {
    // //       "withdraw_account_id":`${account_id}`,
    // //       "country":withdraw_accounts[account_id].info.country,
    // //       "visible":false
    // //     }
    // //   }
    // //   let deleteAccount = await ApiPostRequest(url_delet_account, body, user.userToken)
    // //   // return console.log('||||| _________________________ deleteAccount', deleteAccount)
    // //   return deleteAccount
    // // }
    // url_delet_account = `${AccountApiUrl}accounts/${account_id}`
    // let deleteAccount = await ApiDelete(url_delet_account)
    // return deleteAccount
  }
}


export const delete_withdraw_account = (account_id) => {
  return async (dispatch, getState) => {
    let url_delet_account
    const { user, user_id, withdraw_accounts } = getState().modelData
    url_delet_account = `${WithdrawApiUrl}withdrawAccounts/update-visibility`
    let body = {
      "data": {
        "withdraw_account_id": `${account_id}`,
        "country": withdraw_accounts[account_id].info.country,
        "visible": false
      }
    }
    let deleteAccount = await ApiPostRequest(url_delet_account, body, user.userToken)
    console.log('||||| _________________________ deleteAccount', deleteAccount, body)
    return deleteAccount
  }
}





// CONFIRM DEPOSIT FIAT ORDER --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const confirmDepositOrder = (ticket, base64) => {
  return async (dispatch, getState) => {

    const {
      id
    } = ticket
    // console.log('ticket', ticket)
    const { user, user_id } = getState().modelData

    const body = {
      // "access_token":user.userToken,
      "data": {
        "country": user.country,
        "deposit_id": id,
        "state": "confirmed",
        // "account_id": account_id,
        "proof_of_payment": {
          "type": "image",
          "proof": base64
        }
      }
    }

    // console.log('confirmDepositOrder', body)

    // return console.log('body', body)


    // http://localhost:3001/api/deposits/add-update-deposit
    //
    // {
    //   "access_token": {{access_token}},
    //   "data": {
    //     "unique_id": "1549507497484688584",
    //     "state": "confirmed",
    //     "account_id": "5c19d6ed89c42e352f1297ff",
    //     "proof_of_payment": {
    //       "proof": "image_base_64_encoded"
    //     }
    //   }
    // }

    const url_confirm_deposit = `${DepositApiUrl}deposits/add-update-deposit`
    const confirm_deposit = await ApiPostRequest(url_confirm_deposit, body, user.userToken, true)


    return confirm_deposit
    // console.log('PERO QUE TE PASAAAAAA CABRÓN??, LAME BICHOOOO', confirm_deposit)
  }
}







// CREATE DEPOSIT FIAT ORDER ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const create_deposit_order = (
  currency,
  amount,
  account_id,
  cost_id,
  deposit_service,
  user,
  service_mode,
  deposit_provider_id
) => {

  return async (dispatch) => {



    const body = {
      // "access_token":user.userToken,
      "data": {
        "currency": currency,
        "amount": amount,
        "cost_id": cost_id,
        "deposit_provider_id": deposit_provider_id,
        "info": { deposit_service, service_mode },
        "comment": "",
        "account_id": account_id,
        "country": user.country
      }
    }
    // return console.log('jum')
    const url_new_order = `${DepositApiUrl}deposits/add-new-deposit`
    const new_fiat_deposit = await ApiPostRequest(url_new_order, body, user.userToken)

    console.log('|||||| =====> RES REQUEST: ', new_fiat_deposit, ' | BODY', body)

    if (new_fiat_deposit === 465 || !new_fiat_deposit) { return false }
    const { data } = new_fiat_deposit
    // await dispatch(new_fiat_deposit(new_fiat_deposit))
    // return new_fiat_deposit
    // de aqui para abajo debemos separarlo en otro proceso, asyncrono
    return data
  }
}


export const delete_deposit_order = order_id => {
  return async (dispatch, getState) => {
    // const url_delete_deposit_order = `${DepositApiUrl}deposits/${order_id}`
    // return ApiDelete(url_delete_deposit_order)

    const { user, user_id } = getState().modelData

    const body = {
      "data": {
        "country": user.country,
        "deposit_id": order_id,
        "state": "canceled"
      }
    }
    // return console.log('jum')
    const url_delete_order = `${DepositApiUrl}deposits/add-update-deposit`
    // return console.log('DEPOSIT DELETE INFO',url_delete_order, body)
    return ApiPostRequest(url_delete_order, body, user.userToken)
  }
}


// export const normalize_new_item = (user, list, item, prop) =>{
//   // list =>  normalized data
//   return async(dispatch) =>{
//
//        let new_list = await desNormalizedList(list, user[prop])
//
//        // console.log('Desnormalized List deposits - - - ', new_list)
//
//        let user_update = {
//          ...user,
//          [prop]:[
//            item,
//            ...new_list
//
//          ]
//        }
//        // console.log('=========> user_update - - - ', user_update)
//         let normalizeUser = await normalizeUser(user_update)
//         await dispatch(updateNormalizedDataAction(normalizeUser))
//         // console.log('=========> normalizeUser - - - ', normalizeUser)
//
//   }
// }


export const edit_array_element = (search_by, replace_prop, array_list, new_position, edit_list) => {
  // @Params
  // let search_by = {
  //   name:"id",
  //   id:data.id
  // }
  // => Objeto que contiene en el .name el indice por el que sera identificado el elemento en la lista a editar
  // let replace_prop = {
  //   name:"state",
  //   state:"confirmed"
  // }
  // => Objeto que contiene la propiedad objetivo que será remmplazada en el modelo del elemento matcheado
  // array_list => Lista original que será editada

  return async (dispatch, getState) => {
    // alert('Pelotudo')
    // console.log('|||||| °°°°° search_by', search_by.name, search_by[search_by.name])
    // console.log('|||||| °°°°° replace_prop', replace_prop.name, replace_prop[replace_prop.name])
    // console.log('|||||| array_list ---', array_list)

    const { user } = getState().modelData

    if (!edit_list) { edit_list = 'deposits' }

    if (!array_list) {
      let normalize_list = getState().modelData[edit_list]
      array_list = user[edit_list].map(list_id => {
        return normalize_list[list_id]
      })
    }


    let item_result = await matchItem(array_list, { primary: search_by[search_by.name] }, search_by.name)
    if ((!item_result || item_result) && item_result.length < 1) { return false }

    let new_item = {
      ...item_result[0],
      [replace_prop.name]: replace_prop[replace_prop.name]
    }

    let new_array_list = []
    // new position colocará el item en la primer posición de la lista
    if (new_position) { new_array_list.push(new_item) }

    await array_list.map(item => {
      if (new_position) {
        if (item[search_by.name] === search_by[search_by.name]) { return false }
      } else {
        // new_position === false dejará el item en la posición original de la lista
        if (item[search_by.name] === search_by[search_by.name]) { return new_array_list.push(new_item) }
      }

      return new_array_list.push(item)
    })

    // let user_update = {
    //   ...user,
    //   [edit_list]: [
    //     ...new_array_list
    //   ]
    // }

    // // console.log('____________________USER UPDATE', user_update, edit_list)

    // await dispatch(updateUser(user_update))

    return new_array_list

    // console.log('|||||| new_array_list ---', new_array_list)


  }

}



export const add_item_state = (list_type, new_order) => {
  return async (dispatch, getState) => {

    const { user_id } = getState().modelData
    let list = getState().modelData[list_type]
    let user = getState().modelData.user

    let user_update = {
      ...user,
      [list_type]: {
        new_order,
        ...list
      }
    }


    let normalizedUser = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(normalizedUser))
    return normalizedUser

    // dispatch(UpdatePendingSwap(swaps_update))
    // console.log('||||| NEW_SWAP_LIST', swaps_update)
  }
}


// const charge_funds = props =>{
//
//   return async(dispatch) => {
//     const charge_funds_body = {
//         "data": {
//           "currency":"cop",
//           "amount":"10"
//         }
//     }
//
//     const url_charge_debug_funds = `${ApiUrl}accounts/charge-debug-funds`
//     await ApiPostRequest(url_charge_debug_funds, charge_funds_body)
//   }
//
// }



export const add_new_swap = (account_id, pair_id, value) => {
  return async (dispatch, getState) => {

    // await charge_funds()
    const { user, user_id } = getState().modelData

    const body = {
      // "access_token":user.userToken,
      "data": {
        "want_to_spend": value.toString(),
        "pair_id": pair_id,
        "account_from": account_id,
        "country": user.country
      }
    }

    const add_new_swap_url = `${SwapApiUrl}swaps/add-new-swap`
    const new_swap = await ApiPostRequest(add_new_swap_url, body, user.userToken)
    // console.log('°°°°°|||||||||||||||| RESULTADO SWAP....', new_swap)
    if (!new_swap || new_swap === 465) { return false }

    const {
      data
    } = new_swap

    // ApiPostRequest(url_charge_debug_funds, charge_funds_body)

    return data
  }
}






export const add_done_swap = (swaps, user, done_swap, update_list) => {
  return async (dispatch) => {
    let new_swap = {
      ...swaps[done_swap.id],
      state: "accepted"
    }

    let updated_swaps = {
      ...swaps,
      [new_swap.id]: {
        ...new_swap
      }
    }

    let array_swaps = await desNormalizedList(updated_swaps, user.swaps)
    // console.log('________________DEPURANDO', array_swaps, new_swap)
    if (update_list) { await update_list(array_swaps) }

    let user_update = {
      ...user,
      swaps: [
        ...array_swaps
      ]
    }
    // console.log('||||| SWAPS', user_update)

    let normalizedUser = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(normalizedUser))
    return normalizedUser
    // dispatch(UpdatePendingSwap(swaps_update))
    // console.log('||||| NEW_SWAP_LIST', swaps_update)
  }
}



// export const get_currency_from_contra_pair = (swap_pair, currency_account ) =>{
//
//     if(swap_pair.primary_currency.currency === currency_account.currency){
//       return swap_pair.secondary_currency.currency
//     }
//
//     if(swap_pair.secondary_currency.currency === currency_account.currency){
//       return swap_pair.primary_currency.currency
//     }
//
// }




// OBTENER LISTA DE SWAPS---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// export const getSwapList = () => {
//
//   return async (dispatch, getState) => {
//     alert('getSwapList')
    // return new MainService(dispatch, getState(), getState().modelData.authData.userToken).getSwapList()
//
//     const { modelData } = getState()
//     const { wallets } = modelData
//     const user = modelData.user
//
//
//     await dispatch(appLoadLabelAction('Obteniendo tus registros de intercambios'))
//     // const url_swaps = `${ApiUrl}swaps?filter={"where": {"userId": "${user.id}"}}`
//     const url_swaps = `${SwapApiUrl}users/${user.id}/swaps?country=${user.country}`
//     let myHeaders = {
//       'Authorization': `Bearer ${user.userToken}`,
//     }
//     const swaps = await ApiGetRequest(url_swaps, myHeaders)
//
//     // console.log('RES SWAPS ===============================================>', swaps)
//
//     if (!swaps) { return false }
//     let remodeled_swaps = []
//     swaps.map(async (swap) => {
//       // obtenemos la moneda que cotiza en contra del par, pasandole como params, el swap, el par del swap y la moneda de la cuenta donde se origino el intercambio, la moneda que se gasto
//       // let currency_bought
//
//       // if(wallets[swap.account_from] && all_pairs[swap.pair_id]){
//       //   currency_bought = get_currency_from_contra_pair(all_pairs[swap.pair_id], wallets[swap.account_from].currency)
//       // }
//
//       let new_swap = {
//         account_id: swap.account_from,
//         account_to: swap.account_to,
//         amount: swap.bought,
//         amount_neto: swap.bought,
//         pair_id: swap.pair_id,
//         comment: "",
//         action_price: swap.action_price,
//         currency: swap.to_spend_currency,
//         currency_type: wallets[swap.account_from] && wallets[swap.account_from].currency_type,
//         cost: "",
//         deposit_provider_id: "",
//         expiration_date: new Date(),
//         id: swap.id,
//         state: swap.state === 'rejected' ? 'canceled' : swap.state,
//         bought: swap.bought,
//         currency_bought: swap.to_buy_currency,
//         spent: swap.spent,
//         type_order: "swap"
//       }
//       remodeled_swaps.push(new_swap)
//     })
//
//     // console.log('RES new_swap ===============================================>', remodeled_swaps)
//
//     remodeled_swaps.reverse()
//
//     let user_update = {
//       ...user,
//       swaps: [
//         ...remodeled_swaps
//       ]
//     }
//
//     let normalizeUser = await normalizeUser(user_update)
//     await dispatch(updateNormalizedDataAction(normalizeUser))
//     return normalizeUser
//
//   }
// }







//
// deposit_cost --> cost
// provider.payment_method --> provider_type
// provider.account --> mejorado
//
//
// cost --> cost_struct
//
// http://localhost:3001/api/deposits/add-new-deposit
//
// {
//   "access_token": {{access_token}},
//   "data": {
//     "currency": {
//         "currency" : "cop",
//         "is_token" : false
//       },
//     "amount": "1000000",
//     "cost_id": "en_efectivo",
//     "deposit_provider_id": "5c5941b94820f94673d22d8e",
//     "info": "",
//     "comment": "",
//     "account_id": "5c19d6ed89c42e352f1297ff"
//   }
// }


// http://localhost:3001/api/deposits/add-update-deposit
//
// {
//   "access_token": {{access_token}},
//   "data": {
//     "unique_id": "1549507497484688584",
//     "state": "confirmed",
//     "account_id": "5c19d6ed89c42e352f1297ff",
//     "proof_of_payment": {
//       "proof": "image_base_64_encoded"
//     }
//   }
// }





// OBTENER LISTA DE DEPOSITOS---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------








export const get_withdraw_accounts = (user, withdrawProviders) => {
  return async (dispatch, state) => {
    const { user } = state().modelData;
    let myHeaders = generate_headers(null, state)

    await dispatch(appLoadLabelAction('Obteniendo cuentas de retiro'))
    const get_wAccounts_url = `${WithdrawApiUrl}users/${user.id}/withdrawAccounts?country=${user.country}&filter={"where":{"visible":true}}`

    // const get_wAccounts_url = `${ApiUrl}withdrawAccounts?filter=${query}`
    let withdraw_accounts = await ApiGetRequest(get_wAccounts_url, myHeaders)
    if (!withdraw_accounts || withdraw_accounts === 465 || !withdrawProviders) { return false }

    let providers_served = await withdrawProvidersByType(withdrawProviders)
    let new_withdraw_accounts = await withdraw_accounts.map(wa => {

      if (providers_served[wa.provider_type].currency_type === 'fiat') {
        return {
          id: wa.id,
          account_number: {
            ui_name: providers_served[wa.provider_type].info_needed.account_number.ui_name,
            value: wa.info.account_number
          },
          account_type: {
            ui_name: providers_served[wa.provider_type].info_needed.account_type[wa.info.account_type].ui_name,
            value: wa.info.account_type
          },
          bank_name: {
            ui_name: providers_served[wa.provider_type].info_needed.bank_name[wa.info.bank_name].ui_name,
            value: wa.info.bank_name
          },
          city: {
            ui_name: providers_served[wa.provider_type].info_needed.city[wa.info.city].ui_name,
            value: wa.info.city
          },
          provider_name: wa.info.bank_name,
          used_counter: wa.used_counter,
          email: wa.info.email,
          id_number: wa.info.id_number,
          name: wa.info.name,
          surname: wa.info.surname,
          inscribed: wa.used_counter > 0 ? true : false,
          visible: wa.visible,
          provider_type: wa.provider_type,
          provider_max_amount: providers_served[wa.provider_type].provider.max_amount,
          provider_min_amount: providers_served[wa.provider_type].provider.min_amount,
          currency_type: providers_served[wa.provider_type] && providers_served[wa.provider_type].currency_type,
          withdraw_provider: providers_served[wa.provider_type].id,
          ...wa
        }
      }
      else {
        return { //crypto case
          id: wa.id,
          account_name: {
            ui_name: providers_served[wa.provider_type].info_needed.label.ui_name,
            value: wa.info.label
          },
          account_address: {
            ui_name: providers_served[wa.provider_type].info_needed.address.ui_name,
            value: wa.info.address
          },
          used_counter: wa.used_counter,
          inscribed: wa.used_counter > 0 ? true : false,
          visible: wa.visible,
          provider_type: wa.provider_type,
          provider_max_amount: providers_served[wa.provider_type].provider.max_amount,
          provider_min_amount: providers_served[wa.provider_type].provider.min_amount,
          currency_type: providers_served[wa.provider_type] && providers_served[wa.provider_type].currency_type,
          withdraw_provider: providers_served[wa.provider_type].id,
          ...wa
        }
      }

    })

    // console.log('|||||||||||||||||||||||||| ============================>>> new_withdraw_accounts  ===> ', new_withdraw_accounts)

    // return console.log('|111|||||||||||||||  new_withdraw_accounts', new_withdraw_accounts, providers_served)

    let original_list = new_withdraw_accounts
    new_withdraw_accounts.reverse()

    let user_update = {
      ...user,
      withdraw_accounts: [
        ...new_withdraw_accounts
      ]
    }

    let normalizedUser = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(normalizedUser))

    return original_list
  }

}





// TRAER LISTA DE PROVEEDORES DE RETIRO -------------------------- -------------------------- --------------------------


export const get_withdraw_providers = () => {
  // export const get_withdraw_providers = (no_necessary_user, query) =>{

  // ej query: {"where": {"country": "colombia", "enabled":true, "provider_type":"bank"}}

  return async (dispatch, getState) => {

    // const { user, user_id } = getState().modelData
    const user = getState().modelData.user

    // let get_wp_url = `${ApiUrl}withdrawProviders?filter={"where":{"country":"${user.country}"}}`
    let get_wp_url = `${WithdrawApiUrl}withdrawProviders?country=${user.country}`
    await dispatch(appLoadLabelAction('Obteniendo proveedores de retiro'))

    // if(query){
    //   get_wp_url = `${ApiUrl}withdrawProviders?filter=${query}`
    //   return alert('revisar get_withdraw_providers please bitch')
    // }

    let myHeaders = generate_headers(null, getState)

    let withdrawProviders = await ApiGetRequest(get_wp_url, myHeaders)
    // if(!withdrawProviders){withdrawProviders = withdraw_providersJSON}

    // console.log('!!!!!!!!!!!!!!!!!!!!!withdrawProviders', withdrawProviders)
    // return alert('mmierda')

    let user_update = {
      ...user,
      withdrawProviders: [
        ...withdrawProviders
      ]
    }
    let normalizedUser = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(normalizedUser))
    return withdrawProviders

  }
}




// Endpoint: http://localhost:3001/api/withdraws/add-new-withdraw
//
// {
//   "access_token": {{access_token}},
//   "data": {
//     "amount": "10",
//     "account_from": "5c192d7427784234622b73d2",
//   "withdraw_provider": "5c533c06b8bfac1dec27f470",
//   "withdraw_account": "5c535c798de9544460ed6fe3"
//   }
// }
//
// Endpoint: http://localhost:3001/api/withdraws/add-update-withdraw
//
// {
//   "access_token": {{access_token}},
//   "data": {
//     "unique_id": "154874033974252657",
//     "status": "confirmed",
//     "account_from": "5c19d6ed89c42e352f1297ff"
//   }
// }
//
// El primer endpoint es para crear un nuevo withdraw
// El segundo endpoint es para actualizar el estado del withdraw. Se puede actualizar a todos los status que ya están definidos para deposit


// /update-visibility para actualizar la visibilidad del withdraw_account
//
// /**
//   * @name updateVisibility
//   * @description changes the prop visible
//   * @param {Object} data
//   * @param {String} data.withdraw_account_id
//   * @param {Boolean} data.visible
//   */



export const add_update_withdraw = (withdraw_id, state) => {
  return async (dispatch, getState) => {
    const { user, user_id } = getState().modelData

    const body = {
      // "access_token":user.userToken,
      "data": {
        "withdraw_id": withdraw_id,
        "state": state,
        "country": user.country,
      }
    }

    // console.log('||||| add_update_withdraw BODY BEFORE', body)

    const new_update_withdraw_url = `${WithdrawApiUrl}withdraws/add-update-withdraw`
    const new_withdraw_update = await ApiPostRequest(new_update_withdraw_url, body, user.userToken)
    if (!new_withdraw_update || new_withdraw_update === 465) { return false }
    // console.log('|||||||||| ================> RES WITHDRAW', new_withdraw_update)
    // alert('update withdraw')
    return new_withdraw_update

  }
}


export const add_restoreid = async (restore_id, user) => {

    const body = {
      "data": {
        restore_id
      }
    }

    const url_add_restoreid = `${ApiUrl}profiles/add-restoreid`
    const res = await ApiPostRequest(url_add_restoreid, body, user.userToken)

    if (res === 465 || !res) { return false }

    return res

}



// AÑADIR NUEVA ORDEN DE RETIRO -------------------------- -------------------------- --------------------------

export const add_new_withdraw_order = (amount, account_from, withdraw_provider, withdraw_account) => {

  return async (dispatch, getState) => {

    const { user, user_id } = getState().modelData
    const body = {
      // "access_token":user.userToken,
      "data": {
        "amount": amount,
        "account_id": account_from,
        "withdraw_provider_id": withdraw_provider,
        "withdraw_account_id": withdraw_account,
        "country": user.country
      }
    }

    // console.log('|||||| ========> BODY RES WITHDRAW', body)
    // return alert('withdraw service')

    const new_withdraw_url = `${WithdrawApiUrl}withdraws/add-new-withdraw`
    const new_withdraw_order = await ApiPostRequest(new_withdraw_url, body, user.userToken)
    // console.log('|||||| ========> BODY RES WITHDRAW', new_withdraw_order)
    if (!new_withdraw_order || new_withdraw_order === 465) { return false }
    return new_withdraw_order

  }

}



// OBTENER ORDENES DE RETIRO -------------------------- -------------------------- --------------------------
export const get_withdraw_list = (user) => {

  return async (dispatch) => {


    await dispatch(appLoadLabelAction('Obteniendo tus registros de retiros'))
    // 5bea1f01ba84493018b7528c
    // const url_withdraw_list = `${ApiUrl}withdraws?filter={"where":{"userId":"${user.id}"}}`
    const url_withdraw_list = `${WithdrawApiUrl}users/${user.id}/withdraws?country=${user.country}`
    let myHeaders = {
      'Authorization': `Bearer ${user.userToken}`,
    }
    let withdrawals = await ApiGetRequest(url_withdraw_list, myHeaders)
    if ((withdrawals && withdrawals.length < 1) || !withdrawals || withdrawals === 465) { return false }
    let withdrawals_remodeled = []

    await withdrawals.map(withdraw => {
      let new_withdraw = {
        ...withdraw,
        account_id: withdraw.account_id,
        amount: withdraw.amount,
        amount_neto: withdraw.amount_neto,
        comment: "",
        country: withdraw.country,
        currency: withdraw.currency,
        currency_type: withdraw.currency_type,
        cost: withdraw.cost,
        cost_struct: withdraw.cost_struct,
        deposit_provider_id: "",
        expiration_date: new Date(),
        id: withdraw.id,
        state: withdraw.state === 'accepted' && !withdraw.proof ? 'confirmed' : withdraw.state,
        unique_id: withdraw.id,
        userId: withdraw.userId,
        withdraw_account: withdraw.withdraw_account_id,
        withdraw_provider: withdraw.withdraw_provider_id,
        type_order: "withdraw",
        withdraw_proof: withdraw.proof,
        created_at: withdraw.created_at,
      }
      return withdrawals_remodeled.push(new_withdraw)
    })
    // console.log('=====>   GET WITHDRAWALS ', withdrawals_remodeled)

    withdrawals_remodeled.reverse()

    let user_update = {
      ...user,
      withdrawals: [
        ...withdrawals_remodeled
      ]
    }



    let normalizeUser = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(normalizeUser))


    return normalizeUser

    // return withdrawals

  }

}





export const delete_withdraw_order = order_id => {

  return async (dispatch) => {
    const url_delete_withdraw_order = `${ApiUrl}withdraws/${order_id}`
    let res = await ApiDelete(url_delete_withdraw_order)
    // console.log('delete_withdraw_order', res)
    return res
  }

}


export const ready_to_play = payload => {

  return async (dispatch) => {
    // dispatch(success_sound())
    dispatch(isAppLoaded(payload))
  }

}















// AGREGAR CUENTA DE RETIRO -----------------------------------------------------------------------

export const add_new_withdraw_account = (payload, type) => {
  return async (dispatch, getState) => {

    const { user, user_id } = getState().modelData
    const {
      provider_type,
      name,
      surname,
      id_number,
      id_type,
      short_name,
      account_number,
      account_type,
      city,
      currency
    } = payload

    let body

    if (type === 'crypto') {
      body = {
        // "access_token":user.userToken,
        "data": {
          ...payload
        }
      }
    } else {
      body = {
        // "access_token":user.userToken,
        "data": {
          "currency": currency,
          "provider_type": provider_type,
          "name": name,
          "surname": surname,
          "id_number": id_number || user.id_number,
          "id_type": id_type,
          "bank_name": short_name,
          "account_number": account_number,
          "account_type": account_type,
          "city": city,
          "email": user.email || 'default@coinsenda.com',
          "label": short_name,
          "country": user.country
        }
      }
    }

    console.log('|||||||||||| - - - - add new Waccount', body)

    const new_wa_url = `${WithdrawApiUrl}withdrawAccounts/add-new-withdraw-account`
    const new_wa = await ApiPostRequest(new_wa_url, body, user.userToken)
    // console.log('°°°°°|||||||||||||||| RESULTADO add_new_withdraw_account....', new_wa)
    if (!new_wa || new_wa === 465) { return false }

    const {
      data
    } = new_wa

    // ApiPostRequest(url_charge_debug_funds, charge_funds_body)

    return data
  }
}






export const FlowAnimationLayoutAction = (animation, action, current_section, explicitStep) => {

  return async (dispatch) => {
    // dispatch(FlowAnimationUi(animation))
    switch (action) {
      case 'next':
        // setTimeout(()=>{
        dispatch(IncreaseStep(current_section, explicitStep))
        // }, 130)
        break;
      case 'back':
        // setTimeout(()=>{
        dispatch(ReduceStep(current_section, explicitStep))
        // }, 130)
        break;
      default:
        return false
    }
  }
}










export const add_new_transaction_animation = () => {
  return async (dispatch) => {

    dispatch(current_section_params({ new_deposit_style: true }))
    setTimeout(() => {
      dispatch(current_section_params({ new_deposit_style: false }))
    }, 1000)
    setTimeout(() => {
      dispatch(show_sound())
    }, 550)
  }
}






// OBTENER MONEDAS DISPONIBLES EN COINSENDA ------------------------------------------------------------------------------------

export const get_all_currencies = () => {
  return async (dispatch) => {


    await dispatch(appLoadLabelAction('Obteniendo todas las divisas'))
    const url_currencies = `${ApiUrl}currencies`
    let currencies = await ApiGetRequest(url_currencies)
    let new_currencies = []

    // en caso de que ocurra un error en esta petición cargaremos con datos harcodeados el modelo
    if (!currencies) {
      new_currencies = coins
      dispatch(updateAllCurrenciesAction(new_currencies))
      return new_currencies
    }


    for (let i = 0; i < currencies.length; i++) {
      // if(currencies[i].currency !== "bitcoin_testnet"){
      // if(currencies[i].currency !== "bitcoin"){
      let spllit = currencies[i].node_url && currencies[i].node_url.split("api")
      let new_item = {
        "currency_type": currencies[i].currency_type,
        "id": currencies[i].id,
        "type": "coins",
        "name": currencies[i].currency,
        "code": currencies[i].symbol.toLowerCase(),
        "selection": false,
        "is_token": currencies[i].is_token,
        "min_amount": currencies[i].deposit_min_amount,
        ...currencies[i],
        "node_url": spllit && spllit[0]
      }
      new_currencies.push(new_item)
      // }
    }
    dispatch(updateAllCurrenciesAction(new_currencies))
    return new_currencies
  }
}








// IDENTITY ENDPOINTS ---------------------------------------------------------------------------------------


export const get_user = (token, user_country, userId, email, restore_id) => {
  return async (dispatch, state) => {

    await dispatch(appLoadLabelAction('Cargando tu información'))

    // let body = {
    //   "access_token":token,
    //   "data": {
    //     "country":user_country
    //   }
    // }


    // 1. inicializamos el estado con el token y el country del usuario
    const init_state_url = `${IdentityApIUrl}countryvalidators/findOne?country=${user_country}`
    let myHeaders = generate_headers(token, state)
    let init_state = await ApiGetRequest(init_state_url, myHeaders)
    // console.log('===================================>>>>   init_state', init_state, userId)


    if (!init_state) { return false }

    // 2. Obtenemos el status del usuario del cual extraemos el id y el country

    // const get_status_url = `${IdentityApIUrl}status/get-status`
    // body = {
    //   "data": {}
    // }
    // const status = await ApiPostRequest(get_status_url, body, token)
    // if(!status || status === 465){return false}


    const get_status_url = `${IdentityApIUrl}users/${userId}/status`
    let status = await ApiGetRequest(get_status_url, myHeaders)

    // console.log('===================================>>>>   identity status', status)

    // const { data } = status

    let country_object = await addIndexToRootObject(status.countries)
    let country = await objectToArray(country_object)

    let user_update = {
      ...user_source,
      email,
      restore_id,
      id: status.userId,
      country: country[0].value,
      verification_level: country[0].verification_level,
      verification_error: country[0].errors && country[0].errors[0],
      levels: country[0].levels
    }

    // return console.log('||||||  - - -.  --  status  =====> ', user_update)
    // let profile = await dispatch(get_profile(user_update.id, token))

    // provitional line
    // user_update.security_center.kyc.basic = "confirmed"

    // if((profile.countries[country[0].value] !== 'level_0') && (user_update.verification_level !== 'level_0')){
    let kyc_personal = country[0].levels && country[0].levels.personal
    let kyc_identity = country[0].levels && country[0].levels.identity
    let kyc_financial = country[0].levels && country[0].levels.financial

    if (kyc_personal) {
      user_update.security_center.kyc.basic = kyc_personal
    }

    if (kyc_identity) {
      user_update.security_center.kyc.advanced = kyc_identity
    }

    if (kyc_financial) {
      user_update.security_center.kyc.financial = kyc_financial
    }
    // }




    // para setear el estado desde el api maneja los siguientes endpoints
    // Setea el token del usuario en el swagger
    // DELETE /profiles/{id} => Elimina el profile enviandole el id
    // DELETE /status => Eliminar status
    // POST /status/update
    // where: {"userId": "5d234a113035be2e18a953ca"}
    // {
    //     "userId": "5d234a113035be2e18a953ca",
    //     "countries": {
    //       "colombia": {
    //         "verification_level": "level_1",
    //         "levels": {
    //           "personal": "accepted",
    //           "identity": "accepted"
    //         }
    //       }
    //     },
    //     "need_review": false,
    //     "need_human": false,
    //     "ring": "155437564351921065",
    //     "id": "5ca5e2ecf0e6656d7567d216"
    //   }




    // user_update.security_center.kyc.basic = 'accepted'
    // user_update.security_center.kyc.advanced = 'accepted'
    // user_update.security_center.kyc.financial = 'accepted'




    //3. Obtenemos el profile del usuario, si no retorna nada es porque el nivel de verificación del usuario es 0 y no tiene profile en identity
    // const get_profile_url = `${IdentityApIUrl}profiles/get-profile`
    // const profile_data = await ApiPostRequest(get_profile_url, body, token)

    const get_profile_url = `${IdentityApIUrl}users/${userId}/profiles`
    let profile_data = await ApiGetRequest(get_profile_url, myHeaders)

    if (profile_data && profile_data.length > 0) {
      // Agregamos la información al modelo usuario (user_update)
      user_update = {
        ...user_update,
        ...profile_data[0].personal,
        person_type: profile_data[0].person_type
      }
    }
    // console.log('||||||  - - -.  --  USER UPDATE', user_update)
    // return console.log('||||||  - - -.  --  USER UPDATE', profile_data)

    let normalizedUser = await normalizeUser(user_update)

    await dispatch(updateNormalizedDataAction(normalizedUser))
    // console.log('||||||  - - -.  --  normalizeUser', normalizeUser)
    return normalizedUser
  }
}






export const updateUser = new_user => {
  return async (dispatch) => {
    let normalizedUser = await normalizeUser(new_user)
    dispatch(updateNormalizedDataAction(normalizedUser))
  }
}


export const get_verification_state = () => {

  return async (dispatch, getState) => {

    const { user, user_id } = getState().modelData
    if (!user) { return false }
    const user_data = user
    const { advanced, basic } = user_data.security_center.kyc

    let verification_state_data = (advanced === 'rejected' && basic === 'rejected') ? 'rejected' :
      (advanced === 'confirmed' && basic === 'confirmed') ? 'confirmed' :
        (advanced === 'accepted' && basic === 'accepted') ? 'accepted' :
          (!advanced && !basic) ? null : 'pending'

    await dispatch(verificationStateAction(verification_state_data))

    return verification_state_data

  }
}



// https://api.ip2location.com/v2/?ip=181.55.82.22&key=NBIKK7COQJ&package=WS5

export const country_detect = () => {
  return async (dispatch) => {

    const my_ip_url = 'https://api.ipify.org/?format=json'
    var my_ip_url_request = new Request(my_ip_url);
    let res_ip = await ApiGetRequest(my_ip_url_request)
    if (!res_ip || res_ip === 465 || res_ip === 404) { return false }
    const { ip } = res_ip

    const country_detect_url = `http://api.ipstack.com/${ip}?access_key=1acf821243c5a2b11c257c4b3b9bbffd`
    var myRequest = new Request(country_detect_url);
    let res = await ApiGetRequest(myRequest)
    if (!res || res === 465 || res === 404) { return false }
    return res

  }
}

// Uncomment for select_country component
export const countryvalidators = () => {

  return async (dispatch) => {
    const url_countryvalidators = `${IdentityApIUrl}countryvalidators`
    let res = await ApiGetRequest(url_countryvalidators)
    if (!res || res === 465 || res === 404) { return false }
    let countries = await addIndexToRootObject(res[0].levels.level_1.personal.natural.country)
    // console.log('||| ==================================> LOAD C O U N T R I E S =>2', countries)
    let new_array = await objectToArray(countries)
    let construct_res = {
      res: res[0],
      countries,
      country_list: new_array
    }
    console.log('||| 1. countryvalidators = ', construct_res)
    return construct_res
  }

}









export const update_level_profile = (config, user) => {
  // @Calls
  // ./components/kyc/kyc_container.js

  return async (dispatch) => {
    // "access_token":user.userToken,

    let body = {
      "data": {
        "country": user.country,
        "person_type": user.person_type,
        "info_type": config.info_type,
        "verification_level": config.verification_level,
        "info": config.info
      }
    }


    const add_new_profile_url = `${IdentityApIUrl}profiles/add-new-profile`
    const add_new_profile = await ApiPostRequest(add_new_profile_url, body, user.userToken)
    // console.log('|||||||| update_level_profile_____________', body, add_new_profile)
    // alert('res endpoint')
    if (!add_new_profile || add_new_profile === 465) { return false }
    return add_new_profile

  }

}






export const get_country_list = order_id => {

  return async (dispatch) => {
    const url_country_list = `${CountryApIUrl}countrys`

    let res = await ApiGetRequest(url_country_list)
    // console.log('get_country_list API', url_country_list, res)
    if (!res || res === 465) { return false }
    // let countries = await addIndexToRootObject(res[0].levels.level_1.personal.natural.country)
    // let new_array = await objectToArray(countries)
    // let construct_res = {
    //   res:res[0],
    //   countries,
    //   country_list:new_array
    // }
    // console.log('get_country_list API', res)
    return res
  }

}


export const user_verification_status = (level_request) => {
  // @Call_from
  // ./wallets/views/deposit.js
  // ./wallets/views/withdraw.js

  return async (dispatch, getState) => {

    const { user, user_id } = getState().modelData
    const { advanced, basic, financial } = user.security_center.kyc
    let verified


    switch (level_request) {
      case 'level_1':
        verified = advanced === 'accepted' && basic === 'accepted'
        return verified
      case 'level_2':
        verified = advanced === 'accepted' && basic === 'accepted' && financial === 'accepted'
        return verified
      default:
        return false
    }



  }

}








export const get_profile = (userId, token) => {

  return async (dispatch, state) => {

    let myHeaders = generate_headers(token, state)
    let url_get_profile = `${ApiUrl}users/${userId}/profile`
    let profile = await ApiGetRequest(url_get_profile, myHeaders)
    if (profile === 465) { return false }
    return profile

  }
}


export const add_new_profile = (country, token) => {

  return async (dispatch) => {

    let body = {
      "data": {
        "country": country
      }
    }

    let url_add_profile = `${ApiUrl}profiles/add-new-profile`
    let new_profile = await ApiPostRequest(url_add_profile, body, token)
    if (!new_profile) { return false }

    const { data } = new_profile

    return data
    // let myHeaders = generate_headers(token, state)
    //
    // let url_get_profile = `${ApiUrl}users/${userId}/profile`
    // let profile = await ApiGetRequest(url_get_profile, myHeaders)
    // return profile
  }
}














































// -------- REFERIDOS ----------------------------------------------------------------------------------------------------------------------------------


export const set_ref_code = (ref_code) => {
  return async (dispatch, getState) => {

    const { user, user_id } = getState().modelData

    let body = {
      "access_token": user.userToken,
      "data": {
        "userId": user.id,
        "country": "colombia",
        "new_ref_code": ref_code
      }
    }

    const url_create_ref_code = `${ApiUrl}referrals/set-ref-code`
    let res = await ApiPostRequest(url_create_ref_code, body)

    // let user_update = {
    //   ...user,
    //   referral: res
    // }

    // await dispatch(updateUser(user_update))
    return res


  }
}


export const get_ref_code = () => {
  return async (dispatch, getState) => {

    const { user, user_id } = getState().modelData

    const url_get_ref_code = `${ApiUrl}referrals?filter={"where":{"userId":"${user.id}"}}`
    let res = await ApiGetRequest(url_get_ref_code)
    if (!res || res === 465) { return false }

    // let user_update = {
    //   ...user,
    //   referral: res[0]
    // }

    // await dispatch(updateUser(user_update))
    return res && res[0]
    // get_list_user_wallets()
    // console.log('|||||||||||°°°°°°° - -  create_new_wallet -  - -°°°°°°°|||||||||||', new_wallet)
  }
}



// End referidos ---------------------------------------------------------------------------------------------------------------------------------------------





















// export const update_activity_account = (account_id, activity_type, activity_list) =>{
//
//   return async(dispatch, getState) => {
//
//     return dispatch(update_activity_state(account_id, activity_type, activity_list))
//
//     // let current_wallet = getState().modelData.wallets[account_id]
//     //
//     // // if(!current_wallet){
//     // //   current_wallet = getState().ui.current_section.params.current_wallet
//     // // }
//     //
//     // if(!current_wallet){return false}
//     //
//     // if(!activity_list){
//     //   activity_list = await serve_orders(current_wallet.id, activity_type)
//     // }
//     // await dispatch(current_section_params({currentFilter:activity_type}))
//     // await dispatch(update_activity(current_wallet.id, activity_type, activity_list))
//
//   }
//
// }



export const update_pending_activity = (account_id, activity_type, activity_list) => {

  return async (dispatch, getState) => {


    let current_wallet = getState().modelData.wallets[account_id]

    // return console.log('||||||||||||||| update_pending_activity =====> ', current_wallet)

    if (!current_wallet) {
      current_wallet = getState().ui.current_section.params.current_wallet
    }

    if (!current_wallet) { return false }

    if (!activity_type) {
      activity_type = await getState().ui.current_section.params.currentFilter
    }

    if (!activity_list && current_wallet) {
      activity_list = await serve_orders(current_wallet.id, activity_type)
    }

    if (!activity_list) { return false }
    // console.log('-----|||||||| °°°°  current_wallet', current_wallet)
    // console.log('-----|||||||| °°°°  update_pending_activity', activity_type)

    let pending = (activity_type === 'withdraws') ? 0 : await matchItem(activity_list, { primary: 'pending' }, 'state', true)
    let confirmed = await matchItem(activity_list, { primary: 'confirmed' }, 'state', true)
    let rejected = await matchItem(activity_list, { primary: 'rejected' }, 'state', true)

    let expandidoMax = (((pending && pending.length) + (confirmed && confirmed.length)) * 100)
    let pending_data;
    // pending ? (pending_data = pending ? pending_data = {pending:true, lastPending:(activity_type === 'withdrawals' && current_wallet.currency_type === 'fiat') ? confirmed[0].id : pending[0].id} : null) :
    pending ? (pending_data = pending ? pending_data = { pending: true, lastPending: (activity_type === 'withdrawals') ? (confirmed[0] && confirmed[0].id) : pending[0].id } : null) :
      rejected ? (pending_data = rejected ? pending_data = { pending: true, lastPending: rejected[0] && rejected[0].id } : null) :
        confirmed && (pending_data = confirmed ? pending_data = { pending: true, lastPending: confirmed[0] && confirmed[0].id } : null)
    // console.log('|||||||||| PENDING DATA', pending_data, 'Agregar al estado  |  expandidoMax - pending_data')

    let pending_activity_payload = {
      ...pending_data,
      expandidoMax,
      account_id: current_wallet.id,
      activity_type: activity_type
    }

    dispatch(pending_activity(pending_activity_payload))

  }

}



export const swap_activity_update = (swap, filter) => {

  return async (dispatch, getState) => {

    setTimeout(async () => {
      const { user, user_id, swaps } = getState().modelData
      await dispatch(add_done_swap(swaps, user, swap))
      // actualizamos las ordenes de la cuenta desde donde se genera el swap
      await dispatch(update_activity_state(swap.account_from, filter))
      await dispatch(current_section_params({ swap_done_out: false, swap_done_in: true }))
      setTimeout(() => { dispatch(update_pending_activity()) }, 2500)
      setTimeout(() => {
        dispatch(add_coin_sound())
        dispatch(mensaje('Nuevo intercambio realizado', 'success'))
        dispatch(current_section_params({
          swap_done_out: false, swap_done_in: false, swap_done_id: false, swap_socket_channel: {
            unique_id: null,
            status: null
          }
        }))
      }, 3000)

    }, 1800)
  }

}














export default getPairsByCountry
