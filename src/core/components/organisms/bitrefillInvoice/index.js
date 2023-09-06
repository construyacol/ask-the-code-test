import { InvoiceLayout, PaymentDetailContainer } from './styles'
import { 
    ItemAccountContainer,
    MobileBalanceComponent,
    // RightSection,
    // AccountItemSkeleton
} from 'components/widgets/accountList/listView'
import { INSUFFICIENT_FUNDS } from 'const/bitrefill'
import {
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
    CurrencyLabel
} from 'components/widgets/headerAccount/styles'
import { replaceToCurrency } from 'core/config/currencies'
import IconSwitch from "components/widgets/icons/iconSwitch"
import useViewport from 'hooks/useViewport'
import { ButtonsContainer } from 'core/components/shared/styles'
import { HR } from 'components/widgets/headerAccount/styles'
import { Button, P } from 'core/components/atoms'
import { PaymentDetail } from 'core/components/molecules'


export default function InvoiceDataComponent({ current_wallet, withdrawData, invoiceData, status, handleAction }){

   const accountName = replaceToCurrency({ currency:current_wallet?.currency, sourceName:current_wallet?.name })
   const uiCurrencyName = replaceToCurrency({ currency:current_wallet?.currency })
   const { isMobile } = useViewport()

    return(
        <InvoiceLayout>
            <P>Cuenta de origen:</P>
            <ItemAccountContainer className={`${status} itemAccountContainer`}>
                {!isMobile && <span/>}
                <HeaderMainContainer className="_accountHeaderMainContainer">
                    <IconAccount className="onAccountList fit">
                        <IconSwitch
                            icon={current_wallet?.currency}
                            size={30}
                        />
                    </IconAccount>
                    <LabelContainer className="_header__labelContainer">
                        <AccountLabel className="wallet accountLabel">{accountName || 'Mi billetera'}</AccountLabel>
                        { 
                            isMobile ?
                            <MobileBalanceComponent
                                account={current_wallet}
                            />
                            :
                            <CurrencyLabel className={status}>
                            {status === INSUFFICIENT_FUNDS ? "Fondos insuficientes" : (uiCurrencyName || '-')}
                            </CurrencyLabel>
                        }
                    </LabelContainer> 
                </HeaderMainContainer>
                {
                    status === INSUFFICIENT_FUNDS ?
                    <ButtonsContainer className="insufficient __buttonsContainer--insufficient">
                        <HR/>
                        <Button onClick={handleAction} size="small" variant="contained" color={"primary"}> 
                            {isMobile ? 'Depositar' : 'Cargar cuenta'}
                        </Button>
                    </ButtonsContainer>
                    :
                    <></>
                }
            </ItemAccountContainer>
            <PaymentDetailContainer>
                <PaymentDetail 
                    amount={withdrawData.amount}
                    cost={withdrawData?.fixedCost?.toString()}
                    uiCurrencyName={uiCurrencyName}
                />
            </PaymentDetailContainer>
        </InvoiceLayout>
    )
}