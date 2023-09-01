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

const ETHERS_INITIAL_STATE = {
  ethersProvider:undefined,
  utils:undefined,
  network_data:null, 
  baseFee:0, 
  networkDataExp:undefined, 
  gas_limit:"0", 
  calculateGasLimit:() => null,
  getNetworkData:() => null
}

export default function withCryptoProvider(AsComponent) {
  return function (props) {
    
    const defaultCostId = props?.defaultCostId || DEFAULT_COST_ID?.default
    const [ withdrawViewStateProps ] = WithdrawViewState();
    const current_wallet = withdrawViewStateProps?.current_wallet || props?.current_wallet
    const balance = withdrawViewStateProps?.balance || props?.balance
    const [ withdrawProviders, setNetworkProvider ] = useState({ current:{}, providers:{} })
    const [ currentPriority, setPriority ] = useState(defaultCostId)
    const [ priorityList, setPriorityList ] = useState(withdrawProviders?.current?.provider?.costs || [])
    const [ coinsendaServices ] = useCoinsendaServices();   

    const withdraw_accounts = useSelector((state) => selectWAccountsByAddressProvType(state, withdrawProviders?.current));

    const [ withdrawData, setWithdrawData ] = useState({ 
      timeLeft:undefined, 
      amount:'0',
      takeFeeFromAmount:DEFAULT_TAKE_FEE_FROM_AMOUNT,
      availableBalance: formatToCurrency(balance?.available, balance?.currency), 
      totalBalance: formatToCurrency(balance?.available, balance?.currency), 
      withdrawAmount:undefined,
      fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0), 
      total:new BigNumber(0), 
      minAmount:getMinAmount(withdrawProviders.current) || new BigNumber(0), 
      isEthereum:!priorityList[currentPriority]?.fixed && isEthValidator(withdrawProviders.current?.address_validator_config?.name)
    })


    const [ ethers, setEthers ] = useState(ETHERS_INITIAL_STATE)

    const componentIsMount = useRef()   
    const isEthereumRef = useRef()   
    
 
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
      const fixedCost = getFixedCost(withdrawProviders?.current?.address_validator_config?.name, baseFee)
      setWithdrawData(prevState => ({...prevState, fixedCost}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority, priorityList, ethers.gas_limit, withdrawProviders])

    const fetchNetworkData = async() => coinsendaServices.fetchNetworkData(withdrawProviders?.current?.id)  

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
      setEthers(prevState => ({...prevState, baseFee, network_data:data, networkDataExp:expired}))
      validateExpTime(expired)
      return data
    }

    const validateExpTime = async(exp) => {
      if(!isEthereumRef.current)return;
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
 

    const calculateTotal = () => {
      const { amount, takeFeeFromAmount, fixedCost, totalBalance } = withdrawData
      let parsedAmount = String(amount)?.slice()?.replace(/[,]/g, "")
      let _amount = BigNumber(parsedAmount)
      let totalAmount = BigNumber(0)
      if(takeFeeFromAmount){
        totalAmount = _amount.minus(fixedCost)
        return setWithdrawData(prevState => ({ ...prevState, total:totalAmount, withdrawAmount:_amount })) 
      }else if(_amount.isGreaterThanOrEqualTo(withdrawProviders.current?.provider?.min_amount) && _amount.isLessThanOrEqualTo(totalBalance)){
        totalAmount = _amount.plus(fixedCost)
        return setWithdrawData(prevState => ({ ...prevState, total:totalAmount, withdrawAmount:totalAmount })) 
      }
      setWithdrawData(prevState => ({ ...prevState, total:BigNumber(0), withdrawAmount:BigNumber(0) }))
    }


    useEffect(() => { // Calculo o actualizo el costo fijo segun se cambia de proveedor(red)
      if(!withdrawData?.isEthereum && priorityList[currentPriority]?.fixed){
        setWithdrawData(prevState => ({ ...prevState, fixedCost:new BigNumber(priorityList[currentPriority]?.fixed || 0) }));
      }else{
        getEthFixedCost(ethers?.baseFee);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethers.baseFee, ethers.gas_limit, currentPriority, priorityList])

    useEffect(() => {//inicializo config de ethereum si es necesario
      if(withdrawData?.isEthereum){
        isEthereumRef.current = true
        initEthWithdraw()
        createEthersProvider()
      }else{
        isEthereumRef.current = false
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawData?.isEthereum])

    useEffect(() => {//inicializo o actualizo la configuración de la red si se cambia de proveedor(red)
      if(!isEmpty(withdrawProviders?.current)){
        let _priorityList = withdrawProviders?.current?.provider?.costs
        setPriorityList(_priorityList)
        setPriority(DEFAULT_COST_ID[withdrawProviders?.current?.provider_type] || defaultCostId) //default cost or internal_network
        setWithdrawData(prevState => ({
          ...prevState, 
          timeLeft:undefined, 
          minAmount:getMinAmount(withdrawProviders?.current), 
          isEthereum:!_priorityList[currentPriority]?.fixed && isEthValidator(withdrawProviders?.current?.address_validator_config?.name)
        }))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProviders.current])

    useEffect(() => {
      if(withdrawProviders.current){ //inicializo o actualizo el monto mínimo si se modifica el costo fijo, gas limit o takeFeeFromAmount
        const { takeFeeFromAmount, fixedCost } = withdrawData
        let minAmountProv = getMinAmount(withdrawProviders.current)
        let _minAmount = current_wallet ? formatToCurrency(minAmountProv, current_wallet?.currency) : minAmountProv
        let minAmountWithCost = fixedCost ? _minAmount.plus(fixedCost) : _minAmount
        setWithdrawData(prevState => ({...prevState, minAmount:takeFeeFromAmount === true ? minAmountWithCost : _minAmount}))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawProviders.current, withdrawData.fixedCost, withdrawData.takeFeeFromAmount])

    useEffect(() => {//actualizo el monto disponible si se modifica el costo fijo, gas limit o takeFeeFromAmount
      const { totalBalance, fixedCost, minAmount } = withdrawData
      let finalBalance = formatToCurrency(balance?.available, balance?.currency)
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

    useEffect(() => {
      calculateTotal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority, withdrawData.fixedCost, withdrawData.amount, withdrawData.baseFee])
 
    return ( 
      <>
        <div ref={componentIsMount} style={{display:"none"}} />
        <AsComponent
          provider={{ withdrawData, setWithdrawData, ethers, setEthers, setNetworkProvider }}
          priority={{ currentPriority, setPriority, priorityList, priorityConfig:PRIORITY_CONFIG }}
          coinsendaServices={coinsendaServices}
          {...withdrawViewStateProps} 
          {...props}
          withdrawProviders={withdrawProviders}
          withdraw_accounts={withdraw_accounts}
          withdrawProvider={withdrawProviders.current}
        />
      </>
    )
  };
}
 