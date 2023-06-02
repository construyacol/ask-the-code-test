
// import { useState } from 'react'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { useSelector } from "react-redux";
import sleep from 'utils/sleep'
import useToastMessage from "hooks/useToastMessage";

export const TIME_LIMIT_PER_REQUEST = 60;

const useSubscribeDepositHook = () => {

  const [ coinsendaServices ] = useCoinsendaServices();
  const { deposit_providers } = useSelector((state) => state.modelData);
  const [ toastMessage ] = useToastMessage();

  const subscribeToNewDeposits = async(wallet) => {
    sessionStorage.setItem(`wallet_${wallet?.id}`, JSON.stringify(new Date()));
    let dep_prov = Array.from(new Set(wallet.dep_prov || []))
    for (const provider_id of dep_prov) {  
      if(deposit_providers[provider_id]?.currency_type === 'crypto') await coinsendaServices.subscribeToNewDeposits(provider_id, wallet?.id);
      await sleep(1500) 
    }
    // toastMessage('Detección de depósitos en progreso...')
  };

  const getSuscriptionDate = (walletId) => sessionStorage.getItem(`wallet_${walletId}`)
  const getSecondsElapsed = async(suscriptionDate) => {
    const { timeDifference } = await import('utils/date')
    return timeDifference(new Date(JSON.parse(suscriptionDate)))
  }

  const getSecondsElapsedSubscription = async(wallet, callback) => {
    let suscriptionDate = getSuscriptionDate(wallet?.id)
    // Si es la primera vez que se realiza la suscripción, se registra la misma y se procede a solicitar las suscripciones correspondientes.
    if(!suscriptionDate){
      await subscribeToNewDeposits(wallet) 
      suscriptionDate = getSuscriptionDate(wallet?.id)
    }
    let secondsElapsed = await getSecondsElapsed(suscriptionDate)
    // Si la suscripción ha superado el tiempo límite de vigencia, generamos una espera para entregar feedback al usuario
    if(secondsElapsed > TIME_LIMIT_PER_REQUEST) await sleep(1500)
    return secondsElapsed
 }
  
  const handleSubscribeToNewDeposits = async(wallet) => {
    let secondsElapsed = await getSecondsElapsedSubscription(wallet)
    let leftTime = TIME_LIMIT_PER_REQUEST - secondsElapsed
    // Si el tiempo restante es negativo es porque ya sobrepasó el limite establecido y puede volver a solicitar suscripciones
    if(Math.sign(leftTime) === -1) return subscribeToNewDeposits(wallet);
  }
  return { 
    handleSubscribeToNewDeposits, 
    getSecondsElapsedSubscription,
    subscribeToNewDeposits,
    TIME_LIMIT_PER_REQUEST
  }
}

export default useSubscribeDepositHook


 