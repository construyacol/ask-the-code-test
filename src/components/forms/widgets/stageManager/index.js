
import {
    BackButtom,
    StageIndicator
} from './styles'
import { MdArrowBackIosNew } from 'react-icons/md';
import { 
  StageContainer 
} from '../sharedStyles'
import { InputWrapper } from '../kyc/InputComponent'
import { InputContainer } from '../kyc/styles'

const StageManagerComponent = ({ stageManager, callback, closeStage = false, ...props }) => {

    const {
      currentStage,
      stageController,
      prevStage
    } = stageManager
  
    return(
      <StageIndicator className={`fuente2 _stageIndicator`} >
        {
          (currentStage <= stageController?.length && (currentStage > 0 || closeStage) ) &&
            <BackButtom onClick={currentStage < 1 ? callback : () => prevStage()}>
              <MdArrowBackIosNew size={15} color="var(--paragraph_color)"/>
            </BackButtom>
        }
        <p>
          {currentStage+1}/{stageController?.length}
        </p>
          <h3 className="fuente _stageManagerTitle" >{props?.mainTitle || ''}</h3>
      </StageIndicator>
    )
  }
  
  export default StageManagerComponent


  export const StageSkeleton = props => {
    return(
      <StageContainer className="_bankNameList skeleton">
        <StageIndicator/>
        <InputWrapper className={`skeleton`}>
            <p className={`fuente _inputLabelP`}>is awesome tittle input</p>
          <InputContainer className="inputContainer__ skeleton">
              <input />
          </InputContainer>
        </InputWrapper>
      </StageContainer>
    )
  }






  