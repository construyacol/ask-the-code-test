
import {
    BackButtom,
    StageIndicator
} from './styles'
import { MdArrowBackIosNew } from 'react-icons/md';


const StageManagerComponent = ({ stageManager }) => {

    const {
      currentStage,
      stageController,
      prevStage
    } = stageManager
  
    return(
      <StageIndicator className={`fuente2`}>
        {
          (currentStage > 0 && currentStage <= stageController?.length) &&
            <BackButtom onClick={() => prevStage()}>
              <MdArrowBackIosNew size={15} color="var(--paragraph_color)"/>
            </BackButtom>
        }
        <p>
          {currentStage+1}/{stageController?.length}
        </p>
      </StageIndicator>
    )
  }
  
  export default StageManagerComponent
  