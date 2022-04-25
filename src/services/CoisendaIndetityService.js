import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
  loadLabels,
  INDETITY_URL,
  INDENTITY_USERS_URL,
  INDETITY_COUNTRY_VALIDATORS_URL,
  INDETITY_UPDATE_PROFILE_URL,
  INDENTITY_ADD_BIOMETRIC_DATA_URL,
  fileTest
} from "../const/const";
import userDefaultModel from "../components/api";
import { objectToArray, addIndexToRootObject } from "../utils";
import normalizeUser from "../schemas";
import { verificationStateAction } from "../actions/uiActions";
import Environment from "../environment";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import { CleanForm, ToStep } from "../actions/formActions";

const {
  IdentityApIUrl
} = Environment

export class IndetityService extends WebService {


  async proofEndpoints() {

    const { userId } = this.authData;

    // const body = {
    //   "data": {
    //     "country":"international", 
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}levels/get-next-level`, body);

    // 0: "location"
    // 1: "identity"
    // 2: "regulation"

    // let url = `${IdentityApIUrl}users/${userId}/biometric`;
    // let url = `${IdentityApIUrl}users/${userId}/userLevel`;

    // FORM INPUTS LOCATION
    // let url = `${IdentityApIUrl}countries`;
    // let query = '{"where":{"country":"colombia"}}'
    // let url = `${IdentityApIUrl}provinces?filter=${query}`;
    // let query = '{"where":{"province":"valle del cauca"}}'
    // let url = `${IdentityApIUrl}citys?filter=${query}`;
    // let url = `${IdentityApIUrl}citys`;

    // FORM INPUTS IDENTITY
    // let url = `${IdentityApIUrl}countries`;
    // let query = '{"where":{"nationality":"colombia"}}'
    // let url = `${IdentityApIUrl}documents?filter=${query}`;


    // CREATE LOCATION
    // verificación básica
    // const body = {
    //   "data": {
    //     "location_country":"colombia", 
    //     "province":"risaralda", 
    //     "city":"pereira", 
    //     "address":"avenida siempre viva", 
    //     "country":"international"
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}locations/add-new-location`, body);

    // GET LOCATION
    // let url = `${IdentityApIUrl}users/${userId}/location`;

    // CREATE IDENTITY

    // verificación intermedia info needed ================
    // const body = {
    //   "data": {
    //     "country":"international",
    //     "document_id":"62617223fd01c5004332e4bc",
    //     "info_needed":{
    //       "name":"Andres",
    //       "surname":"Guevara Garcia",
    //       "birthday":"937303200",
    //       "id_number":"1116589656"
    //     }
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}identities/add-new-identity`, body);

    // verificación intermedia files needed ================
    // const body = {
    //   "data": {
    //     "country":"international",
    //     "identity_id":"62634b1bb249f90043fbd3a3",
    //     "files_needed":{
    //        "selfie":fileTest,
    //        "id_front":fileTest
    //     }
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}identities/add-files-to-identity`, body);

    // GET IDENTITY
    // let url = `${IdentityApIUrl}users/${userId}/identities`;

    // const res = await this.Get(url);
    // console.log('|||||||||||||||||||||||||||  testEndpoint  ==> ', res)
    // debugger
  }



  // async getStatus(status) {
  //   // if(status){return status} 
  //   try {
  //     const user = this.user;
  //     const statusUrl = `${INDENTITY_USERS_URL}/${user.id}/status`;
  //     const status = await this.Get(statusUrl);
  //     return status
  //   } catch (e) {
  //     return e
  //   }
  // }

  async updateUserStatus(status) {
    const _user = await this.fetchCompleteUserData()
    if(!_user) return;
    this.setIsAppLoading(true);
    await this.updateUser(_user)
    if(
      _user.levels.identity === 'rejected' &&
      _user.levels.personal === 'rejected'
    ){
      this.dispatch(CleanForm("kyc_basic"))
      this.dispatch(CleanForm("kyc_advanced"))
      this.dispatch(ToStep("globalStep", 0))
    }
    setTimeout(() => this.setIsAppLoading(false), 100)
    // this.setIsAppLoading(false)
  } 


  async addNewBiometricData(config) {

    const { file, biometric_id, challenge_name } = config
    const user = this.user    

    const body = {
      "data": {
        "country": user.country, 
        biometric_id,
        "pose":challenge_name,
        challenge_name,
        file
      }
    }
    // console.log('|||||||||||||||||||||  addNewBiometricData  =>  ', body)
    // console.log('|||||||||||||||||||||  INDENTITY_ADD_BIOMETRIC_DATA_URL  =>  ', INDENTITY_ADD_BIOMETRIC_DATA_URL)
    const res = await this.Post(INDENTITY_ADD_BIOMETRIC_DATA_URL, body);
    return res
  }


  async getUserBiometric() {
    const { userId } = this.authData;
    const url = `${INDENTITY_USERS_URL}/${userId}/biometric?country='international'`;
    const res = await this.Get(url);
    console.log('||||||||||||||  getUserBiometric ==> ', res)
    return res
  }

  async fetchCompleteUserData() {

    await this.dispatch(appLoadLabelAction(loadLabels.CARGANDO_TU_INFORMACION));
    // const finalUrlFirst = `${INDETITY_URL}?country=${userCountry || user.country}`;
    // const firstResponse = await this.Get(finalUrlFirst);
    let profile = await this.fetchUserProfile();
    const userLocation = await this.Get(`${IdentityApIUrl}users/${this.authData.userId}/location`)
    const userIdentities = await this.Get(`${IdentityApIUrl}users/${this.authData.userId}/identities`)
    const kycIdentity = userIdentities?.length && userIdentities[0]
    // const finalUrlSecond = `${INDENTITY_USERS_URL}/${this.authData.userId}/status`;
    // const secondResponse = await this.Get(finalUrlSecond);
    // if(await this.isCached('fetchCompleteUserData_', secondResponse)) {
    //     return true
    // }
    // let country_object = await addIndexToRootObject(secondResponse.countries);
    // let country = await objectToArray(country_object);
    const userLevels = profile?.countries?.international

  
    let updatedUser = {
      ...userDefaultModel,
      identities:userIdentities,
      location:userLocation,
      email: this.authData.userEmail,
      restore_id: profile?.restore_id,
      id: this.authData.userId,
      verification_level: userLevels[userLevels?.length - 1],
      verification_error: kycIdentity?.errors[0],
      id_number:kycIdentity?.document_info?.id_number,
      name:kycIdentity?.document_info?.name,
      surname:kycIdentity?.document_info?.surname,
      levels: {
        personal:kycIdentity?.info_state,
        identity:kycIdentity?.file_state
      },
      country:userLocation?.country
    };

    updatedUser.security_center.kyc.basic = updatedUser?.levels?.personal
    updatedUser.security_center.kyc.advanced = updatedUser?.levels?.identity

    const transactionSecurity = await this.userHasTransactionSecurity(updatedUser.id);
    
    if (transactionSecurity["2fa"] || transactionSecurity.biometric) {
      updatedUser.security_center.transactionSecurity = transactionSecurity
      updatedUser.security_center.authenticator.auth = transactionSecurity["2fa"]?.enabled
      updatedUser.security_center.authenticator.withdraw = transactionSecurity["2fa"]?.enabled;
    }else{
      updatedUser.security_center.transactionSecurity = {
        "2fa":{},
        "biometric":{}
      }
    }

    // const identityConfirmed = updatedUser.levels && updatedUser.levels.identity === 'confirmed' && updatedUser.levels.personal === 'confirmed'
    const identityAccepted = updatedUser.levels.identity === 'accepted' && updatedUser.levels.personal === 'accepted'
    const identityRejected = updatedUser.levels.identity === 'rejected' && updatedUser.levels.personal === 'rejected'
    
    // if((updatedUser?.verification_level !== 'level_0') || identityConfirmed){
    //   // let kyc_personal = country[0].levels && country[0].levels.personal;
    //   // let kyc_identity = country[0].levels && country[0].levels.identity;
    //   // let kyc_financial = country[0].levels && country[0].levels.financial;
    //   // if (kyc_personal) {
    //   //   updatedUser.security_center.kyc.basic = kyc_personal;
    //   // }
    //   // if (kyc_identity) {
    //   //   updatedUser.security_center.kyc.advanced = kyc_identity;
    //   // }
    //   // if (kyc_financial) {
    //   //   updatedUser.security_center.kyc.financial = kyc_financial;
    //   // }
    // }else 
    if(updatedUser?.verification_level === 'level_0' && identityAccepted){
      updatedUser.security_center.kyc.basic = 'confirmed';
      updatedUser.security_center.kyc.advanced = 'confirmed';
    }else if(identityRejected){
      updatedUser.security_center.kyc.basic = 'rejected';
      updatedUser.security_center.kyc.advanced = 'rejected';
    }

    console.log('userLocation', userLocation)
    console.log('userIdentity', kycIdentity)
    console.log('tx profile', profile)
    console.log('updatedUser', updatedUser)
    // debugger

    // const finalUrlThird = `${INDENTITY_USERS_URL}/${this.authData.userId}/profiles`;
    // let thirdResponse = await this.Get(finalUrlThird);

    // if (thirdResponse && thirdResponse.length > 0) {
    //   // Agregamos la información al modelo usuario (updatedUser)
    //   updatedUser = {
    //     ...updatedUser,
    //     ...thirdResponse[0].personal,
    //     operation_country:thirdResponse[0].personal && thirdResponse[0].personal.country,
    //     country: userCountry,
    //     person_type: thirdResponse[0].person_type
    //   };
    // }

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


  updateLevelProfile(config) {
    
    const user = this.user

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
