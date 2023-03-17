import { useState, useEffect } from 'react'
import validations from '../validations'
import useStage from '../../../hooks/useStage'
import { getNextSelectList } from '../utils'
import { ApiPostLocation } from './api'
import { initStages } from '../../../utils'
import KycFormComponent from '../../kycForm'


const LocationComponent = ({ handleDataForm, handleState, closeModal, actions }) => {

  const { dataForm, setDataForm } = handleDataForm
  const { state, setState } = handleState
  const [ loading, setLoading ] = useState(false)

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
    nextStage()
    // await getNextSelectList(stageData?.key)
    await getNextSelectList({
      state,
      stageData,
      setDataForm
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
        setLoading(true)
        let res = await ApiPostLocation(state)
        setLoading(false)
        if(!res)return prevStage();
        const _dataForm = await initStages({
          formName:'identity',
        })
        setDataForm(_dataForm)
      }
      execPost()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage])

  // console.log('handleState', handleState)
 
  return(
    <KycFormComponent
      handleState={handleState}
      dataForm={dataForm}
      closeModal={closeModal}
      prevStep={prevStep} 
      loading={loading}
      onChange={onChange}
      stageManager={stageManager}
      nextStep={nextStep}
      title="Verificación de cuenta"
    />
  )
}

export default LocationComponent


