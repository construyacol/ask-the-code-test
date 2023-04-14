import { useState } from 'react'
import { Button } from 'core/components/atoms'
import { loggedViewProps } from 'interfaces/paymentRequest';
import { useSelector } from "react-redux";
import { modelDataProps } from 'interfaces/state'
import { serveModelsByCustomProps } from 'selectors'
import useViewport from 'hooks/useViewport'
import { 
   ItemAccountContainer,
   MobileBalanceComponent,
   RightSection,
   AccountItemSkeleton
} from 'components/widgets/accountList/listView'
import {
   HeaderMainContainer,
   IconAccount,
   LabelContainer,
   AccountLabel,
   CurrencyLabel
} from 'components/widgets/headerAccount/styles'
import IconSwitch from "components/widgets/icons/iconSwitch"
import { parseSymbolCurrency } from 'core/config/currencies'
import { IsLoggedLayout } from './styles'
import InputComponent from 'components/forms/widgets/kyc/InputComponent'
import { ButtonsContainer } from './styles'
import { formatToCurrency } from "utils/convert_currency";
import { amountValidation, parseToOnlyNumbers } from 'utils/validations'
import { replaceToCurrency } from 'core/config/currencies'
import BigNumber from 'bignumber.js';
import AvailableBalance from 'components/widgets/availableBalance'



import { HR } from 'components/widgets/headerAccount/styles'

interface walletprops {
   id: string,
   [key: string]: any
}

const ERRORS_TYPES = {
   error: true,
   insufficient: true,
}

const IsLoggedView = ({ currency, amount, paymentRequest, children, setAmount }:loggedViewProps) => {
   const [ stageStatus, setStageStatus ] = useState<string>("")
   //@ts-ignore
   const walletsByCurrencies = useSelector(({ modelData:{ wallets }}:modelDataProps) => serveModelsByCustomProps(wallets, 'currency'));
   const { isMobile } = useViewport()
   const wallet:walletprops = walletsByCurrencies[currency as keyof typeof walletsByCurrencies]
   //@ts-ignore
   const accountName = replaceToCurrency({ currency:wallet?.currency, sourceName:wallet?.name })
   const handleMaxAvailable = (e:any) => paymentAmountOnChange({target:{value:e}})
   const paymentAmountOnChange = async(e:any) => { 
      let _value = parseToOnlyNumbers(e.target.value)
      if(!_value){
         setStageStatus("")
         setAmount(new BigNumber(0))
         return e.target.value = "";
      }
      let _amount = formatToCurrency(_value, currency)
      const max_amount = formatToCurrency(wallet?.available, currency)
      const [ finalAmount, state ] = amountValidation(_amount, { provider:{ ...wallet, max_amount } })
      e.target.value = finalAmount.toFormat()
      setAmount(finalAmount)
      setStageStatus(state)
   }

   return(
      <>
         <IsLoggedLayout>
            {
               !paymentRequest?.amount ?
               <InputComponent
                  className="input__fit"
                  onChange={paymentAmountOnChange} 
                  inputStatus={stageStatus}
                  // value={value}
                  inputMode="numeric"
                  name={"amount"} 
                  label={"Ingresa la cantidad que deseas pagar"}
                  placeholder={"Enter amount"}
                  type={"text"}
                  // setStageData={setStageData}
                  AuxComponent={[wallet?.available ? () => (
                  //@ts-ignore
                  <AvailableBalance
                     id={wallet?.id}
                     handleAction={handleMaxAvailable} 
                     amount={wallet?.available || 0}
                  />):() => null]}
               />
               :<></>
            }
            {
               !wallet ?
               <>
                  <AccountItemSkeleton className="itemAccountContainer"/>
               </>
               :
               <>
                  <ItemAccountContainer className={`${stageStatus} itemAccountContainer`}>
                     <span></span>
                     <HeaderMainContainer className="_accountHeaderMainContainer">
                        <IconAccount className="onAccountList fit">
                           <IconSwitch
                              icon={wallet?.currency}
                              size={30}
                           />
                        </IconAccount>
                        <LabelContainer className="_header__labelContainer">
                           <AccountLabel className="wallet accountLabel">{accountName || 'Mi billetera'}</AccountLabel>
                           { 
                              isMobile ?
                                 <MobileBalanceComponent
                                    account={wallet}
                                 />
                              :
                              <CurrencyLabel className={stageStatus}>
                                 {stageStatus === "insufficient" ? "Fondos insuficientes" : (parseSymbolCurrency(wallet?.currency) || '-')}
                              </CurrencyLabel>
                           }
                        </LabelContainer> 
                     </HeaderMainContainer>
                     {
                        stageStatus === "insufficient" ?
                           <ButtonsContainer className="insufficient">
                              <HR/>
                              <Button size="large" variant="outlined" color={"primary"}> 
                                 Depositar
                              </Button>
                           </ButtonsContainer>
                           :
                           <RightSection 
                              isMovilViewport={false}
                              account={wallet}
                           />
                     }
                  </ItemAccountContainer>
               </>
            }
         </IsLoggedLayout>

         {children}

         <ButtonsContainer>
            <Button disabled={!stageStatus || ERRORS_TYPES[stageStatus as keyof typeof ERRORS_TYPES]} variant="contained" color={"primary"}> 
               Pagar
            </Button>
            <Button size="large" variant="text" color={"primary"}> 
               Cancelar solicitud
            </Button>
         </ButtonsContainer>
      </>
   )
 }
//  <CurrencyLabel>{parseSymbolCurrency(currency?.symbol) || '-'}</CurrencyLabel>

 export default IsLoggedView