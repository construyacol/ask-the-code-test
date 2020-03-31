import { WebService } from "./WebService";
import { appLoadLabelAction } from "../loader";
import {
    loadLabels,
    GET_WITHDRAW_BY_USER_URL,
    WITHDRAW_PROVIDERS_URL,
    UPDATE_WITHDRAW_URL,
    ADD_RESTORE_ID_URL,
    NEW_WITHDRAW_URL,
    DELETE_WITHDRAW_URL,
    NEW_WITHDRAW_ACCOUNT_URL
} from "./const";
import { updateNormalizedDataAction } from "../dataModelActions";
import normalizeUser from "../../schemas";
import { withdrawProvidersByType } from "../../services";

export class CoinsendaWithdrawService extends WebService {
    async fetchWithdrawAccounts(user, withdrawProviders) {
        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_CUENTAS_DE_RETIRO))
        const finalUrl = `${GET_WITHDRAW_BY_USER_URL}/${user.id}/withdrawAccounts?country=${user.country}`

        const result = await this.Get(finalUrl)
        if (!result || result === 465 || !withdrawProviders) { return false }

        const providersServed = await withdrawProvidersByType(withdrawProviders)

        const withdrawAccounts = await result.map(withdrawAccount => {
            const aux = providersServed[withdrawAccount.provider_type];
            if (aux.currency_type === 'fiat') {
                return {
                    id: withdrawAccount.id,
                    account_number: {
                        ui_name: aux.info_needed.account_number.ui_name,
                        value: withdrawAccount.info.account_number
                    },
                    account_type: {
                        ui_name: aux.info_needed.account_type[withdrawAccount.info.account_type].ui_name,
                        value: withdrawAccount.info.account_type
                    },
                    bank_name: {
                        ui_name: aux.info_needed.bank_name[withdrawAccount.info.bank_name].ui_name,
                        value: withdrawAccount.info.bank_name
                    },
                    city: {
                        ui_name: aux.info_needed.city[withdrawAccount.info.city].ui_name,
                        value: withdrawAccount.info.city
                    },
                    provider_name: withdrawAccount.info.bank_name,
                    used_counter: withdrawAccount.used_counter,
                    email: withdrawAccount.info.email,
                    id_number: withdrawAccount.info.id_number,
                    name: withdrawAccount.info.name,
                    surname: withdrawAccount.info.surname,
                    inscribed: withdrawAccount.used_counter > 0 ? true : false,
                    visible: withdrawAccount.visible,
                    provider_type: withdrawAccount.provider_type,
                    provider_max_amount: aux.provider.max_amount,
                    provider_min_amount: aux.provider.min_amount,
                    currency_type: aux && aux.currency_type,
                    withdraw_provider: aux.id,
                    ...withdrawAccount
                }
            }
            else {
                return { //crypto case
                    id: withdrawAccount.id,
                    account_name: {
                        ui_name: aux.info_needed.label.ui_name,
                        value: withdrawAccount.info.label
                    },
                    account_address: {
                        ui_name: aux.info_needed.address.ui_name,
                        value: withdrawAccount.info.address
                    },
                    used_counter: withdrawAccount.used_counter,
                    inscribed: withdrawAccount.used_counter > 0 ? true : false,
                    visible: withdrawAccount.visible,
                    provider_type: withdrawAccount.provider_type,
                    provider_max_amount: aux.provider.max_amount,
                    provider_min_amount: aux.provider.min_amount,
                    currency_type: aux && aux.currency_type,
                    withdraw_provider: aux.id,
                    ...withdrawAccount
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

    async fetchWithdrawProviders() {
        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_RETIRO))
        const user = this.user
        const finalUrl = `${WITHDRAW_PROVIDERS_URL}?country=${user.country}`

        let withdrawProviders = await this.Get(finalUrl)

        let updatedUser = {
            ...user,
            withdraw_providers: [
                ...withdrawProviders
            ]
        }
        let normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))
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