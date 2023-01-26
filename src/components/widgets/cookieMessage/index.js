import React, { useRef, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import styled from 'styled-components'
// import { getHostName } from 'environment'


const COINSENDA_DISCLAIMER_IS_ACCEPTED = 'coinsensa-disclaimer-is-accepted';

export default function CookieMessage(props) {

  const [shouldRender, setShouldRender] = useState(false);
  const mainRef = useRef()
  // const [ viewMore, setViewMore ] = useState(false)

  const clickHandler = () => { 
    sessionStorage.setItem(COINSENDA_DISCLAIMER_IS_ACCEPTED, true)
    setShouldRender(false)
  }

  useEffect(() => {
    const value = sessionStorage.getItem(COINSENDA_DISCLAIMER_IS_ACCEPTED)
    if(!value) {
      setShouldRender(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef.current])


 
  return shouldRender ? (

    // <CoockieContainer ref={mainRef} id="cookieContainer" className={`${viewMore ? 'disclaimer__open' : 'disclaimer--showGradient'}`}>
    //   <Close onClick={clickHandler}>X</Close>
    //   <Content>
    //     <h3 className='fuente'>¡Advertencia!</h3>
    //     <br/>
    //     <p className="fuente">
    //       Antes de efectuar tus transacciones, presta atención a lo siguiente: 
    //       <br/>
    //       <br/>
    //       ✓ <b>PHI COLOMBIA S.A.S.</b> no ha establecido ningún tipo de relación o convenio con otras empresas, agencias y/o personas para la obtención de bienes, servicios o beneficios a través de transacciones realizadas por medio de <b>COINSENDA</b>.
    //     </p>
    //       <br/>
    //     <p className="fuente">
    //       ✓ Ante la duda, abstente de realizar cualquier operación y contáctanos a través del correo electrónico: <b>soporte@coinsenda.com</b> o por nuestro chat.
    //     </p>
    //       <br/>
    //     <p className="fuente">
    //       <span>
    //         Para conocer más consulta&nbsp;
    //         <a 
    //           className={styles["cookie-link"]} 
    //           rel="noreferrer" 
    //           href={`https://${getHostName()}.com/docs/terms`}
    //           target="_blank"
    //           >
    //             nuestros terminos y condiciones
    //         </a>
    //       </span>
    //     </p>
    //     <br/>
    //     <br/>
    //     <div className={styles["cookie-button-container"]}>
    //       <span onClick={clickHandler} className={styles["cookie-button-accept"]}>Entendido</span>
    //     </div>
    //   </Content>
    //   {
    //     !viewMore && 
    //       <p className='fuente2 verMas__p' onClick={() => setViewMore(prevState => !prevState)}>{viewMore ? '' : 'Ver más...'} </p>
    //   }
    // </CoockieContainer>

    <CoockieContainer ref={mainRef} id="cookieContainer">
      <Close onClick={clickHandler}>X</Close>
      <Content>
        <h3 className='fuente'>Actualización</h3>
        <br/>
        <p className="fuente">
          Agregamos <strong>USDT</strong> en la red <span className="fuente2"><strong>TRC20</strong></span> y <span className="fuente2"><strong>ERC20</strong></span> en tu Billetera Digital para que puedas realizar depósitos, retiros e intercambios. 🇨🇴🌎
        </p>
        <br/>
        <div className={styles["cookie-button-container"]}>
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

  &:hover{
    ${Close}{
      opacity: 1;
    }
  }

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
