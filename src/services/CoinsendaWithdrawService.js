import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
    loadLabels,
    GET_WITHDRAW_BY_USER_URL,
    WITHDRAW_PROVIDERS_URL,
    UPDATE_WITHDRAW_URL,
    NEW_WITHDRAW_URL,
    DELETE_WITHDRAW_URL,
    NEW_WITHDRAW_ACCOUNT_URL
} from "../const/const";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import { withdrawProvidersByType } from "../utils";
// import { toJS } from "mobx";

export class WithdrawService extends WebService {
    async fetchWithdrawAccounts() {
        const { user, withdrawProviders } = this.globalState.modelData
        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_CUENTAS_DE_RETIRO))
        const finalUrl = `${GET_WITHDRAW_BY_USER_URL}/${user.id}/withdrawAccounts?country=${user.country}`

        const result = await this.Get(finalUrl)
        if (!result || result === 465 || !withdrawProviders) { return false }

        const providersServed = await this.withdrawProvidersByType
        // return console.log('||||||||| fetchDepositProviders', providersServed)

        const withdrawAccounts = await result.map(account => {
            const aux = providersServed[account.provider_type];
            if (aux.currency_type === 'fiat') {
                return {
                    id: account.id,
                    account_number: {
                        ui_name: aux.info_needed.account_number.ui_name,
                        value: account.info.account_number
                    },
                    account_type: {
                        ui_name: aux.info_needed.account_type[account.info.account_type].ui_name,
                        value: account.info.account_type
                    },
                    bank_name: {
                        ui_name: aux.info_needed.bank_name[account.info.bank_name].ui_name,
                        value: account.info.bank_name
                    },
                    city: {
                        ui_name: aux.info_needed.city[account.info.city].ui_name,
                        value: account.info.city
                    },
                    provider_name: account.info.bank_name,
                    used_counter: account.used_counter,
                    email: account.info.email,
                    id_number: account.info.id_number,
                    name: account.info.name,
                    surname: account.info.surname,
                    inscribed: account.used_counter > 0 ? true : false,
                    visible: account.visible,
                    provider_type: account.provider_type,
                    provider_max_amount: aux.provider.max_amount,
                    provider_min_amount: aux.provider.min_amount,
                    currency_type: aux && aux.currency_type,
                    withdraw_provider: aux.id,
                    ...account
                }
            }
            else {
                return { //crypto case
                    id: account.id,
                    account_name: {
                        ui_name: aux.info_needed.label.ui_name,
                        value: account.info.label
                    },
                    account_address: {
                        ui_name: aux.info_needed.address.ui_name,
                        value: account.info.address
                    },
                    used_counter: account.used_counter,
                    inscribed: account.used_counter > 0 ? true : false,
                    visible: account.visible,
                    provider_type: account.provider_type,
                    provider_max_amount: aux.provider.max_amount,
                    provider_min_amount: aux.provider.min_amount,
                    currency_type: aux && aux.currency_type,
                    withdraw_provider: aux.id,
                    ...account
                }
            }

        })

        withdrawAccounts.reverse()

        const updatedUser = {
            ...user,
            withdraw_accounts: [
                ...withdrawAccounts
            ]
        }

        const normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))
        return withdrawAccounts
    }

    get withdrawProvidersByType() {
        return this.withdrawProviders && this.withdrawProviders.reduce((result, provider) => {
            return {
                ...result,
                [provider.provider_type]: provider
            }
        }, {})
    }

    async fetchWithdrawProviders() {
        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_RETIRO))
        const user = this.user
        const finalUrl = `${WITHDRAW_PROVIDERS_URL}?country=${user.country}`

        let withdrawProviders = await this.Get(finalUrl)
        // return console.log('||||||||| fetchWithdrawProviders', withdrawProviders, finalUrl)
        let updatedUser = {
            ...user,
            withdrawProviders: [
                ...withdrawProviders
            ]
        }
        let normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))
        this.withdrawProviders = withdrawProviders
        return withdrawProviders
    }

    async addOrUpdateWithdraw(withdrawId, state) {
        const user = this.user
        const body = {
            // "access_token":user.userToken,
            "data": {
                "withdraw_id": withdrawId,
                "state": state,
                "country": user.country,
            }
        }

        const response = await this.Post(UPDATE_WITHDRAW_URL, body, user.userToken)
        if (!response || response === 465) { return false }

        return response

    }



    async addWithdrawOrder(amount, accountFrom, withdrawProvider, withdrawAccount) {
        const user = this.user
        const body = {
            // "access_token":user.userToken,
            "data": {
                "amount": amount,
                "account_id": accountFrom,
                "withdraw_provider_id": withdrawProvider,
                "withdraw_account_id": withdrawAccount,
                "country": user.country
            }
        }
        const response = await this.Post(NEW_WITHDRAW_URL, body, user.userToken)
        if (!response || response === 465) { return false }

        return response
    }

    async fetchWithdrawByUser(user) {
        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_REGISTROS_DE_RETIROS))

        const finalUrl = `${GET_WITHDRAW_BY_USER_URL}/${user.id}/withdraws?country=${user.country}`
        const response = await this.Get(finalUrl)
        if (response && response.length < 1) { return false }

        const withdrawals = response.reduce((result, withdraw) => result.push({
            ...withdraw,
            account_id: withdraw.account_id,
            amount: withdraw.amount,
            amount_neto: withdraw.amount_neto,
            comment: "",
            country: withdraw.country,
            currency: withdraw.currency,
            currency_type: withdraw.currency_type,
            cost: withdraw.cost,
            cost_struct: withdraw.cost_struct,
            deposit_provider_id: "",
            expiration_date: new Date(),
            id: withdraw.id,
            state: withdraw.state === 'accepted' && !withdraw.proof ? 'confirmed' : withdraw.state,
            unique_id: withdraw.id,
            userId: withdraw.userId,
            withdraw_account: withdraw.withdraw_account_id,
            withdraw_provider: withdraw.withdraw_provider_id,
            type_order: "withdraw",
            withdraw_proof: withdraw.proof,
            created_at: withdraw.created_at,
        }), [])


        withdrawals.reverse()

        const updatedUser = {
            ...user,
            withdrawals: [
                ...withdrawals
            ]
        }

        const normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))

        return normalizedUser
    }

    async deleteWithdrawOrder(orderId) {
        return this.Delete(`${DELETE_WITHDRAW_URL}/${orderId}`)
    }

    async addNewWithdrawAccount(payload, type) {
        const user = this.user
        const {
            provider_type,
            name,
            surname,
            id_number,
            id_type,
            short_name,
            account_number,
            account_type,
            city,
            currency
        } = payload

        const body = type === 'crypto' ? {
            "data": {
                ...payload
            }
        } : {
            "data": {
                "currency": currency,
                "provider_type": provider_type,
                "name": name,
                "surname": surname,
                "id_number": id_number || user.id_number,
                "id_type": id_type,
                "bank_name": short_name,
                "account_number": account_number,
                "account_type": account_type,
                "city": city,
                "email": user.email || 'default@coinsenda.com',
                "label": short_name,
                "country": user.country
            }
        }

        const response = await this.Post(NEW_WITHDRAW_ACCOUNT_URL, body, user.userToken)

        if (!response || response === 465) { return false }

        const {
            data
        } = response

        return data
    }
}
