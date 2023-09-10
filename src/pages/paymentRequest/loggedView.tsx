import { useState, useRef, useEffect } from 'react'
import { Button, P } from 'core/components/atoms'
import { loggedViewProps, doPaymentProps } from 'interfaces/paymentRequest';
import { walletprops } from  'interfaces/state'
import { useSelector } from "react-redux";
import { modelDataProps } from 'interfaces/state'
import { serveModelsByCustomProps, wProvsByCurrencyNetwork, selectWAccountsByAddressProvType } from 'selectors'
import useViewport from 'hooks/useViewport'
// import loadable from "@loadable/component";
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
import { ButtonsContainer } from 'core/components/shared/styles'
import { formatToCurrency } from "utils/convert_currency";
import { amountValidation, parseToOnlyNumbers } from 'utils/validations'
import { replaceToCurrency } from 'core/config/currencies'
// import BigNumber from 'bignumber.js';
import AvailableBalance from 'components/widgets/availableBalance'
import { HR } from 'components/widgets/headerAccount/styles'
import { OPERATIONAL_LEVELS } from 'const/levels'
// import useToastMessage from "hooks/useToastMessage";


interface providerProps {
   [key: string]: any
}

const ERRORS_TYPES = {
   error: true,
   insufficient: true, 
}

// const LazySocket = loadable(() => import(/* webpackPrefetch: true */ "components/sockets/sockets"));
// const LazyToast = loadable(() => import(/* webpackPrefetch: true */ "components/widgets/toast/ToastContainer"));

