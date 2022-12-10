// import { useLayoutEffect, useRef } from 'react'
import {
    HeaderContainer,
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
    CurrencyLabel,
    BalanceContainer,
    HR
} from './styles'

import BalanceComponent from "../balance/balance";
import { useWalletInfo } from "../../../hooks/useWalletInfo";
import IconSwitch from '../icons/iconSwitch'
import useViewport from '../../../hooks/useWindowSize'


export default function HeaderAccount (props) {
    return(
      <HeaderContainer>
        {props.children}
        <MainComponent/>
      </HeaderContainer>
    )
}



export const MainComponent = () => {

    const { currentWallet } = useWalletInfo()
    // const { available } = currentWallet
    const { isMovilViewport } = useViewport()
    // const balanceTextWidth = useRef(currentWallet?.available?.length > 1 ? '150px' : '60px')

    return(
      <HeaderMainContainer className="_accountHeaderMainContainer">
          <IconAccount>
            <IconSwitch
                icon={currentWallet?.currency?.currency}
                size={isMovilViewport ? 20 : 35}
            />
          </IconAccount>
          <LabelContainer className="_header__labelContainer">
            <AccountLabel>{currentWallet?.name || 'Mi billetera'}</AccountLabel>
            <CurrencyLabel>{currentWallet?.currency?.currency || '-'}</CurrencyLabel>
          </LabelContainer>
          <BalanceContainer  
            className="_accountBalanceContainer"
            // width={`${available?.length > 1 ? available?.length * 16 : '60' }px`}
          >
            <HR/>
            <BalanceComponent 
              account_id={currentWallet?.id} 
            />
          </BalanceContainer>
      </HeaderMainContainer>
    )
}