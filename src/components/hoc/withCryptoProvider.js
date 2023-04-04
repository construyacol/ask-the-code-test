import { useState, useEffect, useCallback, useRef } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { DEFAULT_COST_ID } from 'const/const'
import { INFURA_URI, PRIORITY_CONFIG } from 'const/eth'
import BigNumber from "bignumber.js"
import sleep from 'utils/sleep'
import { formatToCurrency } from "utils/convert_currency";
import { getMinAmount } from 'utils/withdrawProvider'
import { useSelector } from "react-redux";
import { selectWAccountsByAddressProvType } from 'selectors'
import { isEmpty } from 'lodash' 

const DEFAULT_TAKE_FEE_FROM_AMOUNT = false 

const isEthValidator = name => {
  return (name === 'eth' || name === 'bnb') ? true : false;
}

export default function withCryptoProvider(AsComponent) {
  return function (props) {
    const [ wProps ] = WithdrawViewState();
    const { current_wallet, withdrawProvidersByName, balance } = wProps
    const [ withdrawProviders, setNetworkProvider ] = useState({ current:{}, providers:{} })
    const [ withdrawProvider, setWithdrawProvider ] = useState(withdrawProvidersByName[current_wallet?.currency]) 
    const [ currentPriority, setPriority ] = useState(DEFAULT_COST_ID[withdrawProvider?.provider_type] || DEFAULT_COST_ID?.default)
    const [ priorityList, setPriorityList ] = useState(withdrawProvider?.provider?.costs || [])
    const [ coinsendaServices ] = useCoinsendaServices();   

    const withdraw_accounts = useSelector((state) => selectWAccountsByAddressProvType(state, withdrawProviders?.current));
    
    // console.log('withdraw_accounts', withdraw_accounts)

    const [ withdrawData, setWithdrawData ] = useState({ 
      timeLeft:undefined, 
      amount:0,
      takeFeeFromAmount:DEFAULT_TAKE_FEE_FROM_AMOUNT,
      availableBalance: formatToCurrency(balance.available, balance?.currency), 
      totalBalance: formatToCurrency(balance.available, balance?.currency), 
      withdrawAmount:undefined,
      fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0), 
      total:new BigNumber(0), 
      minAmount:getMinAmount(withdrawProvider), 
      isEthereum:!priorityList[currentPriority]?.fixed && isEthValidator(withdrawProvider?.address_validator_config?.name)
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

    const getFixedCost = (networkName, amountFee) => {
      let fixedCost
      const gas_limit = calculateGasLimit(ethers?.gas_limit)
      if(networkName === 'eth'){
        const maxFee = amountFee.times(2).plus(priorityList[currentPriority]?.fee_priority)
        fixedCost = gas_limit.times(maxFee)
      }else{
        fixedCost = gas_limit.times(amountFee)
      }
      return fixedCost
    }

    const getEthFixedCost = useCallback(async(baseFee) => {
      if(!baseFee)return;
      const fixedCost = getFixedCost(withdrawProvider?.address_validator_config?.name, baseFee)
      setWithdrawData(prevState => ({...prevState, fixedCost}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const { exp, base_fee, gas_price } = dataNetDecoded
      const baseFee = new BigNumber(base_fee || gas_price)
      const expired = exp - 10
      console.log('expired', expired)
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
      if(!isEmpty(withdrawProviders.current)){
        setWithdrawProvider(withdrawProviders.current)
        setPriorityList(withdrawProviders?.current?.provider?.costs)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProviders])
 
    useEffect(() => {
      if(!withdrawData?.isEthereum && priorityList[currentPriority]?.fixed)  
      setWithdrawData(prevState => ({ ...prevState, fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0) }));
      else getEthFixedCost(ethers?.baseFee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethers.baseFee, ethers.gas_limit, currentPriority, priorityList])

    const initETH = async() => {
      if(withdrawProvider && withdrawData?.isEthereum){
        initEthWithdraw()
        createEthersProvider()
      }else{
      await sleep(500)
      initETH()
      }
    }

    useEffect(() => {
      initETH()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      let withdrawProvGlobalState = withdrawProvidersByName[current_wallet?.currency]
      if(!withdrawProvider && withdrawProvGlobalState){
        setWithdrawProvider(withdrawProvGlobalState)
        let _priorityList = withdrawProvGlobalState?.provider?.costs
        setPriorityList(_priorityList)
        setWithdrawData(prevState => ({
          ...prevState, 
          minAmount:getMinAmount(withdrawProvider), 
          isEthereum:!_priorityList[currentPriority]?.fixed && isEthValidator(withdrawProvider?.address_validator_config?.name)
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

    useEffect(() => {
      if(withdrawProvider){
        setPriority(DEFAULT_COST_ID[withdrawProvider?.provider_type] || DEFAULT_COST_ID?.default)
      }
    }, [withdrawProvider])



    useEffect(() => {
      const { totalBalance, fixedCost, minAmount } = withdrawData
      let finalBalance = formatToCurrency(balance.available, balance?.currency)
      if(!withdrawData.takeFeeFromAmount){
          if(totalBalance?.minus(fixedCost).isGreaterThanOrEqualTo(minAmount)){
            finalBalance = finalBalance?.minus(fixedCost)
          }else{
            finalBalance = BigNumber(0)
          }
      }
      setWithdrawData(prevState => ({...prevState, availableBalance:finalBalance}))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawData.minAmount, withdrawData.fixedCost])

    // console.log('withdrawData', withdrawData)

 
    return ( 
      <>
        <div ref={componentIsMount} style={{display:"none"}} />
        <AsComponent
          provider={{ withdrawData, setWithdrawData, ethers, setEthers, setNetworkProvider }}
          priority={{ currentPriority, setPriority, priorityList, priorityConfig:PRIORITY_CONFIG }}
          coinsendaServices={coinsendaServices}
          {...wProps} 
          {...props}
          withdrawProviders={withdrawProviders}
          withdraw_accounts={withdraw_accounts}
          withdrawProvider={withdrawProvider}
        />
      </>
    )
  };
}
 