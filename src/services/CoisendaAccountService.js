import { WebService } from "../actions/API/WebService";
import { resetModelData, updateNormalizedDataAction, manageBalanceAction } from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import {
    ACCOUNT_URL,
    DEPOSITS_URL,
    CREATE_WALLET_URL,
    DELETE_WALLET_URL,
    loadLabels,
    CURRENCIES_URL
} from "../const/const";
import { appLoadLabelAction } from "../actions/loader";

export class AccountService extends WebService {

    async getWalletsByUser() {
        this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BILLETERAS_Y_BALANCES))
        const user = this.user
        const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`
        const wallets = await this.Get(accountUrl)
        if (!wallets || wallets === 404) { return false }


        const availableWallets = wallets.filter(wallet => {
            return (wallet.visible && wallet.currency.currency !== 'usd') ? wallet : false
        })

        if (!availableWallets.length) {
            await this.dispatch(resetModelData({ wallets: [] }))
        }

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



    async countOfAccountTransactions(account_id) {
      const response = await this.Get(`${ACCOUNT_URL}/${this.user.id}/transactions/count?where={"account_id": "${account_id}"}`)
      return response
    }
}
