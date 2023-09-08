import { useEffect, useState } from 'react'
import { ModalLayout } from 'core/components/layout'
import { serveModelsByCustomProps } from 'selectors'
import { useSelector } from "react-redux";
import withCryptoProvider from 'components/hoc/withCryptoProvider'
import { WITHDRAW_PRIORITY_FEE } from 'const/const'
import { Button, H3 } from 'core/components/atoms';
import { createProviderInfoNeeded } from 'utils/withdrawProvider'
import { Content } from 'components/forms/widgets/success/styles'
// import { ConfirmationLayout } from './styles'
import { useActions } from 'hooks/useActions'
import sleep from 'utils/sleep';
import { isEmpty } from 'lodash'
import loadable from "@loadable/component";
import { getExportByName } from 'utils'
import BigNumber from 'bignumber.js';
import { InvoiceDataComponent, BitrefillPaymentProcess } from 'core/components/organisms'
import { HeaderContainer, ButtonsContainer } from 'core/components/shared/styles'
// import IconSwitch from "components/widgets/icons/iconSwitch"
import { Transfer } from 'components/widgets/icons'
import { ConfirmationContent, ModalContainer } from './styles'
import { 
   INVOICE_PAYMENT_CURRENCY, 
   BITREFILL_STATE, 
   BITREFILL_BASE_URL,
   INSUFFICIENT_FUNDS,
   // TRANSFERRING_FUNDS,
   PENDING_FUNDS
} from 'const/bitrefill'


const Withdraw2FaComponent = loadable(() => import('components/widgets/modal/render/withdraw2FAModal').then(getExportByName('Withdraw2FaComponent')));

function ConfirmationComponent(props){
    
   const { data, balances } = props
   const { paymentCurrency, paymentMethod } = data
   const walletsByCurrency = useSelector(({ modelData:{ wallets }}) => serveModelsByCustomProps(wallets, 'currency'));
   const currentWallet = walletsByCurrency ? walletsByCurrency[INVOICE_PAYMENT_CURRENCY[paymentCurrency]?.currency] : {}
   const currentBalance = (currentWallet && balances) && balances[currentWallet?.id]

   return(
      <>
      {
         (currentWallet && currentBalance) ?
            <WithdrawConfirm
                  defaultCostId={WITHDRAW_PRIORITY_FEE.high.value}
                  current_wallet={currentWallet}
                  balance={currentBalance}
                  invoiceData={{
                     ...data,
                     paymentCurrency:INVOICE_PAYMENT_CURRENCY[paymentCurrency]?.currency,
                     provider:INVOICE_PAYMENT_CURRENCY[paymentCurrency]?.method[paymentMethod]?.provider,
                  }}
                  {...props}
            />
         :
            <></>
      }
      </>
   )
}