const IsLoggedView = ({ 
   currency, 
   amount, 
   paymentRequest, 
   children, 
   setAmount, 
   actions, 
   rejectRequest,
   user,
   isLoading,
   setIsLoading
}:loggedViewProps) => {

   const [ stageStatus, setStageStatus ] = useState<string>("")
//   const [toastMessage] = useToastMessage();
   const inputRef = useRef<HTMLInputElement>(null)

   //@ts-ignore
   const walletsByCurrencies = useSelector(({ modelData:{ wallets }}:modelDataProps) => serveModelsByCustomProps(wallets, 'currency'));
   //@ts-ignore   
   const balancesByCurrencies = useSelector(({ modelData:{ balances }}:modelDataProps) => serveModelsByCustomProps(balances, 'currency'));
   const { isMobile } = useViewport()
   const wallet:walletprops = walletsByCurrencies[currency as keyof typeof walletsByCurrencies]
   const balance:walletprops = balancesByCurrencies[currency as keyof typeof balancesByCurrencies]
   //@ts-ignore
   const withdrawProvidersByType:providerProps = useSelector((state) => wProvsByCurrencyNetwork(state, wallet?.currency));
   //@ts-ignore
   const withdrawAccounts:providerProps = useSelector((state) => selectWAccountsByAddressProvType(state, withdrawProvidersByType?.internal_network));
   //@ts-ignore
   const accountName = replaceToCurrency({ currency:wallet?.currency, sourceName:wallet?.name })

   const handleMaxAvailable = (e:any) => paymentAmountOnChange({target:{value:e}})

   const paymentAmountOnChange = async(e:any) => { 
      let _value = parseToOnlyNumbers(e.target.value)
      if(!_value){
         setStageStatus("")
         // setAmount(new BigNumber(0))
         return e.target.value = "";
      }
      let _amount = formatToCurrency(_value, currency)
      const max_amount = formatToCurrency(balance?.available, currency)
      const [ finalAmount, state ] = amountValidation(_amount, { provider:{ max_amount } })
      setAmount(finalAmount)
      setStageStatus(state)
      if(inputRef?.current) inputRef.current.value = finalAmount.toFormat();
   }

   const goToDesposit = async() => {
      const { history } = await import("const/const")
      history.push(OPERATIONAL_LEVELS.includes(user?.level) ? `/wallets/deposit/${wallet?.id}` : '/settings/kyc')
      actions.isAppLoaded(true);
   }


   const doPayment = async({ twoFaToken }:doPaymentProps) => {
      setIsLoading(true)
      const { mainService } = await import('services/MainService')
      const twoFactorIsEnabled = await mainService.userHasTransactionSecurity();

      if(twoFactorIsEnabled["2fa"]?.enabled && !twoFaToken){
         const withdrawSecurityModule = await import("components/widgets/modal/render/withdraw2FAModal");
         const WithdrawSecurity2fModal = withdrawSecurityModule.default;
         setIsLoading(false)
         return actions.renderModal(() => (
               <WithdrawSecurity2fModal
               cancelAction={() => actions.renderModal(null)}
               isWithdraw2fa
               callback={doPayment}
            />
         ));
      }
      if(twoFaToken) actions.renderModal(null); 
      const { ApiPostCreateFiatWithdraw } = await import('components/forms/widgets/fiatWithdraw/api')
      const withdrawProvider = withdrawProvidersByType?.internal_network
      const existWAccount = withdrawAccounts[paymentRequest?.recipient] || {}
      const withdrawAccount = {
         identifier:paymentRequest?.recipient,
         id_type:"email",
         uiName:paymentRequest?.recipient,
         ...existWAccount
      }
      const { error, data } = await ApiPostCreateFiatWithdraw({
        currentWallet: wallet, 
        withdrawProvider,
        twoFaToken,
        withdrawAmount: amount?.toString(),
        withdrawAccount
      }) 
      setIsLoading(false)
      if(error){
         return 
      //   return toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
      }
      await renderSuccessComponent(data)
   }

   const callback = async() => {
      const { history } = await import("const/const")
      const { ROUTES } = await import("const/routes")
      history.push(`${ROUTES.default}/activity/${wallet?.id}/withdraws`)
      actions.isAppLoaded(true);
   }

   const renderSuccessComponent = async(withdrawData:any) => {
      const Element = await import(`components/forms/widgets/fiatWithdraw/success`)
      if(!Element) return;
      const WithdrawCreatedSuccess = Element.default
      actions.success_sound();
      actions.renderModal(() => <WithdrawCreatedSuccess callback={callback} withdrawData={withdrawData} />);
   }

   useEffect(() => {
      if(balance?.available) paymentAmountOnChange({target:{value:amount?.toString()}})
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [balance?.available])

   const inputValidation = !paymentRequest?.amount && stageStatus !== 'insufficient'

   return(
      <>
         {
            user?.id ?
            <>
               {/* @ts-ignore */}
               {/* <LazySocket toastMessage={toastMessage} /> */}
            </>
            :<></>
         }
         <IsLoggedLayout>
            {
               (((!paymentRequest?.amount && stageStatus === 'insufficient' && amount?.isGreaterThan(0)) || inputValidation) && OPERATIONAL_LEVELS.includes(user?.level)) ?
               <InputComponent
                  className="input__fit"
                  onChange={paymentAmountOnChange} 
                  inputStatus={stageStatus}
                  // value={value}
                  refEl={inputRef}
                  inputMode="numeric"
                  name={"amount"} 
                  label={"Ingresa la cantidad que deseas pagar"}
                  placeholder={"Escribe aquí la cantidad"}
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
               (wallet && OPERATIONAL_LEVELS.includes(user?.level)) ?
                  <>
                     <ItemAccountContainer className={`${stageStatus} itemAccountContainer`}>
                        {!isMobile && <span/>}
                        
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
                              <ButtonsContainer className="insufficient __buttonsContainer--insufficient">
                                 <HR/>
                                 <Button onClick={goToDesposit} size="small" variant="outlined" color={"primary"}> 
                                    Depositar
                                 </Button>
                              </ButtonsContainer>
                              : !isMobile &&
                              <RightSection 
                                 isMovilViewport={false}
                                 account={wallet}
                              />
                        }
                     </ItemAccountContainer>
                  </>
               :
               (!isLoading && !OPERATIONAL_LEVELS.includes(user?.level)) ?
                  <P>Completa tu verificación de identidad para poder realizar este pago...</P>
               :
                  <>
                     <AccountItemSkeleton className="itemAccountContainer"/>
                  </>
            }
         </IsLoggedLayout>

         {children}

         <ButtonsContainer>
            <Button 
               onClick={doPayment}
               disabled={!stageStatus || ERRORS_TYPES[stageStatus as keyof typeof ERRORS_TYPES]} 
               variant="contained" 
               color={"primary"}
               loading={user?.level && isLoading}
            > 
               Pagar
            </Button>
            <Button 
               disabled={!user?.level || isLoading} 
               size="large" 
               variant="text" 
               color={"primary"} 
               onClick={rejectRequest}
            > 
               { (!OPERATIONAL_LEVELS.includes(user?.level) && !isLoading) ? 'Completar verificación' : 'Cancelar solicitud'}
            </Button>
         </ButtonsContainer>
      </>
   )
 }
//  <CurrencyLabel>{parseSymbolCurrency(currency?.symbol) || '-'}</CurrencyLabel>

 export default IsLoggedView

 