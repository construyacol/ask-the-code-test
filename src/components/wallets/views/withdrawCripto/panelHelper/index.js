import { useEffect, useState } from 'react'
import StatusPanelComponent from 'components/forms/widgets/statusPanel'
import { StatusHeaderContainer, TitleContainer, StatusContainer } from 'components/forms/widgets/statusPanel/styles'
import { DetailContainer } from './styles'
import { HandleGas } from './ethGas'
import DetailTemplateComponent from 'components/widgets/detailTemplate'
import ControlButton from "components/widgets/buttons/controlButton";
import { MdSpeed } from 'react-icons/md';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FiArrowLeft } from 'react-icons/fi';

import BigNumber from "bignumber.js"
import { formatToCurrency } from "utils/convert_currency";
import FeeComponent from './IndicatorFee'

// styles
import { 
    PriorityContainer,
    PriorityItems,
    PriorityItem,
    Button,
    SpeedBar
} from './styles' 

const PanelHelper = props => {

    const [ orderDetail, setOrderDetail] = useState([["Cantidad", ""], ["Tarifa de red", ""]])

    const { 
        current_wallet,
        currencySymbol,
        withdrawProvider,
        loader,
        createWithdraw,
        active_trade_operation,
        amountState,
        addressState, 
        isMobile,
        isOpenPanel,
        setIsOpenPanel,
        addressValue,
        priority:{ priorityList, currentPriority, priorityConfig, setPriority },
        provider:{ withdrawData, setWithdrawData, ethers:{ baseFee } }
    } = props

    const { 
        fixedCost, 
        timeLeft, 
        amount,
        isEthereum,
        total,
        takeFeeFromAmount,
        availableBalance,
        totalBalance,
        minAmount
    } = withdrawData

    let controlValidation = total?.isPositive() && total?.isGreaterThanOrEqualTo(withdrawProvider?.provider?.min_amount)

    const calculateTotal = () => {
      let _amount = BigNumber(amount)
      // if(_amount.isNaN()) setWithdrawData(prevState => ({ ...prevState, total:BigNumber(0), withdrawAmount:BigNumber(0) })) ;
      // console.log('|||||| calculateTotal ==> ', _amount.isGreaterThan(availableBalance), _amount.toString(), availableBalance.toString(), withdrawProvider)
      let totalAmount = BigNumber(0)
      if(takeFeeFromAmount){
        totalAmount = _amount.minus(fixedCost)
        return setWithdrawData(prevState => ({ ...prevState, total:totalAmount, withdrawAmount:_amount })) 
      }else if(_amount.isGreaterThanOrEqualTo(withdrawProvider?.provider?.min_amount) && _amount.isLessThanOrEqualTo(totalBalance)){
        totalAmount = _amount.plus(fixedCost)
        return setWithdrawData(prevState => ({ ...prevState, total:totalAmount, withdrawAmount:totalAmount })) 
      }
      setWithdrawData(prevState => ({ ...prevState, total:BigNumber(0), withdrawAmount:BigNumber(0) }))
    }

    const renderOrderDetail = () => {

      let _orderDetail = []
      let _amount = BigNumber(amount || 0)
      let _total = current_wallet ? formatToCurrency(total, current_wallet?.currency) : total
      let _fixedCost = current_wallet ? formatToCurrency(fixedCost, current_wallet?.currency) : fixedCost
      _orderDetail = [
        ["Tarifa de red", {Component:() => <FeeComponent currentPriority={currentPriority} value={`${timeLeft >= 0 ? `(${timeLeft})`:''} ${_fixedCost.toFormat()} ${currencySymbol}`}/>}],
      ] 
      console.log('|||||| calculateTotal ==> ', _amount.isGreaterThan(availableBalance), _amount.toString(), availableBalance.toString(), withdrawProvider)

      if(totalBalance?.isLessThanOrEqualTo(withdrawProvider?.provider?.min_amount) || _amount.isGreaterThan(availableBalance))return setOrderDetail(_orderDetail);

      if(_amount.isGreaterThanOrEqualTo(minAmount)) _orderDetail.push(["Cantidad", `${_amount.toString()}  ${currencySymbol}`])

      if(takeFeeFromAmount){
        if(controlValidation) _orderDetail.push(["Total a recibir", `${_total?.toFormat()} ${currencySymbol}`] )
      }else{
        if(controlValidation && total.isLessThanOrEqualTo(totalBalance)) _orderDetail.push(["Total a retirar", `${_total?.toFormat()} ${currencySymbol}`] )
      }
      setOrderDetail(_orderDetail)
    }

    useEffect(() => {
      renderOrderDetail()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, timeLeft, fixedCost])
  
    useEffect(() => {
      calculateTotal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority, fixedCost, amount, baseFee])

    let title = isMobile || (!isMobile && props.withdrawConfirmed) ? 'Confirmación de retiro' : 'Velocidad de retiro'
    let isReady = addressState === 'good'

    // let Icon = priority === 'high' ? AiOutlineThunderbolt : priority === 'low' ? GiTurtle : MdSpeed 
    return(
        <StatusPanelComponent className={`criptoWithdraw ${!isMobile && props.withdrawConfirmed ? 'processConfirmation' : ''} ${isOpenPanel ? 'isOpen' : ''}`}>
              <StatusHeaderContainer className="criptoWithdrawCont">
                <TitleContainer skeleton={!isReady}>
                  <Button onClick={() => setIsOpenPanel(prevState => !prevState)}>
                    <FiArrowLeft color="var(--paragraph_color)" size={25}/>
                  </Button>
                  <h1 className="fuente">{title}</h1>
                </TitleContainer>
                {isMobile && <h4 style={{ color:"var(--paragraph_color)" }} className="fuente">Velocidad</h4>}
                
                {
                  isReady &&
                  <>
                  <PriorityContainer>
                    <PriorityItems>
                      {
                        Object.keys(priorityList).map((priority, index) => {
                          let Icon = priority === 'high' ? AiOutlineThunderbolt : MdSpeed
                          return(
                            <PriorityItem 
                              onClick={() => setPriority(priority)}
                              key={index} 
                              color={priorityConfig[priority].color} 
                              className={`${priority === currentPriority ? 'isActive' : ''} ${priority}`}
                            >
                              <Icon
                                size={30}
                                color={priority === currentPriority ? priorityConfig[priority].color : 'gray'}
                              />
                              <p className="fuente">{priorityConfig[priority].uiName}</p>
                              {/* <div className="speedBar" /> */}
                            </PriorityItem>
                          )
                        })
                      }
                    </PriorityItems>
                    <SpeedBar priority={currentPriority} color={priorityConfig[currentPriority].color} >
                      <p className="fuente description" style={{fontSize:"13px"}}>{priorityConfig[currentPriority].description}</p>
                    </SpeedBar>
                  </PriorityContainer>
                {
                  isEthereum ? <HandleGas 
                    addressState={addressState} 
                    current_wallet={current_wallet} 
                    toAddress={addressValue} 
                    withdrawData={withdrawData} 
                    setWithdrawData={setWithdrawData}
                    provider={props.provider}
                  /> : <></>
                }
                <StatusContainer>
                  <DetailContainer className="criptoHelper">
                  {
                    addressState === 'good' ?
                    <DetailTemplateComponent
                        items={orderDetail}
                        skeletonItems={1}
                    />
                    :<></>
                  }
                  </DetailContainer>
                </StatusContainer>
                  </>
                }
                

              </StatusHeaderContainer>
              {
                isReady &&
                <ControlButton
                  loader={loader}
                  handleAction={createWithdraw}
                  formValidate={!active_trade_operation && amountState === "good" && addressState === "good" && controlValidation}
                  label={loader ? 'Enviando...' : (!isMobile && !props.withdrawConfirmed) ? "Continuar" : "Retirar ahora"}
                />
              }
      </StatusPanelComponent>
    )
}


export default PanelHelper


// {
//   controlValidation &&
//   <TotalContainer>
//     <p className='fuente'>Total a retirar</p>
//     <h1 className='fuente2'>0.00045 <span>ETHT</span></h1>
//   </TotalContainer>
// }