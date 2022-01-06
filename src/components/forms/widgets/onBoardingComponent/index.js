
import React, { useState, useEffect } from 'react'
import useValidations from '../../hooks/useInputValidations'
// import Layout from '../layout'
import useStage from '../../hooks/useStage'
import loadable from '@loadable/component'
// import InputComponent from './input'
// import { getBody } from '../../utils'
// import { BackButtom, NextButtom } from './buttons'
// import LabelComponent from './labelComponent'
// import KycSkeleton from './skeleton'
import isoType from './isoType.png'

import {
    Layout,
    Content
  } from '../sharedStyles'
const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const OnBoardingContainer = ({ handleDataForm, handleState }) => {


  const { dataForm } = handleDataForm
  const { state, setState } = handleState
  const [ loading, setLoading ] = useState(false)
  const validations = useValidations()


  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

  console.log('stageManager', stageManager)
//   debugger

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


  const onChange = (e) => {
    e.target.preventDefault && e.target.preventDefault();
    if(!validations[stageData?.key]){return}
    const [ _value, _status ] = validations[stageData.key](e.target.value, {...stageData, state, dataForm});
    e.target.value = _value
    //// applies to update state through an effect when it comes from a default state
    setState(prevState => {
      return { ...prevState, [stageData?.key]: _value }
    })
    setStageStatus(_status)
  }


  useEffect(() => {
    console.log('currentStage', currentStage)
    if(currentStage >= stageController.length){
      setLoading(true)
      // onSubmit(setLoading, 3000)
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage])



//   if(loading){return <KycSkeleton/>}

  if(!loading && finalStage){
    // Render success Stage
    return (
      <div>FINAL</div>
      // <DynamicLoadComponent
      //       component={dataForm?.successStage?.component}
      //       handleDataForm={handleDataForm}
      //       handleState={handleState}
      // />
    )
  }

  console.log('stageData', stageData)

  return(
      <Layout>
            <Content>
                <img src={isoType} width={27} alt="isoType"/>
                <DynamicLoadComponent
                    component={`onBoardingComponent/${stageData?.key}.js`}
                    nextStage={nextStage}
                />
                
            </Content>
      </Layout>
  )
}
export default OnBoardingContainer



