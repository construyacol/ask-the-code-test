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

// import { GiTurtle } from 'react-icons/gi';
import BigNumber from "bignumber.js"
import { formatToCurrency } from "utils/convert_currency";
import FeeComponent from './IndicatorFee'


// styles
import { 
    PriorityContainer,
    PriorityItems,
    PriorityItem,
    Button
} from './styles'


const PanelHelper = props => {

    const [ orderDetail, setOrderDetail] = useState([])

    const { 
        balance,
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
        provider:{ withdrawData, setWithdrawData }
    } = props

    const { 
        fixedCost, 
        timeLeft, 
        amount,
        isEthereum,
        total,
        baseFee
    } = withdrawData

    let controlValidation = total?.isPositive() && total?.isGreaterThanOrEqualTo(withdrawProvider?.provider?.min_amount)


    const calculateTotal = () => {
      let totalBalance = BigNumber(balance?.total)
      let _amount = BigNumber(amount)
      let totalAmount = _amount.plus(fixedCost)
      let total = totalAmount.isLessThanOrEqualTo(totalBalance) ? totalAmount : _amount.minus(fixedCost)
      let withdrawAmount = _amount.isGreaterThanOrEqualTo(withdrawProvider?.provider?.min_amount) && (total.isGreaterThanOrEqualTo(totalAmount) ? total : _amount)
      setWithdrawData(prevState => ({...prevState, total, withdrawAmount })) 
    }

    const renderOrderDetail = () => {
        let _total = current_wallet ? formatToCurrency(total, current_wallet?.currency) : total
        let totalBalance = BigNumber(balance?.total)
        let _amount = BigNumber(amount || 0)
        let finalCopy = controlValidation && _total.isGreaterThan(_amount) ? 'Total a retirar' : 'Total a recibir'
        let _fixedCost = current_wallet ? formatToCurrency(fixedCost, current_wallet?.currency) : fixedCost
        let _orderDetail = [
            ["Cantidad", `${_amount.toString()}  ${currencySymbol}`],
            ["Costo de red", {Component:() => <FeeComponent currentPriority={currentPriority} value={`${timeLeft >= 0 ? `(${timeLeft})`:''} ${_fixedCost.toFormat()} ${currencySymbol}`}/>}]
        ]
        if(_total.isLessThanOrEqualTo(totalBalance) && !_amount.isGreaterThan(totalBalance) && controlValidation && _amount.isGreaterThan(0)){
            _orderDetail.push([finalCopy, `${_total?.toFormat()} ${currencySymbol}`])
        }
        setOrderDetail(_orderDetail)
    }

    useEffect(() => {
        renderOrderDetail()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, timeLeft])

  
    useEffect(() => {
      calculateTotal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority, fixedCost, amount, baseFee])

    let title = isMobile ? 'Confirmación de retiro' : 'Velocidad de retiro'

    // let Icon = priority === 'high' ? AiOutlineThunderbolt : priority === 'low' ? GiTurtle : MdSpeed 
    return(
        <StatusPanelComponent className={`criptoWithdraw ${isOpenPanel ? 'isOpen' : ''}`}>
          <Button onClick={() => setIsOpenPanel(prevState => !prevState)}>
            <FiArrowLeft color="var(--paragraph_color)" size={25}/> Volver
          </Button>
          <StatusHeaderContainer className="criptoWithdrawCont">
            <TitleContainer>
              <h1 className="fuente">{title}</h1>
            </TitleContainer>

            {isMobile && <h4 style={{ color:"var(--paragraph_color)" }} className="fuente">Velocidad</h4>}
            
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
                        <div className="speedBar" />
                      </PriorityItem>
                    )
                  })
                }
              </PriorityItems>
              <p className="fuente" style={{fontSize:"13px", paddingTop:"10px"}}>{priorityConfig[currentPriority].description}</p>
            </PriorityContainer>
            
            {
              isEthereum ? <HandleGas 
                priorityList={priorityList} 
                currentPriority={currentPriority} 
                withdrawProvider={withdrawProvider} 
                addressState={addressState} 
                current_wallet={current_wallet} 
                toAddress={addressValue} 
                withdrawData={withdrawData} 
                setWithdrawData={setWithdrawData}
              /> : <></>
            }

            <StatusContainer>
              <DetailContainer className="criptoHelper">
                <DetailTemplateComponent
                    items={orderDetail}
                    skeletonItems={3}
                />
              </DetailContainer>
            </StatusContainer>
          </StatusHeaderContainer>

          <ControlButton
            loader={loader}
            handleAction={createWithdraw}
            formValidate={!active_trade_operation && amountState === "good" && addressState === "good" && controlValidation}
            label="Retirar ahora"
            // formValidate={(amountState === 'good' && addressState === 'good') && true}
          />
      </StatusPanelComponent>
    )
}


export default PanelHelper

