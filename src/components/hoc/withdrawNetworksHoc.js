import { useState, useEffect } from "react";
import { useWalletInfo } from 'hooks/useWalletInfo'
import { isEmpty } from 'lodash'
import { useSelector } from "react-redux";
import { selectWithdrawProviderByName } from 'selectors'


export default function withdrawNetworksHoc(AsComponent) {
  return function (props) {

    const { currentWallet, modelData:{ withdrawProviders }} = useWalletInfo()
    const [ networks, setNetworks ] = useState({})
    const [ currentNetwork, setCurrentNetwork ] = useState({ provider_type:"" })
    const withdrawProvidersByName = useSelector((state) => selectWithdrawProviderByName(state));

    const toggleNetwork = (network) => {
      const { callback } = props
      setCurrentNetwork(networks[network])
      callback && callback({providers:networks, current:networks[network]})
    }

    useEffect(() => {
      (async() => {
        const currentProvider = withdrawProvidersByName[currentWallet.currency]
        // let networksProviders = [ currentProvider.id, "63815598fd21970048f07f07" ]
        let networksProviders = [ currentProvider.id ]
        let _networks = {}
        for (let providerId of networksProviders) {
            const networkProvider = withdrawProviders[providerId]
            _networks = {
                ..._networks,
                [networkProvider.provider_type]:networkProvider
            }
        }
        setNetworks({..._networks})
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProviders])

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
 