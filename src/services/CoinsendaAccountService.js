import { WebService } from "../actions/API/WebService";
import { resetModelData, updateNormalizedDataAction, manageBalanceAction } from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import {
    ACCOUNT_URL,
    DEPOSITS_URL,
    CREATE_WALLET_URL,
    DELETE_WALLET_URL,
    loadLabels,
} from "../const/const";
import { appLoadLabelAction } from "../actions/loader";
import initialAccounts from '../components/api/accountInitialEnvironment.json'
import { serve_orders, matchItem } from "../utils";
import update_activity, { pending_activity } from "../actions/storage";
import { current_section_params } from "../actions/uiActions";

export class AccountService extends WebService {

    async getWalletsByUser(onlyBalances = false) {
        this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BILLETERAS_Y_BALANCES))
        const user = this.user
        const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`
        const wallets = await this.Get(accountUrl)
        if (!wallets || wallets === 404) { return false }

        const availableWallets = wallets.filter(wallet => {
            return (wallet.visible && wallet.currency.currency !== 'usd') ? wallet : false
        })

        if (!availableWallets.length) {
            let userWithOutW = {
                ...user,
                wallets: []
            }
            const toNormalize = await normalizeUser(userWithOutW)
            await this.dispatch(updateNormalizedDataAction(toNormalize))
            return this.dispatch(resetModelData({ wallets: [] }))
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

        const updatedOnlyBalances = {
            ...user,
            balances: [
                ...balanceList
            ]
        }

        let userWallets = await normalizeUser(onlyBalances ? updatedOnlyBalances : updatedUser)

        await this.dispatch(updateNormalizedDataAction(userWallets))
        return userWallets
    }

    async createInitialEnvironmentAccount() {
        const { accounts } = initialAccounts
        for (let body of accounts) {
            // TODO: assign currency by country
            body.data.country = this.user.country
            body.data.name = `Mi Billetera ${body.data.currency.currency}`
            const wallets = await this.createWallet(body)
            if (!wallets) { return }
            await this.getWalletsByUser()
            const { account } = wallets
            const dep_prov = await this.createAndInsertDepositProvider(account)
            if (!dep_prov) { return }
            // console.log(account)
        }
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
        await this.getWalletsByUser(true)
        this.dispatch(manageBalanceAction(accountId, action, amount))
    }

    // async getBalancesByAccount() {
    //     const user = this.user
    //     this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BALANCES))
    //     const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`

    //     const headers = this.getHeaders(user.userToken)

    //     const balances = await this.Get(accountUrl, headers)

    //     if (this.isEmpty(balances)) return

    //     const balanceList = balances.map(balanceItem => ({
    //         id: balanceItem.id,
    //         currency: balanceItem.currency.currency,
    //         reserved: balanceItem.reserved,
    //         available: balanceItem.available,
    //         total: parseFloat(balanceItem.reserved) + parseFloat(balanceItem.available),
    //         lastAction: null,
    //         actionAmount: 0
    //     }))

    //     const updatedUser = {
    //         ...user,
    //         balances: [
    //             ...balanceList
    //         ]
    //     }

    //     const userBalances = await normalizeUser(updatedUser)
    //     await this.dispatch(updateNormalizedDataAction(userBalances))
    // }

    async countOfAccountTransactions(account_id) {
        const response = await this.Get(`${ACCOUNT_URL}/${this.user.id}/transactions/count?where={"account_id": "${account_id}"}`)
        return response
    }

    async updatePendingActivity(accountId, type, activityList) {
        const { modelData, ui } = this.globalState

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

        this.dispatch(pending_activity(finalResult))

    }

    async updateActivityState(accountId, type, activities) {
        if (!activities) {
            activities = await serve_orders(accountId, type)
        }

        await this.dispatch(current_section_params({ currentFilter: type }))
        await this.dispatch(update_activity(accountId, type, activities))
        await this.updatePendingActivity(accountId, type, activities)
    }

    async getFiatAccountByUserId() {
        const user = this.user
        const filter = `filter={"where": {"currency_type": "fiat"}}`
        const URL = `${ACCOUNT_URL}/${user.id}/accounts?country=${user.country}&${filter}`

        const response = await this.Get(URL)

        if (!response || response.length < 1) { return false }
        return response
    }
}
