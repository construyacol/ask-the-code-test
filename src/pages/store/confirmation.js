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
import { history } from 'const/const'

function ConfirmationComponent({ data, balances }){

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
      provider:{  
         withdrawData, 
         setWithdrawData,
         setNetworkProvider
      },
      priority:{ currentPriority }
   } = props

   const [ labelState, setLabelState ] = useState('Preparando envío')
   const [ loading, setLoading ] = useState(false)
   const actions = useActions()

   const withdrawToBitrefill = async() => {
      setLoading(true)
      let withdrawAccount = withdraw_accounts[invoiceData?.paymentAddress]
      if (!withdrawAccount) { 
         setLabelState('Añadiendo cuenta de retiro')
         const body = {
            data:{
               country:current_wallet?.country,
               currency: current_wallet.currency,
               provider_type: withdrawProviders?.current?.provider_type,
               internal:withdrawProviders?.current?.internal || false,
               info_needed:createProviderInfoNeeded({ accountLabel:current_wallet.currency, accountAddress:invoiceData?.paymentAddress, provider_type:withdrawProviders?.current?.provider_type })
            }
         }
         console.log('withdrawAccount body', body)
         const { data } = await coinsendaServices.createWithdrawAccount(body);
         console.log('data', data)
         withdrawAccount = data
         await coinsendaServices.fetchWithdrawAccounts();
      }
      setLabelState('Transfiriendo fondos a Bitrefill')
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
      sessionStorage.setItem(`withdrawToBitrefill${current_wallet?.id}`, current_wallet.id);
      // if(withdrawData?.isEthereum) {
      //    const network_data = await getNetworkData()  
      //    bodyRequest.data.network_data = network_data
      //    bodyRequest.data.cost_information.gas_limit = gas_limit
      // } 
      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest);
      console.log(error, data)
      await sleep(1500)
      if(error){
         setLoading(false)
         return setLabelState('Probablemente no tienes fondos suficientes')
      }
      setLabelState('Esperando detección de fondos por bitrefill, esto puede tomar un momento')
   }

   useEffect(() => {
      let wProviders = withdrawProvidersByName[invoiceData?.paymentCurrency]
      wProviders && setNetworkProvider(prevState => ({...prevState, current:wProviders[invoiceData?.provider]}))
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(() => withdrawProviders.current && setWithdrawData(prevState => ({...prevState, amount:invoiceData?.paymentAmount})), [withdrawProviders])

   useEffect(() => {
      window.onmessage = function(e) {
        if (e.origin !== BITREFILL_BASE_URL) return;
        const invoiceData = JSON.parse(e.data)
        if(invoiceData?.event === 'invoice_update'){
            if(invoiceData?.status === 'payment_detected'){
               setLabelState('Pago detectado por bitrefill. Alcanzando confirmaciones necesarias... esto puede tomar algunos minutos')
            }
        };
      if(invoiceData?.event === 'invoice_complete'){
         setLoading(false)
         actions.renderModal(null);
      };
        console.log('|||||||||  FromBitRefillWebView ==> ', JSON.parse(e.data))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

   // useEffect(() => {
   //    if(withdrawProviders?.current)
   //    // withdrawToBitrefill()
   // }, [])
   console.log('ConfirmationTransfer', props)

   const goToWallet = () => {
         actions.renderModal(null);
         return history.push(`/wallets/deposit/${current_wallet.id}`);
   }

   return(
      <ModalLayout loading={loading}>
         <ConfirmationLayout>
            <p>{labelState}</p>
            <Button loading={loading} onClick={labelState.includes('Probablemente') ? goToWallet : withdrawToBitrefill} variant="contained" color="primary">
               {labelState.includes('Probablemente') ? 'Recargar cuenta' : 'Proceder'}
            </Button>
         </ConfirmationLayout>
      </ModalLayout>
   )
}

export default ConfirmationComponent

const WithdrawConfirm = withCryptoProvider(ConfirmationTransfer)