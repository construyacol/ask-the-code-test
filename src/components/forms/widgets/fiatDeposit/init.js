import { useEffect, useState } from 'react'
import FormComponent from '../..' 
import { initStages } from '../../utils'
import { FIAT_DEPOSIT_TYPES } from './api'
import { FormContainer } from '../sharedStyles'
// import { StageSkeleton } from '../stageManager'
import { SelectListSkeleton } from '../selectListComponent'

export default function NewFiatDepositComponent (props){

    const [ dataForm, setDataForm ] = useState()
    // const actions = useActions();
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: FIAT_DEPOSIT_TYPES.FORM
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

