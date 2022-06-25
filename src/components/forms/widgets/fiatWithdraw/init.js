import { useEffect, useState } from 'react'
import FormComponent from '../..' 
import { initStages } from '../../utils'
import { FIAT_WITHDRAW_TYPES } from './api'
import { SelectListSkeleton } from '../selectListComponent'
import { FormContainer } from '../sharedStyles'

const NewFiatWithdrawAccountComponent = props => {

    const [ dataForm, setDataForm ] = useState()
    // const actions = useActions();

    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: FIAT_WITHDRAW_TYPES.FORM
        }
      )
      setDataForm(_dataForm)
    }
    
    useEffect(()=> { 
      init()
    }, []) 
   
    return(
      <FormContainer className="fiatWithdrawContainer">
          {
              dataForm ?
                <FormComponent
                  handleDataForm={{dataForm, setDataForm}}
                  Fallback={SelectListSkeleton}
                  {...props}
                />
              : 
              <SelectListSkeleton/>
          }
      </FormContainer>
    )
}

export default NewFiatWithdrawAccountComponent

