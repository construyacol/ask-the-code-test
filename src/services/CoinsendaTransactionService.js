import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
    updateNormalizedDataAction
} from "../actions/dataModelActions"
import { loadLabels,
  LOCAL_CURRENCIES_URL,
  CURRENCIES_URL,
  ADD_RESTORE_ID_URL,
  GET_PROFILE_URL,
  ADD_PROFILE_URL,
  TWO_FACTOR_URL
} from "../const/const";
import normalizeUser from "../schemas";
import { matchItem } from "../utils";

export class TransactionService extends WebService {




async userHasTransactionSecurity(userId) {

    const url = `${TWO_FACTOR_URL}?filter={"where": {"userId": "${userId}"}}`
    const response = await this.Get(url)
    if (!response || response === 465 || response && !response.length) { return false }
    return response[0].id;
}

  async getNew2faSecretCode() {
      const user = this.user
      const body = {
          "data": {
              "country":this.user.country
          }
      }
      const response = await this.Post(`${TWO_FACTOR_URL}/get-new-2fa-secret-code`, body, user.userToken)
      if (response === 465 || !response) { return false }

      return response;

  }


  async addNewTransactionSecurity(twofa_token) {
      const user = this.user
      const body = {
        "data": {
          "country": this.user.country,
          "enabled": true,
          "type": "2fa",
          twofa_token
        }
      }
      const response = await this.Post(`${TWO_FACTOR_URL}/add-new-transaction-security`, body, user.userToken)
      if (response === 465 || !response) { return false }
      return response
  }



  async addRestoreId(restoreId) {
      const user = this.user
      const body = {
          "data": {
              restoreId
          }
      }
      const response = await this.Post(ADD_RESTORE_ID_URL, body, user.userToken)
      if (response === 465 || !response) { return false }

      return response
  }



    async addSymbolToLocalCollections(pairs, localCurrency, currencies) {
        return pairs.reduce((result, value) => {
            const secondaryShortName = matchItem(currencies, { primary: localCurrency }, 'currency')
            const primaryShortName = matchItem(currencies, { primary: value.primary_currency.currency }, 'currency')
            if (secondaryShortName && primaryShortName) {
                result.push({
                    ...value,
                    secondaryShortName: secondaryShortName[0].symbol,
                    primaryShortName: primaryShortName[0].symbol
                })
                return result
            }
        }, [])
    }

    async getLocalCurrency(country) {
        const [countryCurrency] = await this.Get(`${LOCAL_CURRENCIES_URL}{"where": {"name": "${country}"}}`)

        if (this.isEmpty(countryCurrency)) return

        const localCurrencyId = countryCurrency.currency_id
        let localCurrencyData = await this.Get(`${CURRENCIES_URL}{"where": {"id": "${localCurrencyId}"}}`)
        if (this.isEmpty(localCurrencyData)) return
        localCurrencyData = localCurrencyData[0]

        return {
            currency: localCurrencyData.currency,
            currency_type: localCurrencyData.currency_type,
            localCurrency: localCurrencyData.symbol.toLowerCase(),
            country
        }
    }


    async fetchUserProfile() {
        return this.Get(`${GET_PROFILE_URL}/${this.authData.userId}/profile`)
    }

    async addNewProfile(country) {
        const body = {
            "data": {
                "country": country
            }
        }

        const response = await this.Post(ADD_PROFILE_URL, body, this.authData.userToken)
        if (!response) { return false }

        const { data } = response

        return data
    }


}
