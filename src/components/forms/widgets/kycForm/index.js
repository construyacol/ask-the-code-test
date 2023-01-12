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
import InfoStateComponent from 'components/forms/widgets/infoPanel/mobile'
import { H2 } from 'components/widgets/typography'
import kycHoc from 'components/hoc/kycHoc'
import Button from 'components/widgets/buttons/button'
  
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
    },
    ...props
  }) => {

    const idNextStageKyc = useKeyActionAsClick(
      true,
      "next-stage-kyc",
      13,
      false,
      "onkeypress",
      true
    );
    
    const { viewportSizes:{ isMobile } } = props
    const stageErrorState = (dataForm?.handleError?.errors[stageData?.key] && !state[stageData?.key]) && 'rejected'
    const errorMessage = dataForm?.handleError?.errors[stageData?.key]
    const inputMessage = (typeof errorMessage === 'string' && errorMessage) || stageData?.settings?.defaultMessage
      

    return(
     
      <Layout 
        style={{background:"white"}}  
        // className="scroll"
      > 
        <Layout className='infoPanel' style={{background:"transparent", left:"auto"}}>

          <DynamicLoadComponent
              component="infoPanel"
              title="Completa tu identidad"
              state={state}
              stageData={stageData}
              dataForm={dataForm}
              stageStatus={stageStatus}
              stageController={stageController}
              {...props}
              // setInfoStages={setInfoStages}
            />
    
            {
              finalStage ? 
              <MainKycSkeleton
                closeModal={closeModal}
              />
              :
              <MainContainer className='mainContainer_'>
                <TitleContainer id="titleContainer__">
                  <H2 className="fuente kycTitle" color='title_color'>
                      { (isNewId && 'Agregando nueva identidad') || (title || 'Verificación de cuenta') }
                  </H2>
                </TitleContainer>
                
                  {
                    isMobile &&
                      <InfoStateComponent 
                        id="infoStatemobile__"
                        currentStage={currentStage}
                        stageController={stageController}
                        dataForm={dataForm}
                        {...props}
                      />
                  }

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
                      progressBar={{start:currentStage+1, end:stageController?.length, showSteps:true}}
                      AuxComponent={[
                        stageData?.settings?.auxComponent, 
                        isMobile ? () => null : () => <NextButtom id={idNextStageKyc} onClick={nextStep} disabled={(currentStage >= stageController?.length) || stageStatus !== 'success'} />
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

                {
                  isMobile &&
                  <Button 
                    color="primary"
                    variant="contained"
                    disabled={(currentStage >= stageController?.length) || stageStatus !== 'success'}
                    onClick={nextStep}
                  >
                    Siguiente
                  </Button>
                }
              </MainContainer>
            }
        </Layout>
      </Layout>
    )
  } 

  export default kycHoc(KycFormComponent)