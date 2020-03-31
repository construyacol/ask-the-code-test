import { WebService } from "./WebService";
import { REFERRALS_URL } from "./const";
import { updateUser } from "../APIactions";

export class CoinsendaReferralService extends WebService {
    async setReferralCode(code) {
        const user = this.user

        let body = {
            "access_token": user.userToken,
            "data": {
                "userId": user.id,
                "country": "colombia",
                "new_ref_code": code
            }
        }

        const finalUrl = `${REFERRALS_URL}/set-ref-code`
        let res = await this.Post(finalUrl, body)

        let updatedUser = {
            ...user,
            referral: res
        }

        await this.dispatch(updateUser(updatedUser))
        return res
    }

    async getReferralCode() {
        const user = this.user

        const finalUrl = `${REFERRALS_URL}?filter={"where":{"userId":"${user.id}"}}`
        let response = await this.Get(finalUrl)

        let updatedUser = {
            ...user,
            referral: response[0]
        }

        await this.dispatch(updateUser(updatedUser))
        return response && response[0]
    }
}