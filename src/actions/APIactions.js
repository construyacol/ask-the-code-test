import Environment from '../environment'
import * as data_model_actions from './dataModelActions'
import * as services from '../utils'
import { IncreaseStep, ReduceStep } from './formActions'
import { toast } from 'react-toastify';
import convertCurrencies from '../utils/convert_currency'
import moment from 'moment'
import 'moment/locale/es'

import { coins } from '../components/api/ui/api.json'
import user_source from '../components/api'
import * as normalizr_services from '../schemas'

import {
  ApiGetRequest,
  ApiPostRequest,
  ApiDelete,
  generate_headers
} from './API'

import {
  toast_sound,
  show_sound
} from './soundActions'

import {
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
} from './uiActions'

const {
  normalizeUser,
} = normalizr_services

const {
  UserPairs,
  updateNormalizedDataAction,
  resetModelData,
  updateAllCurrenciesAction,
  manageBalanceAction
} = data_model_actions

const {
  matchItem,
  desNormalizedList,
  withdrawProvidersByType,
  addIndexToRootObject,
  objectToArray,
  serve_orders
} = services

const { ApiUrl, IdentityApIUrl, CountryApIUrl, AccountApiUrl, DepositApiUrl, WithdrawApiUrl, SwapApiUrl } = Environment

moment.locale('es')

export const loadFirstEschema = () => {
  return async (dispatch) => {
    const dataNormalized = await normalizeUser(user_source)
    dispatch(updateNormalizedDataAction(dataNormalized))
  }
}

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

    const { user } = getState().modelData
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

    dispatch(current_section_params({ new_order_style: true }))
    setTimeout(() => {
      dispatch(current_section_params({ new_order_style: false }))
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

    const { user } = getState().modelData
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


export const getUserVerificationStatus = (level_request) => {
  // @Call_from
  // ./wallets/views/deposit.js
  // ./wallets/views/withdraw.js

  return async (dispatch, getState) => {

    const { user } = getState().modelData
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

    const { user } = getState().modelData

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

    const { user } = getState().modelData

    const url_get_ref_code = `${ApiUrl}referrals?filter={"where":{"userId":"${user.id}"}}`
    let res = await ApiGetRequest(url_get_ref_code)
    if (!res || res === 465) { return false }
    return res && res[0]
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

export const updatePendingActivity = (accountId, type, activityList) => async (dispatch, getState) => {
  const { modelData, ui } = getState()

  if (!modelData.wallets) return;

  const fallbackCurrentWallet = ui.current_section.params.current_wallet
  const fallbackActivityType = ui.current_section.params.currentFilter
  const currentWallet = modelData.wallets[accountId] || fallbackCurrentWallet

  if (!currentWallet) return;

  const activityType = type || fallbackActivityType

  if (!activityList && currentWallet) {
    activityList = await serve_orders(currentWallet.id, activityType)
    if (!activityList) return;
  }

  const isWithdraws = activityType === 'withdraws'
  let pendingData
  const filterActivitiesByStatus = async (primary) => await matchItem(activityList, { primary }, 'state', true)

  // If activity is equal to withdraws filter, always set up as 0 value
  const pending = isWithdraws ? 0 : await filterActivitiesByStatus('pending')
  const confirmed = await filterActivitiesByStatus('confirmed')
  // const rejected = await filterActivitiesByStatus('rejected')

  const expandidoMax = ((pending.length || 0) + (confirmed.length || 0)) * 100

  if (pending) {
    pendingData = { pending: true, lastPending: (activityType === 'withdrawals') ? (confirmed[0] && confirmed[0].id) : pending[0].id }
    // } else if (rejected) {
    //   pendingData = { pending: true, lastPending: rejected[0] && rejected[0].id }
  } else if (confirmed) {
    pendingData = { pending: true, lastPending: confirmed[0] && confirmed[0].id }
  }

  let finalResult = {
    ...pendingData,
    expandidoMax,
    account_id: currentWallet.id,
    activity_type: activityType
  }

  dispatch(pending_activity(finalResult))

}

export const update_pending_activity = (account_id, activity_type, activity_list) => {

  return async (dispatch, getState) => {
    // TODO: Refactor this

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
