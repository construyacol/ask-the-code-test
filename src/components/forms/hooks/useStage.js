import { useState, useEffect } from 'react'
import { getQuery } from '../utils'
import { history } from 'const/const'

const useStage = (stageController, stages, defaultStage = 0) => {

  const [ stageStatus, setStageStatus ] = useState()
  const [ currentStage, setCurrentStage ] = useState(defaultStage)
  const [ stageData, setStageData ] = useState(stages[stageController[currentStage]])

  const nextStage = (step = 1) => {
    // add ref or className on Json file Source to management the DOM components, e.x buttons states...
    if(currentStage >= stageController.length){return}
      setCurrentStage(prevState => prevState+step)
  }

  const prevStage = () => {
    if(currentStage <= 0){return}
    setCurrentStage(prevState => prevState-1)
  }

// Set url query params
  useEffect(()=>{
    if(stageData?.settings?.queryParams){
      let query = getQuery(stageData.settings.queryParams)
      history?.push(query)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData])

  useEffect(()=>{
    const nextStageData = stages[stageController[currentStage]] 
    setStageData(nextStageData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage, stages[stageController[currentStage]]])

  return {
    currentStage,
    nextStage,
    prevStage,
    stageController,
    stageData,
    setStageData,
    stageStatus,
    setStageStatus,
    finalStage:currentStage >= stageController.length
  }

}

export default useStage
