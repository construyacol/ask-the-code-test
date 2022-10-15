import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
  loadLabels,
  // INDETITY_URL,
  INDENTITY_USERS_URL,
  INDETITY_COUNTRY_VALIDATORS_URL,
  INDETITY_UPDATE_PROFILE_URL,
  INDENTITY_ADD_BIOMETRIC_DATA_URL,
  // fileTest,
  // selfietest
} from "../const/const";
import { LEVELS_DATA } from '../const/levels'
import { objectToArray, addIndexToRootObject } from "../utils";
import normalizeUser from "../schemas";
import { verificationStateAction } from "../actions/uiActions";
import Environment from "../environment";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import { UI_NAMES } from '../const/uiNames'
import { 
  // getAvailableIdentityState, 
  getIdentityState 
} from '../utils'
import userDefaultModel from "api/userDefault";
import { keyBy } from 'lodash'



const {
  IdentityApIUrl
} = Environment

export class IndetityService extends WebService {

  async getNextLevel() {
    const body = {
      "data": {
        "country":"international", 
      }
    }

    const { data, error } = await this._Post(`${IdentityApIUrl}levels/get-next-level`, body);

    if(error) return error;
      const { requirements, name } = data
      let _requirements = []
      for (let i = 0; i < requirements?.length; i++) {
        if(requirements[i] !== 'regulation'){
          _requirements.push(requirements[i])
        }
      }
      return {
        name,
        requirements:_requirements
      }
  }
 


  getLevelRequirement(level = "level_1") {
    
    let levelData = {}
    if(!level)throw new Error('No se pudo obtener el level requirement');

    if(["string"].includes(typeof level) && LEVELS_DATA[level]){
      // se provee la información por default ya que la solicitada(currentLevelView) no corresponde a la información provista por getNextLevel o el endpoint retorno algun error
      levelData = {
        ...LEVELS_DATA[level]
      }
    }else{
      if(!LEVELS_DATA[level.name])return;
      levelData = {
        ...LEVELS_DATA[level.name],
        ...level
      }
    }

    const user = this.user

    let pendingRequirements = []
    levelData.requirements.forEach(requirement => {
        // getCondition by levelname => pending to refactor
        if(!user[requirement] ||  (requirement === 'identity' && ["pending", "rejected"].includes(this.getVerificationState()))){
          // pending to refactor conditional laws 
          pendingRequirements.push(requirement)
        }
    });

    return {
      ...levelData, 
      pendingRequirements
    }

  }


  async createRequirementLevel(levelName, getNextLevel = true) {

    if(getNextLevel === false)return this.getLevelRequirement(levelName);
    let nextLevelData = await this.getNextLevel()
    const { error } = nextLevelData
    let levelRequirement = (error || ![nextLevelData.name].includes(levelName)) ? levelName : nextLevelData 

    return this.getLevelRequirement(levelRequirement)
  }


  // let requirements = []
  // let levels = {} 
  // res.requirements.forEach(requirement => {
  //     if(!user[requirement] ||  (requirement === 'identity' && ["pending", "rejected"].includes(this.getVerificationState()))){
  //       requirements.push(requirement)
  //     }
  //     if(res?.name === 'level_1'){
  //         levels = {
  //             ...levels, 
  //             [requirement]:LEVELS_INFO[res?.name][requirement]
  //         }
  //     }else{
  //       levels = LEVELS_INFO?.level_1
  //     }
  // });
  // return {
  //   name:res.name,
  //   levels,
  //   requirements
  // }






















  
 
  // async getIdentityList() {

  //   const { identities } = this.globalState?.modelData?.user;
  //   let _identities = {}
  //   Object.keys(identities).forEach(identity => {
  //   _identities = {
  //       ..._identities,
  //       [identities[identity]?.id]:{
  //         ...identities[identity],
  //         ui_name:`${UI_NAMES?.documents[identities[identity]?.id_type]}`,
  //         icon:"identity"
  //       }
  //     }
  //   })
  //   // _identities = {
  //   //   createId,
  //   //   ..._identities
  //   // }
  //   return _identities
  // }
 
