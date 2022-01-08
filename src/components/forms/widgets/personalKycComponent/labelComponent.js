import React from 'react'
import { 
  LabelContainer,
  TitleLabelContainer,
  Titles
} from './styles'


const LabelComponent = ({ children, currentStage, stages, stageController }) => (
  
    <LabelContainer className="fuente">
      {children}
      <TitleLabelContainer>
        <Titles height={stageController.length} position={currentStage}>
            {
              stageController.map((stageId, keyId) => {
                return <p key={keyId} >{stages[stageId]?.settings?.label || stages[stageId].uiName}</p>
              })
            }
        </Titles>
      </TitleLabelContainer>
    </LabelContainer>
)

export default React.memo(LabelComponent)
