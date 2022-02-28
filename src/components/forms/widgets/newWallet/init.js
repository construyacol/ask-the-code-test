import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
// import { useActions } from '../../hooks/useActions'
import FormComponent from '../../' 
import { initStages } from '../../utils'
import WalletSkeleton from './skeleton'
import { IconClose } from "../../../widgets/shared-styles";
import OtherModalLayout from '../../../widgets/modal/otherModalLayout'
import { useActions } from '../../../../hooks/useActions'
import {
  Layout,
  Content
} from './styles'


const NewWalletComponent = props => {

    const [ dataForm, setDataForm ] = useState()
    const actions = useActions();

    const closeModal = (e, forceClose) => {
      if (e && (e.target.dataset.close_modal || forceClose)) {
        actions.renderModal(null);
      }
  }
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: 'newWallet'
        }
      )
      setDataForm(_dataForm)
    }
  
    useEffect(()=> { 
      init()
    }, []) 
   

    return(
      <OtherModalLayout 
      className="fullScreen"
      on_click={closeModal}
      > 
      <IconClose theme="dark" top={15} right={20} />
        <Layout>
          <Content>
              {
                dataForm ?
                  <FormComponent
                    handleDataForm={{dataForm, setDataForm}}
                    Fallback={WalletSkeleton}
                  />
                :
                  <WalletSkeleton/>
              }
          </Content>
        </Layout>
      </OtherModalLayout>
    )

}

export default NewWalletComponent