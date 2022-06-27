import { useState, useEffect } from 'react'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import validations from './validations'
import InputComponent from '../kyc/InputComponent'
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import useViewport from '../../../../hooks/useWindowSize'


export default function InfoAccountComponent ({ 
    stageManager:{ 
      stageData,
      setStageData,
      setStageStatus,
      stageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children 
  }) {
  
    const { isMovilViewport } = useViewport();
    const [ inputStatus, setInputStatus ] = useState()  
    const selectList = stageData?.accountType?.selectList
    const accountTypeOnChange = (accountType) => {
      setState(prevState => {
        return { ...prevState, [stageData?.key]:{
          ...prevState[stageData?.key],
          [stageData?.accountType?.key]:accountType?.value
        } }
      })
    }
  
    const accountNumberOnChange = (e) => {
      e.target.preventDefault && e.target.preventDefault();
      if(!validations[stageData?.accountNumber?.key]) return;
      const [ _value, _status ] = validations[stageData?.accountNumber?.key](e?.target?.value, {...stageData?.accountNumber, state, dataForm});
      e.target.value = _value
      setState(prevState => {
        return { ...prevState, [stageData?.key]:{
          ...prevState[stageData?.key],
          [stageData?.accountNumber?.key]:_value
        } }
      })
      // setStageStatus(_status)
      setInputStatus(_status)
    }
  
        // load state  by default
      useEffect(() => {
        let inputElement = document.querySelector(`[name="${stageData?.accountNumber?.key}"]`)
        let hasValue = state?.infoAccount?.accountNumber
        if(inputElement && hasValue){
          accountNumberOnChange({target:{value:hasValue}});
          inputElement.value = hasValue
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
  
  
      useEffect(() => {
        if(["success"].includes(inputStatus) && selectList[state?.infoAccount?.accountType]){
          setStageStatus('success')
        }else{
          setStageStatus(null)
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [state?.infoAccount])
  
  
    return( 
      <StageContainer className="_infoAccount">
        {children}
        <InputComponent
            onChange={accountNumberOnChange} 
            inputStatus={inputStatus}
            name={stageData?.accountNumber?.key} 
            label={stageData?.accountNumber?.uiName}
            placeholder={stageData?.accountNumber?.settings?.placeholder}
            type={stageData?.accountNumber?.uiType}
            setStageData={setStageData}
            inputMode="numeric"
          />
        <OptionInputContainer>
          <p className="fuente _pLabel">¿Cual es el tipo de cuenta?</p>
         
          <SelectListContainer>
              {
                selectList && Object.keys(selectList).map((key, index) => {
                  const isSelected = [selectList[key]?.value].includes(state?.infoAccount?.accountType)
                  return <ItemListComponent 
                    key={index}
                    itemList={selectList[key]}
                    firstIndex={index === 0}
                    lastIndex={(Object.keys(selectList)?.length - 1) === index}
                    isSelectedItem={isSelected}
                    isMovilViewport={isMovilViewport}
                    handleAction={accountTypeOnChange}
                  />
                })
              }
          </SelectListContainer>
        </OptionInputContainer>
      </StageContainer>
    )
  
  }
  

