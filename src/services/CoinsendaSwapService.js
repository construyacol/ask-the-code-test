import { WebService } from "../actions/API/WebService";
import { ADD_NEW_SWAP, loadLabels, SWAP_URL, PAIRS_URL, GET_SWAPS_BY_USERS_URL } from "../const/const";
import { desNormalizedList, normalized_list, update_activity_state } from "../utils";
import normalizeUser from "../schemas";
import loadLocalPairsAction, {
    updateNormalizedDataAction,
    getAllPairsAction,
    searchCurrentPairAction,
    loadLocalCurrencyAction
} from "../actions/dataModelActions";
import { appLoadLabelAction } from "../actions/loader";
import convertCurrencies from "../utils/convert_currency";
import { pairsForAccount } from "../actions/uiActions";
import sleep from "../utils/sleep";



export class SwapService extends WebService {

  async fetchAllPairs() {

      this.dispatch(appLoadLabelAction(loadLabels.IMPORTANDO_PARES))
      const pairs = await this.Get(`${SWAP_URL}pairs`)
      if(!pairs){return}
      console.log('||||||||| pairs', pairs)
      // alert('pairs')

      this.dispatch(getAllPairsAction(pairs))
      let updatedUser = {
          ...this.user,
          available_pairs: [
              ...pairs
          ]
      }

      let dataNormalized = await normalizeUser(updatedUser)
      this.dispatch(updateNormalizedDataAction(dataNormalized))
      return dataNormalized
  }

  pairsRequest(query) {
      const requestCompleteUrl = `${PAIRS_URL}${query}`
      return this.Get(requestCompleteUrl)
  }

  async getPairsByCountry(country, currencies) {

      const localCurrency = await this.getLocalCurrency(country)

      if (!localCurrency) { return console.log('No se ha encontrado país en getPairsByCountry') }
      const pairs = await this.pairsRequest(`{"where": {"secondary_currency.currency": "${localCurrency.currency}"}}`)
      if (!pairs) return

      if (currencies) {
        const localCurrencies = await this.addSymbolToLocalCollections(pairs, localCurrency.currency, currencies)
        await this.dispatch(loadLocalPairsAction(localCurrencies))

        // TODO: Evaluate this
        // if(userCollection){ await get_user_pairs(userCollection, dispatch, pairs)}

        this.dispatch(searchCurrentPairAction(`BTC/${localCurrency.currency.toUpperCase()}`, 'pair'))

        this.dispatch(loadLocalCurrencyAction(localCurrency))
      }
  }

  async getPairs(primary, secondary, all) {
      if (!primary && !secondary) return

      if (primary || secondary) {
          const query = !secondary ?
              `{"where": {"primary_currency.currency": "${primary}"}}` :
              `{"where": {"secondary_currency.currency": "${secondary}"}}`
          const response = await this.pairsRequest(query)
          if (this.isEmpty(response)) return
          if (all) { return response }
          return response[0]
      }
      const query = `{"where": {"primary_currency.currency": "${primary}", "secondary_currency.currency": "${secondary}"}}`
      const response = await this.pairsRequest(query)
      if (this.isEmpty(response)) return
      return response[0]
  }

    async loadPairs(currentWallet, localCurrency, currentPair) {
        if ((currentPair && currentPair.pair_id) || !currentWallet) { return false }
        const currency = currentWallet.currency.currency

        // buscamos los pares, por defecto primero buscara el par de la moneda de la cuenta actual cotizando en la moneda fiat local, si no, buscara la cotización en bitcoin, si no la que encuentre ya sea como moneda primaria o secundaria
        let pair = await this.getPairs(currency, localCurrency)
        !pair && (pair = await this.getPairs('bitcoin', currency))
        !pair && (pair = await this.getPairs(currency))
        !pair && (pair = await this.getPairs(null, currency))

        if (!pair) { return false }

        const pairId = pair.id
        const data = await convertCurrencies(currentWallet.currency, '1', pairId)

        if (data) {
            const { to_spend_currency } = data
            return this.dispatch(pairsForAccount(currentWallet.id, {
                current_pair: {
                    pair_id: pairId,
                    currency: to_spend_currency.currency,
                    currency_value: data.want_to_spend
                }
            }))
        }
    }

    async addNewSwap(accountId, pairId, value) {
        const user = this.user

        const body = {
            // "access_token":user.userToken,
            "data": {
                "want_to_spend": value.toString(),
                "pair_id": pairId,
                "account_from": accountId,
                "country": user.country
            }
        }

        const result = await this.Post(ADD_NEW_SWAP, body, user.userToken)

        if (!result || result === 465) { return false }

        const {
            data
        } = result

        return data
    }

    async completeSwap(swaps, user, completeSwap, updateList) {
        let newSwap = {
            ...swaps[completeSwap.id],
            state: "accepted"
        }

        let updatedSwaps = {
            ...swaps,
            [newSwap.id]: {
                ...newSwap
            }
        }

        let swapsAsArray = await desNormalizedList(updatedSwaps, user.swaps)

        if (updateList) { await updateList(swapsAsArray) }

        let updatedUser = {
            ...user,
            swaps: [
                ...swapsAsArray
            ]
        }

        let normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))
        return normalizedUser
    }

    async get_swaps(accountId) {
        const user = this.user
        const { wallets } = this.globalState.modelData

        let filter = `{"where":{"or":[{"account_to":"${accountId}"}, {"account_from":"${accountId}"} ] }, "limit":30, "order":"id DESC", "include":{"relation":"user"}}`
        const finalUrl = `${GET_SWAPS_BY_USERS_URL}/${user.id}/swaps?country=${user.country}&filter=${filter}`


        const swaps = await this.Get(finalUrl)

        if (!swaps || swaps === 465) { return false }

        const result = swaps.map((swap) => {
            return {
                account_id: swap.account_from,
                account_to: swap.account_to,
                amount: swap.bought,
                amount_neto: swap.bought,
                pair_id: swap.pair_id,
                comment: "",
                action_price: swap.action_price,
                currency: swap.to_spend_currency,
                currency_type: wallets[swap.account_from] && wallets[swap.account_from].currency_type,
                cost: "",
                deposit_provider_id: "",
                expiration_date: new Date(),
                id: swap.id,
                state: swap.state === 'rejected' ? 'canceled' : swap.state,
                bought: swap.bought,
                currency_bought: swap.to_buy_currency,
                spent: swap.spent,
                type_order: "swap"
            }
        })

        await this.dispatch(normalized_list(result, 'swaps'))
        await this.dispatch(update_activity_state(accountId, 'swaps', result))

        return result
    }

}
