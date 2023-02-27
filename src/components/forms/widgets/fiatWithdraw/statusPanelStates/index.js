
// import loadable from "@loadable/component";
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import ResumeComponent from './resume'
// import { isEmpty } from 'lodash'
import { 
  FIAT_WITHDRAW_TYPES, 
  // ApiGetFiatWithdrawStages, 
  // createNextStages 
} from '../api'

import StatusPanelComponent from 'components/forms/widgets/statusPanel'
import { InternalOnBoarding } from './onBoardings'
// import { useEffect } from 'react'



const StatusPanelStates = (props) => {
  
  const { stageManager:{stageData }, handleState:{ state }} = props

  const getWithdrawAccountComponent = () => {
  // const DefaultComponent = !state[stageData?.key] && (() => <></>)
  const DefaultComponent = !state[stageData?.key] && InternalOnBoarding
  const _value = state[stageData?.key] && state[stageData?.key]?.value?.replace(" ", "_")?.toLowerCase()
  const toRender = {
      [FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]:{
        [FIAT_WITHDRAW_TYPES?.TYPES?.INTERNAL]:InternalOnBoarding
      }
    }
    const RenderComponent = (toRender[stageData?.key] && _value) && toRender[stageData?.key][_value]
    return RenderComponent || DefaultComponent || ResumeComponent
}
  
  const STAGE_COMPONENTS = {
    [FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]:getWithdrawAccountComponent(),
    [FIAT_WITHDRAW_TYPES?.STAGES?.AMOUNT]:ResumeComponent,
    [FIAT_WITHDRAW_TYPES?.STAGES?.TARGET_PERSON]:InternalOnBoarding,
  }

    return(
      <StatusPanelComponent>
        <RenderSwitchComponent 
          STAGE_COMPONENTS={STAGE_COMPONENTS}
          component={stageData?.key}
          {...props}
        >
          {props.children}
        </RenderSwitchComponent>
      </StatusPanelComponent>
    )
}

export default StatusPanelStates













