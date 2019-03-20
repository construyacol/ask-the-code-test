import Environment from '../environment'
import * as data_model_actions from './dataModelActions'
import * as services from '../services'
import { IncreaseStep, ReduceStep, ToggleModal } from './formActions'
import { toast } from 'react-toastify';
import convertCurrencies from '../services/convert_currency'
import store from '../'

import { coins } from '../components/api/ui/api.json'

// MODELOS DE PARA HACER PRUEBAS EN CASO DE QUE EL API ESTE INACCESIBLE

// import pairs from '../components/api/ui/modelo_pairs.json'
// import deposit_providers from '../components/api/ui/deposit_providers.json'
import user_source from '../components/api'
import walletsJSON from '../components/api/ui/model_account.json'
// import deposits from '../components/api/ui/deposits.json'

import withdraw_providersJSON from '../components/api/ui/withdraw_provider.json'
import withdraw_accountsJSON from '../components/api/ui/withdrawAccounts/withdraw_accounts.json'
import * as normalizr_services from '../schemas'

import {
  toast_sound,
  show_sound
} from './soundActions'

import {
  app_loaded,
  load_label
} from './loader'

import {
  current_section_params,
  pairs_for_account,
  FlowAnimationUi
  // new_fiat_deposit
 } from './uiActions'

const {
  normalize_user
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
UpdatePendingSwap
} = data_model_actions


const {
matchItem,
desNormalizedList,
withdraw_provider_by_type,
add_index_to_root_object,
objectToArray
} = services

const { ApiUrl, TokenUser, IdentityApIUrl } = Environment
let local_currency



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
     toastId:1,
     autoClose: 4000
  })
}
}





const get_local_currency = country =>{
  let value
  return value = (
    country === 'colombia' ? 'COP' :
    country === 'chile' ? 'CLP' :
    country === 'peru' ? 'PEN' :
    country === 'uruguay' ? 'UYU' :
    country === 'argentina' ? 'ARS' :
    'USD'
  )
}


const ApiGetRequest = async(url, params) => {

  // let headers = new Headers();
  //
  // let parametros = { method: 'GET',
  //              headers: headers,
  //              mode: 'cors',
  //              cache: 'default' };

  let response
  try {
    response = await fetch(url)
  }
  catch(error) {
    // si no tenemos conexión con el API nos retornara esto:
    return false
  }
  // console.log('|||||||||| °°°°STATUS°°°°|||||||', response)
  // Si el error esta en los datos de la petición, retornamos el estatus 465
  // console.log('RESPUESTA POST:', response)
  if(!response.ok){return response.status}
  const data = await response.json()
  return data
}


const ApiPostRequest = async(url, body) => {

  let myHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })

  body.data.country = 'colombia'

  // console.log('||||||||ApiPostRequest', body)

  let parametros = {
               method: 'POST',
               headers: myHeaders,
               body: JSON.stringify(body)
             }

  let response
  try {
    response = await fetch(url, parametros)
  }
  catch(error) {
    // si no tenemos conexión con el API nos retornara esto:
    // console.log('|||||||||| °°°°STATUS°°°°|||||||', error)
    return false
  }

  // console.log('|||||||||| °°°°STATUS°°°°|||||||', response)
  // Si el error esta en los datos de la petición, retornamos el estatus 465
  if(!response.ok){return response.status}
  const data = await response.json()
  return data
}


const ApiDelete = async(url) => {

  let parametros = {
          method: 'DELETE'
        }
  let response

  try {
    response = await fetch(url, parametros)
  }
  catch(error) {
    // si no tenemos conexión con el API nos retornara esto:
    return false
  }
  // Si el error esta en los datos de la petición, retornamos el estatus 465
  if(!response.ok){return response.status}
  const delete_success = await response.json()
  // console.log('|||||||||||||| - -- -- --  RESPUESTA:',delete_success)
  return delete_success
}




export const get_all_pairs = (user) =>{
  return async(dispatch)=>{
    await dispatch(load_label('Importando pares'))
    const url_pairs = `${ApiUrl}pairs`
    const pairs = await ApiGetRequest(url_pairs)

    if(!pairs){return false}
    dispatch(AllPairs(pairs))

    let user_update = {
      ...user,
      available_pairs:[
        ...pairs
      ]
    }

    let normalize_pairs = await normalize_user(user_update)
    // console.log('|||||||||||||||||||||||||||||||||||||||| - norma_pairs', normalize_pairs)
    dispatch(Update_normalized_state(normalize_pairs))

  }
}





