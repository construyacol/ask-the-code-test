import { useEffect, useState } from 'react'
import { ModalLayout } from 'core/components/layout'
import { serveModelsByCustomProps } from 'selectors'
import { useSelector } from "react-redux";
import withCryptoProvider from 'components/hoc/withCryptoProvider'
import { WITHDRAW_PRIORITY_FEE } from 'const/const'
import { Button } from 'core/components/atoms';
import { createProviderInfoNeeded } from 'utils/withdrawProvider'
import { INVOICE_PAYMENT_CURRENCY } from 'const/bitrefill'
import { ConfirmationLayout } from './styles'
import { BITREFILL_BASE_URL } from 'const/bitrefill'
import { useActions } from 'hooks/useActions'
import sleep from 'utils/sleep';
import { isEmpty } from 'lodash'
import { history } from 'const/const'
import loadable from "@loadable/component";
import { getExportByName } from 'utils'


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
   const [ labelState, setLabelState ] = useState('Preparando envío')
   const actions = useActions()

   const closeAction = () => {
      setReset(true)
      actions.renderModal(null)
   }

   const setTowFaTokenAction = async(twoFaToken) => {
      setRender2fa(false)
      withdrawToBitrefill({ twoFaToken })
   }

   const goToWallet = () => {
      actions.renderModal(null);
      return history.push(`/wallets/deposit/${current_wallet.id}`);
   }

   const withdrawToBitrefill = async({ twoFaToken }) => {
      if(withdrawData?.withdrawAmount.isEqualTo(0)) return setLabelState('No tienes fondos suficientes');
      setLoading(true)
      const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
      if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken)return setRender2fa(true)
      let withdrawAccount = withdraw_accounts[invoiceData?.paymentAddress]
      if (!withdrawAccount) { 
         setLabelState('Añadiendo cuenta de retiro')
         await sleep(1500)
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
      setLabelState('Transfiriendo fondos a Bitrefill')
      await sleep(1500)
      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest, twoFaToken);
      console.log('coinsendaServices_addWithdrawOrder ====> ', data, error)
      if(error){
         setLoading(false)
         return setLabelState(error.message)
      }
      setLabelState('Esperando detección de fondos por bitrefill, esto puede tomar un momento')
   }

   function handleBitrefillEvents(e) {
      if (e.origin !== BITREFILL_BASE_URL) return;
      const invoiceData = JSON.parse(e.data);
      if (invoiceData?.event === 'invoice_update') {
         if (invoiceData?.status === 'payment_detected') {
            setLabelState('Pago detectado por bitrefill. Alcanzando confirmaciones necesarias... esto puede tomar algunos minutos');
         }
      };
      if (invoiceData?.event === 'invoice_complete' || invoiceData?.event === 'payment_confirmed') actions.renderModal(null);
      console.log('|||||||||  FromBitRefillWebView_handleEvent ==> ', invoiceData);
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
  
   useEffect(() => {
   window.addEventListener('message', handleBitrefillEvents);
   return () => window.removeEventListener('message', handleBitrefillEvents);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);



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
            <ConfirmationLayout>
               <p>{labelState}</p>
               <Button loading={loading} onClick={labelState.includes('No tienes fondos') ? goToWallet : withdrawToBitrefill} variant="contained" color="primary">
                  {labelState.includes('No tienes fondos') ? 'Recargar cuenta' : 'Proceder'}
               </Button>
               <Button disabled={loading} onClick={closeAction} variant="outlined" color="primary">
                  Cancelar
               </Button>
            </ConfirmationLayout>
         }
      </ModalLayout>
   )
}

export default ConfirmationComponent

const WithdrawConfirm = withCryptoProvider(ConfirmationTransfer)
