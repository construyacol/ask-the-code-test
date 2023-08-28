import { useEffect, useState, useRef } from "react";
import { Iframe } from './styles'
import { useSelector } from "react-redux";
import BitRefillFallBack from './fallBack'

// let uri = `https://embed.bitrefill.com/?showPaymentInfo=true&email=${email}&hl=${lang}&ref=${refCode}&paymentMethods=${paymentMethod}`
const BITREFILL_REF_CODE = 'wtto2HuC'
const UTM_SOURCE = 'Coinsenda'
const BITREFILL_BASE_URL = 'https://embed.bitrefill.com'

export default function BitRefillWebView(props) {

  const sandboxConfig = 'allow-scripts allow-same-origin allow-popups allow-forms'
  const iframeRef = useRef(null);
  const user = useSelector(({ modelData:{ user } }) => user);
  const [ iframeLoaded, setIframeLoaded ] = useState(false)
  const [ URI, setURI ] = useState('')
  const [ params ] = useState({
    showPaymentInfo:true,
    hl:'es' ,
    ref:BITREFILL_REF_CODE,
    utm_source:UTM_SOURCE,
    email:user?.email,
    endUserToken:user?.id,
    paymentMethods:['usdt_trc20', 'bitcoin', 'litecoin'],
    refundAddress:'TKtTQX9PSeaRWrnhThttSREMpu4XLnVMv6'
  })
 
  //Todos los parámetros deben estar codificados en URL
  const createURI = (base, params) => {
    let query = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    return `${base}?${query}`;
  }

  const handleIframeLoad = () => setIframeLoaded(true);

  useEffect(() => {
    let uri = createURI(BITREFILL_BASE_URL, params)
    setURI(uri)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listening bitrefill events
  useEffect(() => {
    window.onmessage = function(e) {
      if (e.origin !== BITREFILL_BASE_URL) return;
      console.log('|||||||||  FromBitRefillWebView ==> ', JSON.parse(e.data))
    }
  }, [])

  return(
    <>
      { !iframeLoaded && <BitRefillFallBack/> }
      <Iframe   
        iframeLoaded={iframeLoaded}
        ref={iframeRef} 
        src={URI} 
        sandbox={sandboxConfig} 
        title="Bitrefill"
        onLoad={handleIframeLoad}
      />
    </>
  )
  // return <BitRefillFallBack/>

}

// @params
// refundAddress: Dirección para reembolsar automáticamente el dinero en caso de error. esto le ahorra al usuario un paso en casos excepcionales cuando la compra falla
// endUserToken: token único que actuará como clave de usuario y no recuperará compras anteriores (en desarrollo) Este debe ser un token aleatorio no adivinable generado en el cliente, almacenado y reutilizado durante visitas posteriores.

// Escuchando evento para la creación de ordenes
// Una vez que se crea una orden, bitrefill la comunicará como un objeto JSON al abridor de ventanas usando window.postMessage
// la billetera muestra una confirmación del pago al usuario. Si el usuario confirma, la billetera envía el pago y devuelve al usuario a la vista web de bitrefill.
