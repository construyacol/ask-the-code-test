import { INFO_DOCUMENT_NEEDED, IDENTITY_STAGES } from './api'
import { createStage } from '../../../utils'
import { mainService } from "../../../../../services/MainService";



export const identityStates = () => {
  const user = mainService.user
  return {
    needDoInfoStage:!user?.identity || (user?.identity && ["pending", "rejected"].includes(user?.identity?.info_state))
  }
}

export const createInfoStages = async({
    stageData,
    dataForm,
    setDataForm,
    state
}) => {
    const stageKey = stageData?.key
    if(!dataForm?.stages[stageKey]?.selectList)return ;
    const documentData = dataForm?.stages[stageKey]?.selectList[state[stageKey]]
    if(!documentData || !documentData?.info_needed?.length)return ;

      let apiStages = {}
      documentData?.info_needed?.forEach( documentKey => {
        if(INFO_DOCUMENT_NEEDED[documentKey]){
          apiStages = {
            ...apiStages,
            [documentKey]:INFO_DOCUMENT_NEEDED[documentKey]
          }
        }
      });

      let stages = {} 

      for (const stage of Object.keys(apiStages)) { 
        stages = {
          ...stages,
          [stage]:await createStage(apiStages[stage], IDENTITY_STAGES?.identity[stage], stage)
        }
      } 


      setDataForm(prevState => {
        return { 
          ...prevState,
          stages:{
            ...prevState.stages,
            ...stages
          } 
        }
      })

  }