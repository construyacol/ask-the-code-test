import { useEffect, useState } from 'react'
import FormComponent from '../..' 
import { initStages } from '../../utils'
import { FIAT_DEPOSIT_TYPES } from './api'
import { FormContainer } from '../sharedStyles'
import { SelectListSkeleton } from '../selectListComponent'
import { parseQueryString } from 'utils' 


export default function NewFiatDepositComponent (props){

    const [ dataForm, setDataForm ] = useState()
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
      <FormContainer className={`fiatDepositContainer ${parseQueryString()}`}>
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

