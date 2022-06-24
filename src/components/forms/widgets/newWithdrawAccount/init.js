import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
// import { useActions } from '../../hooks/useActions'
import FormComponent from '../..' 
import { initStages } from '../../utils'
// import WalletSkeleton from './skeleton'
// import { IconClose } from "../../../widgets/shared-styles";
// import OtherModalLayout from '../../../widgets/modal/otherModalLayout'
// import { useActions } from '../../../../hooks/useActions'
// import {
//   Layout,
//   Content
// } from './styles'
import { StageSkeleton } from '../stageManager'
import { FormContainer } from '../sharedStyles'


const NewFiatWithdrawAccountComponent = props => {

    const [ dataForm, setDataForm ] = useState()
    // const actions = useActions();

    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: 'newWithdrawAccount'
        }
      )
      setDataForm(_dataForm)
    }
    
    useEffect(()=> { 
      init()
    }, []) 
   
    return(
      <FormContainer>
          {
              dataForm ?
                <FormComponent
                  handleDataForm={{dataForm, setDataForm}}
                  Fallback={StageSkeleton}
                  {...props}
                />
              : 
              <StageSkeleton/>
          }
      </FormContainer>
    )
}




export default NewFiatWithdrawAccountComponent
