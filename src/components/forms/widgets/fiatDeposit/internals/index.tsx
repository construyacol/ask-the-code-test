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

interface modelDataProp {
    [id: string]: any;
}
type modelDataProps = {
    modelData: modelDataProp;
}

const ModalSharePaymentRequest = (props:any) => {

   const user = useSelector(({ modelData:{ user } }:modelDataProps) => user);
   const [ paymentRequestLink, setPaymentRequestLink ] = useState("")
   const [ loading ] = useState(false)

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
                  <H3 >Compartir enlace de pago</H3>
            </HeaderContainer>

            <ContentContainer>
               {/* <QrGenerator
                  size={120}
                  currency={props?.depositAccount?.currency}
                  amount={props?.internalAmount}
               /> */}
               <P className={"no-margin"}>Se ha creado un enlace con una solicitud de pago <span className="fuente2">{props?.internalAmount ? `por ${props?.internalAmount} ${uiCurrencyName}` : ''}</span></P>
               <P className={"no-margin"}>Comparte tu enlace de pago por <strong>Gmail</strong> o <strong>copialo</strong> y compartelo manualmente.</P>
               <HowToWorkCta />

            </ContentContainer>

            <P className={"no-margin bold"}>Comparte</P>
            <SocialMediaContainer>
                  <Button size="small" onClick={openGmail}>
                     <IconSwitch
                        icon={"gmail"}
                        size={40}
                        // color={'var(--primary)'}
                     />
                  </Button>
                  <Button size="small" variant="contained" color={"primary"} onClick={copyLink}> 
                  Copiar enlace de pago 
                  <i
                     style={{ color: "white" }}
                     className="copy far fa-clone tooltip"
                  />
               </Button>
            </SocialMediaContainer>

            
         </CrudContainer>
      </ModalLayout>
   )
 } 

 export default withCoinsendaServices(ModalSharePaymentRequest)

const SocialMediaContainer = styled.div`
   border-top: 1px solid ${props => props.theme.palette.skeleton_color};
   min-height: 70px;
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: space-between;
`

 const HeaderContainer = styled.div`
    display: flex;
    place-content: center;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.palette.skeleton_color};
 `
 

 const ContentContainer = styled.div`
   p, input{
      font-size:15px;
      /* color: ${props => props.theme.palette.text_color}; */
      width: 100%;
   }
   display: flex;
   flex-direction: column;
   row-gap: 30px;
   margin: 20px 0;
`

 