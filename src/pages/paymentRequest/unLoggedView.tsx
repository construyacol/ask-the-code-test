import { SPAN, H3, P, Button } from 'core/components/atoms'
import { unLoggedViewProps } from 'interfaces/paymentRequest';
import QrGenerator from 'components/forms/widgets/fiatDeposit/internals/qrGenerator'
import { UnloggedDisclaimer } from "./styles"
import { HowToWorkCta } from 'core/components/molecules'
import { ButtonsContainer } from './styles'


const UnLoggedView = ({ currency, amount, children }:unLoggedViewProps) => {
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
            <Button size="large" variant="contained" color={"primary"}> 
               Iniciar sesión
            </Button>
            <Button size="large" variant="text" color={"primary"}> 
               Cancelar solicitud
            </Button>
         </ButtonsContainer>
      </>
    )
 }

 export default UnLoggedView