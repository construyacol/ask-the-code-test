
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import ResumeComponent from './resume'
import { 
  FIAT_WITHDRAW_TYPES, 
} from '../api'

import StatusPanelComponent from 'components/forms/widgets/statusPanel'
import { InternalOnBoarding } from '../../onBoarding/internals'
import { CryptoOnBoarding } from '../../onBoarding/crypto'



const StatusPanelStates = (props) => {
  
  const { stageManager:{stageData }, handleState:{ state }} = props

  const getWithdrawAccountComponent = () => {
  const DefaultComponent = !state[stageData?.key] && InternalOnBoarding
  const _value = state[stageData?.key] && state[stageData?.key]?.value?.replace(" ", "_")
  const toRender = {
      [FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]:{
        [FIAT_WITHDRAW_TYPES?.TYPES?.INTERNAL]:InternalOnBoarding,
        [FIAT_WITHDRAW_TYPES?.STAGES?.CRYPTO]:CryptoOnBoarding,
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













