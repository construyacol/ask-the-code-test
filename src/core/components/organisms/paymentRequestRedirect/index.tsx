import { useState, useEffect } from 'react' 
import { CtasContainer } from './styles'
import { ModalLayout } from 'core/components/layout'
import { CrudContainer } from 'core/components/molecules/modalCrud/styles'
import { IconClose } from "components/widgets/shared-styles";
import IconSwitch from "components/widgets/icons/iconSwitch";
import { HeaderContainer, ContentContainer } from 'pages/paymentRequest/styles'
import { P, H3, Button } from 'core/components/atoms'
import { getAllUrlParams } from "utils/urlUtils";
import { PaymentRequestParams } from 'interfaces/paymentRequest';
import { AmountUiView } from 'core/components/molecules'
import { replaceToCurrency } from 'core/config/currencies'
import { history } from "const/const"
import { useActions } from "hooks/useActions";
import { checkIfFiat } from 'core/config/currencies';
import { useWalletInfo } from 'hooks/useWalletInfo'

type PaymentRequestRedirectProps = {
   paymentRequestLink:string,
   callback?: (value: any) => void
}

const PaymentRequestRedirect = ({ paymentRequestLink, callback }:PaymentRequestRedirectProps) => {

   const [ paymentRequest, setPaymentRequest ] = useState<PaymentRequestParams>({} as PaymentRequestParams)
   const actions = useActions();
   const walletInfo = useWalletInfo()
   
   const getAddress = () => {
      const { currentWallet } = walletInfo
      if(checkIfFiat(currentWallet?.currency)){
         callback && callback(paymentRequest)
      }else{
         history.push("?network=internal_network&address="+paymentRequest.recipient)
      }
      actions.renderModal(null);
   }
   const proceedWithPayment = () => window.location.replace(paymentRequestLink);
 
   useEffect(() => {
      if(paymentRequestLink){
         const params = getAllUrlParams(paymentRequestLink)
         setPaymentRequest(params.paymentRequest)
      }
   }, [paymentRequestLink])

   const uiCurrencyName = paymentRequest?.currency ? replaceToCurrency({ currency:paymentRequest?.currency }) : ''

   return(
      <ModalLayout>
         <CrudContainer rowGap="10px" className={`medium flex`}>
         <IconClose theme="dark" size={20} />
         <HeaderContainer>
            <IconSwitch
               icon={"qr"}
               size={35}
               color={'var(--primary)'}
            />
            <H3>Se ha detectado una solicitud de pago</H3>
         </HeaderContainer>

         <ContentContainer>
               
               <P className={"no-margin"}>
                  Solicitud de pago creada por <strong>{paymentRequest?.metaData?.userName}</strong>
                  {paymentRequest.amount ? <AmountUiView amount={paymentRequest.amount} uiCurrencyName={uiCurrencyName}/> : ''}
               </P>
               <P className={"no-margin"}>Puedes proceder con la solicitud de pago u obtener la dirección del destinatario. ¿Que deseas hacer?</P>
               
               <CtasContainer className="align-center" marginTop={30}>
                  <Button className="fit" size="medium" variant="outlined" color={"primary"} onClick={getAddress}> 
                     Obtener dirección
                  </Button> 
                  <Button className="fit" size="medium" variant="contained" color={"primary"} onClick={proceedWithPayment}> 
                     Proceder con el pago
                  </Button> 
               </CtasContainer>
            </ContentContainer>

         </CrudContainer>
      </ModalLayout>
   )
}

export default PaymentRequestRedirect