export const get_pairs_for = (country, user_collection) => {

  return async(dispatch)=>{
    //defino la moneda local con base a la ubicación operativa del usuario
    local_currency = await get_local_currency(country)

    // consulto en el API todos los pares disponibles que cotizan contra la moneda local del usuario

    const url_pairs = `${ApiUrl}pairs?filter={"where": {"secondary_currency.currency": "${local_currency.toLowerCase()}"}}`
    const pairs = await ApiGetRequest(url_pairs)

    if(!pairs){return false}
    // Actualizo el estado con todas las cotizaciones disponibles en contra(secondary_currency) de la moneda local
    // await dispatch(AllPairs(data))
    await dispatch(LocalPairs(pairs))
    // console.log('CONSULTANDO TODOS LOS PARES DISPONIBLES::::::', pairs)

    // el parametro user_colecction es un array con las monedas preferidas o por defecto que se le mostraran al usuario en el dashboard
    // este es un parametro opcional, si no se pasa el parametro se mostrará solo la cotización de bitcoin contra la moneda local, si tampoco existe esta cotización, se mostrará la que haya disponible
    if(user_collection){ await get_user_pairs(user_collection, dispatch, pairs)}

    // defino un par por defecto, que será el que se mostrara de primero, bitcoin por default contra la moneda local, en caso de que no exista este par, mostrará el que este disponible
    dispatch(SearchCurrentPair(`BTC/${local_currency}`, 'pair'))
    // así mismo actualizo la moneda local del usuario en el estado en redux para posteriores consultas
    dispatch(LocalCurrency(local_currency))
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
      let query = `{"where": {"primary_currency":{"eq": {"currency" : "${primary}", "is_token" : false}} }}`
      let res = await get_this_pair(query)
      if(all){return res}
      return res[0]
    }

    if(!primary && secondary){
     // consulte todos los pares disponibles donde la moneda secundaria  es "secondary"
     // let query = `{"where": {"secondary_currency":{"eq": {"currency" : "${secondary}", "is_token" : false}}}}`
      let query = `{"where": {"secondary_currency":{"eq": {"currency" : "${secondary}", "is_token" : false}}}}`
      let res = await get_this_pair(query)
      if(all){return res}
      return res[0]
    }

    if(!primary || !secondary){return false}

    const query = `{"where": {"primary_currency": {"eq": {"currency" : "${primary}", "is_token" : false}}, "secondary_currency":{"eq": {"currency" : "${secondary}", "is_token" : false}}  }}`
    let res = await get_this_pair(query)
    return res[0]

}



export const get_this_pair = async(query) => {

  const url = `${ApiUrl}pairs?filter=${query}`
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

    if(current_pair && current_pair.pair_id || !current_wallet){return false}
    let currency = current_wallet.currency.currency
    let pair;
    // buscamos los pares, por defecto primero buscara el par de la moneda de la cuenta actual cotizando en la moneda fiat local, si no, buscara la cotización en bitcoin, si no la que encuentre ya sea como moneda primaria o secundaria
      pair = await get_pair(currency, local_currency)
      !pair && (pair = await get_pair('bitcoin', currency))
      !pair && (pair = await get_pair(currency))
      !pair && (pair = await get_pair(null, currency))


    if(!pair){return false}

    let pair_id = pair.id

    const data = await convertCurrencies(current_wallet.currency, '1', pair_id)


    if(data){
      const { to_spend_currency, want_to_spend } = data
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
    const url_balance = `${ApiUrl}accounts?filter={"where": {"userId": "${user.id}"}}`
    let balances = await ApiGetRequest(url_balance)
    if(!balances || balances === 465){return false}
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

    let list_user_balances = await normalize_user(user_update)
    await dispatch(Update_normalized_state(list_user_balances))
    return list_user_balances

  }

}








// ACCOUNTS SERVICES --------------------------------------------------------------------------------------

