import React, { useState, useEffect } from 'react'
import validations from '../validations'
import useStage from '../../../hooks/useStage'
import { getNextSelectList } from '../utils' 
import { ApiPostIdentityInfo, createInfoStages } from './api'
import KycFormComponent from '../../kycForm'
// import useToast from '../../../../hooks/useToastMessage'
// import SuccessComponent from './success'
import { initStages } from '../../../utils'
// import { useSelector } from "react-redux";


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


  
  const {
    prevStage,
    nextStage,
    currentStage,
    stageController,
    stageData,
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

  return(
    <KycFormComponent
      state={state}
      dataForm={dataForm}
      closeModal={closeModal}
      isNewId={props?.isNewId}
      prevStep={prevStep}
      loading={loading}
      onChange={onChange}
      stageManager={stageManager}
      nextStep={nextStep}
    />
  )
}

export default InfoComponent

