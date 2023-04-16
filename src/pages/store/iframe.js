import { useEffect } from "react";
// import { useSelector } from "react-redux";
import styled from 'styled-components'

const BitRefillWebView = props => {

  const sandboxConfig = 'allow-scripts allow-same-origin allow-popups allow-forms'
  // const user = useSelector(({ modelData:{ user } }) => user);
  const email = encodeURIComponent('todocleansss@outlook.es') // user?.email
  const paymentMethod = encodeURIComponent(['usdt_trc20', 'bitcoin', 'usdt_erc20', 'usdc_erc20', 'ethereum'])
  // const uri = `https://embed.bitrefill.com/?email=${email}&paymentMethod=usdt_trc20`
  const uri = `https://embed.bitrefill.com/?showPaymentInfo=true&email=${email}&hl=es&paymentMethods=${paymentMethod}`
  // const uri = `https://embed.bitrefill.com/?email=${email}&hl=es`

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