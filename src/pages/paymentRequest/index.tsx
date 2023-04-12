import { useEffect, useState } from 'react'
import { CrudContainer } from 'core/components/molecules/modalCrud/styles'
import IconSwitch from "components/widgets/icons/iconSwitch";
import { SPAN, H3, P } from 'core/components/atoms'
import { 
   PaymentRequestParams,
   errProps,
   AmountProps,
   UserRecipientProps,
   paymentDetailProps
} from 'interfaces/paymentRequest';
// import { SESSION_ERROR } from 'const/session'
import { REPLACE_TO_CURRENCY_CONFIG, replaceTo } from 'core/config/currencies'
import DetailTemplateComponent from 'components/widgets/detailTemplate'
import { formatToCurrency } from "utils/convert_currency";

// import { validateExpTime, getUserToken } from 'utils/handleSession'
// import { useActions } from "hooks/useActions";
// import IsLoggedView from './loggedView'

//styles
import { 
   PaymentRequestLayout, 
   HeaderContainer, 
   ContentContainer 
} from './styles'

import {
   // SuccessViewContent,
   // SuccessViewLayout,
   // Title,
   // Header,
   ContentDetail,
   // AccountMetaData,
   SubTitle,
   Content
} from 'components/forms/widgets/success/styles'


const PaymentRequestView = (props:any) => {
   const [ isLogged, setIsLogged ] = useState(false)
   const [ paymentRequest ] = useState<PaymentRequestParams>(props?.location?.state?.paymentRequest)
   const { amount, currency, metaData } = paymentRequest
   const paymentCurrency = currency || "cop"
   const availableCurrencyName = REPLACE_TO_CURRENCY_CONFIG[paymentCurrency as keyof typeof REPLACE_TO_CURRENCY_CONFIG]
   const uiCurrencyName = availableCurrencyName ? replaceTo(paymentCurrency, availableCurrencyName) : paymentCurrency
   // const actions = useActions()
   // const handleSession = (props:errProps) => SESSION_ERROR.REFRESH_TOKEN_EXPIRED !== props?.error && setIsLogged(true);
   // useEffect(() => { validateExpTime(handleSession) }, [])
   // useEffect(() => {
   //    (async() => {
   //       if(!isLogged)return;
   //       const userData = await getUserToken();
   //       if(!userData){return console.log('Error obteniendo el token::48 Root.js')}
   //       const { userToken, decodedToken } = userData
   //       actions.setAuthData({
   //          userToken,
   //          userEmail: decodedToken.email,
   //          userId: decodedToken.usr
   //       });
   //       const { mainService } = await import('services/MainService')
   //       await mainService.loadFirstEschema();
   //       await mainService.fetchCompleteUserData();
   //       await mainService.init();
   //    })()
   // // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [isLogged])


   // const RenderContentComponent = isLogged ? IsLoggedView : UnLoggedView

   return(
      <PaymentRequestLayout>
         <CrudContainer rowGap="10px" className={`large flex no-padding`}>
            <Content>
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
               <ContentContainer>
                  <P>
                     {metaData?.userName} te ha enviado una solicitud de pago<AmountUiView amount={amount} uiCurrencyName={uiCurrencyName}/>. 
                     {isLogged ? <> Para realizar el pago, puedes usar tu billetera <strong>{uiCurrencyName}</strong> </> : ''}
                  </P>
                  {/* <RenderContentComponent 
                     currency={currency}
                  /> */}
                  <PaymentDetail 
                     paymentRequest={paymentRequest}
                     uiCurrencyName={uiCurrencyName}
                  />
               </ContentContainer>
            </Content>
         </CrudContainer>
      </PaymentRequestLayout>
   )
}

export default PaymentRequestView


const UnLoggedView = () => {
   return(
      <P className={'no-margin'}>UnLoggedView</P>
   )
}




const UserRecipient = ({ metaData }:UserRecipientProps) => <SPAN>&nbsp;de {metaData?.userName}</SPAN>
const AmountUiView = ({amount, uiCurrencyName}:AmountProps) => {
   return(
      <>
         {
            Number(amount) !== 0 ? (
            <SPAN>
               &nbsp;por la cantidad de  
               <SPAN className="number">
                  &nbsp;{amount}&nbsp;
               </SPAN>
               <strong>{uiCurrencyName}</strong>
            </SPAN>) : ''
         }
      </>
   )
}


const PaymentDetail = ({ paymentRequest, uiCurrencyName }:paymentDetailProps) => {

   const { amount, currency } = paymentRequest
   const [ paymentDetail, setPaymentDetail ] = useState<any>([])

   useEffect(() => {
      (() => {
         let _paymentDetail = []
         let _amount = formatToCurrency(amount || 0, currency)
         _paymentDetail.push(["Moneda", uiCurrencyName])
         _amount.isGreaterThan(0) && paymentDetail.push(["Cantidad a pagar", `${_amount.toFormat()} ${uiCurrencyName}`])
         _paymentDetail.push(["Costo", "0"])
         setPaymentDetail(_paymentDetail)
      })()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return(
      <>
         <SubTitle className="fuente">Datos del pago</SubTitle>
         <ContentDetail className="onBottom">
            <DetailTemplateComponent
               skeletonItems={2}
               items={paymentDetail}
            />
         </ContentDetail>
      </>
   )
}