import { useState, useEffect } from "react";
import { useWalletInfo } from 'hooks/useWalletInfo'
import { isEmpty } from 'lodash'


export default function depositNetworksHoc(AsComponent) {
  return function (props) {

    const { currentWallet, modelData:{ deposit_providers }} = useWalletInfo()
    const [ networks, setNetworks ] = useState({})
    const [ currentNetwork, setCurrentNetwork ] = useState({ provider_type:"" })

    const toggleNetwork = (network) => {
      const { callback } = props
      setCurrentNetwork(networks[network])
      callback && callback({providers:networks, current:networks[network]})
    }

    useEffect(() => {
        (async() => {
            let networksProviders = currentWallet?.dep_prov
            // networksProviders.push('6381a404b40ace0029e0c719')
            let _networks = {}
            for (let providerId of networksProviders) {
                const networkProvider = deposit_providers[providerId]
                _networks = {
                    ..._networks,
                    [networkProvider.provider_type]:networkProvider
                }
            }
            setNetworks({..._networks})
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deposit_providers])

    useEffect(() => {
        if(!isEmpty(networks)){
            toggleNetwork(Object.keys(networks)[0])
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
 