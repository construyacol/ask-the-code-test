import { useState } from 'react'
import { getCdnPath } from 'environment'
import { P, H2, Button, SPAN } from 'core/components/atoms'
import { ContentDisclaimer, ButtonCont } from './usdtErcDisclaimer' 


const UnSwapableDisclaimer = ({ children, currentWallet }:any) => {
   const [ show, setShow ] = useState(true)
   const secondaryAction = () => setShow(false)
   console.log('currentWallet', currentWallet)
   return(
      <>
         {children}
         <ContentDisclaimer className={`${!show ? '__hide' : ''}`}>
            <img src={`${getCdnPath('assets')}error_animation.gif`}  alt="" width={75} height={75} /> 
               <H2 size={18} className="fuente">¡Espera un momento!</H2>
               <P size={14} className="fuente"> Actualmente <SPAN className="uppercase bold">{currentWallet?.currency}</SPAN> solo está disponible para realizar depósitos y retiros.</P>
               <ButtonCont>
                  <Button fontSize={15} variant="outlined" color="primary" onClick={secondaryAction}>Entendido</Button>
               </ButtonCont>
         </ContentDisclaimer>
      </>
   )
}

export default UnSwapableDisclaimer
