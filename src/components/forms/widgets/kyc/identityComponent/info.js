import React, { useState, useEffect } from 'react'
import validations from '../validations'
import useStage from '../../../hooks/useStage'
import loadable from '@loadable/component'
import InputComponent from '../InputComponent'
import { getNextSelectList } from '../utils' 
import { BackButtom, NextButtom } from './buttons'
import LabelComponent from './labelComponent'
import KycSkeleton from './skeleton'
import { ApiPostIdentityInfo, createInfoStages } from './api'
// import useToast from '../../../../hooks/useToastMessage'
// import SuccessComponent from './success'
import useKeyActionAsClick from '../../../../../hooks/useKeyActionAsClick';
import { Wrapper as Layout } from '../../layout/styles'
import { initStages } from '../../../utils'
// import { useSelector } from "react-redux";

import {
  MainContainer,
  StickyGroup,
  TitleContainer,
} from '../styles'

const DynamicLoadComponent = loadable(() => import('../../../dynamicLoadComponent'))
const InfoComponent = ({ handleDataForm, handleState, closeModal, ...props }) => {

  const { dataForm, setDataForm } = handleDataForm
  const { state, setState } = handleState
  const [ loading, setLoading ] = useState(false)
  // const user = useSelector(({ modelData:{ user } }) => user);

  // const [ toastMessage ] = useToast()
  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

  const idNextStageKyc = useKeyActionAsClick(
    true,
    "next-stage-kyc",
    13,
    false,
    "onkeypress",
    true
  );
  
  const {
    prevStage,
    nextStage,
    currentStage,
    stageController,
    finalStage,
    stageData,
    setStageData,
    stageStatus,
    setStageStatus
  } = stageManager

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    document.querySelector(`[name="${stageData?.key}"]`).value = ""
    document.querySelector(".label_text__" + stageData?.key).style.color = 'gray'
    setLoading(true)
    if(currentStage >= (stageController.length - 1)){
      await createInfoStages({
        stageData,
        dataForm,
        setDataForm,
        state
      })
    }
    nextStage()
    await getNextSelectList({
      state,
      stageData,
      setDataForm,
      dataForm
    })
    setLoading(false)
  }

  const prevStep = () => {
    setState(prevState => {
      return { ...prevState, [stageData?.key]: "" }
    })
    return prevStage()
  }

  // console.log('dataForm', dataForm)

  const onChange = (e) => {
    e.target.preventDefault && e.target.preventDefault();
    // if(!validations[stageData.key]) return;
    const [ _value, _status ] = validations[stageData.key](e?.target?.value, {...stageData, state, dataForm});
    e.target.value = _value
    //// applies to update state through an effect when it comes from a default state
    setState(prevState => {
      return { ...prevState, [stageData?.key]: _value }
    })
    setStageStatus(_status)
  }

  // load state  by default
  useEffect(() => {
    let inputElement = document.querySelector(`[name="${stageData?.key}"]`)
    // except metada because is not include on state
    if(inputElement && state[stageData.key]){
      // if(!stageData?.key?.includes('meta') && inputElement && state[stageData.key]){
      onChange({target:{value:state[stageData.key]}});
      inputElement.value = state[stageData.key]
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state[stageData?.key]])


  useEffect(() => {
    if(currentStage >= stageController.length){
      const execPost = async() => {
        const documents = dataForm?.stages?.id_type?.selectList
        const idDocument = state?.id_type
        const document = (documents && idDocument) && documents[idDocument]
        if(!document)return prevStage();
        setLoading(true)
        let res = await ApiPostIdentityInfo({document, dataForm, ...state})
        setLoading(false)
        if(!res)return prevStage();
        const currentIdentity = res.data
        const _dataForm = await initStages({
          formName:'identity', 
          currentIdentity
        })
        return setDataForm({
          ..._dataForm,
          config:{
            currentIdentity
          }
        })
      }
      execPost()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage])

  // console.log('||||||||||||||||||||||||||||||||| dataForm ==> ', dataForm)
  
  // console.log('||||||||||||||||||||||||||||||||| state ==> ', state)

  // if(loading){return <KycSkeleton/>}

  if(!loading && finalStage){
    // Render success Stage
    return (
      <KycSkeleton
        closeModal={closeModal}
      />
    )
  }

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

        <MainContainer>
          <TitleContainer id="titleContainer__">
            <h1 className="titleContainer__h1 fuente">{ props.isNewId ? 'Crea un documento de identidad' : 'Crea una identidad' }</h1>
          </TitleContainer>
          <StickyGroup background="white" id="stickyGroup__" >
            <LabelComponent 
              stageController={stageController}
              stages={dataForm?.stages}
              currentStage={currentStage}
              >
              <BackButtom onClick={prevStep} disabled={currentStage <= 0}/>
            </LabelComponent>
            <InputComponent
              onChange={onChange} 
              inputStatus={stageStatus}
              defaultValue={state[stageData?.key]}
              name={stageData?.key} 
              message={stageData?.settings?.defaultMessage}
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
      </Layout>
  )
}

export default InfoComponent


