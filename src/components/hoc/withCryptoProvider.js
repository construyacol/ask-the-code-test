import { useState, useEffect, useCallback, useRef } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { DEFAULT_COST_ID } from 'const/const'
import BigNumber from "bignumber.js"
import sleep from 'utils/sleep'


export default function withCryptoProvider(AsComponent) {
  return function (props) {

    const [ wProps ] = WithdrawViewState();
    const { current_wallet, withdrawProvidersByName } = wProps
    const withdrawProvider = withdrawProvidersByName[current_wallet?.currency?.currency]
    const [ currentPriority, setPriority ] = useState(DEFAULT_COST_ID)
    const [ priorityList ] = useState(withdrawProvider?.provider?.costs || [])
    const [ coinsendaServices ] = useCoinsendaServices();
    const [ withdrawData, setWithdrawData ] = useState({ 
      timeLeft:undefined, 
      baseFee:0, 
      amount:0,
      networkDataExp:undefined, 
      fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0), 
      total:new BigNumber(0), 
      network_data:null, 
      gas_limit:priorityList[currentPriority]?.gas_limit, 
      isEthereum:!priorityList[currentPriority]?.fixed && withdrawProvider?.address_validator_config?.name === 'eth' 
    })
    const componentIsMount = useRef()
    const getEthFixedCost = useCallback(async(baseFee) => {
      if(!baseFee)return;
      const maxFee = baseFee.times(2).plus(priorityList[currentPriority]?.fee_priority)
      const gas_limit = new BigNumber(withdrawData?.gas_limit)
      const fixedCost = gas_limit.times(maxFee)
      setWithdrawData(prevState => ({...prevState, fixedCost}))
    }, [currentPriority, priorityList, withdrawData.gas_limit])

    const fetchNetworkData = async() => coinsendaServices.fetchNetworkData(withdrawProvider?.id)  
    const getNetworkData = async() => {
      const currentTime = new Date().getTime()/1000    
      if(currentTime <= withdrawData?.networkDataExp){
        return withdrawData.network_data
      }else{
        const { data } = await fetchNetworkData()   
        return data
      }
    }

    const initEthWithdraw = async() => {
      const { data, error } = await coinsendaServices.fetchNetworkData(withdrawProvider?.id)     
      if(error)return alert(error?.message)
      const jwt = await import('jsonwebtoken')
      const dataNetDecoded = await jwt.decode(data)
      const { exp, base_fee } = dataNetDecoded
      const baseFee = new BigNumber(base_fee)
      const expired = exp - 10
      setWithdrawData(prevState => ({...prevState, baseFee, network_data:data, networkDataExp:expired}))
      validateExpTime(expired)
      return data
    }

    const validateExpTime = async(exp) => {
      const currentTime = new Date().getTime()/1000;        
      const timeLeft = (exp - parseInt(currentTime));
      setWithdrawData(prevState => ({...prevState, timeLeft}))
      await sleep(1000)
      if(currentTime <= exp && componentIsMount?.current){
          return validateExpTime(exp)
      }else if(componentIsMount?.current){
          return initEthWithdraw()
      }
    }
 
    useEffect(() => {
      if(!withdrawData?.isEthereum && priorityList[currentPriority]?.fixed)  
      setWithdrawData(prevState => ({ ...prevState, fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0) }));
      else getEthFixedCost(withdrawData?.baseFee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawData.baseFee, withdrawData.gas_limit, currentPriority])

    useEffect(() => {
      if(withdrawData?.isEthereum) initEthWithdraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return (
      <>
        <div ref={componentIsMount} style={{display:"none"}} />
        <AsComponent
          provider={{ withdrawData, setWithdrawData, getNetworkData }}
          priority={{ currentPriority, setPriority }}
          coinsendaServices={coinsendaServices}
          withdrawProvider={withdrawProvider}
          {...wProps} 
          {...props}
        />
      </>
    )
  };
}
 