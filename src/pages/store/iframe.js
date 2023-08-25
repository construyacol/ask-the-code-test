import { useEffect } from "react";
// import { useSelector } from "react-redux";
import styled from 'styled-components'

const BitRefillWebView = props => {

  const sandboxConfig = 'allow-scripts allow-same-origin allow-popups allow-forms'
  // const user = useSelector(({ modelData:{ user } }) => user);
  // const uri = `https://embed.bitrefill.com/?email=${email}&paymentMethod=usdt_trc20`
  // const uri = `https://embed.bitrefill.com/?email=${email}&hl=es`

  //Todos los parámetros deben estar codificados en URL

  const lang = encodeURIComponent('es') 
  const email = encodeURIComponent('todocleansss@outlook.es') // user?.email
  const paymentMethod = encodeURIComponent(['usdt_trc20', 'bitcoin', 'usdt_erc20', 'usdc_erc20', 'ethereum', 'litecoin'])
  const uri = `https://embed.bitrefill.com/?showPaymentInfo=true&email=${email}&hl=${lang}&paymentMethods=${paymentMethod}`
  console.log('BitRefillWebView', uri)

  useEffect(() => {
    window.onmessage = function(e) {
      if (e.origin !== 'https://embed.bitrefill.com') return;
      console.log('|||||||||  BitRefillWebView ==> ', JSON.parse(e.data))
    }
  }, [])
  return(<Iframe src={uri} sandbox={sandboxConfig} title="Bitrefill"></Iframe>)
}

export default BitRefillWebView

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
` 

// @params
// refundAddress: Dirección para reembolsar automáticamente el dinero en caso de error. esto le ahorra al usuario un paso en casos excepcionales cuando la compra falla
// endUserToken: token único que actuará como clave de usuario y no recuperará compras anteriores (en desarrollo) Este debe ser un token aleatorio no adivinable generado en el cliente, almacenado y reutilizado durante visitas posteriores.
