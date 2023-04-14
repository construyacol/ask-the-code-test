import { useEffect, useState } from 'react'
import { CrudContainer } from 'core/components/molecules/modalCrud/styles'
import IconSwitch from "components/widgets/icons/iconSwitch";
import { SPAN, H3, P } from 'core/components/atoms'
import { 
   PaymentRequestParams,
   AmountProps,
   UserRecipientProps,
} from 'interfaces/paymentRequest';
import { formatToCurrency } from "utils/convert_currency";
import { useSelector } from "react-redux"
import { getUserToken, getExpTimeData } from 'utils/handleSession'
import { useActions } from "hooks/useActions";
import IsLoggedView from './loggedView'
import UnLoggedView from './unLoggedView'
import PaymentDetail from './paymentDetail'
import SkeletonView from './skeletonView'
import { replaceToCurrency } from 'core/config/currencies'
import { modelDataProps } from 'interfaces/state'
import BigNumber from 'bignumber.js';
import { OPERATIONAL_LEVELS } from 'const/levels'

//styles
import { 
   PaymentRequestLayout, 
   HeaderContainer, 
   ContentContainer,
   ViewerContainer
} from './styles'

import { Content } from 'components/forms/widgets/success/styles'

const PaymentRequestView = (props:any) => {
   //TODO: Crear selector para no tener que cargar todo el modelo de usuario en el store desde el inicio
   const [ isLogged, setIsLogged ] = useState(false)
   const user = useSelector(({ modelData:{ user } }:modelDataProps) => user);
   const [ isLoading, setIsLoading ] = useState(true)
   const [ paymentRequest ] = useState<PaymentRequestParams>(props?.location?.state?.paymentRequest)
   const { currency, metaData } = paymentRequest
   const [ amount, setAmount ] = useState<BigNumber>(formatToCurrency(paymentRequest?.amount ? `${paymentRequest?.amount}`.replace(/,/g, "") : 0, currency))
   const uiCurrencyName = replaceToCurrency({ currency })
   const actions = useActions()

   const rejectRequest = async() => {
      const { getHostName } = await import("environment")
      const { history } = await import("const/const")
      const { ROUTES } = await import("const/routes")
      localStorage.removeItem('paymentRequest')
      if(!isLogged) return window.location.href = `https://${getHostName()}.com`
      history.push(OPERATIONAL_LEVELS.includes(user?.level) ? ROUTES.default : ROUTES.unverified)
      actions.isAppLoaded(true);
  }

   useEffect(() => {
      (async() => {
         setIsLoading(true)
         const { refreshTokenExpirationTime, currentTime } = await getExpTimeData()
         setIsLoading(false)
         if(currentTime <= refreshTokenExpirationTime) return setIsLogged(true)
      })()
   }, [])

   useEffect(() => {
      (async() => {
         if(!isLogged)return;
         setIsLoading(true)
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
         setIsLoading(false)
      })()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLogged])

   const RenderContentComponent = (isLoading && !isLogged) ? SkeletonView : isLogged ? IsLoggedView : UnLoggedView
   console.log('RenderContentComponent', paymentRequest.recipient, user?.email)
   return(
      <PaymentRequestLayout>
         <CrudContainer rowGap="10px" className={`large flex no-padding`}>
         {
            paymentRequest.recipient === user?.email && <ViewerContainer>Vista de pagador</ViewerContainer>
         }
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
                     setIsLoading={setIsLoading}
                     paymentRequest={paymentRequest}
                     isLogged={isLogged}
                     rejectRequest={rejectRequest}
                     actions={actions}
                     user={user}
                     isLoading={isLoading}
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




