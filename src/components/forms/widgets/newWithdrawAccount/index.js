import { useState, useEffect } from 'react'
import useStage from '../../hooks/useStage'
import { StageContainer, ButtonContainers } from './styles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
import { createInfoNeededStages } from './api'
import InfoAccountComponent from './infoAccount'
// import SelectListComponent from '../selectListComponent'


import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { OptionInputContainer } from './styles'



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
    withdrawProviderBank:WithdrawProviderBank,
    infoAccount:InfoAccountComponent,
    identity:IdentityComponent
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
          <ButtonContainers>
            <ControlButton
              loader={loading}
              // id={idForMainButton}
              formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
              label="Siguiente"
              handleAction={nextStep}
            />
          </ButtonContainers>
        </StatusPanelComponent>
    </>                 
  )
}


export default NewWAccountComponent


function IdentityComponent({ 
  stageManager:{ 
    stageData,
    setStageData,
    setStageStatus,
    stageStatus
  },
  handleState:{ state, setState },
  handleDataForm:{ dataForm },
  children 
}) {

  // console.log('IdentityComponent, ', stageData)

  return(
    <StageContainer className="_identityComponent">
      {children}
      <OptionInputContainer>
        <p className="fuente _pLabel _inputLabelP">¿Cual es el documento vinculado a tu cuenta de retiro?</p>
        <SelectListContainer>
              {
                stageData?.selectList && Object.keys(stageData?.selectList).map((key, index) => {
                  const isSelected = [stageData?.selectList[key]?.value].includes(state?.infoAccount?.accountType)
                  return <ItemListComponent 
                    key={index}
                    itemList={stageData?.selectList[key]}
                    firstIndex={index === 0}
                    lastIndex={(Object.keys(stageData?.selectList)?.length - 1) === index}
                    isSelectedItem={isSelected}
                    // isMovilViewport={isMovilViewport}
                    handleAction={() => null}
                  />
                })
              }
          </SelectListContainer>
      </OptionInputContainer>
    </StageContainer>
  )
}



const ProofComponent = ({ children, nextStage }) => {
  return(
    <StageContainer>
      {children}
    </StageContainer>
  )
}





