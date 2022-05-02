import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
// import { useActions } from '../../hooks/useActions'
import Layout from '../layout'

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
      <Layout closeControls>
        {
          dataForm ?
            <FormComponent
              handleDataForm={{dataForm, setDataForm}}
            />
          :
            <p>Cargando...</p>
        }
      </Layout>
    )

}

export default OnBoardingComponent