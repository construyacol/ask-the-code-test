import { WebService } from "./WebService";
import { appLoadLabelAction } from "../loader";
import {
    updateNormalizedDataAction
} from "../dataModelActions"
import { loadLabels, LOCAL_CURRENCIES_URL, CURRENCIES_URL, ADD_RESTORE_ID_URL } from "./const";
import normalizeUser from "../../schemas";
import { matchItem } from "../../services";

export class TransactionService extends WebService {

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


}
