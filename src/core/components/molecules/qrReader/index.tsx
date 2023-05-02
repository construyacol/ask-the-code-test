import { useState } from 'react'
import { Button } from 'core/components/atoms'
import IconSwitch from "components/widgets/icons/iconSwitch";
import { CAPACITOR_PLATFORM } from 'const/const';
import { checkCameraPermission } from 'utils'
import { useActions } from "hooks/useActions";
import { PAYMENT_REQUEST } from 'const/routes'



type qrReaderProps = {
   callback?: (value: string) => void
}

const QrReader = ({ callback  }:qrReaderProps) => {

   const [ loading, setLoading ] = useState(false)
   const actions = useActions();
   // const [ qrValue, setQrValue ] = useState("")

   const handleScan = async(data: string) => {
      if(!data)return;
      // setQrValue(data)
      const isPaymentRequest = new RegExp(PAYMENT_REQUEST, "g").test(data)
      if(isPaymentRequest){
         const { PaymentRequestRedirect } = await import("core/components/organisms"); 
         return actions.renderModal(() => <PaymentRequestRedirect paymentRequestLink={data} />);
      }
      callback && callback(data)
   }
   // 
   const readQr = async() => {
      setLoading(true)
      if (CAPACITOR_PLATFORM !== 'web' && await checkCameraPermission()) {
         const { BarcodeScanner } = await import('@awesome-cordova-plugins/barcode-scanner');
         const { text, cancelled } = await BarcodeScanner.scan();
         if(!!!cancelled)handleScan(text);
      } else if (CAPACITOR_PLATFORM === 'web') {
         actions.renderModal(null);
         const Element = await import("components/widgets/qr-scanner"); 
         const RenderComponent = Element.default
         actions.renderModal(() => <RenderComponent onScan={handleScan} />);
      }
      setLoading(false)
   }

   return(
      <Button 
         onClick={readQr}
         loading={loading}
         className={'no-padding'}
      >
         <IconSwitch
            icon="qr"
            color="gray"
            size={25}
         />
      </Button>
   )

}

export default QrReader