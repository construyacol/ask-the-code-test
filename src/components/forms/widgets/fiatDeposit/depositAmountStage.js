import { useEffect, useState } from 'react'
import { StageContainer } from '../sharedStyles'
import InputComponent from '../kyc/InputComponent'
// import { useSelector } from "react-redux";
import validations from './validations'
import { createSelector } from "reselect";
import AvailableBalance from '../../../widgets/availableBalance'
// import { formatToCurrency } from "../../../../utils/convert_currency";
// import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { getMinAmount } from './validations'

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
    depositProvider
  }) {
    
    const { min_amount, currency, costs } = depositProvider?.provider
    const [ minAmount, setMinAmount] = useState(min_amount)
    // const { depositCost } = state
    // const { isMovilViewport } = useViewport();

    const depositAmountOnChange = async(e) => {
      e.target.preventDefault && e.target.preventDefault();
      if(!validations[stageData?.key]) return;

      const [ _value, _status ] = await validations[stageData?.key](e?.target?.value, {
        ...stageData, 
        state,  
        dataForm, 
        depositProvider
      });
      e.target.value = _value
      setState(prevState => ({ ...prevState, [stageData?.key]: _value }))
      setStageStatus(_status)
    }

    const handleMinAmount = () => {
      if(!depositProvider) return;
      let minAmount = getMinAmount(min_amount, { currency, costs });
      depositAmountOnChange({target:{value:minAmount.toFormat()}});
    }

    useEffect(() => {
      if(depositProvider){
        let minAmount = getMinAmount(min_amount, { currency, costs });
        setMinAmount(minAmount?.toFormat())
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // load state  by default
    useEffect(() => {
      let inputElement = document.querySelector(`[name="${stageData?.key}"]`)
      if(inputElement && state[stageData.key]){
        depositAmountOnChange({target:{value:state[stageData.key]}});
        inputElement.value = state[stageData.key]
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state[stageData?.key]])
  
    return( 
      <StageContainer className="_withdrawAmount">
        {children}
        <InputComponent
          onChange={depositAmountOnChange} 
          inputStatus={stageStatus}
          inputMode="numeric"
          name={stageData?.key} 
          label={stageData?.uiName}
          placeholder={stageData?.settings?.placeholder}
          type={stageData?.uiType}
          setStageData={setStageData}
          AuxComponent={[() => (<AvailableBalance
            // id={currentWallet?.id}
            handleAction={handleMinAmount} 
            copyText="Mínimo:"
            // amount={state[stageData?.key]}
            amount={minAmount}
          />)]}
        />
      </StageContainer>
    )
  }
  
  export const selectWithdrawProvider = createSelector(
    (state) => state.modelData.withdrawProviders,
    (_, withdrawProvId) => withdrawProvId,
    (withdrawProviders, withdrawProvId) => {
      if(!withdrawProviders)return ; 
      const withdrawProvider = withdrawProviders[withdrawProvId]
      return [ withdrawProvider ];
    }
  );