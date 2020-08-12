import Environment from '../../environment'
import {
  ApiGetRequest,
} from './'

const { AccountApiUrl } = Environment

export const get_fiat_accounts_by_userId = (userId) => {

  return async (dispatch, getState) => {

    const user = getState().modelData.user

    let filter = `filter={"where": {"currency_type": "fiat"}}`
    const url_accounts = `${AccountApiUrl}users/${user.id}/accounts?country=${user.country}&${filter}`


    let myHeaders = {
      'Authorization': `Bearer ${user.userToken}`,
    }

    const fiat_accounts = await ApiGetRequest(url_accounts, myHeaders)

    if (!fiat_accounts || fiat_accounts.length < 1) { return false }
    return fiat_accounts



  }

}
