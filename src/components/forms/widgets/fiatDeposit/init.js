import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
import { useActions } from '../../../../hooks/useActions'
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
// import { ContainerLayout } from '../../../widgets/modal/render/addressBook'
import FormComponent from '../../' 
import { initStages } from '../../utils'
import { DepositSkeleton } from './amount'


const FiatDepositComponent = props => {

    const actions = useActions();

    const [ dataForm, setDataForm ] = useState()

    const closeModal = (e) => {
      if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
        actions.renderModal(null);
      }
    };
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: 'fiatDeposit'
        }
      )
      setDataForm(_dataForm)
    }
  
    useEffect(()=> { 
      init()
    }, []) 

    return(
      <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
        on_click={closeModal}
      >
          {
            dataForm ?
              <FormComponent
                handleDataForm={{dataForm, setDataForm}}
                closeModal={closeModal}
              />
            :
            <DepositSkeleton showHeader />
          }
      </OtherModalLayout>
    )

}

export default FiatDepositComponent