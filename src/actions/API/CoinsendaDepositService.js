import { WebService } from "./WebService";
import { UPDATE_DEPOSIT_URL, NEW_DEPOSIT_URL, loadLabels, DEPOSITS_URL } from "./const";
import { appLoadLabelAction } from "../loader";
import normalizeUser from "../../schemas";
import { updateNormalizedDataAction } from "../dataModelActions";

export class DepositService extends WebService {
    async fetchDepositProviders() {
        this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_DEPOSITO))

        const finalUrl = `${DEPOSITS_URL}users/${this.user.id}/depositProviders?country=${this.user.country}&filter[include]=depositAccount`
        const response = await this.Get(finalUrl)
        // return console.log('||||||||| fetchDepositProviders', response)

        const result = response.reduce((result, item) => {
            result.push({
                ...item,
                provider: {
                    ...item.depositAccount,
                    account: {
                        ...item.depositAccount.account
                    }
                }
            })
            return result
        }, [])

        const finalData = {
            ...this.user,
            deposit_providers: [
                ...result,
            ]
        }

        const normalizedData = await normalizeUser(finalData)
        this.dispatch(updateNormalizedDataAction(normalizedData))
        return normalizedData.entities.deposit_providers
    }

    async confirmDepositOrder(order, base64image) {
        const user = this.user

        const body = {
            // "access_token":user.userToken,
            "data": {
                "country": user.country,
                "deposit_id": order.id,
                "state": "confirmed",
                // "account_id": account_id,
                "proof_of_payment": {
                    "type": "image",
                    "proof": base64image
                }
            }
        }

        return await this.Post(UPDATE_DEPOSIT_URL, body, user.userToken, true)
    }

    async createDeposit(
        currency,
        amount,
        accountId,
        costId,
        depositService,
        user,
        serviceMode,
        depositProviderId
    ) {
        const body = {
            // "access_token":user.userToken,
            "data": {
                "currency": currency,
                "amount": amount,
                "cost_id": costId,
                "deposit_provider_id": depositProviderId,
                "info": { depositService, serviceMode },
                "comment": "",
                "account_id": accountId,
                "country": user.country
            }
        }


        const result = await this.Post(NEW_DEPOSIT_URL, body, user.userToken)
        if (result === 465 || !result) { return false }
        const { data } = result

        return data
    }

    async deleteDeposit(depositId) {
        const user = this.user

        const body = {
            "data": {
                "country": user.country,
                "deposit_id": depositId,
                "state": "canceled"
            }
        }

        return this.Post(UPDATE_DEPOSIT_URL, body, user.userToken)
    }
}
