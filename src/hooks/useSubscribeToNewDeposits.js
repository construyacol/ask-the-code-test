
import { useCoinsendaServices } from "services/useCoinsendaServices";
import sleep from 'utils/sleep'

const useSubscribeDepositHook = props => {

  const [ coinsendaServices ] = useCoinsendaServices();

  const subscribeToNewDeposits = async(provider_id, times = 0, intervalTime = 5000) => {
    await sleep(1000)
    times --
    if(times >= 0){ 
      await coinsendaServices.subscribeToNewDeposits(provider_id);
      await sleep(intervalTime)
      return subscribeToNewDeposits(provider_id, times)
    }
  };

    return { subscribeToNewDeposits }
}

export default useSubscribeDepositHook


