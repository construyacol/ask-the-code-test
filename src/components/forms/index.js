import React, { useState, useEffect } from 'react'
import DynamicLoadComponent from './dynamicLoadComponent'
import { getInitialState } from './utils'
import './global.css' 

const FormComponent = ({ handleDataForm, Fallback, ...props }) => {
  
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
