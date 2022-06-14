import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
// import { useActions } from '../../hooks/useActions'
import FormComponent from '../..' 
import { initStages } from '../../utils'
// import WalletSkeleton from './skeleton'
// import { IconClose } from "../../../widgets/shared-styles";
// import OtherModalLayout from '../../../widgets/modal/otherModalLayout'
import { useActions } from '../../../../hooks/useActions'
// import {
//   Layout,
//   Content
// } from './styles'
import styled from 'styled-components'


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
      <WithdrawAccountContainer>
          {
              dataForm ?
                <FormComponent
                  handleDataForm={{dataForm, setDataForm}}
                  // Fallback={WalletSkeleton}
                />
              :
              <p>cargando</p>
          }
      </WithdrawAccountContainer>
    )
}

//<WalletSkeleton/>


export default NewFiatWithdrawAccountComponent

const WithdrawAccountContainer = styled.div`
  width:100%;
  height:100%;
  display:grid;
  grid-template-columns:1fr minmax(auto, 350px);
`