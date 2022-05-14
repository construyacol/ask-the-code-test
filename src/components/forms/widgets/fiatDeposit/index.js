import { useState } from 'react'
import { useActions } from '../../../../hooks/useActions'
import { DepositContent, DepositHeader } from './styles'
import { WindowControl } from '../../../widgets/modal/render/addressBook/header'
import { IconClose, IconBackContainer } from "../../../widgets/shared-styles";
import useStage from '../../hooks/useStage'
import { getCdnPath } from '../../../../environment'
import { MdKeyboardArrowLeft } from "react-icons/md";
import loadable from '@loadable/component'
import { ApiPostCreateDeposit } from './api'
import FiatDepositSuccess from './success'
import { useParams  } from "react-router-dom";
import { useSelector } from "react-redux";
import { DepositSkeleton } from './amount'
import { ContainerLayout } from '../../../widgets/modal/render/addressBook'
// import IconSwitch from "../../../widgets/icons/iconSwitch";
// import { AmountLayout } from './styles'
// import { 
//   Content as ContentAmount, 
//   Title,
//   IconSkeleton
// } from './amount'
// import { InputDepositForm } from "../../../widgets/inputs";
// import ControlButton from "../../../widgets/buttons/controlButton";




const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const FiatDepositComponent = ({ handleState, handleDataForm:{ dataForm }, ...props }) => {

  const actions = useActions()
  const [ loader, setLoader ] = useState()
  const params = useParams()
  const account = useSelector((state) => state?.modelData?.wallets[params?.account_id]);
  const depositProvider = useSelector((state) => state?.modelData?.deposit_providers[account?.dep_prov[0]]);
  const [ newOrder, setNewOrder ] = useState()
  const { osDevice } = useSelector((state) => state?.ui);

  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )



  const {
    finalStage,
    nextStage,
    prevStage,
    stageData,
    currentStage
    // stageStatus,
    // setStageStatus
  } = stageManager

  const submitForm = async() => {
    const { state } = handleState
    const new_order = await ApiPostCreateDeposit({
      account_id: account?.id,
      amount: state.amount,
      comment: "",
      cost_id: state.costId,
      currency: account?.currency,
      deposit_provider_id: account?.dep_prov[0],
    }, {setLoader, nextStage})
    if(!new_order) return;
    setNewOrder(new_order)
  } 

  if(finalStage){
    return <FiatDepositSuccess 
      closeModal={props.closeModal} 
      actions={actions}
      params={params}
      depositProvData={depositProvider?.provider}
      new_ticket={newOrder}
    />
  }

  return(
        <ContainerLayout className={`appear ${osDevice}`}>
          <IconClose
            theme="dark"
            size={20}
          /> 
          <HeaderComponent 
            prevStage={prevStage}
            currentStage={currentStage}
          />
          <DepositContent id="mainContent">
            {
              stageData &&
              <DynamicLoadComponent
                  component={`fiatDeposit/${stageData?.key}.js`}
                  nextStage={nextStage}
                  handleState={handleState}
                  stageData={stageData}
                  loader={loader}
                  setLoader={setLoader}
                  submitForm={submitForm}
                  Fallback={DepositSkeleton}
              />
            }
          </DepositContent>
        </ContainerLayout>
  )
}

export default FiatDepositComponent





export const HeaderComponent = ({ prevStage, currentStage }) => {

  return(
    <DepositHeader backgroundImage={`${getCdnPath('assets')}map.webp`}>
      <section>
        <WindowControl
          // id={idForBack}
          state={`${currentStage < 1 ? "close" : "open"}`}
          onClick={() => prevStage()}
        >
          <IconBackContainer>
            <MdKeyboardArrowLeft size={27} color="white" />
          </IconBackContainer>
        </WindowControl>
        <p className="fuente titleHead">Depósito COP</p>
      </section>
    </DepositHeader>
  )

}


