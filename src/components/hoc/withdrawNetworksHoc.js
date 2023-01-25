import { useState, useEffect } from "react";
import { useWalletInfo } from 'hooks/useWalletInfo'
import { isEmpty } from 'lodash'
import { useSelector } from "react-redux";
import { wProvsByCurrencyNetwork, selectDepositAccountsByNetwork } from 'selectors'


export default function withdrawNetworksHoc(AsComponent) {
  return function (props) {

    const { currentWallet } = useWalletInfo()
    const [ networks, setNetworks ] = useState({})
    const [ currentNetwork, setCurrentNetwork ] = useState(props.currentNetwork || { provider_type:"" })
    const wProvsByNetwork = useSelector((state) => wProvsByCurrencyNetwork(state, currentWallet?.currency));
    const availableDepositAccounts = useSelector((state) => selectDepositAccountsByNetwork(state, currentWallet?.currency));

    const toggleNetwork = (network) => {
      const { callback } = props
      setCurrentNetwork(networks[network])
      sessionStorage.setItem(`withdrawNetworkDefault_${currentWallet?.id}`, network);
      callback && callback({providers:networks, current:networks[network]})
    }

    useEffect(() => {
      (async() => {
        let networksProviders = Object.keys(wProvsByNetwork)
        let _networks = {}
        for (let providerId of networksProviders) {
            const networkProvider = wProvsByNetwork[providerId]
            _networks = {
                ..._networks,
                [networkProvider.provider_type]:{
                  ...networkProvider,
                  user_friendly:availableDepositAccounts[providerId]?.user_friendly
                }
            }
        }
      setNetworks({..._networks})
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wProvsByNetwork])

    useEffect(() => {
      if(!isEmpty(networks)){
          (() => {
            const withdrawNetworkDefault = sessionStorage.getItem(`withdrawNetworkDefault_${currentWallet?.id}`)
            if(withdrawNetworkDefault) return toggleNetwork(withdrawNetworkDefault);
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
 