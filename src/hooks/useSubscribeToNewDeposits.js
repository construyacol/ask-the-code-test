
import { useCoinsendaServices } from "services/useCoinsendaServices";
import sleep from 'utils/sleep'

const useSubscribeDepositHook = props => {

    const [ coinsendaServices ] = useCoinsendaServices();

    const subscribeToNewDeposits = async(provider_id, times = 0, intervalTime = 4000) => {
      await sleep(1000)
      await coinsendaServices.subscribeToNewDeposits(provider_id);
      times --
      if(times >= 0){
        await sleep(intervalTime)
        console.log('subscribeToNewDeposits', times)
        return subscribeToNewDeposits(provider_id, times)
      }
    };

    return { subscribeToNewDeposits }
}

export default useSubscribeDepositHook


