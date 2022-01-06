import { useEffect, useState } from 'react'
// import loadable from '@loadable/component'
import OtherModalLayout from "../widgets/modal/otherModalLayout";
import { IconClose } from "../widgets/shared-styles";
import { useActions } from '../../hooks/useActions'
import { initStages } from '../forms/utils'
import FormComponent from '../forms' 

// Temporal dependencies
import { Router, Route } from "react-router-dom";
import { history } from "../../const/const";


const OnBoardingComponent = props => {

    const actions = useActions();

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
      <Router history={history}>
          <Route path="/"> 
              <OtherModalLayout
                className="fullScreen"
                disable
            >
                  {
                    dataForm ?
                      <FormComponent
                        handleDataForm={{dataForm, setDataForm}}
                      />
                    :
                      <h1>Skeleton</h1>
                  }
            </OtherModalLayout>
          </Route>
    </Router>
        
    )

}

export default OnBoardingComponent