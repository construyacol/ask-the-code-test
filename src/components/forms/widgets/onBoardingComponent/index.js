
import React, { useState, useEffect } from 'react'
// import useValidations from '../../hooks/useInputValidations'
// import Layout from '../layout'
import useStage from '../../hooks/useStage'
import loadable from '@loadable/component'
// import InputComponent from './input'
// import { getBody } from '../../utils'
// import { BackButtom, NextButtom } from './buttons'
// import LabelComponent from './labelComponent'
// import KycSkeleton from './skeleton'
import isoType from './assets/isoType.png'

import {
    Layout,
    Content
  } from '../sharedStyles'
const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

const OnBoardingContainer = ({ handleDataForm, handleState }) => {


  const { dataForm } = handleDataForm
  // const { state, setState } = handleState
  const [ loading, setLoading ] = useState(false)
  // const validations = useValidations()


  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )


  const {
    nextStage,
    finalStage,
    stageData,
    setStageStatus
  } = stageManager


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



