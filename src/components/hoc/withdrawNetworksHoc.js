import { useState, useEffect } from "react";
import { useWalletInfo } from 'hooks/useWalletInfo'
import { isEmpty } from 'lodash'
import { useSelector } from "react-redux";
import { wProvsByCurrencyNetwork, selectDepositAccountsByNetwork } from 'selectors'
import { NETWORK_LABELS } from 'const/const'


export default function withdrawNetworksHoc(AsComponent) {
  return function (props) {

    const { currentWallet } = useWalletInfo()
    const [ networks, setNetworks ] = useState({})
    const [ currentNetwork, setCurrentNetwork ] = useState(props.currentNetwork || { provider_type:"" })
    const wProvsByNetwork = useSelector((state) => wProvsByCurrencyNetwork(state, currentWallet?.currency));
    const availableDepositAccounts = useSelector((state) => selectDepositAccountsByNetwork(state, currentWallet?.currency));
    console.log('wProvsByCurrencyNetwork', wProvsByNetwork)

    const toggleNetwork = (network) => {
      const { callback } = props
      setCurrentNetwork(networks[network])
      // sessionStorage.setItem(`withdrawNetworkDefault_${currentWallet?.id}`, JSON.stringify({suscriptionDate:new Date(), network}));
      callback && callback({providers:networks, current:networks[network]})
    }

    useEffect(() => {
      (async() => {
        let networksProviders = Object.keys(wProvsByNetwork)
        let _networks = {}
        console.log('wProvsByNetwork',wProvsByNetwork)
        for (let providerId of networksProviders) {
          const networkProvider = wProvsByNetwork[providerId]
            if(networkProvider?.currency_type !== 'crypto') continue;
            _networks = {
                ..._networks,
                [networkProvider.provider_type]:{
                  ...networkProvider,
                  uiName:NETWORK_LABELS[networkProvider?.provider_type]?.uiName, 
                  auxUiName:NETWORK_LABELS[networkProvider?.provider_type]?.auxUiName, 
                  icon:NETWORK_LABELS[networkProvider?.provider_type]?.icon, 
                  user_friendly:NETWORK_LABELS[networkProvider?.provider_type]?.user_friendly || availableDepositAccounts[providerId]?.user_friendly
                }
            }
        }
      setNetworks({..._networks})
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wProvsByNetwork])

    useEffect(() => {
      if(!isEmpty(networks)){
          (async() => {
            // const withdrawNetworkDefault = sessionStorage.getItem(`withdrawNetworkDefault_${currentWallet?.id}`)
            // if(!withdrawNetworkDefault)return;
            // const { suscriptionDate, network } = JSON.parse(withdrawNetworkDefault)
            // const { timeDifference } = await import('utils/date')
            // let secondsElapsed = timeDifference(new Date(suscriptionDate))
            // console.log('secondsElapsed', secondsElapsed)
            // if(secondsElapsed < 60) return toggleNetwork(network);
            // Si solo hay una red, se selecciona por defecto
            Object.keys(networks).length === 1 && toggleNetwork(Object.keys(networks)[0]);
          })()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [networks])




    return (
      <AsComponent
      currentNetwork={currentNetwork}
      networks={networks}
      toggleNetwork={toggleNetwork}
        {...props}
      />
    );
  };
}
 