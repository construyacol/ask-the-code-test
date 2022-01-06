import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
import OtherModalLayout from "../widgets/modal/otherModalLayout";
import { IconClose } from "../widgets/shared-styles";
import { useActions } from '../../hooks/useActions'
import { initStages } from '../forms/utils'
import FormComponent from '../forms' 


const FormsComponent = props => {

    const actions = useActions();

    const [ dataForm, setDataForm ] = useState()
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          personType:'natural',
          level:'level_1',
          formName: 'biometric'
        }
      )
      setDataForm(_dataForm)
    }
  
    useEffect(()=> { 
      init()
    }, []) 

    const cerrar = (e, forceClose) => {
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
            on_click={cerrar}
        >
            <IconClose theme="dark" size={20} />
              {
                dataForm ?
                  <FormComponent
                    handleDataForm={{dataForm, setDataForm}}
                  />
                :
                  <h1>Skeleton</h1>
              }
        </OtherModalLayout>
    )

}

export default FormsComponent