import styled from 'styled-components'
import { useSelector } from "react-redux";
import { selectFiatWithdrawProviders } from "selectors"
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { TagNewComponent } from 'core/components/molecules'
import { P, SPAN } from 'core/components/atoms';
import { BiRightArrowAlt } from 'react-icons/bi';


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
  ...props
}) => {
  const fiatWithdrawProviders = useSelector(({ modelData:{ withdrawProviders } }) => selectFiatWithdrawProviders(withdrawProviders, 'provider_type'));
  return(
    <>
      {uiName && <p className="fuente _pLabel _inputLabelP">{uiName}</p>}
      <SelectListContainer>
        { 
          fiatWithdrawProviders && Object.keys(withdrawServiceList).map((provKey, index) => {
              const itemList = fiatWithdrawProviders[provKey]
              const AuxComponent = withdrawServiceList[provKey]?.AuxComponent
              const isSelected = state[stageData?.key]?.value === (withdrawServiceList[provKey]?.value || provKey)
              let _value = withdrawServiceList[provKey]?.value
              console.log('fiatWithdrawProviders', withdrawServiceList, )
              if(!fiatWithdrawProviders[provKey])return null;
              return <ItemListComponent 
                key={index} 
                className={`auxNumber account_${itemList?.id}`}
                itemList={{
                  value:_value || provKey,
                  icon:withdrawServiceList[provKey]?.icon || provKey,
                  uiName:withdrawServiceList[provKey]?.uiName
                }}
                // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                firstIndex={index === 0}
                lastIndex={Object.keys(withdrawServiceList)?.length === 1 ? true : (Object.keys(fiatWithdrawProviders)?.length - 1) === index}
                isSelectedItem={isSelected}
                handleAction={_value === 'newBankAccount' ? () => props.setCreateAccount(true) : handleAction} 
                AuxComponent={[
                    AuxComponent ? () => <AuxComponent/> : () => null
                ]}
              />
            })
        }
      </SelectListContainer>
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
  AuxComponent:TagNewComponent
}

export const INTERNAL_NETWORK = {
  internal_network:{
    uiName:() => <P>A otra persona</P>,
    AuxComponent:TagNewComponent
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
  ...BANK,
  ethereum_testnet:CRYPTO_ACCOUNT_LABEL,
  ethereum:CRYPTO_ACCOUNT_LABEL,
}
  