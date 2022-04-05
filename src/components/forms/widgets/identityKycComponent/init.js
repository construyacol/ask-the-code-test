import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
import Layout from '../layout'
import FormComponent from '../..' 
import { initStages } from '../../utils'


const IdentityKycComponent = props => {


    const [ dataForm, setDataForm ] = useState()
    
    const init = async() => {
      const _dataForm = await initStages(
        {
          personType:'legal',
          level:'level_1',
          formName: 'identity'
        }
      )
      // console.log('_dataForm', _dataForm)
      // debugger
      setDataForm(_dataForm) 
    }

    useEffect(()=> { 
      init()
    }, []) 
   
    return(
      <Layout
        closeControls
      >
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

export default IdentityKycComponent