export const get_list_user_wallets = (user) =>{
  // console.log('||||||||||||||°°°°--------get_list_user_wallets--------°°°°|||||||||||||', user)

  return async(dispatch) =>{


    await dispatch(load_label('Obteniendo tus billeteras'))
    const url_wallets = `${ApiUrl}accounts?filter={"where": {"userId": "${user.id}"}}`
    let wallets = await ApiGetRequest(url_wallets)
    if(!wallets){wallets = walletsJSON }
    if(!wallets || wallets === 404){return false}
    if(wallets && wallets.length<1){
      await dispatch(reset_model_data({wallets:[]}))
    }
      let user_update = {
        ...user,
        wallets:[
          ...wallets
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
    const url_dep_prov = `${ApiUrl}depositProviders?filter={"where": {"userId": "${user.id}"}}`
    const deposit_providers = await ApiGetRequest(url_dep_prov)
    if(!deposit_providers || deposit_providers === 404){return false}
    const url_dep_prov_fiat = `${ApiUrl}depositProviders?filter={"where":{"provider_type":"bank","country":"${user.country}"}}`
    const deposit_provider_fiat = await ApiGetRequest(url_dep_prov_fiat)
    if(!deposit_provider_fiat || deposit_provider_fiat === 404){return false}


    let user_update = {
      ...user,
      deposit_providers:[
        ...deposit_providers,
        ...deposit_provider_fiat
      ]
    }

    let dep_provs = await normalize_user(user_update)
    dispatch(Update_normalized_state(dep_provs))
  }

}



// ACCOUNTS SERVICES BY ID --------------------------------------------------------------------------------------

export const get_wallet_by_id = (wallet_id) =>{
  // console.log('||||||||||||||°°°°--------get_list_user_wallets--------°°°°|||||||||||||', user)
  return async(dispatch) =>{

    // 1consultamos la wallet
    const url_wallet = `${ApiUrl}accounts?filter={"where": {"id": "${wallet_id}"}}`
    const wallet = await ApiGetRequest(url_wallet)
    // console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°| get_wallet_by_id :', wallet)

    if(wallet && wallet.length<1 || !wallet || wallet === 404){return false}

    let deposit_provider=null

    if(wallet[0].dep_prov.length>0){
      // 2 si la wallet tiene deposit providers consultamos el ultimo disponible y lo modelamos
      let id_provider = await wallet[0].dep_prov[wallet[0].dep_prov.length-1]
      const url_dep_prov = `${ApiUrl}depositProviders?filter={"where": {"id": "${id_provider}"}}`
      // console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°| get_wallet_by_id :', url_dep_prov)
      deposit_provider = await ApiGetRequest(url_dep_prov)
    }

    const model_wallet = {
      ...wallet[0],
      deposit_provider:!deposit_provider ? null : {...deposit_provider[0]}
    }

    return model_wallet

  }
}



// CREATE NEW ACCOUNT (WALLET) ----------------------------------------------------------------------------------------

export const create_new_wallet = (body) =>{
  return async(dipatch)=>{
    const url_new_account = `${ApiUrl}accounts/create-account`
    return ApiPostRequest(url_new_account, body)
    // get_list_user_wallets()
    // console.log('|||||||||||°°°°°°° - -  create_new_wallet -  - -°°°°°°°|||||||||||', new_wallet)
  }
}


// DELETE ACCOUNT (WALLET - WITHDRAW)--------------------------------------------------------------------------------------------------

export const delete_account = (account_id, type) =>{
  return async(dispatch)=>{
    const url_delet_account = type === 'withdraw' ? `${ApiUrl}withdrawAccounts/${account_id}` : `${ApiUrl}accounts/${account_id}`
    return ApiDelete(url_delet_account)
  }
}






// CONFIRM DEPOSIT FIAT ORDER --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const confirm_deposit_order = (ticket, base64) =>{
  return async(dispatch) =>{

    const {
      unique_id,
      account_id
    } = ticket
    // console.log('ticket', ticket)


    const body = {
      "access_token":TokenUser,
      "data": {
        "unique_id": unique_id,
        "state": "confirmed",
        "account_id": account_id,
        "proof_of_payment": {
          "proof":base64
        }
      }
    }

    // console.log('body', body)


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

    const url_confirm_deposit = `${ApiUrl}deposits/add-update-deposit`
    const confirm_deposit = await ApiPostRequest(url_confirm_deposit, body)


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
  deposit_provider_id
) => {

  return async(dispatch) =>{

    const body = {
        "access_token":TokenUser,
        "data": {
          "currency": currency,
          "amount": amount,
          "cost_id": cost_id,
          "deposit_provider_id":deposit_provider_id,
          "info": {deposit_service},
          "comment": "",
          "account_id": account_id
        }
      }


    const url_new_order = `${ApiUrl}deposits/add-new-deposit`
    const new_fiat_deposit = await ApiPostRequest(url_new_order, body)

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
  return async(dispatch)=>{
    const url_delete_deposit_order = `${ApiUrl}deposits/${order_id}`
    return ApiDelete(url_delete_deposit_order)
  }
}


export const normalize_new_item = (user, list, item, prop) =>{
  return async(dispatch) =>{

       let new_list = await desNormalizedList(list, user[prop])

       // console.log('Desnormalized List deposits - - - ', new_list)

       let user_update = {
         ...user,
         deposits:[
           ...new_list,
           item
         ]
       }

        // console.log('usuario new model', user.deposits)
        let normalizeUser = await normalize_user(user_update)
        // console.log('usuario normalIZADO', normalizeUser)
        await dispatch(Update_normalized_state(normalizeUser))
  }
}


const charge_funds = props =>{

  return async(dispatch) => {
    const charge_funds_body = {
        "data": {
          "currency":"cop",
          "amount":"10"
        }
    }


    const url_charge_debug_funds = `${ApiUrl}accounts/charge-debug-funds`
    let res = await ApiPostRequest(url_charge_debug_funds, charge_funds_body)
  }

}



export const add_new_swap = (account_id, pair_id, value) =>{
  return async(dispatch) =>{


    await charge_funds()

    const body = {
        "access_token":TokenUser,
        "data": {
          "account_from_id":account_id,
          "pair_id":pair_id,
          "want_to_spend":value.toString()
        }
    }

    const add_new_swap_url = `${ApiUrl}swaps/add-new-swap`
    const new_swap = await ApiPostRequest(add_new_swap_url, body)
    // console.log('°°°°°|||||||||||||||| RESULTADO SWAP....', new_swap)
    if(!new_swap || new_swap === 465){return false}

    const {
      data
    } = new_swap

    // ApiPostRequest(url_charge_debug_funds, charge_funds_body)

    return data
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


export const add_done_swap = (swaps, user, done_swap, update_list) =>{
  return async(dispatch) => {

    let new_swap = {
      ...swaps[done_swap.unique_id],
      state:"accepted"
    }

    let updated_swaps = {
      ...swaps,
      [new_swap.unique_id]:{
        ...new_swap
      }
    }

    let array_swaps = await desNormalizedList(updated_swaps, user.swaps)

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



const get_currency_from_contra_pair = (swap_pair, currency_account ) =>{

    if(swap_pair.primary_currency.currency === currency_account.currency){
      return swap_pair.secondary_currency.currency
    }

    if(swap_pair.secondary_currency.currency === currency_account.currency){
      return swap_pair.primary_currency.currency
    }

}




// OBTENER LISTA DE SWAPS---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
export const get_swap_list = (user, wallets, all_pairs) =>{
  return async(dispatch) => {

    await dispatch(load_label('Obteniendo tus registros de intercambios'))
    const url_swaps = `${ApiUrl}swaps?filter={"where": {"userId": "${user.id}"}}`
    const swaps = await ApiGetRequest(url_swaps)


    if(!swaps){return false}

    let remodeled_swaps = []

    swaps.map(async(swap) => {
      // obtenemos la moneda que cotiza en contra del par, pasandole como params, el swap, el par del swap y la moneda de la cuenta donde se origino el intercambio, la moneda que se gasto
      let currency_bought = get_currency_from_contra_pair(all_pairs[swap.pair_id], wallets[swap.account_from].currency)
      let new_swap = {
        account_id:swap.account_from,
        account_to:swap.account_to,
        amount:swap.bought,
        amount_neto:swap.execution.total,
        comment:"",
        action_price:swap.action_price,
        currency:wallets[swap.account_from].currency,
        currency_type:wallets[swap.account_from].currency_type,
        cost:"",
        deposit_provider_id:"",
        expiration_date:new Date(),
        id:swap.id,
        state:"accepted",
        bought:swap.bought,
        currency_bought:currency_bought,
        spent:swap.spent,
        type_order:"swap"
      }
      remodeled_swaps.push(new_swap)
    })

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


export const get_deposit_list = (user) =>{
  return async(dispatch) => {



    await dispatch(load_label('Obteniendo tus registros de deposito'))
    // 5bea1f01ba84493018b7528c
    const url_deposit = `${ApiUrl}deposits?filter={"where": {"userId": "${user.id}"}}`
    const deposits = await ApiGetRequest(url_deposit)
    if(!deposits || deposits === 465){return false}
    let remodeled_deposits = await deposits.map(item => {
      let new_item = {
        ...item,
        type_order:"deposit"
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
    // console.log('|||||||||||| NORMALIZANDO DEPOSITOS::: ', normalizeUser)
    await dispatch(Update_normalized_state(normalizeUser))
    return normalizeUser

    // return console.log('SERVICE: : get_deposit_list - - ', normalizeUser)


    // const url_deposit = `${ApiUrl}accounts?filter={"where": {"userId": "5bea1f01ba84493018b7528c", "account_id":"5c19d6ed89c42e352f1297ff"}}`

    // const wallet = await ApiGetRequest(url_wallet)
    // console.log('get_deposit_list')
  }
}





export const get_withdraw_accounts = (user, withdraw_providers, query) =>{
  return async(dispatch)=>{

    await dispatch(load_label('Obteniendo cuentas de retiro'))
    const get_wAccounts_url = `${ApiUrl}withdrawAccounts?filter=${query}`
    let withdraw_accounts = await ApiGetRequest(get_wAccounts_url)
    if(!withdraw_accounts || withdraw_accounts === 465){withdraw_accounts = withdraw_accountsJSON}
    let providers_served = await withdraw_provider_by_type(withdraw_providers)
    let new_withdraw_accounts = await withdraw_accounts.map(wa => {
      if(wa.info.currency_type === 'fiat'){
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
          currency_type:wa.info.currency_type,
          withdraw_provider:providers_served[wa.provider_type].id
        }
      }

      // console.log('||||||||||waccount ', waccount)
      // return {
      //   ...wa,
      //   currency_type:providers_served[wa.provider_type] && providers_served[wa.provider_type].currency_type
      // }
    })


    new_withdraw_accounts.reverse()

        let user_update = {
          ...user,
          withdraw_accounts:[
            ...new_withdraw_accounts
          ]
        }

        let normalizeUser = await normalize_user(user_update)
        await dispatch(Update_normalized_state(normalizeUser))
  }

}





 // TRAER LISTA DE PROVEEDORES DE RETIRO -------------------------- -------------------------- --------------------------


 export const get_withdraw_providers = (user, query) =>{
   // ej query: {"where": {"country": "colombia", "enabled":true, "provider_type":"bank"}}

   return  async(dispatch) => {

     let get_wp_url = `${ApiUrl}withdrawProviders?filter={"where":{"country":"${user.country}"}}`
     await dispatch(load_label('Obteniendo proveedores de retiro'))
     if(query){get_wp_url = `${ApiUrl}withdrawProviders?filter=${query}`}
     let withdraw_providers = await ApiGetRequest(get_wp_url)
     if(!withdraw_providers){withdraw_providers = withdraw_providersJSON}
     if(!user){return withdraw_providers}
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



export const add_update_withdraw = (unique_id, state, account_from) =>{
  return async(dispatch) =>{

    const body = {
      "access_token":TokenUser,
      "data": {
        "unique_id": unique_id,
        "state": state,
        "account_from": account_from,
      }
    }



    const new_update_withdraw_url = `${ApiUrl}withdraws/add-update-withdraw`
    const new_withdraw_update = await ApiPostRequest(new_update_withdraw_url, body)
    if(!new_withdraw_update || new_withdraw_update === 465){return false}
    // console.log('||||||||||', new_withdraw_order)
    return new_withdraw_update

  }
}




 // AÑADIR NUEVA ORDEN DE RETIRO -------------------------- -------------------------- --------------------------

 export const add_new_withdraw_order = (amount, account_from, withdraw_provider, withdraw_account) =>{

   return async(dispatch) =>{

     const body = {
       "access_token":TokenUser,
       "data": {
         "amount": amount,
         "account_from": account_from,
         "withdraw_provider": withdraw_provider,
         "withdraw_account": withdraw_account,
       }
     }

     const new_withdraw_url = `${ApiUrl}withdraws/add-new-withdraw`
     const new_withdraw_order = await ApiPostRequest(new_withdraw_url, body)
     if(!new_withdraw_order || new_withdraw_order === 465){return false}
     return new_withdraw_order

   }

 }



 // OBTENER ORDENES DE RETIRO -------------------------- -------------------------- --------------------------
export const get_withdraw_list = (user) =>{

  return async(dispatch) => {


    await dispatch(load_label('Obteniendo tus registros de retiros'))
// 5bea1f01ba84493018b7528c
    const url_withdraw_list = `${ApiUrl}withdraws?filter={"where":{"userId":"${user.id}"}}`
    let withdrawals = await ApiGetRequest(url_withdraw_list)

    if(!withdrawals || withdrawals === 465){return false}

    // console.log('|||||| GE WITHDRAWALS ', withdrawals)

    let withdrawals_remodeled = []

    await withdrawals.map(withdraw => {
      let new_withdraw = {
        account_id:withdraw.account_from,
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
        state:withdraw.state,
        unique_id:withdraw.unique_id,
        userId:withdraw.userId,
        withdraw_account:withdraw.withdraw_account,
        withdraw_provider:withdraw.withdraw_provider,
        type_order:"withdraw"
      }
      withdrawals_remodeled.push(new_withdraw)
    })

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
    // await dispatch(ToggleModal())
    dispatch(app_loaded(payload))
  }

}















// AGREGAR CUENTA DE RETIRO -----------------------------------------------------------------------

export const add_new_withdraw_account = (payload, type) =>{
  return async(dispatch) =>{

    const {
      provider_type,
      name,
      surname,
      id_number,
      short_name,
      account_number,
      account_type,
      city,
      email
    } = payload

    let body

    if(type==='crypto'){
      body = {
      "access_token":TokenUser,
      "data": {
        ...payload
      }
    }
    }else{
      body = {
      "access_token":TokenUser,
      "data": {
        "provider_type": provider_type,
        "name": name,
        "surname": surname,
        "id_number": id_number,
        "bank_name": short_name,
        "account_number": account_number,
        "account_type": `cuenta_${account_type}`,
        "city": city,
        "email": email,
        "label": short_name,
        "currency_type":'fiat'
      }
    }
  }

    // console.log('|||||||||||| - - - - add new Waccount', type, body)

    const new_wa_url = `${ApiUrl}withdrawAccounts/add-new-withdraw-account`
    const new_wa = await ApiPostRequest(new_wa_url, body)
    // console.log('°°°°°|||||||||||||||| RESULTADO SWAP....', new_wa)
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
                         }
           new_currencies.push(new_item)
        // }
    }
    dispatch(UpdateAllCurrencies(new_currencies))
    return new_currencies
  }
}





export const get_user = user_id =>{
  return async(dispatch) => {
    // hacemos la consulta al api para traer el modelo del usuario....
    // en este ejemplo utilizaremos un modelo de un json llamado user_source
    await dispatch(load_label('mi información'))
    let normalizeUser = await normalize_user(user_source)
    // console.log('||||||||||||||°°°°--------GET_USER--------°°°°|||||||||||||', normalizeUser)
    dispatch(Update_normalized_state(normalizeUser))
  }
}


export const update_user = new_user =>{
  return async(dispatch) => {
    let normalizeUser = await normalize_user(new_user)
    dispatch(Update_normalized_state(normalizeUser))
  }
}


















// IDENTITY ENDPOINTS ------------------------------------------------------------------------------------




export const countryvalidators = order_id =>{

  return async(dispatch) => {
    const url_countryvalidators = `${IdentityApIUrl}countryvalidators`
    let res = await ApiGetRequest(url_countryvalidators)
    if(!res || res === 465){return false}
    let countries = await add_index_to_root_object(res[0].levels.level_1.personal.natural.country)
    let new_array = await objectToArray(countries)
    let construct_res = {
      res:res[0],
      countries,
      country_list:new_array
    }
    return construct_res
  }

}



























export default get_pairs_for
