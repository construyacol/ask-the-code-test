import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
// import { useActions } from '../../hooks/useActions'

import FormComponent from '../../' 
import { initStages } from '../../utils'


const OnBoardingComponent = props => {

    // const actions = useActions();

    const [ dataForm, setDataForm ] = useState()
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          formName: 'onBoarding'
        }
      )
      setDataForm(_dataForm) 
    }
  
    useEffect(()=> { 
      init()
    }, []) 
   

    return(
      <>
        {
          dataForm ?
            <FormComponent
              handleDataForm={{dataForm, setDataForm}}
            />
          :
            <p>Cargando...</p>
        }
      </>
    )

}

export default OnBoardingComponent