import { useEffect } from 'react'
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
import { useActions } from '../../../../hooks/useActions'
import { ContainerLayout, Content } from '../../../widgets/modal/render/addressBook'
import { Header, WindowControl } from '../../../widgets/modal/render/addressBook/header'
import { IconClose, IconBackContainer } from "../../../widgets/shared-styles";
import useStage from '../../hooks/useStage'
import { getCdnPath } from '../../../../environment'
import { MdKeyboardArrowLeft } from "react-icons/md";
import loadable from '@loadable/component'



const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const FiatDepositComponent = ({ handleState, handleDataForm:{ dataForm }, ...props }) => {


  const actions = useActions()
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
          <DynamicLoadComponent
              component={`fiatDeposit/${stageData?.key}.js`}
              nextStage={nextStage}
              handleState={handleState}
              stageData={stageData}
          />
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
      <p className="fuente titleHead">Deposito COP</p>
    </section>
  </Header>
  )

}