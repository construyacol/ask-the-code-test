import { WebService } from "../actions/API/WebService";
import { resetModelData, updateNormalizedDataAction, manageBalanceAction, updateAllCurrenciesAction } from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import {
    ACCOUNT_URL,
    DEPOSITS_URL,
    CREATE_WALLET_URL,
    DELETE_WALLET_URL,
    DELETE_WITHDRAW_ACCOUNT_URL,
    loadLabels,
    CURRENCIES_URL
} from "../const/const";
import { coins } from '../components/api/ui/api.json'
import { appLoadLabelAction } from "../actions/loader";

export class AccountService extends WebService {
    async getWalletsByUser() {
        this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BILLETERAS_Y_BALANCES))
        const user = this.user
        const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`
        const wallets = await this.Get(accountUrl)

        if (!wallets || wallets === 404) { return false }
        if (this.isEmpty(wallets)) {
            await this.dispatch(resetModelData({ wallets: [] }))
        }

        const availableWallets = wallets.filter(wallet => {
            return (wallet.visible && wallet.currency.currency !== 'usd') ? wallet : false
        })


        const balanceList = availableWallets.map(balanceItem => ({
            id: balanceItem.id,
            currency: balanceItem.currency.currency,
            reserved: balanceItem.reserved,
            available: balanceItem.available,
            total: parseFloat(balanceItem.reserved) + parseFloat(balanceItem.available),
            lastAction: null,
            actionAmount: 0
        }))


        let updatedUser = {
            ...user,
            wallets: [
                ...availableWallets
            ],
            balances: [
                ...balanceList
            ]
        }
        let userWallets = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(userWallets))
        return userWallets
    }

    async getWalletById(walletId) {
        const user = this.user
        const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts?filter={"where": {"id": "${walletId}"}}`
        const headers = this.getHeaders(user.userToken)

        const [wallets] = await this.Get(accountUrl, headers)
        if (this.isEmpty(wallets)) return

        const depositProvders = wallets.dep_prov;
        let depositProviderDetails = [{}]

        if (depositProvders.length > 0) {

            let providerId = await depositProvders.slice(-1)[0]

            const depositProviderUrl = `${DEPOSITS_URL}users/${user.id}/depositProviders?country=${user.country}&filter={"where": {"id":"${providerId}"}}`

            depositProviderDetails = await this.Get(depositProviderUrl, headers)
        }

        const result = {
            ...wallets,
            depositProvider: { ...depositProviderDetails[0] }
        }

        return result
    }

    async createWallet(body) {
        return this.Post(CREATE_WALLET_URL, body, this.user.userToken)
    }

    async deleteWallet(account) {
        const { id, country } = account
        const user = this.user

        const body = {
            data: {
                account_id: id,
                country,
                visible: false
            }
        }
        const deleteAccount = await this.Post(DELETE_WALLET_URL, body, user.userToken)

        if (!deleteAccount || deleteAccount === 404 || deleteAccount === 465) { return false }
        return deleteAccount
    }

    async deleteWithdrawAccount(accountId) {
        const { user, withdraw_accounts } = this.modelData

        const body = {
            "data": {
                "withdraw_account_id": `${accountId}`,
                "country": withdraw_accounts[accountId].info.country,
                "visible": false
            }
        }

        const deleteAccount = await this.Post(DELETE_WITHDRAW_ACCOUNT_URL, body, user.userToken)

        return deleteAccount
    }


    async manageBalance(accountId, action, amount) {
        const user = this.user
        // await this.getBalancesByAccount(user)
        this.dispatch(manageBalanceAction(accountId, action, amount))
    }

    // async getBalancesByAccount() {
    //     const user = this.user
    //     this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BALANCES))
    //     const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`
    //
    //     const headers = this.getHeaders(user.userToken)
    //
    //     const balances = await this.Get(accountUrl, headers)
    //
    //     if (this.isEmpty(balances)) return
    //
    //     const balanceList = balances.map(balanceItem => ({
    //         id: balanceItem.id,
    //         currency: balanceItem.currency.currency,
    //         reserved: balanceItem.reserved,
    //         available: balanceItem.available,
    //         total: parseFloat(balanceItem.reserved) + parseFloat(balanceItem.available),
    //         lastAction: null,
    //         actionAmount: 0
    //     }))
    //
    //     const updatedUser = {
    //         ...user,
    //         balances: [
    //             ...balanceList
    //         ]
    //     }
    //
    //     const userBalances = await normalizeUser(updatedUser)
    //     await this.dispatch(updateNormalizedDataAction(userBalances))
    // }

    async fetchAllCurrencies() {
        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TODAS_LAS_DIVISAS))

        const response = await this.Get(CURRENCIES_URL)
        let new_currencies = []

        // en caso de que ocurra un error en esta petición cargaremos con datos harcodeados el modelo
        if (!response) {
            this.dispatch(updateAllCurrenciesAction(new_currencies))
            return coins
        }

        const currencies = response.reduce((result, currency) => {
            const split = currency.node_url && currency.node_url.split("api")
            result.push({
                "currency_type": currency.currency_type,
                "id": currency.id,
                "type": "coins",
                "name": currency.currency,
                "code": currency.symbol.toLowerCase(),
                "selection": false,
                "is_token": currency.is_token,
                "min_amount": currency.deposit_min_amount,
                ...currency,
                "node_url": split && split[0]
            })
            return result
        }, [])
        // console.log('GET CURRENCIES, ', currencies)
        await this.dispatch(updateAllCurrenciesAction(currencies))
        return currencies
    }
}
