import { WebService } from "./WebService";
import { UPDATE_DEPOSIT_URL, NEW_DEPOSIT_URL } from "./const";

export class CoinsendaDepositService extends WebService {
    async confirmDepositOrder(order, base64image) {
        const { user } = this.state.modelData

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
        const { user } = this.state.modelData

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