import { WebService } from "./WebService";
import Environment from "../../environment";
import { appLoadLabelAction } from "../loader";
import loadLocalPairsAction, { getAllPairsAction, updateNormalizedDataAction, searchCurrentPairAction, loadLocalCurrencyAction } from "../dataModelActions"
import userSource from '../../components/api'
import { loadLabels } from "./const";
import normalizeUser from "../../schemas";
import { matchItem } from "../../services";

const DEFAULT_URL = `${Environment.SwapApiUrl}pairs`
const LOCAL_CURRENCIES_URL = `${Environment.ApiUrl}countries?filter=`
const CURRENCIES_URL = `${Environment.ApiUrl}currencies?filter=`
const PAIRS_URL = `${Environment.SwapApiUrl}pairs?filter=`

export class CoinsendaSwapService extends WebService {
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
                return result.push({
                    ...value,
                    secondaryShortName: secondaryShortName[0].symbol,
                    primaryShortName: primaryShortName[0].symbol
                })
            }
            return false
        }, [])
    }

    async getloadLocalCurrencyAction(country) {
        const countryCurrency = await this.Get(`${LOCAL_CURRENCIES_URL}{"where": {"name": "${country}"}}`)

        if (this.isEmpty(countryCurrency)) return

        const localCurrencyId = countryCurrency[0].currency_id
        const localCurrencyData = await this.Get(`${CURRENCIES_URL}{"where": {"id": "${localCurrencyId}"}}`)

        if (this.isEmpty(localCurrencyData)) return

        return {
            currency: localCurrencyData.currency,
            currency_type: localCurrencyData.currency_type,
            localCurrency: localCurrencyData.symbol.toLowerCase(),
            country
        }
    }

    pairRequest(query) {
        const requestCompleteUrl = `${PAIRS_URL}${query}`
        return this.Get(requestCompleteUrl)
    }

    async getPairByCountry(country, userCollection) {
        const { currencies } = this.state.modelData
        const localCurrency = await this.getloadLocalCurrencyAction(country)

        if (!localCurrency) { return console.log('No se ha encontrado país en getPairByCountry') }

        const pairs = await this.pairRequest(`{"where": {"secondary_currency.currency": "${localCurrency.currency}"}}`)

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

    async getPair(primary, secondary, all) {
        if (!primary && !secondary) return

        if (primary || secondary) {
            const query = !secondary ?
                `{"where": {"primary_currency.currency": "${primary}"}}` :
                `{"where": {"secondary_currency.currency": "${secondary}"}}`
            const response = await this.pairRequest(query)
            if (this.isEmpty(response)) return
            if (all) { return response }
            return response[0]
        }
        const query = `{"where": {"primary_currency.currency": "${primary}", "secondary_currency.currency": "${secondary}"}}`
        const response = await this.pairRequest(query)
        return response[0]
    }
}