import { mainService } from "../../../../../services/MainService";


const CONTACT_INFO_NEEDED = {
  "phone":{
    ui_name:"Número de celular",
    uiType:"text",
  }
}

const STAGES = {
    "phone":{
      uiName:"Numero de teléfono",
      key:"phone",
      uiType:"text",
      "settings":{
        defaultMessage:"Digíta tu número de celular",
        successPattern:/[0-9]{5,40}/g,
        // label:"Número de celular:",
        queryParams:{
          form:'personal_phone'
        },
        errors:[
          { pattern:/[^0-9]/g, message:'Solo se permiten Números...'}
        ],
        // auxComponent:"kyc/contactComponent/countryPrefix", //targetId to render component
        auxComponent:null,
        mainComponent:null
      }
    }
}  

export const CONTACT_DEFAULT_STATE = {
  contact:{ 
    // meta_phone: "colombia",
  }
}

export const ApiGetContactStages = async(config) => {
    return CONTACT_INFO_NEEDED
}

export const ApiPostContact = async(payload) => {
  const res = await mainService.createContact(payload)
  if(!res)return ;
  await mainService.fetchCompleteUserData()
  const reqData = await mainService.getLevelRequirement()
  if(reqData){
    const { pendingRequirements } = reqData
    return pendingRequirements[0]
  }
  return res
}

  
export const CONTACT_COMPONENTS = {
    wrapperComponent:{
        contact:'kyc/contactComponent'
    }
}

export const CONTACT_STAGES = {
    contact:STAGES
}


  