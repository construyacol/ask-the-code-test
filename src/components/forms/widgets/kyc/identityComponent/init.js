import React, { useState, useEffect } from 'react'
import FormComponent from '../../..' 
import { initStages } from '../../../utils'
import { useActions } from '../../../../../hooks/useActions'
import KycSkeleton from './skeleton.js'
import Layout from '../../layout'
  
const IdentityForm = (props) => {

  const [ dataForm, setDataForm ] = useState()
  const actions = useActions();

  const init = async() => {
    const _dataForm = await initStages({
      formName:'identity',
      isNewId:props.isNewId
    })
    setDataForm(_dataForm)
  }

  const closeModal = (e, forceClose) => {
      actions.isAppLoading(false);
      actions.renderModal(null);
  };

  useEffect(()=> { 
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {...props}
            />
            :
            <KycSkeleton/>
        }
    </Layout>
  )

}


export default IdentityForm