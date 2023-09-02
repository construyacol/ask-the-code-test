import { useEffect, useState, } from "react";
import { serveModelsByCustomProps } from 'selectors'
import { useSelector } from "react-redux";
import BitRefillFallBack from './fallBack'
import { useActions } from 'hooks/useActions'
import { Iframe } from './styles'
import { createURI } from 'utils'
import { getPaymentData } from 'utils/bitrefill'
import { BITREFILL_BASE_URL, BITREFILL_PARAMS_DEFAULT } from 'const/bitrefill'


export default function BitRefillWebView(props) {

  const sandboxConfig = 'allow-scripts allow-same-origin allow-popups allow-forms'
  const actions = useActions()
  const user = useSelector(({ modelData:{ user } }) => user);
  const balances = useSelector(({ modelData:{ balances } }) => balances);
  const balancesByCurrency = serveModelsByCustomProps(balances, 'currency')

  const [ iframeLoaded, setIframeLoaded ] = useState(false)
  const [ URI, setURI ] = useState('')

  const openConfirmation = async(data) => {
    const Element = await import("./confirmation");
    if (!Element) return;
    const ConfirmationComponent = Element.default
    actions.renderModal(() => <ConfirmationComponent data={data} balances={balances}/>);
  }

  const handleIframeLoad = () => setIframeLoaded(true);

  const initialize = async() => {
    const paymenData = await getPaymentData(balancesByCurrency)
    const params = {
      ...BITREFILL_PARAMS_DEFAULT,
      ...paymenData,
      email:user?.email,
      endUserToken:user?.id,
    }
    setURI(createURI(BITREFILL_BASE_URL, params))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => initialize(), [])

  // Listening bitrefill events
  useEffect(() => {
    window.onmessage = function(e) {
      if (e.origin !== BITREFILL_BASE_URL) return;
      if(JSON.parse(e.data)?.event === 'payment_intent')openConfirmation(JSON.parse(e.data));
      console.log('|||||||||  FromBitRefillWebView ==> ', JSON.parse(e.data))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return(
    <>
      { !iframeLoaded && <BitRefillFallBack/> }
      <Iframe   
        iframeLoaded={iframeLoaded}
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
