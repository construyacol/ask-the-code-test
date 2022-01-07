import React, { useState, useEffect } from 'react'
import FormComponent from '../../' 
import { initStages } from '../../utils'
// import loadable from '@loadable/component'


const PersonalKyc = () => {

//   const KycSkeleton = loadable(() => import('./components/forms/widgets/personalKycComponent/skeleton'))
  const [ dataForm, setDataForm ] = useState()
  
  const init = async() => {
    const _dataForm = await initStages({
      personType:'natural',
      level:'level_1',
      formName:'personal',
    })
    setDataForm(_dataForm)
  }

  useEffect(()=> { 
    init()
  }, [])


  return(
    <>
        {
          dataForm ?
            <FormComponent handleDataForm={{dataForm, setDataForm}}/>
            :
            <h1>Skeleton</h1>
        }
    </>
   
  )

}


export default PersonalKyc