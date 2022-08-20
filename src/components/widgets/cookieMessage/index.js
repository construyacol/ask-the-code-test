import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import styled from 'styled-components'
import { getCdnPath } from 'environment'


const COINSENDA_COOKIES_IS_ACCEPTED = 'coinsensa-cookies-is-accepted';

export default function CookieMessage(props) {
  const [shouldRender, setShouldRender] = useState(false);
  const mainRef = useRef()
  const clickHandler = () => { 
    localStorage.setItem(COINSENDA_COOKIES_IS_ACCEPTED, true)
    setShouldRender(false)
  }

  useEffect(() => {
    const value = localStorage.getItem(COINSENDA_COOKIES_IS_ACCEPTED)
    if(!value) {
      setShouldRender(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef.current])


  const closeHandle = () => {
    setShouldRender(false)
  }

  return shouldRender ? (
    <CoockieContainer ref={mainRef} id="cookieContainer">
      <Close onClick={closeHandle}>X</Close>
      <Content>
        <h2>¡Advertencia!</h2>
        <br/>
        <p className="fuente">
          Antes de efectuar tus transacciones, presta atención a lo siguiente: 
          <br/>
          <br/>
          ✓ PHI COLOMBIA S.A.S. no ha establecido ningún tipo de relación o convenio con otras empresas, agencias y/o personas para la obtención de bienes, servicios o beneficios a través de transacciones realizadas por medio de COINSENDA.
          {/* <span>&nbsp;Para conocer más consulta <Link className={styles["cookie-link"]} to="/docs/legal">nuestras politicas</Link></span> */}
        </p>
        <p>
          ✓ Ante la duda, abstente de realizar cualquier operación y contáctanos a través del correo electrónico: soporte@coinsenda.com o por nuestro chat.
        </p>
      </Content>
      <Content2>
        <img src={`${getCdnPath('assetsRoot')}cookie.png`} width="40px" height="40px" alt="" loading="lazy"/>
        <div className={styles["cookie-button-container"]}>
          <span onClick={clickHandler} className={styles["cookie-button-accept"]}>Aceptar</span>
        </div>
      </Content2>
    </CoockieContainer>
  ) : <></>
}

const Content2 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 40px;
  justify-items:center;
`

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  p{
    font-size: 14px;
    margin: 0;
  }
  h2{
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
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

&:hover{
  ${Close}{
    opacity: 1;
  }
}


  z-index: 9999999999;
  background: white;
  width: 95vw;
  max-width: 550px;
  height: 120px;
  position: fixed;
  bottom: 15px;
  left: 15px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr 70px;
  padding: 15px;
  padding-right: 30px;
  column-gap: 5px;
  border-top: 3px solid #004a7b;
  -webkit-box-shadow: -1px 0px 5px 0px rgba(50, 50, 50, 0.6);
  -moz-box-shadow:    -1px 0px 5px 0px rgba(50, 50, 50, 0.6);
  box-shadow:         -1px 0px 5px 0px rgba(50, 50, 50, 0.6);

  img{
    align-self: center;
    justify-self:center;
  }

  @media (max-width: 765px) {
    max-width: 300px;
  }
`