  async createContact({ phone }) {
    const body = {
      "data": {
        phone, 
        "country":this.user.country
      }
    }
    return await this.Post(`${IdentityApIUrl}contacts/add-new-contact`, body);
  }

    async getCountryList() {
      let url = `${IdentityApIUrl}countries`;
      return await this.Get(url);
    }

    async getProvinceList(props) {
      const payload = props?.payload
      let query = `?filter={"where":{"country":"${payload}"}}`
      let url = `${IdentityApIUrl}provinces${query}`;
      return await this.Get(url);
    }

    async getCityList(props) {
      const payload = props?.payload
      let query = `{"where":{"province":"${payload}"}}`
      let url = `${IdentityApIUrl}citys?filter=${query}`;
      return await this.Get(url);
    }

    async createAvailableIdentityList(props) {

      const payload = props?.payload
      let currentIdentity = props?.config?.currentIdentity
      
      let documentList = await this.getDocumentList(payload)

      if(documentList && this.user?.identities?.length){
        let userIdentities =  {}
        this.user?.identities.forEach(identity => {
          userIdentities = {
            ...userIdentities,
            [identity?.id_type]:identity
          }
        })

        if(currentIdentity && ["rejected"].includes(getIdentityState(currentIdentity))){
          let documentListByKey = keyBy(documentList, "id_type")
          return [{...documentListByKey[currentIdentity?.id_type], state:"rejected"}] 
        }else{
          return documentList
        }
          // let _documentList = []
          //   let isThereOneRejectedIdentity = false
          //   documentList.forEach(_document => {
          //     let currentIdentity = userIdentities[_document?.id_type] 
          //     let currentIdentityState = currentIdentity && getIdentityState(currentIdentity)
          //     if(["rejected"].includes(currentIdentityState)){ 
          //       isThereOneRejectedIdentity = true
          //       return _documentList = [{..._document, state:"rejected"}] 
          //     }else if(!isThereOneRejectedIdentity){
          //       _documentList.push(_document)
          //     }
          //     // if(!isThereOneRejectedIdentity && (!currentIdentity || (currentIdentity && currentIdentity?.nationality !== nationality))){
          //     //   // Si no hay identidades rejectadas y si el usuario no tiene esta identidad creada Ó si la tiene pero de diferente nacionalidad agregue la opción para crear el documento
          //     //   _documentList.push(_document)
          //     // }
          //   })
          //   return _documentList
          // }else{
          //   return documentList
          // }
      }else{
        return documentList
      }
    }

    async getDocumentList(nationality) {
      if(!nationality)return ;
      let query = `?filter={"where":{"nationality":"${nationality}"}}`
      let url = `${IdentityApIUrl}documents${query}`;
      const res = await this.Get(url);
      const finalResponse = []
      if(res?.length){
        res.forEach(idItem => {
          finalResponse.push({
            ...idItem,
            code:idItem.id_type,
            name:UI_NAMES?.documents[idItem?.id_type]
          })
        })
      }
      return finalResponse
    }

    // TODO: Create util method from create querys
    // ==> getOneDocument(filter) {
    // if(typeof filter !== 'object')return;
    // let key = Object.keys(filter)[0]
    // let query = `?filter={"where":{"${key}":"${filter[key]}"}}`

    async getOneDocument({ id_type, nationality }) {
      let query = `?filter={"where":{"id_type":"${id_type}", "nationality":"${nationality}"}}`
      let url = `${IdentityApIUrl}documents/findOne${query}`;
      return await this.Get(url);
    }

    
    async createLocation(_body) {
      let body = {
        data:{
          ..._body?.data,
          country:this.user.country
        }
      }
      return await this.Post(`${IdentityApIUrl}locations/add-new-location`, body);
    }


