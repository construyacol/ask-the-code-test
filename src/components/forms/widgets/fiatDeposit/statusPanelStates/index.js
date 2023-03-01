
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import ResumeComponent from './resume'
import StatusPanelComponent from 'components/forms/widgets/statusPanel'
// import { InternalOnBoarding } from '../../onBoarding/internals'
import { CryptoOnBoarding } from '../../onBoarding/crypto'
import { PseOnBoarding } from '../../onBoarding/pse'

import { FIAT_DEPOSIT_TYPES } from '../api'


const StatusPanelStates = (props) => {

  const { stageManager:{stageData }, handleState:{ state }} = props
  const getDepositComponent = () => {
    const DefaultComponent = !state[stageData?.key] && CryptoOnBoarding
    const _value = state[stageData?.key] && state[stageData?.key]?.value?.replace(" ", "_")
    const toRender = {
        [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:{
          [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:CryptoOnBoarding,
          pse:PseOnBoarding,
        }
    }
    const RenderComponent = (toRender[stageData?.key] && _value) && toRender[stageData?.key][_value]
    return RenderComponent || DefaultComponent || ResumeComponent
  }

  const STAGE_COMPONENTS = {
    [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:getDepositComponent(),
    [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:ResumeComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PERSON_TYPE]:ResumeComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:ResumeComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]:ResumeComponent,
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













