import Environment from '../environment'
import * as data_model_actions from './dataModelActions'
import * as services from '../services'
import { IncreaseStep, ReduceStep } from './formActions'
import { toast } from 'react-toastify';
import convertCurrencies from '../services/convert_currency'
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
  update_activity,
  pending_activity
} from './storage'

import {
  app_loaded,
  load_label
} from './loader'

import {
  current_section_params,
  pairs_for_account,
  verification_state
  // new_fiat_deposit
 } from './uiActions'


const {
  normalize_user,
  normalize_data
} = normalizr_services

const {
LocalPairs,
AllPairs,
SearchCurrentPair,
LocalCurrency,
UserPairs,
Update_normalized_state,
reset_model_data,
UpdateAllCurrencies,
ManageBalanceAction,
all_pairs_landing
} = data_model_actions

const {
matchItem,
desNormalizedList,
withdraw_provider_by_type,
add_index_to_root_object,
objectToArray,
serve_orders
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


export const mensaje = (msg, type, position) =>{
  return async(dispatch) => {

    setTimeout(()=>{
      dispatch(toast_sound())
    }, 300)

    toast(msg, {
      position: toast.POSITION[!position ? 'BOTTOM_RIGHT' : position],
       pauseOnFocusLoss: false,
       draggablePercent: 60,
       className: `${type === 'error' ? 'toastError': type === 'success' ? 'DCfondo' : 'DCfondoDefault'}`,
       bodyClassName: `${type === 'error' ? 'toastErrorText': type === 'success' ? 'DCTtext' : 'DCTtextDefault'}`,
       progressClassName: `${type === 'error' ? 'ErroProgressBar': type === 'success' ? 'DCProgress' : 'DCProgress'}`,
       autoClose: 4000
    })
  }
}





export const get_historical_price = (currency, amount_days, api_key) => {

  return async(dispatch)=>{

    let url = `https://min-api.cryptocompare.com/data/histoday?fsym=${currency}&tsym=USD&limit=${amount_days}&api_key={${api_key}}`
    let res = await ApiGetRequest(url) //fetch
    if(res.Response === 'Error'){return false} //Error message
    // console.log(res)
    // alert()
    if(!res.Data.length){return false} //Error message

    let days = res.Data.length - 1
    let price_date = []
    let data_price = []

    res.Data.map(item => {
        let date_ago = moment().subtract(days, 'days').calendar()
        price_date.push(date_ago)
        data_price.push(item.close)
        return days--
    })

    return {
      price_date,
      data_price
    }

  }

}




export const get_all_pairs = (token, country) =>{
  return async(dispatch)=>{

    // let body = {
    //   // "access_token":token,
    //   "data": {
    //     "country":country
    //   }
    // }


    await dispatch(load_label('Importando pares'))

    const url_pairs = `${SwapApiUrl}pairs`
    // const pairs = await ApiPostRequest(url_pairs, body, true)
    // console.log('=========>    QUE PASA PRRO get_all_pairs', url_pairs)
    let pairs = await ApiGetRequest(url_pairs)
    // return console.log('PARES RES ', pairs)
    if(!pairs || pairs === 465){return false}

    dispatch(AllPairs(pairs))

    let user_update = {
      ...user_source,
      available_pairs:[
        ...pairs
      ]
    }

    let normalize_pairs = await normalize_user(user_update)
    // console.log('|||||||||||||||||||||||||||||||||||||||| - norma_pairs', normalize_pairs)
    dispatch(Update_normalized_state(normalize_pairs))
    return normalize_pairs
    // return pairs
  }
}



export const get_all_pairs_from_landing = () =>{
  return async(dispatch)=>{
    await dispatch(load_label('Importando pares'))
    const url_pairs = `${SwapApiUrl}pairs`
    const pairs = await ApiGetRequest(url_pairs)

    if(!pairs || pairs === 465){return false}
    // const { data } = pairs

    let normalize_pairs = await normalize_data(pairs)
    dispatch(all_pairs_landing(normalize_pairs.entities.all_pairs))
  }
}



    const add_symbol_to_local_collections = async(cop_pairs, local_currency, currencies) =>{
      // console.log('=]======> local_currencies', bitcoin, cop_pairs)

      let new_cop_pairs = cop_pairs.map(pair => {
        let secondary_short_name = matchItem(currencies, {primary:local_currency}, 'currency')
        let primary_short_name = matchItem(currencies, {primary:pair.primary_currency.currency}, 'currency')
        return {
          ...pair,
          secondary_short_name:secondary_short_name[0].symbol,
          primary_short_name:primary_short_name[0].symbol
        }
      })
      return new_cop_pairs
    }



    const get_local_currency = async country =>{

      // https://sendatx.ngrok.io/

      const get_data_country = `${ApiUrl}countries?filter={"where": {"name": "${country}"}}`
      const data_country = await ApiGetRequest(get_data_country)
      if((!data_country || data_country) && data_country.length < 1){return false}
      // console.log('||||||||||| get_local_COUNTRY', data_country)
      let local_currency_id = data_country[0].currency_id

      const get_local_currency = `${ApiUrl}currencies?filter={"where": {"id": "${local_currency_id}"}}`
      const local_currency_data = await ApiGetRequest(get_local_currency)
      if((!local_currency_data || local_currency_data) && local_currency_data.length < 1){return false}


      let local_currency

       await local_currency_data.map(currency => {
            return local_currency = {
              currency:currency.currency,
              currency_type:currency.currency_type,
              localCurrency:currency.symbol.toLowerCase(),
              country
              }
          })


      return local_currency
      //
      //
      // const url_get_local_currency = `${ApiUrl}currencies?filter={"where":{"currency_type":"fiat"},"include":{"relation":"countrys","scope":{"where":{"name":"${country}"}}}}`
      // const currencies = await ApiGetRequest(url_get_local_currency)
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


    export const get_pairs_for = (country, user_collection) => {

      return async(dispatch, getState) => {
        //defino la moneda local con base a la ubicación operativa del usuario
        const { currencies } = getState().model_data

        local_currency = await get_local_currency(country)
        if(!local_currency){return console.log('No se ha encontrado país en get_pairs_for')}
        // consulto en el API todos los pares disponibles que cotizan contra la moneda local del usuario
        const url_pairs = `${SwapApiUrl}pairs?filter={"where": {"secondary_currency.currency": "${local_currency.currency}"}}`
        const pairs = await ApiGetRequest(url_pairs)
        if(!pairs){return false}
        // Actualizo el estado con todas las cotizaciones disponibles en contra(secondary_currency) de la moneda local
        // await dispatch(AllPairs(data))

        let local_currencies

        if(currencies){
          local_currencies = await add_symbol_to_local_collections(pairs, local_currency.currency, currencies)
        }else{
          alert('debes cargar las currencies para continuar')
          return console.log('debes cargar las currencies');
        }


        await dispatch(LocalPairs(local_currencies))
        // console.log('CONSULTANDO TODOS LOS PARES DISPONIBLES::::::', pairs)

        // el parametro user_colecction es un array con las monedas preferidas o por defecto que se le mostraran al usuario en el dashboard
        // este es un parametro opcional, si no se pasa el parametro se mostrará solo la cotización de bitcoin contra la moneda local, si tampoco existe esta cotización, se mostrará la que haya disponible
        if(user_collection){ await get_user_pairs(user_collection, dispatch, pairs)}
        // defino un par por defecto, que será el que se mostrara de primero, bitcoin por default contra la moneda local, en caso de que no exista este par, mostrará el que este disponible
        dispatch(SearchCurrentPair(`BTC/${local_currency.currency.toUpperCase()}`, 'pair'))
        // así mismo actualizo la moneda local del usuario en el estado en redux para posteriores consultas
        dispatch(LocalCurrency(local_currency))
        return pairs
      }

    }








export const get_user_pairs = async(user_collection, dispatch, data) => {
    const result = []
    // Bitcoin vendra por defecto en la primer posición del user_collection, asi que:
    // buscamos si hay una coincidencia de 'bitcoin' en user_collection no hacemos nada,
    let bitcoin = await matchItem(user_collection, {primary:'bitcoin'}, 'primary')
    // si no hay coincidencia lo agregamos en la primer posición
    if(!bitcoin){user_collection.unshift({primary:'bitcoin'})}

    user_collection.map(async item=>{
      //comparamos cada item de los pares que provee el usuario(user_collection)
      // si existen dentro de las colecciones de las vistas(coins)
      let coinView = await matchItem(coins, item, 'view')
      // y al mismo tiempo en los pares de las cotizaciones disponibles en el servidor(data)
      let coinQuote = await matchItem(data, item, 'quote')
      // si no existe en las dos listas entonces no se actualiza el estado "pairs.user_collection"
      if(coinView && coinQuote){
                await result.push(coinView)
                await dispatch(UserPairs(result))
      }else{return console.log(`El par del usuario no estan disponibles en el server`)} //Handle error
    })
}





export const get_pair_from = (primary, secondary, all) =>{

  return async(dispatch)=>{
    return get_pair(primary, secondary, all)
  }

}

const get_pair = async(primary, secondary, all) =>{

    if(primary && !secondary){
     // consulte todos los pares disponibles donde la moneda primaria es "primary"
      // let query = `{"where": {"primary_currency":{"eq": {"currency" : "${primary}", "is_token" : false}} }}`
      let query = `{"where": {"primary_currency.currency": "${primary}"}}`
      let res = await get_this_pair(query)
      if(all){return res}
      return res[0]
    }

    if(!primary && secondary){
     // consulte todos los pares disponibles donde la moneda secundaria  es "secondary"
      let query = `{"where": {"secondary_currency.currency": "${secondary}"}}`
      let res = await get_this_pair(query)
      if(all){return res}
      return res[0]
    }

    if(!primary || !secondary){return false}

    const query = `{"where": {"primary_currency.currency": "${primary}", "secondary_currency.currency": "${secondary}"}}`
    let res = await get_this_pair(query)
    return res[0]

}



export const get_this_pair = async(query) => {

  const url = `${SwapApiUrl}pairs?filter=${query}`
  const pairs = await ApiGetRequest(url)
  if(pairs && pairs.length<1){return false}
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
  return async(dispatch) =>{


    if((current_pair && current_pair.pair_id) || !current_wallet){return false}
    let currency = current_wallet.currency.currency
    let pair;
    // buscamos los pares, por defecto primero buscara el par de la moneda de la cuenta actual cotizando en la moneda fiat local, si no, buscara la cotización en bitcoin, si no la que encuentre ya sea como moneda primaria o secundaria
      pair = await get_pair(currency, local_currency)
      !pair && (pair = await get_pair('bitcoin', currency))
      !pair && (pair = await get_pair(currency))
      !pair && (pair = await get_pair(null, currency))


    if(!pair){return false}

    let pair_id = pair.id
    // return console.log('____________________________________________get_pair_default', pair)

    // console.log('====>  convertCurrencies', current_wallet.currency, pair_id)

    const data = await convertCurrencies(current_wallet.currency, '1', pair_id)


    // console.log('====>  convertCurrencies res =>', data)


    if(data){
      const { to_spend_currency } = data
      return dispatch(pairs_for_account(current_wallet.id, {
          current_pair:{
            pair_id:pair_id,
            currency:to_spend_currency.currency,
            currency_value:data.want_to_spend
          }
      }))
    }

  }
}





export const get_account_balances = user => {

  return async(dispatch) =>{

    await dispatch(load_label('Obteniendo tus balances'))
    const url_balance = `${AccountApiUrl}users/${user.id}/accounts`
    let myHeaders = await dispatch(generate_headers())

    let balances = await ApiGetRequest(url_balance, myHeaders)

    if(!balances || balances === 465 || balances.length<1){return false}
    // console.log('===========> BALANCES:', balances)
    let balance_list = balances.map(balance => {
      return {
        id:balance.id,
        currency:balance.currency.currency,
        reserved:balance.reserved,
        available:balance.available,
        total:parseFloat(balance.reserved) + parseFloat(balance.available),
        lastAction:null,
        actionAmount:0
      }
    })


    let user_update = {
      ...user,
      balances:[
        ...balance_list
      ]
    }
    // return console.log('========> BALANCES', user_update)

    let list_user_balances = await normalize_user(user_update)
    await dispatch(Update_normalized_state(list_user_balances))
    return list_user_balances

  }

}



export const ManageBalance = (account_id, action, amount) => {

  return async(dispatch, getState) =>{
    const { user_id } = getState().model_data
    let user = getState().model_data.user[user_id]


    const url_balance = `${AccountApiUrl}users/${user.id}/accounts`
    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }
    let balances_res = await ApiGetRequest(url_balance, myHeaders)
    if(!balances_res || balances_res === 465){return false}
    let balance_list = balances_res.map(balance => {
      return {
        id:balance.id,
        currency:balance.currency.currency,
        reserved:balance.reserved,
        available:balance.available,
        total:parseFloat(balance.reserved) + parseFloat(balance.available),
        lastAction:null,
        actionAmount:0
      }
    })

    let user_update = {
      ...user,
      balances:[
        ...balance_list
      ]
    }

    let list_user_balances = await normalize_user(user_update)
    await dispatch(Update_normalized_state(list_user_balances))

    dispatch(ManageBalanceAction(account_id, action, amount))


  }
}








// ACCOUNTS SERVICES --------------------------------------------------------------------------------------

export const get_list_user_wallets = (user) =>{
  // console.log('||||||||||||||°°°°--------get_list_user_wallets--------°°°°|||||||||||||', user)

  return async(dispatch) =>{

    await dispatch(load_label('Obteniendo tus billeteras'))
    // const url_wallets = `${ApiUrl}accounts?filter={"where": {"userId": "${user.id}"}}`

    const url_wallets = `${AccountApiUrl}users/${user.id}/accounts`
    let myHeaders = await dispatch(generate_headers())
    let wallets = await ApiGetRequest(url_wallets, myHeaders)
    // return console.log('________________________________', wallets)
    // if(!wallets){wallets = walletsJSON}
    if(!wallets || wallets === 404){return false}
    if(wallets && wallets.length<1){
      await dispatch(reset_model_data({wallets:[]}))
    }


    let visible_wallets = wallets
    // let visible_wallets = []
    //  wallets.map(wallet => {
    //    if(wallet.currency.currency === 'usd' || wallet.currency.currency === 'bitcoin_testnet'){return false}
    //    return visible_wallets.push(wallet)
    //  })

      let user_update = {
        ...user,
        wallets:[
          ...visible_wallets
        ]
      }

      let list_user_wallets = await normalize_user(user_update)
      await dispatch(Update_normalized_state(list_user_wallets))
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



// OBTENER DEPOSIT_PROVIDERS

export const get_deposit_providers = (user) => {

return async(dispatch) => {

    await dispatch(load_label('Obteniendo proveedores de deposito'))
    // const url_dep_prov = `${ApiUrl}depositProviders?filter={"where": {"userId": "${user.id}"}}`
    const url_dep_prov = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}`
    let myHeaders = await dispatch(generate_headers())
    const deposit_providers = await ApiGetRequest(url_dep_prov, myHeaders)
    if(!deposit_providers || deposit_providers === 404){return false}

    const deposit_providersDA_url = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}&filter[include]=depositAccount`
    const depositAccounts = await ApiGetRequest(deposit_providersDA_url, myHeaders)
    if(!depositAccounts || depositAccounts === 404){return false}

    let modelDAUpgrade = []
    let indexDA = 0
    depositAccounts.map(depositAccount => {
      let account = Object.assign({}, depositAccount.depositAccount.account, deposit_providers[indexDA].account);
      let new_deposit_provider = {
        ...deposit_providers[indexDA],
        provider:{
          ...depositAccount.depositAccount,
          account:{
            ...account
          }
        }
      }
      modelDAUpgrade.push(new_deposit_provider)
      return indexDA++
    })


    // const url_dep_prov_fiat = `${ApiUrl}depositProviders?filter={"where":{"provider_type":"bank","country":"${user.country}"}}`
    // const deposit_provider_fiat = await ApiGetRequest(url_dep_prov_fiat)
    // if(!deposit_provider_fiat || deposit_provider_fiat === 404){return false}

    let user_update = {
      ...user,
      deposit_providers:[
        ...modelDAUpgrade,
        // ...deposit_provider_fiat
      ]
    }

    let dep_provs = await normalize_user(user_update)
    dispatch(Update_normalized_state(dep_provs))
  }

}



// ACCOUNTS SERVICES BY ID --------------------------------------------------------------------------------------

export const get_wallet_by_id = (wallet_id) =>{
  return async(dispatch, getState) =>{
    const user = getState().model_data.user[getState().model_data.user_id]
    // 1consultamos la wallet
    // const url_wallet = `${AccountApiUrl}accounts?filter={"where": {"id": "${wallet_id}"}}`
    let myHeaders = await dispatch(generate_headers())
    const url_wallet = `${AccountApiUrl}users/${user.id}/accounts?filter={"where": {"id": "${wallet_id}"}}`
    const wallet = await ApiGetRequest(url_wallet, myHeaders)

    if((wallet && wallet.length<1) || !wallet || wallet === 404){return false}
    let deposit_provider=null

    if(wallet[0].dep_prov.length>0){
      // 2 si la wallet tiene deposit providers consultamos el ultimo disponible y lo modelamos
      let id_provider = await wallet[0].dep_prov[wallet[0].dep_prov.length-1]
      console.log('||||||||||___________deposit_provider VERIFY', id_provider)
      const url_dep_prov = `${DepositApiUrl}users/${user.id}/depositProviders?country=${user.country}&filter={"where": {"id":"${id_provider}"}}`
      // const url_dep_prov = `${AccountApiUrl}depositProviders?filter={"where": {"id": "${id_provider}"}}`
      // console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°| get_wallet_by_id :', url_dep_prov)
      deposit_provider = await ApiGetRequest(url_dep_prov, myHeaders)
    }
    console.log('||||||||||___________deposit_provider', deposit_provider)
    const model_wallet = {
      ...wallet[0],
      deposit_provider:!deposit_provider ? null : {...deposit_provider[0]}
    }

    return model_wallet

  }
}



// CREATE NEW ACCOUNT (WALLET) ----------------------------------------------------------------------------------------

export const create_new_wallet = (body) =>{
  return async(dispatch, getState)=>{
    const { user, user_id } = getState().model_data
    const url_new_account = `${AccountApiUrl}accounts/add-new-account`
    return ApiPostRequest(url_new_account, body, user[user_id].TokenUser)
    // get_list_user_wallets()
    // console.log('|||||||||||°°°°°°° - -  create_new_wallet -  - -°°°°°°°|||||||||||', new_wallet)
  }
}


// DELETE ACCOUNT (WALLET - WITHDRAW)--------------------------------------------------------------------------------------------------

export const delete_account = (account_id, type) =>{
  return async(dispatch, getState)=>{
    let url_delet_account
    if(type === 'withdraw'){
      const { user, user_id } = getState().model_data
      url_delet_account = `${WithdrawApiUrl}withdrawAccounts/update-visibility`
      let body = {
        "data": {
          "withdraw_account_id":`${account_id}`,
          "country":user[user_id].country,
          "visible":false
        }
      }
      let deleteAccount = await ApiPostRequest(url_delet_account, body, user[user_id].TokenUser)
      // return console.log('||||| _________________________ deleteAccount', deleteAccount)
      return deleteAccount
    }
    url_delet_account = `${AccountApiUrl}accounts/${account_id}`
    let deleteAccount = await ApiDelete(url_delet_account)
    return deleteAccount
  }
}






// CONFIRM DEPOSIT FIAT ORDER --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const confirm_deposit_order = (ticket, base64) =>{
  return async(dispatch, getState) =>{

    const {
      id
    } = ticket
    // console.log('ticket', ticket)
    const { user, user_id } = getState().model_data

    const body = {
      // "access_token":user[user_id].TokenUser,
      "data": {
        "country":user[user_id].country,
        "deposit_id": id,
        "state": "confirmed",
        // "account_id": account_id,
        "proof_of_payment": {
          "type":"image",
          "proof":base64
        }
      }
    }

    // console.log('confirm_deposit_order', body)

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
    const confirm_deposit = await ApiPostRequest(url_confirm_deposit, body, user[user_id].TokenUser, true)


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
  deposits,
  service_mode,
  deposit_provider_id
) => {

  return async(dispatch) =>{



    const body = {
        // "access_token":user.TokenUser,
        "data": {
          "currency": currency,
          "amount": amount,
          "cost_id": cost_id,
          "deposit_provider_id":deposit_provider_id,
          "info": {deposit_service, service_mode},
          "comment": "",
          "account_id": account_id,
          "country":user.country
        }
      }
    // return console.log('jum')
    const url_new_order = `${DepositApiUrl}deposits/add-new-deposit`
    const new_fiat_deposit = await ApiPostRequest(url_new_order, body, user.TokenUser)

    // console.log('|||||| =====> RES REQUEST: ', new_fiat_deposit, '| BODY' , body)

    // sentryCaptureMessage('add-new-deposits', new_fiat_deposit)

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




    // console.log('BOOOOOOODY!!!!,', body , new_fiat_deposit)

    // const new_fiat_deposit = {
    //   "account_id": "5c04f873eb9c94511fd2edfc",
    //   "amount": "300000",
    //   "amount_neto": "300000",
    //   "comment": "Putoooo",
    //   "cost_id": "Otros medios",
    //   "currency":currency,
    //   "currency_type": "fiat",
    //   "cost": "0",
    //   "deposit_provider_id": "5c0d57120fcccc1c74575e50",
    //   "expiration_date": "2019-01-03T07:47:21.037Z",
    //   "id": "5c2726896be6a827dfc0e40d",
    //   "info":"",
    //   "state": "pending",
    //   "userId": "5bea1f01ba84493018b7528c"
    // }

    if(new_fiat_deposit === 465 || !new_fiat_deposit){return false}
    const { data } = new_fiat_deposit
    // await dispatch(new_fiat_deposit(new_fiat_deposit))
    // return new_fiat_deposit
  // de aqui para abajo debemos separarlo en otro proceso, asyncrono
    return data
  }
}


export const delete_deposit_order = order_id =>{
  return async(dispatch, getState)=>{
    // const url_delete_deposit_order = `${DepositApiUrl}deposits/${order_id}`
    // return ApiDelete(url_delete_deposit_order)

    const { user, user_id } = getState().model_data

    const body = {
        "data": {
          "country":user[user_id].country,
          "deposit_id":order_id,
          "state":"canceled"
        }
      }
    // return console.log('jum')
    const url_delete_order = `${DepositApiUrl}deposits/add-update-deposit`
    // return console.log('DEPOSIT DELETE INFO',url_delete_order, body)
    return ApiPostRequest(url_delete_order, body, user[user_id].TokenUser)
  }
}


export const normalize_new_item = (user, list, item, prop) =>{
  // list =>  normalized data
  return async(dispatch) =>{

       let new_list = await desNormalizedList(list, user[prop])

       // console.log('Desnormalized List deposits - - - ', new_list)

       let user_update = {
         ...user,
         [prop]:[
           item,
           ...new_list

         ]
       }
       // console.log('=========> user_update - - - ', user_update)
        let normalizeUser = await normalize_user(user_update)
        await dispatch(Update_normalized_state(normalizeUser))
        // console.log('=========> normalizeUser - - - ', normalizeUser)

  }
}


export const edit_array_element = (search_by, replace_prop, array_list, new_position, edit_list) =>{
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

  return async(dispatch, getState) =>{
    // alert('Pelotudo')
    // console.log('|||||| °°°°° search_by', search_by.name, search_by[search_by.name])
    // console.log('|||||| °°°°° replace_prop', replace_prop.name, replace_prop[replace_prop.name])
    // console.log('|||||| array_list ---', array_list)

    const { user, user_id } = getState().model_data

    if(!edit_list){edit_list = 'deposits'}

    if(!array_list){
      let normalize_list = getState().model_data[edit_list]
      array_list =  user[user_id][edit_list].map(list_id => {
          return normalize_list[list_id]
        })
    }


    let item_result = await matchItem(array_list, {primary:search_by[search_by.name]}, search_by.name)
    if((!item_result || item_result) && item_result.length<1){return false}

    let new_item = {
      ...item_result[0],
      [replace_prop.name]:replace_prop[replace_prop.name]
    }

    let new_array_list = []
    // new position colocará el item en la primer posición de la lista
    if(new_position){new_array_list.push(new_item)}

    await array_list.map(item => {
      if(new_position){
        if(item[search_by.name] === search_by[search_by.name]){return false}
      }else{
        // new_position === false dejará el item en la posición original de la lista
        if(item[search_by.name] === search_by[search_by.name]){return new_array_list.push(new_item)}
      }

      return new_array_list.push(item)
    })

    let user_update = {
      ...user[user_id],
      [edit_list]:[
        ...new_array_list
      ]
    }

    // console.log('____________________USER UPDATE', user_update, edit_list)

    await dispatch(update_user(user_update))

    return new_array_list

    // console.log('|||||| new_array_list ---', new_array_list)


  }

}



export const add_order_to = (prop, list, user, new_order) =>{
  return async(dispatch) => {

    let new_list = await desNormalizedList(list, user[prop])
    // let new_list = `new_${prop}`
    new_list = [
      new_order,
      ...new_list
    ]

    let user_update = {
      ...user,
      [prop]:[
        ...new_list
      ]
    }

    let normalizeUser = await normalize_user(user_update)
    await dispatch(Update_normalized_state(normalizeUser))
    return normalizeUser

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



export const add_new_swap = (account_id, pair_id, value) =>{
  return async(dispatch, getState) =>{

    // await charge_funds()
    const { user, user_id } = getState().model_data

    const body = {
        // "access_token":user[user_id].TokenUser,
        "data": {
          "want_to_spend":value.toString(),
          "pair_id":pair_id,
          "account_from":account_id,
          "country":user[user_id].country
        }
    }

    const add_new_swap_url = `${SwapApiUrl}swaps/add-new-swap`
    const new_swap = await ApiPostRequest(add_new_swap_url, body, user[user_id].TokenUser)
    // console.log('°°°°°|||||||||||||||| RESULTADO SWAP....', new_swap)
    if(!new_swap || new_swap === 465){return false}

    const {
      data
    } = new_swap

    // ApiPostRequest(url_charge_debug_funds, charge_funds_body)

    return data
  }
}






export const add_done_swap = (swaps, user, done_swap, update_list) =>{
  return async(dispatch) => {
    let new_swap = {
      ...swaps[done_swap.id],
      state:"accepted"
    }

    let updated_swaps = {
      ...swaps,
      [new_swap.id]:{
        ...new_swap
      }
    }

    let array_swaps = await desNormalizedList(updated_swaps, user.swaps)
    // console.log('________________DEPURANDO', array_swaps, new_swap)
    if(update_list){await update_list(array_swaps)}

    let user_update = {
      ...user,
      swaps:[
        ...array_swaps
      ]
    }
    // console.log('||||| SWAPS', user_update)

    let normalizeUser = await normalize_user(user_update)
    await dispatch(Update_normalized_state(normalizeUser))
    return normalizeUser
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
export const get_swap_list = () =>{
  return async(dispatch, getState) => {

    const { model_data } =  getState()
    const { wallets } = model_data
    const user = model_data.user[model_data.user_id]


    await dispatch(load_label('Obteniendo tus registros de intercambios'))
    // const url_swaps = `${ApiUrl}swaps?filter={"where": {"userId": "${user.id}"}}`
    const url_swaps = `${SwapApiUrl}users/${user.id}/swaps?country=${user.country}`
    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }
    const swaps = await ApiGetRequest(url_swaps, myHeaders)

    // console.log('RES SWAPS ===============================================>', swaps)

    if(!swaps){return false}
    let remodeled_swaps = []
    swaps.map(async(swap) => {
      // obtenemos la moneda que cotiza en contra del par, pasandole como params, el swap, el par del swap y la moneda de la cuenta donde se origino el intercambio, la moneda que se gasto
      // let currency_bought

      // if(wallets[swap.account_from] && all_pairs[swap.pair_id]){
      //   currency_bought = get_currency_from_contra_pair(all_pairs[swap.pair_id], wallets[swap.account_from].currency)
      // }

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

    // console.log('RES new_swap ===============================================>', remodeled_swaps)

    remodeled_swaps.reverse()

    let user_update = {
      ...user,
      swaps:[
        ...remodeled_swaps
      ]
    }

    let normalizeUser = await normalize_user(user_update)
    await dispatch(Update_normalized_state(normalizeUser))
    return normalizeUser

  }
}







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








export const get_withdraw_accounts = (user, withdraw_providers) =>{
  return async(dispatch)=>{

    let myHeaders = await dispatch(generate_headers())

    await dispatch(load_label('Obteniendo cuentas de retiro'))
    const get_wAccounts_url = `${WithdrawApiUrl}users/${user.id}/withdrawAccounts?country=${user.country}`
    // const get_wAccounts_url = `${ApiUrl}withdrawAccounts?filter=${query}`
    let withdraw_accounts = await ApiGetRequest(get_wAccounts_url, myHeaders)
    if(!withdraw_accounts || withdraw_accounts === 465 || !withdraw_providers){return false}

    let providers_served = await withdraw_provider_by_type(withdraw_providers)
    let new_withdraw_accounts = await withdraw_accounts.map(wa => {

      if(providers_served[wa.provider_type].currency_type === 'fiat'){
        return {
          id:wa.id,
          account_number:{
            ui_name:providers_served[wa.provider_type].info_needed.account_number.ui_name,
            value:wa.info.account_number
          },
          account_type:{
            ui_name:providers_served[wa.provider_type].info_needed.account_type[wa.info.account_type].ui_name,
            value:wa.info.account_type
          },
          bank_name:{
            ui_name:providers_served[wa.provider_type].info_needed.bank_name[wa.info.bank_name].ui_name,
            value:wa.info.bank_name
          },
          city:{
            ui_name:providers_served[wa.provider_type].info_needed.city[wa.info.city].ui_name,
            value:wa.info.city
          },
          provider_name:wa.info.bank_name,
          used_counter:wa.used_counter,
          email:wa.info.email,
          id_number:wa.info.id_number,
          name:wa.info.name,
          surname:wa.info.surname,
          inscribed:wa.inscribed,
          visible:wa.visible,
          provider_type:wa.provider_type,
          provider_max_amount:providers_served[wa.provider_type].provider.max_amount,
          provider_min_amount:providers_served[wa.provider_type].provider.min_amount,
          currency_type:providers_served[wa.provider_type] && providers_served[wa.provider_type].currency_type,
          withdraw_provider:providers_served[wa.provider_type].id
        }
      }
      else{
        return { //crypto case
          id:wa.id,
          account_name:{
            ui_name:providers_served[wa.provider_type].info_needed.label.ui_name,
            value:wa.info.label
          },
          account_address:{
            ui_name:providers_served[wa.provider_type].info_needed.address.ui_name,
            value:wa.info.address
          },
          used_counter:wa.used_counter,
          inscribed:wa.inscribed,
          visible:wa.visible,
          provider_type:wa.provider_type,
          provider_max_amount:providers_served[wa.provider_type].provider.max_amount,
          provider_min_amount:providers_served[wa.provider_type].provider.min_amount,
          currency_type:providers_served[wa.provider_type] && providers_served[wa.provider_type].currency_type,
          withdraw_provider:providers_served[wa.provider_type].id
        }
      }

    })
    // return console.log('|111|||||||||||||||  new_withdraw_accounts', new_withdraw_accounts, providers_served)

    let original_list = new_withdraw_accounts
    new_withdraw_accounts.reverse()

        let user_update = {
          ...user,
          withdraw_accounts:[
            ...new_withdraw_accounts
          ]
        }

        let normalizeUser = await normalize_user(user_update)
        await dispatch(Update_normalized_state(normalizeUser))

        return original_list
  }

}





 // TRAER LISTA DE PROVEEDORES DE RETIRO -------------------------- -------------------------- --------------------------


 export const get_withdraw_providers = () =>{
 // export const get_withdraw_providers = (no_necessary_user, query) =>{

   // ej query: {"where": {"country": "colombia", "enabled":true, "provider_type":"bank"}}

   return  async(dispatch, getState) => {

     // const { user, user_id } = getState().model_data
     const user = getState().model_data.user[getState().model_data.user_id]

     // let get_wp_url = `${ApiUrl}withdrawProviders?filter={"where":{"country":"${user.country}"}}`
     let get_wp_url = `${WithdrawApiUrl}withdrawProviders?country=${user.country}`
     await dispatch(load_label('Obteniendo proveedores de retiro'))

     // if(query){
     //   get_wp_url = `${ApiUrl}withdrawProviders?filter=${query}`
     //   return alert('revisar get_withdraw_providers please bitch')
     // }

     let myHeaders = await dispatch(generate_headers())

     let withdraw_providers = await ApiGetRequest(get_wp_url, myHeaders)
     // if(!withdraw_providers){withdraw_providers = withdraw_providersJSON}

     // console.log('!!!!!!!!!!!!!!!!!!!!!withdraw_providers', withdraw_providers)
     // return alert('mmierda')

     let user_update = {
       ...user,
       withdraw_providers:[
         ...withdraw_providers
       ]
     }
     let normalizeUser = await normalize_user(user_update)
     await dispatch(Update_normalized_state(normalizeUser))
     return withdraw_providers

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



export const add_update_withdraw = (withdraw_id, state) =>{
  return async(dispatch, getState) =>{
    const { user, user_id } = getState().model_data

    const body = {
      // "access_token":user[user_id].TokenUser,
      "data": {
        "withdraw_id": withdraw_id,
        "state": state,
        "country":user[user_id].country,
      }
    }

    console.log('||||| add_update_withdraw BODY BEFORE', body)

    const new_update_withdraw_url = `${WithdrawApiUrl}withdraws/add-update-withdraw`
    const new_withdraw_update = await ApiPostRequest(new_update_withdraw_url, body, user[user_id].TokenUser)
    if(!new_withdraw_update || new_withdraw_update === 465){return false}
    // console.log('|||||||||| ================> RES WITHDRAW', new_withdraw_update)
    // alert('update withdraw')
    return new_withdraw_update

  }
}




 // AÑADIR NUEVA ORDEN DE RETIRO -------------------------- -------------------------- --------------------------

 export const add_new_withdraw_order = (amount, account_from, withdraw_provider, withdraw_account) =>{

   return async(dispatch, getState) =>{

     const { user, user_id } = getState().model_data
     const body = {
       // "access_token":user[user_id].TokenUser,
       "data": {
         "amount": amount,
         "account_id": account_from,
         "withdraw_provider_id": withdraw_provider,
         "withdraw_account_id": withdraw_account,
         "country":user[user_id].country
       }
     }

     const new_withdraw_url = `${WithdrawApiUrl}withdraws/add-new-withdraw`
     const new_withdraw_order = await ApiPostRequest(new_withdraw_url, body, user[user_id].TokenUser)
     // console.log('|||||| ========> BODY RES WITHDRAW', new_withdraw_order)
     if(!new_withdraw_order || new_withdraw_order === 465){return false}
     return new_withdraw_order

   }

 }



 // OBTENER ORDENES DE RETIRO -------------------------- -------------------------- --------------------------
export const get_withdraw_list = (user) =>{

  return async(dispatch) => {


    await dispatch(load_label('Obteniendo tus registros de retiros'))
// 5bea1f01ba84493018b7528c
    // const url_withdraw_list = `${ApiUrl}withdraws?filter={"where":{"userId":"${user.id}"}}`
    const url_withdraw_list = `${WithdrawApiUrl}users/${user.id}/withdraws?country=${user.country}`
    let myHeaders = {
      'Authorization': `Bearer ${user.TokenUser}`,
    }
    let withdrawals = await ApiGetRequest(url_withdraw_list, myHeaders)
    if((withdrawals && withdrawals.length<1) || !withdrawals || withdrawals === 465){return false}
    let withdrawals_remodeled = []

    await withdrawals.map(withdraw => {
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
        state:withdraw.state === 'accepted' && !withdraw.proof ? 'confirmed' : withdraw.state,
        unique_id:withdraw.id,
        userId:withdraw.userId,
        withdraw_account:withdraw.withdraw_account_id,
        withdraw_provider:withdraw.withdraw_provider_id,
        type_order:"withdraw",
        withdraw_proof:withdraw.proof,
        created_at:withdraw.created_at,
      }
      return  withdrawals_remodeled.push(new_withdraw)
    })
    // console.log('=====>   GET WITHDRAWALS ', withdrawals_remodeled)

    withdrawals_remodeled.reverse()

    let user_update = {
      ...user,
      withdrawals:[
        ...withdrawals_remodeled
      ]
    }



    let normalizeUser = await normalize_user(user_update)
    await dispatch(Update_normalized_state(normalizeUser))


    return normalizeUser

    // return withdrawals

  }

}





export const delete_withdraw_order = order_id =>{

  return async(dispatch) => {
    const url_delete_withdraw_order = `${ApiUrl}withdraws/${order_id}`
    let res = await ApiDelete(url_delete_withdraw_order)
    // console.log('delete_withdraw_order', res)
    return res
  }

}


export const ready_to_play = payload =>{

  return async(dispatch) => {
    // dispatch(success_sound())
    dispatch(app_loaded(payload))
  }

}















// AGREGAR CUENTA DE RETIRO -----------------------------------------------------------------------

export const add_new_withdraw_account = (payload, type) =>{
  return async(dispatch, getState) =>{

    const { user, user_id } = getState().model_data
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

    if(type==='crypto'){
      body = {
      // "access_token":user[user_id].TokenUser,
      "data": {
        ...payload
      }
    }
    }else{
      body = {
      // "access_token":user[user_id].TokenUser,
      "data": {
        "currency":currency,
        "provider_type": provider_type,
        "name": name,
        "surname": surname,
        "id_number": id_number || user[user_id].id_number,
        "id_type":id_type ,
        "bank_name": short_name,
        "account_number": account_number,
        "account_type":account_type,
        "city": city,
        "email": user[user_id].email || 'default@coinsenda.com',
        "label": short_name,
        "country":user[user_id].country
      }
    }
  }

    console.log('|||||||||||| - - - - add new Waccount', body)

    const new_wa_url = `${WithdrawApiUrl}withdrawAccounts/add-new-withdraw-account`
    const new_wa = await ApiPostRequest(new_wa_url, body, user[user_id].TokenUser)
    // console.log('°°°°°|||||||||||||||| RESULTADO add_new_withdraw_account....', new_wa)
    if(!new_wa || new_wa === 465){return false}

    const {
      data
    } = new_wa

    // ApiPostRequest(url_charge_debug_funds, charge_funds_body)

    return data
  }
}






export const FlowAnimationLayoutAction = (animation, action, current_section, explicitStep) =>{

  return async(dispatch) => {
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










export const add_new_transaction_animation = () =>{
  return async(dispatch) => {

    dispatch(current_section_params({new_deposit_style:true}))
    setTimeout(()=>{
      dispatch(current_section_params({new_deposit_style:false}))
    }, 1000)
    setTimeout(()=>{
      dispatch(show_sound())
    }, 550)
  }
}






// OBTENER MONEDAS DISPONIBLES EN COINSENDA ------------------------------------------------------------------------------------

export const get_all_currencies = () => {
  return async(dispatch) => {


    await dispatch(load_label('Obteniendo todas las divisas'))
    const url_currencies = `${ApiUrl}currencies`
    let currencies = await ApiGetRequest(url_currencies)
    let new_currencies = []

  // en caso de que ocurra un error en esta petición cargaremos con datos harcodeados el modelo
    if(!currencies){
      new_currencies = coins
      dispatch(UpdateAllCurrencies(new_currencies))
      return new_currencies
    }


     for (let i = 0; i < currencies.length; i++) {
      // if(currencies[i].currency !== "bitcoin_testnet"){
          let spllit = currencies[i].node_url && currencies[i].node_url.split("api")
          let new_item = {
                        "currency_type":currencies[i].currency_type,
                        "id":currencies[i].id,
                        "type":"coins",
                        "name":currencies[i].currency,
                        "code":currencies[i].symbol.toLowerCase(),
                        "selection":false,
                        "is_token":currencies[i].is_token,
                        "min_amount":currencies[i].deposit_min_amount,
                        ...currencies[i],
                        "node_url":spllit && spllit[0]
                         }
           new_currencies.push(new_item)
        // }
    }
    dispatch(UpdateAllCurrencies(new_currencies))
    return new_currencies
  }
}








// IDENTITY ENDPOINTS ---------------------------------------------------------------------------------------


export const get_user = (token, user_country) =>{
  return async(dispatch) => {

    await dispatch(load_label('Cargando tu información'))

    let body = {
      "access_token":token,
      "data": {
        "country":user_country
      }
    }

    // 1. inicializamos el estado con el token y el country del usuario
    const init_state_url = `${IdentityApIUrl}countryvalidators/get-existant-country-validator`
    const init_state = await ApiPostRequest(init_state_url, body)
    // return console.log('||||||  - - -.  --  COUNTRY - V A L I D A T O R S', init_state)
    if(init_state && !init_state.data){return false}

    // 2. Obtenemos el status del usuario del cual extraemos el id y el country
    const get_status_url = `${IdentityApIUrl}status/get-status`
    body = {
      "data": {}
    }
    const status = await ApiPostRequest(get_status_url, body, token)
    // console.log('||||||  - - -.  --  status', status)
    if(!status || status === 465){return false}
    const { data } = status
    let country_object = await add_index_to_root_object(data.countries)
    let country = await objectToArray(country_object)
    let user_update = {
      ...user_source,
      id:data.userId,
      country:country[0].value,
      verification_level:country[0].verification_level,
      levels:country[0].levels
    }

    // let profile = await dispatch(get_profile(user_update.id, token))

    // if((profile.countries[country[0].value] !== 'level_0') && (user_update.verification_level !== 'level_0')){
      let kyc_personal = country[0].levels && country[0].levels.personal
      let kyc_identity = country[0].levels && country[0].levels.identity
      let kyc_financial = country[0].levels && country[0].levels.financial

      if(kyc_personal){
        user_update.security_center.kyc.basic = kyc_personal
      }

      if(kyc_identity){
        user_update.security_center.kyc.advanced = kyc_identity
      }

      if(kyc_financial){
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
    const get_profile_url = `${IdentityApIUrl}profiles/get-profile`
    const profile_data = await ApiPostRequest(get_profile_url, body, token)
    if(profile_data && profile_data.data){
      // Agregamos la información al modelo usuario (user_update)
      user_update = {
        ...user_update,
        ...profile_data.data.personal,
        person_type:profile_data.data.person_type
      }
    }
    // return console.log('||||||  - - -.  --  USER UPDATE', profile_data)

    let normalizeUser = await normalize_user(user_update)
    await dispatch(Update_normalized_state(normalizeUser))
    // console.log('||||||  - - -.  --  normalizeUser', normalizeUser)
    return normalizeUser
  }
}






export const update_user = new_user =>{
  return async(dispatch) => {
    let normalizeUser = await normalize_user(new_user)
    dispatch(Update_normalized_state(normalizeUser))
  }
}


export const get_verification_state = () =>{

  return async(dispatch, getState) => {

    const { user, user_id } = getState().model_data
    if(!user){return false}
    const user_data = user[user_id]
    const { advanced, basic } = user_data.security_center.kyc

    let verification_state_data = (advanced === 'rejected'  && basic === 'rejected') ? 'rejected' :
    (advanced === 'confirmed'  && basic === 'confirmed') ? 'confirmed' :
    (advanced === 'accepted'  && basic === 'accepted') ? 'accepted' :
    (!advanced  && !basic) ? null : 'pending'

    await dispatch(verification_state(verification_state_data))

    return verification_state_data

  }
}



// https://api.ip2location.com/v2/?ip=181.55.82.22&key=NBIKK7COQJ&package=WS5

export const country_detect = () =>{
  return async(dispatch) => {

   const my_ip_url = 'https://api.ipify.org/?format=json'
   var my_ip_url_request = new Request(my_ip_url);
   let res_ip = await ApiGetRequest(my_ip_url_request)
   if(!res_ip || res_ip === 465 || res_ip === 404){return false}
   const { ip } = res_ip

    const country_detect_url = `http://api.ipstack.com/${ip}?access_key=1acf821243c5a2b11c257c4b3b9bbffd`
    var myRequest = new Request(country_detect_url);
    let res = await ApiGetRequest(myRequest)
    if(!res || res === 465 || res === 404){return false}
    return res

  }
}


export const countryvalidators = () =>{

  return async(dispatch) => {
    const url_countryvalidators = `${IdentityApIUrl}countryvalidators`
    let res = await ApiGetRequest(url_countryvalidators)
    if(!res || res === 465 || res === 404){return false}
    let countries = await add_index_to_root_object(res[0].levels.level_1.personal.natural.country)
    // console.log('||| ==================================> LOAD C O U N T R I E S =>2', countries)
    let new_array = await objectToArray(countries)
    let construct_res = {
      res:res[0],
      countries,
      country_list:new_array
    }

    return construct_res
  }

}









export const update_level_profile = (config, user) =>{
// @Calls
// ./components/kyc/kyc_container.js

  return async(dispatch) => {

    let body ={
      "access_token":user.TokenUser,
      "data": {
        "country":user.country,
        "person_type":user.person_type,
        "info_type":config.info_type,
        "verification_level":config.verification_level,
        "info":config.info
      }
    }

    // return console.log('|||||||| update_level_profile_____________body', body)

    const add_new_profile_url = `${IdentityApIUrl}profiles/add-new-profile`
    const add_new_profile = await ApiPostRequest(add_new_profile_url, body)
    if(!add_new_profile || add_new_profile === 465){return false}
    return add_new_profile

  }

}






export const get_country_list = order_id =>{

  return async(dispatch) => {
    const url_country_list = `${CountryApIUrl}countrys`

    let res = await ApiGetRequest(url_country_list)
    // console.log('get_country_list API', url_country_list, res)
    if(!res || res === 465){return false}
    // let countries = await add_index_to_root_object(res[0].levels.level_1.personal.natural.country)
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


export const user_verification_status = (level_request) =>{
// @Call_from
// ./wallets/views/deposit.js
// ./wallets/views/withdraw.js

  return async(dispatch, getState) => {

    const { user, user_id } = getState().model_data
    const { advanced, basic, financial } = user[user_id].security_center.kyc
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








export const get_profile = (userId, token) =>{

  return async(dispatch) => {

    let myHeaders = await dispatch(generate_headers(token))
    let url_get_profile = `${ApiUrl}users/${userId}/profile`
    let profile = await ApiGetRequest(url_get_profile, myHeaders)
    if(profile === 465){return false}
    return profile

  }
}


export const add_new_profile = (country, token) =>{

  return async(dispatch) => {

  let body = {
    	"data":{
    		"country":country
    	}
    }
    let url_add_profile = `${ApiUrl}profiles/add-new-profile`
    let new_profile = await ApiPostRequest(url_add_profile, body, token)
    if(!new_profile){return false}

    const { data } = new_profile

    return data
    // let myHeaders = await dispatch(generate_headers(token))
    //
    // let url_get_profile = `${ApiUrl}users/${userId}/profile`
    // let profile = await ApiGetRequest(url_get_profile, myHeaders)
    // return profile


  }
}














































 // -------- REFERIDOS ----------------------------------------------------------------------------------------------------------------------------------


export const set_ref_code = (ref_code) =>{
  return async(dispatch, getState)=>{

    const { user, user_id } = getState().model_data

    let body = {
      "access_token":user[user_id].TokenUser,
      "data":{
      	"userId":user[user_id].id,
        "country":"colombia",
        "new_ref_code":ref_code
      }
    }

    const url_create_ref_code = `${ApiUrl}referrals/set-ref-code`
    let res = await ApiPostRequest(url_create_ref_code, body)

    let user_update = {
      ...user[user_id],
      referral:res
    }

    await dispatch(update_user(user_update))
    return res


  }
}


export const get_ref_code = () =>{
  return async(dispatch, getState)=>{

    const { user, user_id } = getState().model_data

    const url_get_ref_code = `${ApiUrl}referrals?filter={"where":{"userId":"${user[user_id].id}"}}`
    let res = await ApiGetRequest(url_get_ref_code)
    if(!res || res === 465){return false}

    let user_update = {
      ...user[user_id],
      referral:res[0]
    }

    await dispatch(update_user(user_update))
    return res && res[0]
    // get_list_user_wallets()
    // console.log('|||||||||||°°°°°°° - -  create_new_wallet -  - -°°°°°°°|||||||||||', new_wallet)
  }
}



// End referidos ---------------------------------------------------------------------------------------------------------------------------------------------





















export const update_activity_account = (account_id, activity_type, activity_list) =>{

  return async(dispatch, getState) => {

    let current_wallet = getState().model_data.wallets[account_id]

    if(!current_wallet){
      current_wallet = getState().ui.current_section.params.current_wallet
    }

    if(!current_wallet){return false}

    if(!activity_list){
      activity_list = await serve_orders(current_wallet.id, activity_type)
    }
    await dispatch(current_section_params({currentFilter:activity_type}))
    await dispatch(update_activity(current_wallet.id, activity_type, activity_list))
      // console.log('update_activity_account- -- -  ', pending_activity)
      // return pending_activity()
      // let account = getState().model_data.wallets[account_id]

      // const { user, user_id } = getState().model_data
      // console.log('update_pending_activity', getState(), account)
  }

}



export const update_pending_activity = (account_id, activity_type, activity_list) =>{

  return async(dispatch, getState) => {

      let current_wallet = getState().model_data.wallets[account_id]

      if(!current_wallet){
        current_wallet = getState().ui.current_section.params.current_wallet
      }

      if(!current_wallet){return false}

      if(!activity_type){
        activity_type = await getState().ui.current_section.params.currentFilter
      }

      if(!activity_list && current_wallet){
        activity_list = await serve_orders(current_wallet.id, activity_type)
      }

      if(!activity_list){return false}
      // console.log('-----|||||||| °°°°  current_wallet', current_wallet)
      // console.log('-----|||||||| °°°°  update_pending_activity', activity_type, current_wallet)

      let pending = (activity_type === 'withdrawals') ? 0 : await matchItem(activity_list, {primary:'pending'}, 'state', true)
      let confirmed = await matchItem(activity_list, {primary:'confirmed'}, 'state', true)
      let rejected = await matchItem(activity_list, {primary:'rejected'}, 'state', true)

      let expandidoMax = (((pending && pending.length) + (confirmed && confirmed.length))*100)
      let pending_data;
      // pending ? (pending_data = pending ? pending_data = {pending:true, lastPending:(activity_type === 'withdrawals' && current_wallet.currency_type === 'fiat') ? confirmed[0].id : pending[0].id} : null) :
      pending ? (pending_data = pending ? pending_data = {pending:true, lastPending:(activity_type === 'withdrawals') ? (confirmed[0] && confirmed[0].id) : pending[0].id} : null) :
      rejected ? (pending_data = rejected ? pending_data = {pending:true, lastPending:rejected[0] && rejected[0].id} : null) :
      confirmed && (pending_data = confirmed ? pending_data = {pending:true, lastPending:confirmed[0] && confirmed[0].id} : null)
      // console.log('|||||||||| PENDING DATA', pending_data, 'Agregar al estado  |  expandidoMax - pending_data')

      let pending_activity_payload = {
        ...pending_data,
        expandidoMax,
        account_id:current_wallet.id,
        activity_type:activity_type
      }

      dispatch(pending_activity(pending_activity_payload))

  }

}



export const swap_activity_update = (swap, filter) =>{

  return async(dispatch, getState) => {

    setTimeout(async()=>{
      const { user, user_id, swaps } = getState().model_data
      await dispatch(add_done_swap(swaps, user[user_id], swap))
      // actualizamos las ordenes de la cuenta desde donde se genera el swap
      await dispatch(update_activity_account(swap.account_from, filter, null))
      await dispatch(current_section_params({swap_done_out:false, swap_done_in:true}))
      setTimeout(()=>{dispatch(update_pending_activity())}, 1500)
      setTimeout(()=>{
        dispatch(add_coin_sound())
        dispatch(mensaje('Nuevo intercambio realizado', 'success'))
        dispatch(current_section_params({swap_done_out:false, swap_done_in:false, swap_done_id:false, swap_socket_channel:{
          unique_id:null,
          status:null
        }}))
      }, 3000)

    }, 1800)
  }

}














export default get_pairs_for
