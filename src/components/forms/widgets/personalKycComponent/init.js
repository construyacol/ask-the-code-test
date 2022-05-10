import React, { useState, useEffect } from 'react'
import FormComponent from '../../' 
import { initStages } from '../../utils'
import { useActions } from '../../../../hooks/useActions'
import KycSkeleton from './skeleton.js'
import Layout from '../layout'
  
const PersonalKyc = () => {

  const [ dataForm, setDataForm ] = useState()
  const actions = useActions();

  const init = async() => {
    const _dataForm = await initStages({
      personType:'natural',
      level:'level_1',
      formName:'personal',
    })
    setDataForm(_dataForm)
  }

  const closeModal = (e, forceClose) => {
      actions.isAppLoading(false);
      actions.renderModal(null);
  };

  useEffect(()=> { 
    init()
  }, [])

  return(
    <Layout
      closeControls
    >
        {
          dataForm ?
            <FormComponent 
              actions={actions} 
              closeModal={closeModal} 
              handleDataForm={{dataForm, setDataForm}}
              Fallback={KycSkeleton}  
            />
            :
            <KycSkeleton/>
        }
    </Layout>
  )

}


export default PersonalKyc