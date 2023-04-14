import { P, Button } from 'core/components/atoms'
import { loggedViewProps } from 'interfaces/paymentRequest';
import QrGenerator from 'components/forms/widgets/fiatDeposit/internals/qrGenerator'
import { UnloggedDisclaimer } from "./styles"
import { HowToWorkCta } from 'core/components/molecules'
import { ButtonsContainer } from './styles'

const UnLoggedView = ({ currency, paymentRequest, amount, children, rejectRequest }:loggedViewProps) => {

   const savePaymentRequest = () =>  localStorage.setItem('paymentRequest', JSON.stringify(paymentRequest))

   const goToLogin = async() => {
      savePaymentRequest()
      const environmentModule = await import("environment")
      return window.location.href = `${environmentModule.default.Oauth.url}signin`
   }

   return(
   <>
      <UnloggedDisclaimer>
         <P className={'no-margin'}>Escanea el código QR desde la APP o desde la cámara de tu celular, o inicia sesión y procede con el pago.</P>
         <HowToWorkCta label="Cómo escanear desde la APP" />
      </UnloggedDisclaimer>
      <QrGenerator
         currency={currency}
         amount={amount}
      />
      {children}
      <ButtonsContainer>
         <Button size="large" variant="contained" color={"primary"} onClick={goToLogin}> 
            Iniciar sesión y proceder
         </Button>
         <Button size="large" variant="text" color={"primary"} onClick={rejectRequest}> 
            Cancelar solicitud
         </Button>
      </ButtonsContainer>
   </>
   )
 }

 export default UnLoggedView