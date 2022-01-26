import { useState } from 'react'
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
import { useActions } from '../../../../hooks/useActions'
import { ContainerLayout, Content } from '../../../widgets/modal/render/addressBook'
import { Header, WindowControl } from '../../../widgets/modal/render/addressBook/header'
import { IconClose, IconBackContainer } from "../../../widgets/shared-styles";
import useStage from '../../hooks/useStage'
import { getCdnPath } from '../../../../environment'
import { MdKeyboardArrowLeft } from "react-icons/md";
import loadable from '@loadable/component'
import { ApiPostCreateDeposit } from './api'
import FiatDepositSuccess from './success'
import { useParams  } from "react-router-dom";
import { useSelector } from "react-redux";

const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const FiatDepositComponent = ({ handleState, handleDataForm:{ dataForm }, ...props }) => {

  const actions = useActions()
  const [ loader, setLoader ] = useState()
  const params = useParams()
  const account = useSelector((state) => state?.modelData?.wallets[params?.account_id]);
  const depositProvider = useSelector((state) => state?.modelData?.deposit_providers[account?.dep_prov[0]]);
  const [ newOrder, setNewOrder ] = useState()

  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

  const closeModal = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null);
    }
  };

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
      closeModal={closeModal} 
      actions={actions}
      params={params}
      depositProvData={depositProvider?.provider}
      new_ticket={newOrder}
    />
  }

  return(
    <OtherModalLayout
      id="close-button-with-OtherModalLayout"
      onkeydown={false}
      on_click={closeModal}
    >

    <ContainerLayout className="appear">
       <IconClose
          handleAction={() => actions.renderModal(null)}
          theme="dark"
          size={20}
        /> 
        
        <HeaderComponent 
          prevStage={prevStage}
          currentStage={currentStage}
        />

        <Content id="mainContent">
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
              Fallback={() => (<p>Cargando...</p>)}
          />
        }
        </Content>
    </ContainerLayout>

    </OtherModalLayout>
  )

}

export default FiatDepositComponent


const HeaderComponent = ({ prevStage, currentStage }) => {

  return(
    <Header backgroundImage={`${getCdnPath('assets')}map.webp`}>
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
  </Header>
  )

}