import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
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
      <OtherModalLayout className="fullScreen" disable>
        {
          dataForm ?
            <FormComponent
              handleDataForm={{dataForm, setDataForm}}
            />
          :
            <h1>Skeleton</h1>
        }
      </OtherModalLayout>
    )

}

export default OnBoardingComponent