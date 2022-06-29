import { useEffect } from 'react'
import { StageContainer } from '../sharedStyles'
import InputComponent from '../kyc/InputComponent'
// import { useSelector } from "react-redux";
import validations from './validations'
import { createSelector } from "reselect";
// import AvailableBalance from '../../../widgets/availableBalance'
// import { formatToCurrency } from "../../../../utils/convert_currency";
// import { SelectListContainer, ItemListComponent } from '../selectListComponent'


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
  
    // const [availableAmount, setAvailableAmount] = useState(availableBalance)
    // const { isMovilViewport } = useViewport();

    const withdrawAmountOnChange = async(e) => {
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
          inputMode="numeric"
          name={stageData?.key} 
          label={stageData?.uiName}
          placeholder={stageData?.settings?.placeholder}
          type={stageData?.uiType}
          setStageData={setStageData}
          // AuxComponent={[() => (<AvailableBalance
          //   id={currentWallet?.id}
          //   handleAction={handleMaxAvailable} 
          //   amount={availableAmount}
          // />)]}
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