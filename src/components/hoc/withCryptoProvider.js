import { useState, useEffect, useCallback, useRef } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { DEFAULT_COST_ID } from 'const/const'
import { INFURA_URI, PRIORITY_CONFIG } from 'const/eth'
import BigNumber from "bignumber.js"
import sleep from 'utils/sleep'
import { formatToCurrency } from "utils/convert_currency";
import { getMinAmount } from 'utils/withdrawProvider'


const DEFAULT_TAKE_FEE_FROM_AMOUNT = true

export default function withCryptoProvider(AsComponent) {
  return function (props) {
    const [ wProps ] = WithdrawViewState();
    const { current_wallet, withdrawProvidersByName, balance } = wProps
    const [ withdrawProvider, setWithdrawProvider ] = useState(withdrawProvidersByName[current_wallet?.currency])
    const [ currentPriority, setPriority ] = useState(DEFAULT_COST_ID)
    const [ priorityList, setPriorityList ] = useState(withdrawProvider?.provider?.costs || [])
    const [ coinsendaServices ] = useCoinsendaServices();
    const [ withdrawData, setWithdrawData ] = useState({ 
      timeLeft:undefined, 
      amount:0,
      takeFeeFromAmount:DEFAULT_TAKE_FEE_FROM_AMOUNT,
      availableBalance: current_wallet ? formatToCurrency(balance.available, current_wallet?.currency) : new BigNumber(balance.available), 
      withdrawAmount:undefined,
      fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0), 
      total:new BigNumber(0), 
      minAmount:getMinAmount(withdrawProvider), 
      isEthereum:!priorityList[currentPriority]?.fixed && withdrawProvider?.address_validator_config?.name === 'eth' 
    })

    const [ ethers, setEthers ] = useState({
      ethersProvider:undefined,
      utils:undefined,
      network_data:null, 
      baseFee:0, 
      networkDataExp:undefined, 
      gas_limit:"0", 
      calculateGasLimit:() => null,
      getNetworkData:() => null
    })

    const componentIsMount = useRef()   
 
    const calculateGasLimit = useCallback((gasLimit) => {
      let gas_limit = BigNumber.isBigNumber(gasLimit) ? gasLimit : BigNumber(gasLimit)
      const additionalGas = gas_limit.times(0.1) 
      return gas_limit.plus(additionalGas) 
    }, [])

    const getEthFixedCost = useCallback(async(baseFee) => {
      if(!baseFee)return;
      const maxFee = baseFee.times(2).plus(priorityList[currentPriority]?.fee_priority)
      const gas_limit = calculateGasLimit(ethers?.gas_limit)
      const fixedCost = gas_limit.times(maxFee)
      setWithdrawData(prevState => ({...prevState, fixedCost}))
    }, [calculateGasLimit, currentPriority, priorityList, ethers.gas_limit])

    const fetchNetworkData = async() => coinsendaServices.fetchNetworkData(withdrawProvider?.id)  

    const getNetworkData = async() => {
      const currentTime = new Date().getTime()/1000    
      if(currentTime <= ethers?.networkDataExp){
        return ethers.network_data
      }else{
        const { data } = await fetchNetworkData()   
        return data
      }
    }

    const createEthersProvider = async() => {
      const { ethers } = await import('ethers');
      setEthers(prevState => ({
        ...prevState,
        ethersProvider:new ethers.providers.JsonRpcProvider(INFURA_URI),
        utils:ethers.utils,
        gas_limit:calculateGasLimit(priorityList[currentPriority]?.gas_limit).toFixed(0), 
        calculateGasLimit,
        getNetworkData
      }))
    }

    const initEthWithdraw = async() => {
      const { data, error } = await fetchNetworkData()    
      if(error)return alert(error?.message)
      const jwt = await import('jsonwebtoken')
      const dataNetDecoded = await jwt.decode(data)
      const { exp, base_fee } = dataNetDecoded
      const baseFee = new BigNumber(base_fee)
      const expired = exp - 10
      setEthers(prevState => ({...prevState, baseFee, network_data:data, networkDataExp:expired}))
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
      else getEthFixedCost(ethers?.baseFee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethers.baseFee, ethers.gas_limit, currentPriority])

    useEffect(() => {
      if(withdrawProvider && withdrawData?.isEthereum){
        initEthWithdraw()
        createEthersProvider()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProvider])

    useEffect(() => {
      let withdrawProvGlobalState = withdrawProvidersByName[current_wallet?.currency]
      if(!withdrawProvider && withdrawProvGlobalState){
        setWithdrawProvider(withdrawProvGlobalState)
        let _priorityList = withdrawProvGlobalState?.provider?.costs
        setPriorityList(_priorityList)
        setWithdrawData(prevState => ({
          ...prevState, 
          minAmount:getMinAmount(withdrawProvider), 
          isEthereum:!_priorityList[currentPriority]?.fixed && withdrawProvider?.address_validator_config?.name === 'eth' 
        }))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProvidersByName])


    useEffect(() => {
      if(withdrawProvider){
          const { takeFeeFromAmount, fixedCost } = withdrawData
          let minAmountProv = getMinAmount(withdrawProvider)
          let _minAmount = current_wallet ? formatToCurrency(minAmountProv, current_wallet?.currency) : minAmountProv
          let minAmountWithCost = fixedCost ? _minAmount.plus(fixedCost) : _minAmount
          setWithdrawData(prevState => ({...prevState, minAmount:takeFeeFromAmount === true ? minAmountWithCost : _minAmount}))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProvider, current_wallet, withdrawData.fixedCost, withdrawData.takeFeeFromAmount])
      
    return ( 
      <>
        <div ref={componentIsMount} style={{display:"none"}} />
        <AsComponent
          provider={{ withdrawData, setWithdrawData, ethers, setEthers }}
          priority={{ currentPriority, setPriority, priorityList, priorityConfig:PRIORITY_CONFIG }}
          coinsendaServices={coinsendaServices}
          withdrawProvider={withdrawProvider}
          {...wProps} 
          {...props}
        />
      </>
    )
  };
}
 