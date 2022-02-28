import React, { useState, useEffect } from 'react'
import DynamicLoadComponent from './dynamicLoadComponent'
// import loadable from '@loadable/component'
import { getInitialState } from './utils'
import './mobile.css'
import './global.css'

const FormComponent = ({ handleDataForm, Fallback, ...props }) => {
  
  // const FormSkeleton = loadable(() => import(`./widgets/${handleDataForm.dataForm.wrapperComponent || 'personalKycComponent'}/skeleton`))
  const [ state, setState ] = useState()

  useEffect(()=>{
    setState(getInitialState(handleDataForm.dataForm))
    // eslint-disable-next-line 
  }, [handleDataForm?.dataForm?.wrapperComponent])
  
  return( 
        <DynamicLoadComponent
          component={handleDataForm?.dataForm?.wrapperComponent}
          Fallback={Fallback}
          handleDataForm={handleDataForm}
          handleState={{setState, state}}
          {...props}
        />
  )
}

export default FormComponent
