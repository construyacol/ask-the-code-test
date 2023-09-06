import { ModalLayout } from 'core/components/layout'
import styled from 'styled-components'
import { CrudContainer } from 'core/components/molecules/modalCrud/styles'
// import { getCdnPath } from 'environment'
import { P, H3, Button } from 'core/components/atoms'
// import { InputComponent } from 'core/components/molecules'
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import withCoinsendaServices from 'components/withCoinsendaServices'
// import { device } from 'const/const';
import IconSwitch from "components/widgets/icons/iconSwitch";
// import QrGenerator from './qrGenerator'
import { createPaymentRequestLink } from 'utils/paymentRequest'
import { HowToWorkCta } from 'core/components/molecules'
import { REPLACE_TO_CURRENCY_CONFIG, replaceTo } from 'core/config/currencies'
import { IconClose } from "components/widgets/shared-styles";
import { ContentContainer } from 'pages/paymentRequest/styles'
import { HeaderContainer } from 'core/components/shared/styles'
import { modelDataProps } from 'interfaces/state'
import { DisclaimerContainer } from 'components/widgets/shared-styles'
import useViewport from 'hooks/useViewport'

// const createUri = async() => {
//    const { refreshToken } = await getUserToken()
//    const { userToken } = await coinsendaServices.getJWToken(refreshToken)
//    const uri = `https://app.${getHostName()}.com?token=${userToken}&refresh_token=${refreshToken}&face_recognition`
//    generateQR(uri)
// }

const ModalSharePaymentRequest = (props:any): JSX.Element => {

   const user = useSelector(({ modelData:{ user } }:modelDataProps) => user);
   const [ paymentRequestLink, setPaymentRequestLink ] = useState("")
   const [ loading ] = useState(false)
   const { isMobile } = useViewport();

   useEffect(() => {
      (async() => {
         setPaymentRequestLink(await createPaymentRequestLink({ currency:props?.depositAccount?.currency, amount:props?.internalAmount }))
      })()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props?.depositAccount?.currency, props?.internalAmount])


   const createPaymentRequestPayload = () => {
      const subject = `${user?.name} te envía una solicitud de pago ${props?.internalAmount ? `por ${props?.internalAmount} ${props?.depositAccount?.currency}` : ''}`;
      const body = `Entra en coinsenda y procede desde el siguiente link: ${paymentRequestLink}`;
      return { subject, body }
    }

    const openGmail = () => {
      const { subject, body } = createPaymentRequestPayload();
      const url = `https://mail.google.com/mail/?view=cm&body=${encodeURIComponent(body)}&su=${encodeURIComponent(subject)}`;
      window.open(url, '_blank');
    }
    const openWhatsApp = () => {
      const { subject, body } = createPaymentRequestPayload();
      let message = `${encodeURIComponent(subject)}, \n\n${encodeURIComponent(body)}`;
      const url = `https://web.whatsapp.com/send?text=${message}`;
      window.open(url, '_blank');
    }

   const copyLink = async() => {
      const { copyClipboard } = await import('utils')
      return copyClipboard(paymentRequestLink)
   }

   const paymentCurrency = props?.depositAccount?.currency || "cop"
   const availableCurrencyName = REPLACE_TO_CURRENCY_CONFIG[paymentCurrency as keyof typeof REPLACE_TO_CURRENCY_CONFIG]
   const uiCurrencyName = availableCurrencyName ? replaceTo(paymentCurrency, availableCurrencyName) : paymentCurrency
   
   return(
      <ModalLayout loading={loading}>
         <CrudContainer rowGap="10px" className={`medium flex`}>
            <IconClose theme="dark" size={20} />
            <HeaderContainer>
                  {/* <img src={`${getCdnPath('assets')}error_animation.gif`}  alt="" width={75} height={75} /> */}
                  <IconSwitch
                     icon={"qr"}
                     size={35}
                     color={'var(--primary)'}
                  />
                  <H3 >Comparte tu enlace de pago</H3>
            </HeaderContainer>

            <ContentContainer>
               
               <P className={"no-margin"}>Se ha creado un enlace con una solicitud de pago <span className="fuente2">{props?.internalAmount ? `por ${props?.internalAmount} ${uiCurrencyName}` : ''}</span></P>
               <LinkContainer>
                  <P size={14} maxWidth={isMobile ? 250 : 350} className={"no-margin ellipsis number"} color="primary">{paymentRequestLink}</P>
               </LinkContainer>
               
               <CtasContainer>
                  <Button className="fit" size="medium" variant="contained" color={"primary"} onClick={copyLink}> 
                     Copiar enlace
                  </Button> 
                  <HowToWorkCta />
               </CtasContainer>
               <P className={"no-margin"}>Comparte tu enlace de pago por <strong>Gmail</strong>, <strong>WhatsApp</strong> o <strong>copialo</strong> y compartelo manualmente.</P>
            </ContentContainer>

            <P className={"no-margin bold"}>Compartir por:</P>

            <SocialMediaContainer>
                  <Button className="button--share__icon" size="small" onClick={openGmail}>
                     <IconSwitch
                        icon={"gmail"}
                        size={30}
                     />
                     <P className={"no-margin"}>Gmail</P>
                  </Button>
                  <Button className="button--share__icon" size="small" onClick={openWhatsApp}>
                     <IconSwitch
                        icon={"whatsapp"}
                        size={30}
                     />
                     <P className={"no-margin"}>Whatsapp</P>
                  </Button>
            </SocialMediaContainer>
         </CrudContainer>
      </ModalLayout>
   )
 } 

 export default withCoinsendaServices(ModalSharePaymentRequest)

const LinkContainer = styled(DisclaimerContainer)`
   background-color: #0198ff24;
   border-left: 2px solid var(--primary);
`

const CtasContainer = styled.div`
   display: flex;
   column-gap: 20px;
   flex-wrap: wrap;
`

const SocialMediaContainer = styled.div`
   border-top: 1px solid ${props => props.theme.palette.skeleton_color};
   min-height: 70px;
   width: 100%;
   display: flex;
   align-items: center;
   column-gap: 10px;
   .button--share__icon{
      flex-direction: column;
      row-gap: 12px;
      font-size: 13px;
   }
`
 