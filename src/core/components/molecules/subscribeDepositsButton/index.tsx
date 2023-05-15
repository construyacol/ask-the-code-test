import { useState, useEffect, useRef } from 'react'
import { Button, SPAN } from 'core/components/atoms'
import { Container } from './styles'  
import { RxUpdate } from 'react-icons/rx';
import useSubscribeDepositHook from 'hooks/useSubscribeToNewDeposits'
import { walletprops } from  'interfaces/state'
import sleep from 'utils/sleep'
import BigNumber from 'bignumber.js'
import { getCdnPath } from 'environment'

type componentProps = {
   wallet:walletprops
}

// type GetLeftTimeReturnType = number

function SubscribeDepositsButton({ wallet }:componentProps){

   const {
      getSecondsElapsedSubscription,
      subscribeToNewDeposits,
      TIME_LIMIT_PER_REQUEST
   } = useSubscribeDepositHook()

   const componentIsMount = useRef<HTMLDivElement>(null)
   const [ loader, setLoader] = useState(false)
   const [ leftTime, setLeftTime ] = useState(0)
   const [ blocked, setBlocked] = useState(false)
   const uiName = blocked ? 'Reintenta en' : loader ? 'Detectando depositos...' : 'Detectar depositos'

   const isAvailableSubscribe = (isAvailable:boolean):void => {
      setBlocked(!isAvailable)
      setLoader(!isAvailable)
   }

   const searching = async() => {
      setLoader(true)
      await sleep(500)
      // setLoader(false)
   }

   const checkAvailableSubscribe = async():Promise<any> => {
      if(!componentIsMount.current)return;
      const secondsElapsed = await getSecondsElapsedSubscription(wallet)
      setLoader(false)
      let LeftTime = new BigNumber((TIME_LIMIT_PER_REQUEST - secondsElapsed))
      // Si el tiempo restante es negativo, es porque hay una suscripción vencida y requiere volver a hacer un check
      if(LeftTime.isNegative()) await checkAvailableSubscribe();
      // Si el tiempo restante es positivo y mayor a 0 es porque hay una suscripción en progreso, se procede a actualizar el tiempo y mantener bloqueados los controles
      if(LeftTime.isPositive() && LeftTime.isGreaterThan(0)){
         setLeftTime(LeftTime.toNumber())
         isAvailableSubscribe(false)
      }else{
         setLeftTime(0)
         return isAvailableSubscribe(true)
      }
      await sleep(1000) 
      checkAvailableSubscribe()
   }

   const handleAction = async() => {
      if(blocked || loader) return
      setLoader(true)
      await subscribeToNewDeposits(wallet)
      checkAvailableSubscribe()
   }

   useEffect(() => { 
      (async()=>{
         await searching()
         checkAvailableSubscribe() 
      })()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return(
      <Container ref={componentIsMount}>
         <Button onClick={handleAction} variant={(loader || blocked) ?  'text' : "outlined"} color="primary" className="" size="small">
               {
                  (loader && !blocked) ?
                  <img src={`${getCdnPath('assets')}wallet/withdraw/estimating.gif`} alt="" width={18} />
                  :
                  <RxUpdate className='loading' color="var(--primary)"/>
               }
               {uiName}
               {blocked && <SPAN variant="number" color="primary">{leftTime}s</SPAN>}
         </Button>
      </Container>
   )
}

export default SubscribeDepositsButton