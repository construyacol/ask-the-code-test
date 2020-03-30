import { WebService } from "./WebService";
import { appLoadLabelAction } from "../loader";
import loadLocalPairsAction, {
    getAllPairsAction,
    updateNormalizedDataAction,
    searchCurrentPairAction,
    loadLocalCurrencyAction,
} from "../dataModelActions"
import userSource from '../../components/api'
import { loadLabels, DEFAULT_URL, LOCAL_CURRENCIES_URL, CURRENCIES_URL, PAIRS_URL } from "./const";
import normalizeUser from "../../schemas";
import { matchItem } from "../../services";
import convertCurrencies from "../../services/convert_currency";
import { pairsForAccount } from "../uiActions";

export class CoinsendaPairsService extends WebService {
    async fetchAllPairs() {
        this.dispatch(appLoadLabelAction(loadLabels.IMPORTANDO_PARES))

        const pairs = await this.Get(DEFAULT_URL)

        this.dispatch(getAllPairsAction(pairs))

        let updatedUser = {
            ...userSource,
            available_pairs: [
                ...pairs
            ]
        }

        let dataNormalized = await normalizeUser(updatedUser)
        this.dispatch(updateNormalizedDataAction(dataNormalized))
        return dataNormalized
    }

    isEmpty(data) {
        return !data || (data && data.lenght === 0)
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
        const countryCurrency = await this.Get(`${LOCAL_CURRENCIES_URL}{"where": {"name": "${country}"}}`)

        if (this.isEmpty(countryCurrency)) return

        const localCurrencyId = countryCurrency[0].currency_id
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

    pairsRequest(query) {
        const requestCompleteUrl = `${PAIRS_URL}${query}`
        return this.Get(requestCompleteUrl)
    }

    async getPairsByCountry(country, userCollection) {
        const { currencies } = this.state.modelData
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
        return console.log('debes cargar las currencies');
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
}