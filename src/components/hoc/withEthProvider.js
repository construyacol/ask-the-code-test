import { useState, useEffect, useCallback, useRef } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { DEFAULT_COST_ID } from 'const/const'
import BigNumber from "bignumber.js"
import sleep from 'utils/sleep'


export default function withEthProvider(AsComponent) {
  return function (props) {

    const [ wProps ] = WithdrawViewState();
    const { current_wallet, withdrawProvidersByName } = wProps
    const withdrawProvider = withdrawProvidersByName[current_wallet?.currency?.currency]
    const [ currentPriority, setPriority ] = useState(DEFAULT_COST_ID)
    const [ priorityList ] = useState(withdrawProvider?.provider?.costs || [])
    const [ coinsendaServices ] = useCoinsendaServices();
    const componentIsMount = useRef()
    const [ withdrawData, setWithdrawData ] = useState({ 
      timeLeft:undefined, 
      baseFee:null, 
      fixedCost:null, 
      total:null, 
      network_data:null, 
      gas_limit:priorityList[currentPriority]?.gas_limit, 
      isEthereum:!withdrawProvider?.provider?.costs[DEFAULT_COST_ID]?.fixed && withdrawProvider?.address_validator_config?.name === 'eth' 
    })

    const getFixedCost = useCallback(async(baseFee) => {
      const maxFee = baseFee.times(2).plus(priorityList[currentPriority]?.fee_priority)
      const gas_limit = new BigNumber(withdrawData?.gas_limit)
      const fixedCost = gas_limit.times(maxFee)
      console.log('fixedCost', fixedCost.toFormat())
      setWithdrawData(prevState => ({...prevState, fixedCost}))
  }, [currentPriority, priorityList, withdrawData.gas_limit])

  
  const getBaseFee = async() => {
      const { data, error } = await coinsendaServices.fetchWithdrawProviderNetData(withdrawProvider?.id)   
      if(error)return alert(error?.message);
      const jwt = await import('jsonwebtoken')
      const dataNetDecoded = await jwt.decode(data);
      const { exp, base_fee } = dataNetDecoded;
      const baseFee = new BigNumber(base_fee)
      const expired = exp - 5
      setWithdrawData(prevState => ({...prevState, baseFee, network_data:data}))
      validateExpTime(expired)
  }

  const validateExpTime = async(exp) => {
      const currentTime = new Date().getTime()/1000;        
      const timeLeft = (exp - parseInt(currentTime));
      console.log('timeLeft', timeLeft)
      setWithdrawData(prevState => ({...prevState, timeLeft}))
      await sleep(1000)
      if(currentTime <= exp && componentIsMount?.current){
          return validateExpTime(exp)
      }else if(componentIsMount?.current){
          return getBaseFee()
      }
  }

  useEffect(() => {
      withdrawData.baseFee && getFixedCost(withdrawData.baseFee)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawData.baseFee, withdrawData.gas_limit, currentPriority])

  useEffect(() => {
      if(withdrawData?.isEthereum) getBaseFee();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
      <>
        <div ref={componentIsMount} style={{display:"none"}} />
        <AsComponent
          provider={{ withdrawData, setWithdrawData }}
          priority={{ currentPriority, setPriority, priorityList }}
          coinsendaServices={coinsendaServices}
          {...wProps} 
          {...props}
        />
      </>
    )
  };
}
 