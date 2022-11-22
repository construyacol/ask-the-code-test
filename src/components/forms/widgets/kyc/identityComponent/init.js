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
      ...props
    })

    setDataForm({
      ..._dataForm,
      config:{
        isNewId:props.isNewId,
        currentIdentity:props.currentIdentity
      }
    })
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
      className={`${dataForm?.wrapperComponent?.includes('files') ? 'scroll' : ''}`}
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
 