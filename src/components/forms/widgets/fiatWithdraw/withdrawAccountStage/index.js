import { useEffect, useState } from 'react'
import { StageContainer, OptionInputContainer } from '../../sharedStyles'
import loadable from "@loadable/component";
import { useActions } from 'hooks/useActions'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import useToastMessage from "hooks/useToastMessage";
import useViewport from 'hooks/useViewport'
import { isEmpty } from 'lodash'
import { FIAT_WITHDRAW_TYPES } from '../api'

const EmptyStateAccountList = loadable(() => import("./emptyStateAccountList"), {fallback:<p>Cargando</p>});
const WithdtrawAccountList = loadable(() => import("./withdtrawAccountList"), {fallback:<p>Cargando</p>});

export default function WithdrawAccountsComponent({ 
    children,
    ...props
}){
  const { 
    handleState:{ setState, state },
    stageManager:{ setStageStatus, stageData },
    withdrawAccounts
  } = props
  const actions = useActions()
  const { isMobile } = useViewport();
  const [ coinsendaServices ] = useCoinsendaServices();
  const [toastMessage] = useToastMessage();
  const [ bankAccountList, setBankAccountList ] = useState(true)


  const selectWithdrawAccount = (withdrawAccount) => {
    setState(prevState => { return { ...prevState, [stageData?.key]: withdrawAccount } })
    setStageStatus('success')
  }

  useEffect(() => {
    if(state[stageData?.key]){
      selectWithdrawAccount(state[stageData?.key])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  useEffect(() => {
    (async() => {
      // let wAccountId = await Object.keys(withdrawAccounts).find(wAccountId => withdrawAccounts[wAccountId]?.provider_type !== 'internal_network')
      let _bankAccountList = {}
      for (const wAccountId in withdrawAccounts) {
          if(![
            FIAT_WITHDRAW_TYPES.TYPES.INTERNAL, 
            FIAT_WITHDRAW_TYPES.TYPES.ETHEREUM, 
            FIAT_WITHDRAW_TYPES.TYPES.ETHEREUM_TESTNET].includes(withdrawAccounts[wAccountId]?.provider_type)){
          _bankAccountList = {
            ..._bankAccountList,
            [wAccountId]:withdrawAccounts[wAccountId]
          }
        }
      }
      setBankAccountList(_bankAccountList)
    })()
  }, [withdrawAccounts])


  return(
    <StageContainer className="_identityComponent">
      {children} 
      <OptionInputContainer>
        {
          isEmpty(bankAccountList) ?
            <EmptyStateAccountList 
              handleAction={selectWithdrawAccount}
              {...props}
            />
          :
            <WithdtrawAccountList
              {...props}
              withdrawAccounts={bankAccountList}
              toastMessage={toastMessage}
              coinsendaServices={coinsendaServices}
              actions={actions}
              isMobile={isMobile}
              selectWithdrawAccount={selectWithdrawAccount}
            />
        }
      </OptionInputContainer>
    </StageContainer>
  )
}


