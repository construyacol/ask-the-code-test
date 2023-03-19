import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { TagNewComponent } from 'core/components/molecules'
import { P, SPAN } from 'core/components/atoms';
import { BiRightArrowAlt } from 'react-icons/bi';
import { FIAT_WITHDRAW_TYPES } from '../api'


const EmptyStateAccountList = (props) => {
  return(
    <>
        <WithdrawServiceList
          uiName="¿A donde deseas enviar DCOP?"
          {...props}
        />
    </>
  )
}

export default EmptyStateAccountList


export const WithdrawServiceList = ({
  withdrawServiceList = WITHDRAW_ACCOUNT_LABELS,
  stageManager:{ stageData },
  handleState:{ state },
  handleAction,
  uiName,
  wProvidersByProvType,
  ...props
}) => {

  const [ availableWProv, setAvailableWProv ] = useState(false)

  useEffect(() => {
    for (const item in withdrawServiceList) {
      if(wProvidersByProvType[item]?.enabled) setAvailableWProv(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return(
    <>
      {
        availableWProv &&
        <>
          {uiName && <p className="fuente _pLabel _inputLabelP">{uiName}</p>}
          <SelectListContainer>
            { 
              wProvidersByProvType && Object.keys(withdrawServiceList).map((provKey, index) => {
                  const itemList = wProvidersByProvType[provKey]
                  const AuxComponent = withdrawServiceList[provKey]?.AuxComponent 
                  const isSelected = state[stageData?.key]?.value === (withdrawServiceList[provKey]?.value || provKey)
                  let _value = withdrawServiceList[provKey]?.value
                  if(!wProvidersByProvType[provKey] || !wProvidersByProvType[provKey]?.enabled)return null;
                  return <ItemListComponent 
                    key={index} 
                    className={`auxNumber account_${itemList?.id}`}
                    itemList={{
                      value:_value || provKey,
                      icon:withdrawServiceList[provKey]?.icon || provKey,
                      uiName:withdrawServiceList[provKey]?.uiName,
                      auxUiName:withdrawServiceList[provKey]?.auxUiName
                    }}
                    // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                    firstIndex={index === 0}
                    lastIndex={Object.keys(withdrawServiceList)?.length === 1 ? true : (Object.keys(wProvidersByProvType)?.length - 3) === index}
                    isSelectedItem={isSelected}
                    // handleAction={[ 'newBankAccount', 'withdrawCrypto' ]?.includes(_value) ? () => props.setView(_value) : (item) => handleAction({value:item?.value})} 
                    handleAction={[ 'newBankAccount' ]?.includes(_value) ? () => props.setView(_value) : (item) => handleAction({value:item?.value})} 
                    AuxComponent={[AuxComponent]}
                  />
                })
            }
          </SelectListContainer>
        </>
      }
    </>
  )
}

const Sub = styled(SPAN)`
  opacity: .5;
  font-size: 14px;
  font-weight: 200;
`

const CRYPTO_ACCOUNT_LABEL ={ 
  uiName:() => <P>A billetera DCOP <Sub className={"number"}> (ERC20)</Sub></P>,
  // AuxComponent:() => <div style={{
  //   display:"flex",
  //   justifyContent:"flex-end",
  //   columnGap: "15px"
  //   }}><TagNewComponent/> <BiRightArrowAlt className="_birArrow" size={37} /></div> ,
  AuxComponent:TagNewComponent,
  value:'withdrawCrypto'
}

export const INTERNAL_NETWORK = {
  [FIAT_WITHDRAW_TYPES?.TYPES?.INTERNAL]:{
    uiName:"A otra persona",
    AuxComponent:TagNewComponent,
    auxUiName:"De forma instantanea y gratuita"
  }
}

export const BANK = {
  bank:{
    uiName:"A mi cuenta bancaria personal",
    icon:"bankAccount",
    value:'newBankAccount',
    AuxComponent:() => <BiRightArrowAlt className="_birArrow" size={37} />
  }
}

const WITHDRAW_ACCOUNT_LABELS = {
  ...INTERNAL_NETWORK,
  // ethereum_testnet:CRYPTO_ACCOUNT_LABEL,
  // ethereum:CRYPTO_ACCOUNT_LABEL,
  ...BANK,
}

export const WITHDRAW_ACCOUNT_LIST = {
  ...INTERNAL_NETWORK,
  // ethereum_testnet:CRYPTO_ACCOUNT_LABEL,
  // ethereum:CRYPTO_ACCOUNT_LABEL,
}
  