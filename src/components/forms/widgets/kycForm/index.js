import InputComponent from 'components/forms/widgets/kyc/InputComponent'
import { BackButtom, NextButtom } from 'components/forms/widgets/kyc/identityComponent/buttons'
import LabelComponent from 'components/forms/widgets/kyc/identityComponent/labelComponent'
import { MainKycSkeleton, InputSkeleton } from 'components/forms/widgets/kyc/identityComponent/skeleton'
import useKeyActionAsClick from 'hooks/useKeyActionAsClick';
import loadable from '@loadable/component'
import { Wrapper as Layout } from 'components/forms/widgets/layout/styles'
import {
  MainContainer,
  StickyGroup,
  TitleContainer,
} from 'components/forms/widgets/kyc/styles'
  
const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const KycFormComponent = ({ 
    state, 
    dataForm, 
    closeModal,
    isNewId,
    prevStep,
    loading,
    onChange,
    nextStep,
    title,
    stageManager:{
      currentStage,
      stageController,
      finalStage,
      stageData,
      setStageData,
      stageStatus
    }
  }) => {
    const idNextStageKyc = useKeyActionAsClick(
      true,
      "next-stage-kyc",
      13,
      false,
      "onkeypress",
      true
    );

    const stageErrorState = (dataForm?.handleError?.errors[stageData?.key] && !state[stageData?.key]) && 'rejected'
    const errorMessage = dataForm?.handleError?.errors[stageData?.key]
    const inputMessage = (typeof errorMessage === 'string' && errorMessage) || stageData?.settings?.defaultMessage

    return(
      <Layout className='infoPanel' style={{background:"white"}}>
        <DynamicLoadComponent
            component="infoPanel"
            title="Completa tu identidad"
            state={state}
            stageData={stageData}
            dataForm={dataForm}
            stageStatus={stageStatus}
          />
  
          {
            finalStage ? 
            <MainKycSkeleton
              closeModal={closeModal}
            />
            :
            <MainContainer>
              <TitleContainer id="titleContainer__">
                <h2 className="titleContainer__h1 fuente">
                    { (isNewId && 'Crea un documento de identidad') || (title || 'Crea una identidad') }
                </h2>
              </TitleContainer>
              <StickyGroup background="white" id="stickyGroup__" >
                <LabelComponent 
                  stageController={stageController}
                  stages={dataForm?.stages}
                  currentStage={currentStage}
                  > 
                  <BackButtom onClick={prevStep} disabled={currentStage <= 0}/>
                </LabelComponent>
                {
                  loading ?
                  <InputSkeleton/>
                  :
                  <InputComponent
                    className={`${stageErrorState}`}
                    onChange={onChange} 
                    inputStatus={stageStatus}
                    defaultValue={state[stageData?.key]}
                    name={stageData?.key} 
                    message={inputMessage}
                    placeholder={stageData?.settings?.placeholder}
                    type={stageData?.uiType}
                    setStageData={setStageData}
                    dataForm={dataForm}
                    state={state}
                    progressBar={{start:currentStage+1, end:stageController.length, showSteps:true}}
                    AuxComponent={[
                      stageData?.settings?.auxComponent, 
                      () => <NextButtom id={idNextStageKyc} onClick={nextStep} disabled={(currentStage >= stageController.length) || stageStatus !== 'success'} />
                    ]}
                  />
                }
              </StickyGroup>
              <DynamicLoadComponent
                component="kyc/selectList"
                list={stageData?.selectList}
                name={stageData?.key}
                state={state}
                handleAction={onChange}
                // pass useCallBack to inherited functions to this component
              />
  
            </MainContainer>
          }
      </Layout>
    )
  }

  export default KycFormComponent