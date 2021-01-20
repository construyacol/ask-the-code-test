import { WebService } from "../actions/API/WebService";
import { REFERRALS_URL } from "../const/const";

export class ReferralService extends WebService {


  async setReferralCode(ref_code) {
    const user = this.user;

    let body = {
      data: {
        country: user.country,
        new_ref_code: ref_code,
      },
    };

    const finalUrl = `${REFERRALS_URL}/set-ref-code`;
    let res = true;
    // let res = await this.Post(finalUrl, body);
    if(!res){return false}

    let updatedUser = {
        ...user,
        referral:{
          ref_code
        }
    }

    await this.dispatch(this.updateUser(updatedUser))
    return true;
  }

  async getReferralCode() {
    const user = this.user;

    const finalUrl = `${REFERRALS_URL}?filter={"where":{"userId":"${user.id}"}}`;
    let response = await this.Get(finalUrl);

    let updatedUser = {
      ...user,
      referral: response[0],
    };

    await this.dispatch(this.updateUser(updatedUser));
    return response && response[0];
  }
}
