import { useEffect } from 'react'
import { StageContainer } from './styles'
import InputComponent from '../kyc/InputComponent'
import { useSelector } from "react-redux";
import validations from './validations'
import { createSelector } from "reselect";
// import AvailableBalance from '../../../widgets/availableBalance'

export default function AmountComponent ({ 
    stageManager:{ 
      stageData,
      setStageData,
      setStageStatus,
      stageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    currentWallet,
    availableBalance
  }) {
  
    const { withdrawAccount } = state
    const [ withdrawProvider ] = useSelector((state) => selectWithdrawProvider(state, withdrawAccount?.withdraw_provider));
    // const { isMovilViewport } = useViewport();

  
    const withdrawAmountOnChange = async(e) => {
      e.target.preventDefault && e.target.preventDefault();
      if(!validations[stageData?.key]) return;

      const [ _value, _status ] = await validations[stageData?.key](e?.target?.value, {
        ...stageData, 
        state, 
        dataForm, 
        withdrawProvider, 
        availableBalance,
        currentWallet
      });

      e.target.value = _value
      setState(prevState => {
        return { ...prevState, [stageData?.key]: _value }
      })
      setStageStatus(_status)
    }

      // load state  by default
      useEffect(() => {
        let inputElement = document.querySelector(`[name="${stageData?.key}"]`)
        if(inputElement && state[stageData.key]){
          withdrawAmountOnChange({target:{value:state[stageData.key]}});
          inputElement.value = state[stageData.key]
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [state[stageData?.key]])
  
    return( 
      <StageContainer className="_withdrawAmount">
        {children}
        <InputComponent
          onChange={withdrawAmountOnChange} 
          inputStatus={stageStatus}
          // value={value}
          name={stageData?.key} 
          label={stageData?.uiName}
          placeholder={stageData?.settings?.placeholder}
          type={stageData?.uiType}
          setStageData={setStageData}
        />
      </StageContainer>
    )
  
  }
  



  const selectWithdrawProvider = createSelector(
    (state) => state.modelData.withdrawProviders,
    (_, withdrawProvId) => withdrawProvId,
    (withdrawProviders, withdrawProvId) => {
      if(!withdrawProviders)return ; 
      const withdrawProvider = withdrawProviders[withdrawProvId]
      return [ withdrawProvider ];
    }
  );