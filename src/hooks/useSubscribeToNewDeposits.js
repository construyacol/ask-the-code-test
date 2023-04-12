
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { useSelector } from "react-redux";
import sleep from 'utils/sleep'

export const TIME_LIMIT_PER_REQUEST = 60;

const useSubscribeDepositHook = () => {

  const [ coinsendaServices ] = useCoinsendaServices();
  const { deposit_providers } = useSelector((state) => state.modelData);

  const subscribeToNewDeposits = async(wallet) => {
    sessionStorage.setItem(`wallet_${wallet?.id}`, JSON.stringify(new Date()));
    for (const provider_id of wallet?.dep_prov) {  
      // console.log('CONSULTANDO_DEPOSITOS_DE', deposit_providers[provider_id]?.currency, deposit_providers[provider_id]?.provider_type)
      if(deposit_providers[provider_id]?.currency_type === 'crypto') await coinsendaServices.subscribeToNewDeposits(provider_id, wallet?.id);
      await sleep(1500) 
    }
  };

  const handleSubscribeToNewDeposits = async(wallet) => {
    const { timeDifference } = await import('utils/date')
    let suscriptionDate = sessionStorage.getItem(`wallet_${wallet?.id}`)
    // Si no se dispone de una fecha de suscripción, significa que es la primera vez que se realiza la suscripción, por lo tanto, se registra una nueva fecha de suscripción y se procede a solicitar las suscripciones correspondientes.
    if(!suscriptionDate) return subscribeToNewDeposits(wallet);
    let secondsElapsed = timeDifference(new Date(JSON.parse(suscriptionDate)))
    let leftTime = TIME_LIMIT_PER_REQUEST - secondsElapsed
    // console.log('TIEMPO_RESTANTE => ', leftTime)
    // Si el tiempo restante es negativo es porque ya sobrepasó el limite establecido y puede volver a solicitar suscripciones
    if(Math.sign(leftTime) === -1) return subscribeToNewDeposits(wallet);
  }

  return { handleSubscribeToNewDeposits }
}

export default useSubscribeDepositHook


 