    async createIdentity(payload) {
      const {
        document_id,
        info_needed
      } = payload
      const body = {
        data: {
          country:this.user.country,
          document_id,
          info_needed
        }
      }
      return await this._Post(`${IdentityApIUrl}identities/add-new-identity`, body);
    }

    async updateInfoIdentity(payload) {

      const {
        identity_id,
        info_needed
      } = payload

      const body = {
        data: {
          country:this.user.country,
          identity_id,
          info_needed
        }
      }
      return await this._Post(`${IdentityApIUrl}identities/add-info-to-identity`, body);
    }


    async addFilesToIdentity(payload) {
      
      const user = this.user
      const {
        identity_id,
        files_needed
      } = payload

      const body = {
        data: {
          country:user?.country,
          identity_id,
          files_needed
        }
      }
      return await this.Post(`${IdentityApIUrl}identities/add-files-to-identity`, body);
    }



    



  async proofEndpoints() {

    // const { userId } = this.authData;

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
    // this.getNextLevel()
    // let url = `${IdentityApIUrl}users/${userId}/userLevel?country="international"`;

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



    // CREATE CONTACT
    // Contacto / telefóno
    // const body = {
    //   "data": {
    //     "phone":"57 315-708-1125", 
    //     "country":"international"
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}contacts/add-new-contact`, body);

    // // GET CONTACT
    // let url = `${IdentityApIUrl}users/${userId}/contact?country=international`;



    // CREATE LOCATION
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
    // let url = `${IdentityApIUrl}users/${userId}/location?country=international`;




    // CREATE INFO IDENTITY

    // verificación intermedia info needed ================
    // const body = {
    //   "data": {
    //     "country":"international",
    //     "document_id":"62617223fd01c5004332e4bc",
    //     "info_needed":{
    //       "name":"Felipe",
    //       "surname":"Garcia Martinez",
    //       "birthday":"937303200",
    //       "id_number":"1116589656"
    //     }
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}identities/add-new-identity`, body);


    // UPDATE INFO IDENTITY
    
    // const body = {
    //   "data": {
    //     "country":"international",
    //     "identity_id":"62699aa771047f0041280afa",
    //     "info_needed":{
    //       "name":"Felipe",
    //       "surname":"Garcia Martinez",
    //       "birthday":"937303200",
    //       "id_number":"1116589656"
    //     }
    //   }
    // }
    // const res = await this.Post(`${IdentityApIUrl}identities/add-info-to-identity`, body);





    // ADD / UPDATE FILES TO IDENTITY
    // verificación intermedia files needed ================
    // const body = {
    //   "data": {
    //     "country":"international",
    //     "identity_id":"62705c0ec0e168004c564442",
    //     "files_needed":{
    //        "selfie":selfietest,
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
    console.log('updateUserStatus identity =======> ', status)
    const _user = await this.fetchCompleteUserData()
    console.log('_user =======> ', _user)
    // debugger
    if(!_user) return;
    this.setIsAppLoading(true);
    await this.updateUser(_user)
    setTimeout(() => this.setIsAppLoading(false), 100)
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
    const res = await this.Post(INDENTITY_ADD_BIOMETRIC_DATA_URL, body);
    return res
  }

  async getUserBiometric() {
    const { userId } = this.authData;
    const url = `${INDENTITY_USERS_URL}/${userId}/biometric?country='international'`;
    const res = await this.Get(url);
    // console.log('||||||||||||||  getUserBiometric ==> ', res)
    return res
  }


  async loadFirstEschema() {
    const dataNormalized = await normalizeUser(userDefaultModel);
    this.dispatch(updateNormalizedDataAction(dataNormalized));
  }


  getMainIdentity(identities) {
    if(identities?.length){
      let mainIdentity = identities.find(identity => identity?.info_state === "accepted" && identity?.file_state === "accepted")
      return mainIdentity || identities[0]       
    }else return ;

  }


  async fetchCompleteUserData() {

    await this.dispatch(appLoadLabelAction(loadLabels.CARGANDO_TU_INFORMACION));
    // const finalUrlFirst = `${INDETITY_URL}?country=${userCountry || user.country}`;
    // const firstResponse = await this.Get(finalUrlFirst);
 
    // Contacto telefónico
    // Residencia
    // Identidad



    let profile = await this.fetchUserProfile();
    let contact = await this.Get(`${IdentityApIUrl}users/${this.authData.userId}/contact?country=international`)
    let location = await this.Get(`${IdentityApIUrl}users/${this.authData.userId}/location?country=international`)
    let identities = await this.Get(`${IdentityApIUrl}users/${this.authData.userId}/identities?country=international`)
    // Inicializamos identity buscando si hay por lo menos una identidad aceptada con eso la cuenta puede operar completamente, 
    // si no tiene ninguna identidad aceptada entonces elejimos la identidad "rejectada" o "pendiente", si la tiene
    // let identity = identities && identities[0]
    let identity = this.getMainIdentity(identities)
    
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
      ...this.user,
      // ...
      location,
      contact,
      identity,
      // ...
      identities,
      // ...
      email: this.authData.userEmail,
      restore_id: profile?.restore_id,
      id: this.authData.userId,
      level: typeof userLevels === 'string' ? userLevels : (userLevels?.length && userLevels[userLevels?.length - 1]),
      verification_error: identity?.errors?.length && identity?.errors[0],
      id_number:identity?.document_info?.id_number,
      name:identity?.document_info?.name,
      surname:identity?.document_info?.surname,
      levels: {
        personal:identity?.info_state,
        identity:identity?.file_state
      },
      country:"international"
    };


    // updatedUser.identity.info_state = "rejected"
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
    
    // if((updatedUser?.level !== 'level_0') || identityConfirmed){
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
    if(updatedUser?.level === 'level_0' && identityAccepted){
      updatedUser.security_center.kyc.basic = 'confirmed';
      updatedUser.security_center.kyc.advanced = 'confirmed';
    }else if(identityRejected){
      updatedUser.security_center.kyc.basic = 'rejected';
      updatedUser.security_center.kyc.advanced = 'rejected';
    }

    console.log('location', location)
    console.log('userIdentity', identity)
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


  

  getVerificationState() {
    const user = this.user;
    let state = 'pending'
    // if(!user?.identity)return state;
    // const { file_state, info_state } = user?.identity
    // if([info_state, file_state].includes("rejected")){
    //     return "rejected"
    // }else if(info_state === file_state){
    //     state = info_state
    // }
    // return state
    if(
      !user ||
      !user?.contact || 
      user?.location?.state !== "accepted" || 
      !user?.identity
    ) return state;
    
    const { file_state, info_state } = user?.identity

    if([info_state, file_state].includes("rejected")){
        return "rejected"
    }else if([info_state, file_state].includes("pending")){
      return "pending"
    }else if([info_state, file_state].includes("confirmed")){
      return "confirmed"
    }else if(info_state === file_state){
        state = info_state
    }
    this.dispatch(verificationStateAction(state));
    return state
    // const { advanced, basic } = user.security_center.kyc;
    // let status = "pending";
    // if (advanced === basic) {
    //   status = !advanced ? null : advanced;
    // }
    // await this.dispatch(verificationStateAction(status));
    // return status;
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
        level: config.level,
        info: config.info,
      },
    };
    return this.Post(INDETITY_UPDATE_PROFILE_URL, body);
  }

  // getCountryList() {
  //   return this.Get(`${Environment.CountryApIUrl}countrys`);
  // }

  // async userVerificationStatus(level) {
  //   const user = this.user;
  //   const { advanced, basic, financial } = user.security_center.kyc;

  //   switch (level) {
  //     case "level_1":
  //       return advanced === "accepted" && basic === "accepted";
  //     case "level_2":
  //       return (
  //         advanced === "accepted" &&
  //         basic === "accepted" &&
  //         financial === "accepted"
  //       );
  //     default:
  //       return false;
  //   }
  // }
}