function ConfirmationTransfer(props) {
   const {
      invoiceData,
      withdrawProvidersByName,
      withdrawProviders,
      withdraw_accounts,
      current_wallet,
      coinsendaServices,
      user,
      setReset,
      provider:{  
         withdrawData, 
         setWithdrawData,
         setNetworkProvider
      },
      priority:{ currentPriority }
   } = props

   const [ loading, setLoading ] = useState(false)
   const [ render2fa, setRender2fa ] = useState(false)
   // const [ labelState, setLabelState ] = useState('Preparando envío')
   const [ paymentState, setPaymentState ] = useState(BITREFILL_STATE.pending_funds)

   const actions = useActions()

   const closeAction = () => {
      setReset(true)
      actions.renderModal(null)
   }

   const setTowFaTokenAction = async(twoFaToken) => {
      setRender2fa(false)
      withdrawToBitrefill({ twoFaToken })
   }

   const goToWallet = async() => {
      actions.renderModal(null);
      const { history } = await import("const/const")
      return history.push(`/wallets/deposit/${current_wallet.id}`);
   }

   const withdrawToBitrefill = async({ twoFaToken }) => {
      setLoading(true)
      setPaymentState(BITREFILL_STATE.transferring_funds)
      const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
      if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken)return setRender2fa(true)
      let withdrawAccount = withdraw_accounts[invoiceData?.paymentAddress]
      if (!withdrawAccount) { 
         const body = {
            data:{
               country:current_wallet?.country,
               currency: current_wallet.currency,
               provider_type: withdrawProviders?.current?.provider_type,
               internal:withdrawProviders?.current?.internal || false,
               info_needed:createProviderInfoNeeded({ accountLabel:current_wallet.currency, accountAddress:invoiceData?.paymentAddress, provider_type:withdrawProviders?.current?.provider_type })
            }
         }
         const { data } = await coinsendaServices.createWithdrawAccount(body);
         withdrawAccount = data
         await coinsendaServices.fetchWithdrawAccounts();
      }
      let bodyRequest = {
         data: { 
         amount:withdrawData?.withdrawAmount?.toString(),
         account_id: current_wallet.id,
         withdraw_provider_id:withdrawProviders?.current?.id,
         withdraw_account_id: withdrawAccount?.id,
         cost_information:{ cost_id:currentPriority },
         country: user.country,
         }
      }
      console.log('bodyRequest ====> ', bodyRequest)
      sessionStorage.setItem(`withdrawToBitrefill${current_wallet?.id}`, current_wallet.id);
      // if(withdrawData?.isEthereum) {
      //    const network_data = await getNetworkData()  
      //    bodyRequest.data.network_data = network_data
      //    bodyRequest.data.cost_information.gas_limit = gas_limit
      // } 
      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest, twoFaToken);
      await sleep(4000)
      console.log('coinsendaServices_addWithdrawOrder ====> ', data, error)
      if(error){
         setLoading(false)
         return alert(error.message)
      }
      setPaymentState(BITREFILL_STATE.detecting_payment)
   }

   function handleBitrefillEvents(e) {
      if (e.origin !== BITREFILL_BASE_URL) return;
      const invoiceData = JSON.parse(e.data);
      if (invoiceData?.event === 'invoice_update') {
         if (invoiceData?.status === 'payment_detected') {
            setPaymentState(BITREFILL_STATE.payment_detected)
         }
      };
      if (invoiceData?.event === 'invoice_complete' || invoiceData?.event === 'payment_confirmed') actions.renderModal(null);
   }

   // 1. Inicialmente se setea el withdraw provider al hoc - controlador de retiro cripto
   useEffect(() => {
      let withdrawProviderData = withdrawProvidersByName[invoiceData?.paymentCurrency]
      if(withdrawProviderData) setNetworkProvider(prevState => ({...prevState, current:withdrawProviderData[invoiceData?.provider]}))
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   // 2. Una vez el controlador del cripto provider tiene un withdraw provider seteado, seteamos la cantidad de retiro para que el controlador pueda calcular demás criterios necesarios para conllevar el retiro en proceso
   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(() => !isEmpty(withdrawProviders.current) && setWithdrawData(prevState => ({...prevState, amount:invoiceData?.paymentAmount})), [withdrawProviders])

   // 3. Determino si hay fondos suficientes en la cuenta de origen
   useEffect(() => {
      if(new BigNumber(withdrawData?.amount).isGreaterThan(0)) withdrawData?.withdrawAmount.isEqualTo(0) && setPaymentState(BITREFILL_STATE[INSUFFICIENT_FUNDS]);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [withdrawData?.withdrawAmount])
  
   useEffect(() => {
   window.addEventListener('message', handleBitrefillEvents);
   return () => window.removeEventListener('message', handleBitrefillEvents);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   
   console.log('invoiceData', invoiceData?.invoiceId)

   return(
      <ModalLayout loading={true}>
         {
            render2fa ?
            <Withdraw2FaComponent
               isWithdraw2fa
               closeAction={closeAction}
               handleAction={setTowFaTokenAction}
            />
            :
            <ModalContainer rowGap="10px" maxWidth={600} className={`flex no-padding height-fit-content`}>
               <Content className="payment--content">
                  <HeaderContainer>
                     <Transfer
                        size={40}
                        color={'var(--primary)'}
                     />
                     <H3> 
                        {![INSUFFICIENT_FUNDS, PENDING_FUNDS].includes(paymentState.status) ? 'Procesando pago a Bitrefill' : 'Confirmación de pago'}
                     </H3>
                  </HeaderContainer>

                  <ConfirmationContent>
                     <InvoiceDataComponent 
                        invoiceData={invoiceData} 
                        withdrawData={withdrawData}
                        current_wallet={current_wallet}   
                        status={paymentState.status}
                        handleAction={goToWallet}
                     />
                     <BitrefillPaymentProcess
                        paymentState={paymentState}
                        visible={![INSUFFICIENT_FUNDS, PENDING_FUNDS].includes(paymentState.status)}
                     />
                  </ConfirmationContent>

                  <ButtonsContainer marginTop={30}>
                     <Button disabled={loading} onClick={closeAction}  color="primary">
                        Cancelar
                     </Button>
                     <Button 
                        // loading={loading} 
                        disabled={loading || [INSUFFICIENT_FUNDS].includes(paymentState.status)} 
                        onClick={[INSUFFICIENT_FUNDS].includes(paymentState.status) ? goToWallet : withdrawToBitrefill} 
                        variant="contained" 
                        color="primary"
                     >  
                        {loading ? 'Pagando...' : 'Proceder'}
                     </Button>
                  </ButtonsContainer>
               </Content>
            </ModalContainer>
         }
      </ModalLayout>
   )
}

export default ConfirmationComponent

const WithdrawConfirm = withCryptoProvider(ConfirmationTransfer)


