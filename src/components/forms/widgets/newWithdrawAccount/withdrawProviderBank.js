import { useEffect } from 'react'
import useViewport from "../../../../hooks/useWindowSize"
import validations from './validations'
import { StageContainer } from './styles'
import InputComponent from '../kyc/InputComponent'
import SelectListComponent from '../selectListComponent'



const WithdrawProviderBank = ({ 
    stageManager, 
    children,
    handleState:{ state, setState },
    handleDataForm:{ dataForm }
  }) => {
  
    const { isMovilViewport } = useViewport();
    const {
      stageData,
      setStageStatus,
      stageStatus,
      // setStageData
    } = stageManager
  
    const onChange = (e) => {
      e.target.preventDefault && e.target.preventDefault();
      if(!validations[stageData.key]) return;
      const [ _value, _status ] = validations[stageData.key](e?.target?.value, {...stageData, state, dataForm});
      e.target.value = _value
      setState(prevState => {
        return { ...prevState, [stageData?.key]: _value }
      })
      setStageStatus(_status)
    }
  
  
    // load state  by default
    useEffect(() => {
      let inputElement = document.querySelector(`[name="${stageData?.key}"]`)
      // except metada because is not include on state
      if(inputElement && state[stageData.key]){
        // if(!stageData?.key?.includes('meta') && inputElement && state[stageData.key]){
        onChange({target:{value:state[stageData.key]}});
        inputElement.value = state[stageData.key]
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state[stageData?.key]])
  
    // console.log('stageData', stageData)
  
    return(
      <StageContainer className="_withdrawProviderBank">
        {children}
        <InputComponent
          onChange={onChange} 
          inputStatus={stageStatus}
          // defaultValue={state[stageData?.key]}
          name={stageData?.key} 
          label={stageData?.uiName}
          // message={stageData?.settings?.defaultMessage}
          placeholder={stageData?.settings?.placeholder}
          type={stageData?.uiType}
          // setStageData={setStageData}
          // dataForm={dataForm}
          // state={state}
          // progressBar={{start:currentStage+1, end:stageController.length, showSteps:true}}
          // AuxComponent={[
          //   stageData?.settings?.auxComponent, 
          //   () => <NextButtom id={idNextStageKyc} onClick={nextStep} disabled={(currentStage >= stageController.length) || stageStatus !== 'success'} />
          // ]}
        />
  
        <SelectListComponent
          stageData={stageData}
          state={state}
          isMovilViewport={isMovilViewport}
          onChange={onChange}
        />
       
      </StageContainer>
    )
  }

export default WithdrawProviderBank