import { useEffect } from 'react'
import { ModalLayout } from 'core/components/layout'
import { serveModelsByCustomProps } from 'selectors'
import { useSelector } from "react-redux";
import withCryptoProvider from 'components/hoc/withCryptoProvider'
import { WITHDRAW_PRIORITY_FEE } from 'const/const'
import { Button } from 'core/components/atoms';
import { createProviderInfoNeeded } from 'utils/withdrawProvider'
import { INVOICE_PAYMENT_CURRENCY } from 'const/bitrefill'
import { ConfirmationLayout } from './styles'


function ConfirmationComponent({ data, balances }){

    const { paymentCurrency, paymentMethod } = data
    const walletsByCurrency = useSelector(({ modelData:{ wallets }}) => serveModelsByCustomProps(wallets, 'currency'));
    const currentWallet = walletsByCurrency ? walletsByCurrency[INVOICE_PAYMENT_CURRENCY[paymentCurrency]?.currency] : {}
    const currentBalance = (currentWallet && balances) && balances[currentWallet?.id]

    return(
        <ModalLayout loading={true}>
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
        </ModalLayout>
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

   useEffect(() => {
      let wProviders = withdrawProvidersByName[invoiceData?.paymentCurrency]
      wProviders && setNetworkProvider(prevState => ({...prevState, current:wProviders[invoiceData?.provider]}))
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(() => withdrawProviders.current && setWithdrawData(prevState => ({...prevState, amount:invoiceData?.paymentAmount})), [withdrawProviders])
   // useEffect(() => {
   //    if(withdrawProviders?.current)
   //    // withdrawToBitrefill()
   // }, [])
   console.log('ConfirmationTransfer', props)

   // useEffect(() => {
   //    const { 
   //       availableBalance, 
   //       fixedCost, 
   //       minAmount, 
   //       totalBalance, 
   //       amount,
   //       total,
   //       withdrawAmount
   //    } = withdrawData
   //    console.log('---------------------------------------------')
   //    console.log('withdrawData', withdrawData)
   //    console.log('total', total.toFixed())
   //    console.log('withdrawAmount', withdrawAmount?.toFixed())
   //    console.log('amount', amount)
   //    console.log('availableBalance', availableBalance.toFixed())
   //    console.log('totalBalance', totalBalance.toFixed())
   //    console.log('fixedCost', fixedCost.toFixed())
   //    console.log('minAmount', minAmount.toFixed())
   // }, [withdrawData])

   const withdrawToBitrefill = async() => {
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
         console.log('withdrawAccount body', body)
         const { data } = await coinsendaServices.createWithdrawAccount(body);
         console.log('data', data)
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
      sessionStorage.setItem(`withdrawToBitrefill${current_wallet?.id}`, current_wallet.id);
      // if(withdrawData?.isEthereum) {
      //    const network_data = await getNetworkData()  
      //    bodyRequest.data.network_data = network_data
      //    bodyRequest.data.cost_information.gas_limit = gas_limit
      // } 
      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest);
      console.log('withdrawAccount addWithdrawOrder', error, data)
   }

   return(
      <ConfirmationLayout>
         <p>ConfirmationTransfer</p>
         <Button onClick={withdrawToBitrefill} variant="contained" color="primary">Confirmar envío</Button>
      </ConfirmationLayout>
   )
}

export default ConfirmationComponent

const WithdrawConfirm = withCryptoProvider(ConfirmationTransfer)