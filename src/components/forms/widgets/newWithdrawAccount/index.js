import { useState } from 'react'
import useStage from '../../hooks/useStage'
import { StageContainer, ButtonContainers } from './styles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
import { createInfoNeededStages } from './api'
import BankNameListComponent from './bankNameStage'
import useViewport from '../../../../hooks/useWindowSize'
// import SelectListComponent from '../selectListComponent'


const IdentityComponent = loadable(() => import("./identityStage"));
const InfoAccountComponent = loadable(() => import("./infoAccountStage"));

const NewWAccountComponent = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const stageManager = useStage(
  // create the form stages
  Object.keys(dataForm?.handleError?.errors || dataForm.stages),
  dataForm.stages
)

const {
  nextStage,
  stageData,
  currentStage,
  stageStatus,
  setStageStatus,
  finalStage,
  stageController
} = stageManager

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    if(currentStage<1){
      setLoading(true)
      await createInfoNeededStages({
        stageData,
        dataForm,
        setDataForm,
        state:handleState?.state
      })
      setLoading(false)
    }
    nextStage()
  }

  // console.log('stageData', stageData)

  if(finalStage){
    return <p>finalStage</p>
  }

  const stageComponents = {
    bankName:BankNameListComponent,
    infoAccount:InfoAccountComponent,
    identity:IdentityComponent
  }

  const RenderStageComponent = stageComponents[stageData?.key] || ProofComponent 

  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label="Siguiente"
        handleAction={nextStep}
      />
    </ButtonContainers>
  )


  return(
    <>
        <RenderStageComponent
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
        >
          <StageManagerComponent stageManager={stageManager} {...props}/>
          {
            isMovilViewport &&
              <ButtonComponent/>
          }
        </RenderStageComponent>
        
          {
            !isMovilViewport &&
              <StatusPanelComponent>
                <p></p>
                    <ButtonComponent/>
              </StatusPanelComponent>
          }
    </>                 
  )
}


export default NewWAccountComponent




const ProofComponent = ({ children, nextStage }) => {
  return(
    <StageContainer>
      {children}
    </StageContainer>
  )
}





