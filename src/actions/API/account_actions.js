import Environment from '../../environment'
// import * as normalizr_services from '../../schemas'
// import { updateNormalizedDataAction } from '../dataModelActions'

import {
  ApiGetRequest,
  // generate_headers,
  // ApiPostRequest,
} from './'

// import { get_withdraws } from './withdraw_actions'

// import {
//   update_item_state
// } from '../dataModelActions'

// import {
//   isAppLoaded,
//   appLoadLabelAction
// } from '../loader'

// import {
//   update_activity_state,
//   normalized_list
// } from '../../services'

const { AccountApiUrl } = Environment

// const {
//   normalizeUser,
//   normalize_data
// } = normalizr_services

export const get_fiat_accounts_by_userId = (userId) => {

  return async(dispatch, getState) => {

    const user = getState().modelData.user

    let filter = `filter={"where": {"currency_type": "fiat"}}`
    const url_accounts = `${AccountApiUrl}users/${user.id}/accounts?country=${user.country}&${filter}`


    let myHeaders = {
      'Authorization': `Bearer ${user.userToken}`,
    }

    const fiat_accounts = await ApiGetRequest(url_accounts, myHeaders)
    // console.log(' =====================>>>> url_accounts ___', url_accounts, fiat_accounts)

    if(!fiat_accounts || fiat_accounts.length < 1){return false}
    return fiat_accounts



  }

}

























//