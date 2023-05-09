
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import loadable from "@loadable/component";
import { FIAT_DEPOSIT_TYPES } from '../api'
import StatusPanelComponent from 'components/forms/widgets/statusPanel'
import { getExportByName } from 'utils'

// import InternalDepositResume from '../internals/internalResume'
// import ResumeComponent from './resume'
// import { CryptoOnBoarding } from '../../onBoarding/crypto'
// import { PseOnBoarding } from '../../onBoarding/pse'
// import { CopInternalOnBoarding } from 'components/forms/widgets/onBoarding/internals'


const InternalDepositResume = loadable(() => import("../internals/internalResume"), {fallback:<p>Ca</p>});
const ResumeComponent = loadable(() => import("./resume"), {fallback:<p>Ca</p>});
const CryptoOnBoarding = loadable(() => import("../../onBoarding/crypto").then(getExportByName("CryptoOnBoarding")), {fallback:<div></div>});
const PseOnBoarding = loadable(() => import("../../onBoarding/pse").then(getExportByName("PseOnBoarding")), {fallback:<div></div>});
const CopInternalOnBoarding = loadable(() => import("components/forms/widgets/onBoarding/internals").then(getExportByName("CopInternalOnBoarding")), {fallback:<div></div>});



const StatusPanelStates = (props) => {

  const { stageManager:{stageData }, handleState:{ state }} = props
  const getDepositComponent = () => {
    const DefaultComponent = !state[stageData?.key] && ResumeComponent
    const _value = state[stageData?.key] && state[stageData?.key]?.value?.replace(" ", "_")
    const toRender = {
      [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:{
        [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:CryptoOnBoarding,
        [FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL]:CopInternalOnBoarding,
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
    [FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL_AMOUNT]:InternalDepositResume,
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













