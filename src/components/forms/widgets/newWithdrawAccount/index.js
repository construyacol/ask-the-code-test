import { useState } from 'react'
import useStage from '../../hooks/useStage'
import styled from 'styled-components'
import { StageContainer } from './styles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
import { createInfoNeededStages } from './api'


const WithdrawProviderBank = loadable(() => import("./withdrawProviderBank"));

const NewWAccountComponent = ({ handleState, handleDataForm, ...props }) => {

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
  stageController,
  finalStage
} = stageManager

  const nextStep = async() => {
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

  console.log('stageData', stageData)

  if(finalStage){
    return <p>finalStage</p>
  }

  const stageComponents = {
    withdrawProviderBank:WithdrawProviderBank,
    identity:ProofComponent
  }

  const RenderStageComponent = stageComponents[stageData?.key] || ProofComponent

  return(
    <>
        <RenderStageComponent
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
        >
          <StageManagerComponent stageManager={stageManager}/>
        </RenderStageComponent>

        <StatusPanelComponent>
          <p></p>
          <ButtonContainer>
            <ControlButton
              loader={loading}
              // id={idForMainButton}
              formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
              label="Siguiente"
              handleAction={nextStep}
            />
          </ButtonContainer>
        </StatusPanelComponent>
    </>                 
  )
}

const ButtonContainer = styled.div`
  position: sticky;
  bottom: 20px;  
  display: grid;
 
`

export default NewWAccountComponent



const ProofComponent = ({ children, nextStage }) => {
  return(
    <StageContainer>
      {children}
    </StageContainer>
  )
}





