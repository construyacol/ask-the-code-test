import { useEffect } from 'react'
import { StageContainer, OptionInputContainer } from '../../sharedStyles'
import loadable from "@loadable/component";
import { useActions } from 'hooks/useActions'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import useToastMessage from "hooks/useToastMessage";
import useViewport from 'hooks/useViewport'
import { isEmpty } from 'lodash'

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


  return(
    <StageContainer className="_identityComponent">
      {children} 
      <OptionInputContainer>
        {
          isEmpty(withdrawAccounts) ?
            <EmptyStateAccountList 
              handleAction={selectWithdrawAccount}
              {...props}
            />
          :
            <WithdtrawAccountList
              withdrawAccounts={withdrawAccounts}
              toastMessage={toastMessage}
              coinsendaServices={coinsendaServices}
              actions={actions}
              isMobile={isMobile}
              selectWithdrawAccount={selectWithdrawAccount}
              {...props}
            />
        }
      </OptionInputContainer>
    </StageContainer>
  )
}


