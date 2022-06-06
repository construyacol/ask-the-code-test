import { useLayoutEffect, useRef } from 'react'
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
    const { isMovilViewport } = useViewport()
    const balanceTextWidth = useRef(currentWallet?.available?.length > 1 ? '150px' : '50px')

    useLayoutEffect(() => {
      // const _balanceTextWidth = document.querySelector(".BalanceComponent .textin")?.clientWidth
      // balanceTextWidth.current = `${(currentWallet?.available?.length + 1)*16}px`
    })

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
            width={`${balanceTextWidth?.current}`}
          >
            <HR/>
            <BalanceComponent 
              account_id={currentWallet?.id} 
            />
          </BalanceContainer>
      </HeaderMainContainer>
    )
}