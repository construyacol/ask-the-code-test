import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
import { IconClose } from "../../../widgets/shared-styles";
import { useActions } from '../../../../hooks/useActions'
import { initStages } from '../../utils'
import FormComponent from '../../' 
import { useSelector } from "react-redux";
import { Layout } from '../sharedStyles'

const BiometricKyc = props => {

    const actions = useActions();
    const { userId } = useSelector(({ modelData:{ authData } }) => authData);


    const [ dataForm, setDataForm ] = useState()
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: 'biometric'
        }
      )
      setDataForm(_dataForm)
    }
  
    useEffect(()=> { 
      if(userId){
        init()
      }
    }, [userId]) 

    const closeModal = (e, forceClose) => {
        if (e && (e.target.dataset.close_modal || forceClose)) {
          actions.isAppLoading(false);
          actions.renderModal(null);
          // history.goBack()
        }
    };

    return(
        <OtherModalLayout
            id="close-button-with-OtherModalLayout"
            className="fullScreen"
            onkeydown={true}
            on_click={closeModal}
        >
            <IconClose theme="dark" size={20} />
              {
                dataForm ?
                  <FormComponent
                    handleDataForm={{dataForm, setDataForm}}
                    {...props}
                  />
                :
                  <Layout/>
              }
        </OtherModalLayout>
    )
}

export default BiometricKyc