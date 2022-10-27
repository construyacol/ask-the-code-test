import { BsCheck2Circle } from 'react-icons/bs'
import { IoFileTray } from 'react-icons/io5'
import { P } from 'components/widgets/typography'
import { UI_NAMES } from '../../../../../const/uiNames'
import {
    StageListItemContainer,
    IconContainer,
    ControlContainer,
    CurrentStageIndicator,
    StageList
} from './styles'


const StageListComponent = ({ stages, stageData, state, idType, handleStage, stageController, loading }) => {

    return(
      <StageList className="item_">
        {
          Object.keys(stages).map((stageKey, index) => {
  
            const isFirstStage = index === 0
            const isCurrentEl = stageData?.key === stageKey
            const stageState = state[stageKey] ? 'complete' : 'incomplete'
            const uiName = stageKey === 'selfie' ? `${stages[stageKey]?.uiName} sosteniendo ${UI_NAMES?.documents[idType]}` : stages[stageKey]?.uiName
  
            const stageIndex = stageController.indexOf(stageKey)
            const prevStageKey = stageController[(stageIndex-1)]
            const prevState = state[prevStageKey]
            const isAvailable = (prevState?.img || isFirstStage) ? 'available' : ''
            const isCurrentElColor = (stageData?.key === stageKey || stageState === 'complete' || isAvailable === 'available')  ? "var(--primary)" : "var(--paragraph_color)"         
  
            return(
              <StageListItemContainer key={index} className={`${isCurrentEl ? 'current' : ''} ${stageState} ${isAvailable} ${loading ? 'loading' : ''}`} onClick={() => handleStage(stageKey)}>
                <IconContainer className={`${stageState} ${isAvailable}`}>
  
                {
                  state[stageKey]?.img ?
                  <BsCheck2Circle
                    size={18} 
                    color="green"
                  />
                  :
                  <IoFileTray
                    size={18} 
                    color={isCurrentElColor}
                  />
                }
  
                </IconContainer>
                
                <P className={`_title ${stageState}`} size={15} >{uiName}</P>
  
                {state[stageKey] && <P className="number _size">{state[stageKey]?.size} KB</P>}
  
                <ControlContainer className="item__">
                  { isCurrentEl && <CurrentStageIndicator/>}
                </ControlContainer>
              </StageListItemContainer>
            )
          })
        }
      </StageList>
    )
  }

  export default StageListComponent

