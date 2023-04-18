import { useEffect, useState } from 'react'
import { createPaymentRequestLink } from 'utils/paymentRequest'
import QRCode from "qrcode";
import { PaymentRequestContainer } from '../statusPanelStates/styles'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const QR_CONFIG = {
   rendererOpts: {
      margin: 3.5,
      errorCorrectionLevel: 'H',
      type: 'image/webp',
      quality: 0.3,
   },
   color: {
      dark:"#455868",
   }
}


const QrGenerator = ({ currency, amount="", size=200 }:any) => {

   const [ qrImg, setQrImg] = useState("");

   useEffect(() => {
      (async() => { 
         const paymentRequestParams = await createPaymentRequestLink({ currency, amount })
         let base64 = await QRCode.toDataURL(paymentRequestParams, QR_CONFIG)
         setQrImg(base64)
      })()
   }, [currency, amount])

   return (
      <PaymentRequestContainer>
         {qrImg && 
            <Zoom>
               <img alt='' height={size} src={qrImg}></img>
            </Zoom>
         }
      </PaymentRequestContainer>
   )
}


export default QrGenerator