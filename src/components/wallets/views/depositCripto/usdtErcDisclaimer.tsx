import { useState } from 'react'
import { getCdnPath } from 'environment'
import styled from 'styled-components'
import { AlertDisclaimer } from 'components/widgets/shared-styles'
import { P, H2, Button } from 'core/components/atoms'
import { device } from 'const/const'

const DEPOSIT_COST = "15 Dolares"

const UsdtErcDisclaimer = ({ children, callback, currentWallet, networksData }:any) => {
   const [ show, setShow ] = useState(true)
   const mainAction = () => {
      sessionStorage.removeItem(`depositNetworkDefault_${currentWallet.id}`)
      callback && callback({})
   }
   const secondaryAction = () => setShow(false)
   return(
      <>
         {children}
         <ContentDisclaimer className={`${!show ? '__hide' : ''}`}>
            <img src={`${getCdnPath('assets')}error_animation.gif`}  alt="" width={75} height={75} /> 
               <H2 size={18} className="fuente">¡Espera un momento!</H2>
               {
                  currentWallet?.currency === 'usdt' ?
                  <P size={14} className="fuente"> Los depósitos de <strong className="fuente2">USDT (ERC20)</strong> en la red Ethereum en este momento tienen un costo fijo de <strong className="fuente2" style={{color:"red"}}>{DEPOSIT_COST}</strong> debido a las altas tarifas de operación de la red. Pero no te preocupes, ¡tenemos la solución! Te invitamos a depositar <strong className="fuente2">USDT (TRC20)</strong> en la red TRON o <strong className="fuente2">USDT (BEP20)</strong> en la red de Binance, <strong >¡que no tienen ningún costo asociado!</strong></P>
                  :
                  <P size={14} className="fuente text-center"> Los depósitos de tokens <strong className="fuente2">ERC20</strong> de la red <strong className="fuente2">Ethereum</strong> en este momento tienen un costo fijo de <strong className="fuente2" style={{color:"red"}}>{DEPOSIT_COST}</strong> debido a las altas tarifas de operación de la red. </P>
               }
               <ButtonCont>
                  <Button fontSize={15} variant="outlined" color="primary" onClick={secondaryAction}>Continuar a <span className="fuente2">ERC20</span></Button>
                  {
                     Object.keys(networksData.providers).length > 1 && 
                     <Button fontSize={15} variant="contained" color="primary" onClick={mainAction}>Seleccionar otra red</Button>
                  }
               </ButtonCont>
         </ContentDisclaimer>
      </>
   )
}

export default UsdtErcDisclaimer

export const EthCostDisclaimer = () => {
   return(
      <AlertDisclaimer>
         <P size={14} variant='number' color='red'>Costo: <strong style={{color:"red"}}>{DEPOSIT_COST}</strong></P>
      </AlertDisclaimer>
   )
}

export const ButtonCont = styled.div`
   display: flex;
   column-gap: 30px;
   flex-wrap: wrap;
   margin-top: 50px;
`

export const ContentDisclaimer = styled.div`
   &.__hide{
      display: none;
   }
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: auto;
   width: auto;
   max-width: 730px;
   background: rgb(249,249,251);
   position: absolute;
   width: 100%;
   height: 100%;
   z-index: 1;
   p{
      margin-top: 50px;
      line-height: 25px;
      max-width: 600px;
   }

   @media ${device.mobile}{
      margin-top: 90px;
      ${ButtonCont}{
         flex-direction: column;
         width: 100%;
         row-gap: 20px;
      }
   }
`