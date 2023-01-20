import { useState, useEffect } from "react";
import { useWalletInfo } from 'hooks/useWalletInfo'
import { isEmpty } from 'lodash'
import { useSelector } from "react-redux";
import { selectDepositAccountsByNetwork, selectDepositProvsByNetwork } from 'selectors'
import { useCoinsendaServices } from "services/useCoinsendaServices";


export default function depositNetworksHoc(AsComponent) {
  return function (props) {
 
    const { currentWallet } = useWalletInfo()
    const [ networks, setNetworks ] = useState({})
    const [ currentNetwork, setCurrentNetwork ] = useState(props.currentNetwork || { provider_type:"" })
    const availableDepositAccounts = useSelector((state) => selectDepositAccountsByNetwork(state, currentWallet?.currency));
    const depositProviders = useSelector((state) => selectDepositProvsByNetwork(state, currentWallet?.currency));
    const [ coinsendaServices ] = useCoinsendaServices();

    const toggleNetwork = (network) => {
      const { callback } = props
      setCurrentNetwork(networks[network])
      sessionStorage.setItem(`depositNetworkDefault_${currentWallet?.id}`, network);
      callback && callback({providers:networks, current:networks[network]})
    }   

    useEffect(() => {
        (async() => {
            if(isEmpty(availableDepositAccounts))return;
            let _networks = {}
            for (const depositAccountNetwork in availableDepositAccounts) {
              let network = depositProviders[depositAccountNetwork]
              if(!network) network = await coinsendaServices.createAndInsertDepositProvider(currentWallet, availableDepositAccounts[depositAccountNetwork]?.id)
              _networks = {
                ..._networks,
                [availableDepositAccounts[depositAccountNetwork]?.provider_type]:{
                  ...network, 
                  user_friendly:availableDepositAccounts[depositAccountNetwork]?.user_friendly}
              }
            }
            setNetworks({..._networks})
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableDepositAccounts, depositProviders])

    useEffect(() => {
      if(!isEmpty(networks)){
          (() => {
            const depositNetworkDefault = sessionStorage.getItem(`depositNetworkDefault_${currentWallet?.id}`)
            if(depositNetworkDefault) return toggleNetwork(depositNetworkDefault);
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
