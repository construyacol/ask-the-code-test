import { WebService } from "../actions/API/WebService";
import { REFERRALS_URL, GET_REFERRAL_URL } from "../const/const";

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
    let res = await this.Post(finalUrl, body);
    if(!res){return false}

    let updatedUser = {
        ...user,
        referral:{
          ref_code
        }
    }

    this.updateUser(updatedUser)
    return true;
  }

  async getReferralCode() {
    const user = this.user;
    if(user.verification_level === 'level_0') return ; 
    const finalUrl = `${GET_REFERRAL_URL}/${user.id}/referral`;
    // const finalUrl = `${GET_REFERRAL_URL}?filter={"where":{"userId":"${user.id}"}}`;
    let referralData = await this.Get(finalUrl);
    if(!referralData){ return }

    let updatedUser = {
      ...user,
      referral:{
        ref_code:referralData.ref_code,
        referred_by:referralData.referred_by,
        referreds:referralData.referreds
      }
    };

    this.updateUser(updatedUser)
    return true;
  }
}
