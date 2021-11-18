import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
  loadLabels,
  INDETITY_URL,
  INDENTITY_USERS_URL,
  INDETITY_COUNTRY_VALIDATORS_URL,
  INDETITY_UPDATE_PROFILE_URL,
} from "../const/const";
import userDefaultState from "../components/api";
import { objectToArray, addIndexToRootObject } from "../utils";
import normalizeUser from "../schemas";
import { verificationStateAction } from "../actions/uiActions";
import Environment from "../environment";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import { CleanForm, ToStep } from "../actions/formActions";


export class IndetityService extends WebService {


  async getStatus(status) {
    // if(status){return status} 
    try {
      const user = this.user;
      const statusUrl = `${INDENTITY_USERS_URL}/${user.id}/status`;
      const status = await this.Get(statusUrl);
      return status
    } catch (e) {
      console.log('getStatus', e)
      return e
    }
  }

  async updateUserStatus(status) {

    const user = this.user;
    const _status = await this.getStatus(status)
    if(!_status) return;
    this.setIsAppLoading(true)
    const { countries:{ international } } = _status
    let userUpdate = {
      ...user,
      verification_level:international.verification_level,
      verification_error:international.errors && international.errors[0],
      levels:international.levels,
      security_center:{
        ...user.security_center,
        kyc:{
          advanced:international.levels.identity,
          basic:international.levels.personal,
          financial:international.levels.financial
        }
      }
    }
    // console.log('||||||||||||||| getUserStatus:: ', userUpdate)
    await this.updateUser(userUpdate)

    setTimeout(()=>{
      this.setIsAppLoading(false);
    }, 100)

    if(
    international.levels.identity === 'rejected' &&
    international.levels.personal === 'rejected'
    ){
      this.dispatch(CleanForm("kyc_basic"))
      this.dispatch(CleanForm("kyc_advanced"))
      this.dispatch(ToStep("globalStep", 0))
    }
  } 

  async fetchCompleteUserData(userCountry, profile = {}) {
    await this.dispatch(appLoadLabelAction(loadLabels.CARGANDO_TU_INFORMACION));
    const user = this.user;

    const finalUrlFirst = `${INDETITY_URL}?country=${userCountry || user.country}`;

    const firstResponse = await this.Get(finalUrlFirst);
    if (!firstResponse) {
      return false;
    }

    const finalUrlSecond = `${INDENTITY_USERS_URL}/${this.authData.userId}/status`;
    const secondResponse = await this.Get(finalUrlSecond);

    // if(await this.isCached('fetchCompleteUserData_', secondResponse)) {
    //     return true
    // }

    let country_object = await addIndexToRootObject(secondResponse.countries);
    let country = await objectToArray(country_object);

    let updatedUser = {
      ...userDefaultState,
      email: this.authData.userEmail,
      // userToken: this.authData.userToken,
      restore_id: profile.restore_id || user.restore_id,
      id: secondResponse.userId,
      verification_level: country[0].verification_level,
      verification_error: country[0].errors && country[0].errors[0],
      levels: country[0].levels,
      country: userCountry
    };

    const transactionSecurity = await this.userHasTransactionSecurity(updatedUser.id);
    console.log(transactionSecurity)
    debugger

    if (transactionSecurity) {
      const { transaction_security_id, scopes } = transactionSecurity;
      updatedUser.security_center.txSecurityId = transaction_security_id;
      updatedUser.security_center.authenticator.auth = true;
      updatedUser.security_center.authenticator.withdraw = scopes.withdraw;
    }


    if(country[0].levels && country[0].levels.personal){
      updatedUser.security_center.kyc.basic = country[0].levels && country[0].levels.personal
    }

    const identityConfirmed = updatedUser.levels && updatedUser.levels.identity === 'confirmed' && updatedUser.levels.personal === 'confirmed'
    const identityAccepted = updatedUser.levels && updatedUser.levels.identity === 'accepted' && updatedUser.levels.personal === 'accepted'
    const identityRejected = updatedUser.levels && updatedUser.levels.identity === 'rejected' && updatedUser.levels.personal === 'rejected'

    if((profile.countries[country[0].value] !== 'level_0') || identityConfirmed){
      let kyc_personal = country[0].levels && country[0].levels.personal;
      let kyc_identity = country[0].levels && country[0].levels.identity;
      let kyc_financial = country[0].levels && country[0].levels.financial;
      if (kyc_personal) {
        updatedUser.security_center.kyc.basic = kyc_personal;
      }
      if (kyc_identity) {
        updatedUser.security_center.kyc.advanced = kyc_identity;
      }
      if (kyc_financial) {
        updatedUser.security_center.kyc.financial = kyc_financial;
      }
    }else if(profile.countries[country[0].value] === 'level_0' && identityAccepted){
      updatedUser.security_center.kyc.basic = 'confirmed';
      updatedUser.security_center.kyc.advanced = 'confirmed';
    }else if(identityRejected){
      updatedUser.security_center.kyc.basic = 'rejected';
      updatedUser.security_center.kyc.advanced = 'rejected';
    }



    const finalUrlThird = `${INDENTITY_USERS_URL}/${this.authData.userId}/profiles`;
    let thirdResponse = await this.Get(finalUrlThird);

    if (thirdResponse && thirdResponse.length > 0) {
      // Agregamos la información al modelo usuario (updatedUser)
      updatedUser = {
        ...updatedUser,
        ...thirdResponse[0].personal,
        operation_country:thirdResponse[0].personal && thirdResponse[0].personal.country,
        country: userCountry,
        person_type: thirdResponse[0].person_type
      };
    }

    let normalizedUser = await normalizeUser(updatedUser);
    await this.dispatch(updateNormalizedDataAction(normalizedUser));

    return updatedUser;
  }

  async updateUser(userData) {
    const _userUpdate = await normalizeUser(userData);
    return this.dispatch(updateNormalizedDataAction(_userUpdate));
  }

  async getVerificationState() {
    const user = this.user;
    if (!user) {
      return false;
    }
    const { advanced, basic } = user.security_center.kyc;
    let status = "pending";
    if (advanced === basic) {
      status = !advanced ? null : advanced;
    }
    await this.dispatch(verificationStateAction(status));
    return status;
  }


  async countryValidators() {
    let response = await this.Get(`${INDETITY_COUNTRY_VALIDATORS_URL}?country=international`);
    if (!response || response === 465 || response === 404) {
      return false;
    }
    let countries = await addIndexToRootObject(
      response[0].levels.level_1.personal.natural.country
    );
    let countriesAsArray = await objectToArray(countries);
    let countriesObject = {
      res: response[0],
      countries,
      country_list: countriesAsArray,
    };
    return countriesObject;
  }


  updateLevelProfile(config, user) {
    let body = {
      data: {
        country: user.country,
        person_type: user.person_type,
        info_type: config.info_type,
        verification_level: config.verification_level,
        info: config.info,
      },
    };

    return this.Post(INDETITY_UPDATE_PROFILE_URL, body);
  }

  getCountryList() {
    return this.Get(`${Environment.CountryApIUrl}countrys`);
  }

  async userVerificationStatus(level) {
    const user = this.user;
    const { advanced, basic, financial } = user.security_center.kyc;

    switch (level) {
      case "level_1":
        return advanced === "accepted" && basic === "accepted";
      case "level_2":
        return (
          advanced === "accepted" &&
          basic === "accepted" &&
          financial === "accepted"
        );
      default:
        return false;
    }
  }
}
