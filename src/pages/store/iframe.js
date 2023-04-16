import { useEffect } from "react";
// import { useSelector } from "react-redux";
import styled from 'styled-components'

const BitRefillWebView = props => {

  // const user = useSelector(({ modelData:{ user } }) => user);
  const email = encodeURIComponent('todocleansss@outlook.es') // user?.email
  const paymentMethod = encodeURIComponent(`ethereum`)
  const uri = `https://embed.bitrefill.com/?email=${email}`
  // const uri = `https://embed.bitrefill.com/?email=${email}&paymentMethod=${paymentMethod}`

  useEffect(() => {
    window.onmessage = function(e) {
      if (e.origin !== 'https://embed.bitrefill.com') return;
      console.log('|||||||||  BitRefillWebView ==> ', e.data)
    }
  }, [])

  return(<Iframe src={uri} title="Bitrefill"></Iframe>)
}

export default BitRefillWebView

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
` 