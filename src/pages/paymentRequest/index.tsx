import { useEffect, useState } from 'react'
import { CrudContainer } from 'core/components/molecules/modalCrud/styles'
import IconSwitch from "components/widgets/icons/iconSwitch";
import { SPAN, H3, P, Button } from 'core/components/atoms'
import { 
   PaymentRequestParams,
   errProps,
   AmountProps,
   UserRecipientProps,
} from 'interfaces/paymentRequest';
import { SESSION_ERROR } from 'const/session'
import { REPLACE_TO_CURRENCY_CONFIG, replaceTo } from 'core/config/currencies'
import { formatToCurrency } from "utils/convert_currency";

import { validateExpTime, getUserToken } from 'utils/handleSession'
import { useActions } from "hooks/useActions";

import IsLoggedView from './loggedView'
import UnLoggedView from './unLoggedView'
import PaymentDetail from './paymentDetail'
import SkeletonView from './skeletonView'
import { replaceToCurrency } from 'core/config/currencies'



import BigNumber from 'bignumber.js';

//styles
import { 
   PaymentRequestLayout, 
   HeaderContainer, 
   ContentContainer
} from './styles'

import { Content } from 'components/forms/widgets/success/styles'


const PaymentRequestView = (props:any) => {

   //TODO: Crear selector para no tener que cargar todo el modelo de usuario en el store desde el inicio
   const [ isLogged, setIsLogged ] = useState(false)
   const [ isLoading, setIsLoading ] = useState(true)
   const [ paymentRequest ] = useState<PaymentRequestParams>(props?.location?.state?.paymentRequest)
   const { currency, metaData } = paymentRequest
   const [ amount, setAmount ] = useState<BigNumber>(formatToCurrency(paymentRequest?.amount ? `${paymentRequest?.amount}`.replace(/,/g, "") : 0, currency))
   const uiCurrencyName = replaceToCurrency({ currency })
   const actions = useActions()
   const handleSession = (props:errProps) => SESSION_ERROR.REFRESH_TOKEN_EXPIRED !== props?.error && setIsLogged(true);
   //TODO: Crear selector con authdata para colocar como dependencia y actualizar el tiempo de validación 
   useEffect(() => { 
      (async() => {
         setIsLoading(true)
         try {
            await validateExpTime(handleSession) 
         } finally {
            setIsLoading(false)
         }
      })()
   }, [])
   useEffect(() => {
      (async() => {
         if(!isLogged)return;
         const userData = await getUserToken();
         if(!userData){return console.log('Error obteniendo el token::48 Root.js')}
         const { userToken, decodedToken } = userData
         actions.setAuthData({
            userToken,
            userEmail: decodedToken.email,
            userId: decodedToken.usr
         });
         const { mainService } = await import('services/MainService')
         await mainService.loadFirstEschema();
         await mainService.fetchCompleteUserData();
         await mainService.init();
      })()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLogged])

   const RenderContentComponent = (isLoading && !isLogged) ? SkeletonView : isLogged ? IsLoggedView : UnLoggedView
   // console.log('PaymentRequestViewamount', amount, isLogged)

   return(
      <PaymentRequestLayout>
         <CrudContainer rowGap="10px" className={`large flex no-padding`}>
            <Content className="payment--content">
               <HeaderContainer>
                  <IconSwitch
                     icon={"qr"}
                     size={35}
                     color={'var(--primary)'}
                  />
                  <H3> 
                     Solicitud de pago 
                     {metaData?.userName ? <UserRecipient metaData={metaData}/> : ''}
                  </H3>
               </HeaderContainer>
               <ContentContainer style={{rowGap:"30px"}}>
                  <P className={'no-margin'}>
                     {metaData?.userName} te ha enviado una solicitud de pago
                     {paymentRequest.amount ? <AmountUiView amount={amount.toFormat()} uiCurrencyName={uiCurrencyName}/> : ''}
                     {isLogged ? <>. Para realizar el pago, puedes utilizar los fondos de tu billetera <strong>{uiCurrencyName}</strong> </> : ''}
                  </P>
                  
                  <RenderContentComponent  
                     currency={currency}
                     amount={amount}
                     setAmount={setAmount}
                     paymentRequest={paymentRequest}
                  >
                     <PaymentDetail 
                        amount={amount}
                        paymentRequest={paymentRequest}
                        uiCurrencyName={uiCurrencyName}
                     />
                  </RenderContentComponent>
               </ContentContainer>
               
            </Content>
         </CrudContainer>
      </PaymentRequestLayout>
   )
}

export default PaymentRequestView




const UserRecipient = ({ metaData }:UserRecipientProps) => <SPAN>&nbsp;de {metaData?.userName}</SPAN>
const AmountUiView = ({amount, uiCurrencyName}:AmountProps) => {
   if(!amount)return null;
   return(
      <SPAN>
         &nbsp;por la cantidad de  
         <SPAN className="number">
            &nbsp;{amount}&nbsp;
         </SPAN>
         <strong>{uiCurrencyName}</strong>
      </SPAN>
   )
}




