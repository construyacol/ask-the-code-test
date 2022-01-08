import React, { useState, useEffect } from 'react'
import FormComponent from '../../' 
import { initStages } from '../../utils'
import loadable from '@loadable/component'
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";


const PersonalKyc = () => {

  const KycSkeleton = loadable(() => import('./skeleton.js'))
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
    <OtherModalLayout>
        {
          dataForm ?
            <FormComponent handleDataForm={{dataForm, setDataForm}}/>
            :
            <KycSkeleton/>
        }
    </OtherModalLayout>
   
  )

}


export default PersonalKyc