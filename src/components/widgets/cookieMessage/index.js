import React, { useRef, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import styled from 'styled-components'
// import { getHostName } from 'environment'
import IconSwitch from '../icons/iconSwitch';
import Button from '../buttons/button';
import { device, history } from 'const/const';
// import { serveModelsByCustomProps } from 'selectors'
import { useSelector } from "react-redux";
import { checkIfFiat } from 'core/config/currencies';

const COINSENDA_DISCLAIMER_IS_ACCEPTED = 'coinsensa-disclaimer-is-accepted';

export default function CookieMessage(props) {

  const { wallets } = useSelector((state) => state.modelData);
  const [ fiatWallet, setFiatWallet ] = useState()

  const [shouldRender, setShouldRender] = useState(false);
  const mainRef = useRef() 

  const clickHandler = () => { 
    sessionStorage.setItem(COINSENDA_DISCLAIMER_IS_ACCEPTED, true)
    setShouldRender(false)
  }

  const goToNew = () => {
    history.push(`/wallets/withdraw/${fiatWallet?.id}`)
    clickHandler()
  }

  useEffect(() => {
    (() => {
      for (const walletId in wallets) {
        const wallet = wallets[walletId]
        if(checkIfFiat(wallet?.currency)) setFiatWallet(wallet)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const value = sessionStorage.getItem(COINSENDA_DISCLAIMER_IS_ACCEPTED)
    if(!value) setShouldRender(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef.current])


  return shouldRender ? (
    <CoockieContainer ref={mainRef} id="cookieContainer" className='withOutHeight'>
    <Close onClick={clickHandler}>X</Close>
    <Content>
      <IconSwitch 
        size={30}
        icon="eth"
        color="var(--primary)"
      />
      <br/>
      <p className="fuente">
      
        Los depósitos de <strong className="fuente2">USDT (ERC20)</strong> en la red Ethereum ahora tienen un costo fijo de 15 dólares debido a las altas tarifas de la red. 
        Te invitamos a depositar <strong className="fuente2">USDT (TRC20)</strong> en la red TRON o <strong className="fuente2">USDT (BEP20)</strong> en la red de Binance sin ningún costo. ✅☝️
      </p>
      <br/>
      <div className={` cookie-button-container ${styles["cookie-button-container"]}`}>
        <span onClick={clickHandler} className={styles["cookie-button-accept"]}>Entendido</span>
      </div>
    </Content>
  </CoockieContainer>
  ) : <></>
}

const Content = styled.div`

  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
  .iconSty{
    justify-self: center;
  }
  
  p{
    font-size: 14px;
    margin: 0;
    line-height: 19px;
  }
  h2, h3{
    font-weight: bold;
    margin: 0;
    text-align:center;
  }

  @media ${device.mobile} {
    .cookie-button-container{
      display: flex;
      flex-direction: column;
    }
  }


`

const Close = styled.div`
  transition: .15s;
  border-radius:4px;
  background: rgb(0 0 0 / 64%);;
  width: 28px;
  height: 28px;
  top: -35px;
  position: absolute;
  right: 0;
  color: white;
  display: grid;
  align-items: center;
  justify-items: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;

  &::after{
    height: 100%;
    width: 30px;
    content:"";
    position: absolute;
    bottom: -15px;
  }
`

const CoockieContainer = styled.section`
  position:relative;
  z-index: 9999999999;
  background: white;
  width: 95vw;
  max-width: calc(550px - 50px);
  height: 180px;
  position: fixed;
  bottom: 15px;
  left: 15px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 20px 25px;
  column-gap: 5px;
  border-top: 4px solid var(--primary);
  -webkit-box-shadow: -1px 0px 5px 0px rgba(50, 50, 50, 0.6);
  -moz-box-shadow:    -1px 0px 5px 0px rgba(50, 50, 50, 0.6);
  box-shadow:         -1px 0px 5px 0px rgba(50, 50, 50, 0.6);

  &:hover{
    ${Close}{
      opacity: 1;
    }
  }
  &.withOutHeight{
    height: auto;
  }

  img{
    align-self: center;
    justify-self:center;
  }

  &.disclaimer--showGradient{
      &::after{
        content:"";
        position:absolute;
        width:100%;
        height: 80px;
        bottom:0;
        left: 0;
        pointer-events:none;
        background: linear-gradient(0deg,#ffffff 50%,transparent 100%);
      }
    }

    &.disclaimer__open{
      height: auto;
    }

  .verMas__p{
      position: absolute;
      width: auto;
      height: auto;
      bottom: 12px;
      z-index: 1;
      justify-self: center;
      font-family: "Raleway",sans-serif;
      cursor:pointer;
      margin: 0;
      color: var(--title1);
  }

  @media (max-width: 765px) {
    max-width: 300px;
    left:0;
    right:0;
    margin:auto;
    ${Close}{
      opacity: 1;
    }
  }
`
