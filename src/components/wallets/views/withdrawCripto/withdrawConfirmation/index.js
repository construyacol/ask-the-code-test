import { useState, useEffect } from 'react'
import styled from 'styled-components'
import IconSwitch from '../../../../widgets/icons/iconSwitch'
import PriorityComponent from './priorityComponent'
import DetailTemplateComponent from '../../../../widgets/detailTemplate'
import ControlButton, { SecondaryButton } from "../../../../widgets/buttons/controlButton";
import { useActions } from "../../../../../hooks/useActions";
import BigNumber from "bignumber.js"
import FeeComponent from './IndicatorFee'
import { AddressContainer, Address } from '../tagItem'
import P from 'components/widgets/typography/p'
import { formatToCurrency } from "utils/convert_currency";
import {
    LayoutContainer,
    HeaderContainer,
    DetailContainer,
    ControlsContainer,
    GasLayout,
    Pcontainer,
    FromToCont,
    Title,
    Img,
    CoinsendaLabel,
    WithdrawIconContainer
} from './styles'


export default function WithdrawConfirmation({ 
    addressValue, 
    tagWithdrawAccount, 
    current_wallet, 
    withdrawProvider, 
    amount,
    currencySymbol,
    handleAction,
    callback,
    provider:{ withdrawData, setWithdrawData },
    priority:{ currentPriority, setPriority }
}){

    const [ loader, setLoader ] = useState(null)
    const [ orderDetail, setOrderDetail ] = useState([])
    const actions = useActions();
    const accountName = tagWithdrawAccount?.account_name?.value
    const { 
        network_data, 
        gas_limit, 
        fixedCost, 
        timeLeft, 
        isEthereum,
        total
    } = withdrawData

    let controlValidation = total?.isPositive() && total?.isGreaterThanOrEqualTo(withdrawProvider?.provider?.min_amount)

    const handleSubmit = async() => {
        setLoader(true)
        await handleAction({ cost_information:{ cost_id:currentPriority }, network_data, gas_limit })
        setLoader(false)
    }

    const closeModal = () => {
        actions.renderModal(null)
        callback && callback()
    }

    const calculateTotal = () => setWithdrawData(prevState => ({...prevState, total: new BigNumber(amount).minus(fixedCost)})) 
    
    const renderOrderDetail = () => {
        let _total = current_wallet ? formatToCurrency(total, current_wallet?.currency) : total
        let _fixedCost = current_wallet ? formatToCurrency(fixedCost, current_wallet?.currency) : fixedCost
        let totaToReceive = controlValidation ? `${_total?.toFormat()} ${currencySymbol}` : {Component:() => <p style={{color:"red", fontSize:"12px", margin:"0"}}>La cantidad no supera el mínimo permitido.</p>}
        setOrderDetail([
            ["Cantidad", `${new BigNumber(amount).toString()}  ${currencySymbol}`],
            ["Tarifa de red", {Component:() => <FeeComponent currentPriority={currentPriority} value={`${timeLeft >= 0 ? `(${timeLeft})`:''} ${_fixedCost.toFormat()} ${currencySymbol}`}/>}],
            ["Total a recibir", totaToReceive]
        ])
    }

    useEffect(() => {
        renderOrderDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total])

    useEffect(() => {
        calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority, fixedCost, timeLeft])

    return(
            <LayoutContainer className={`swing-in-bottom-bck ${isEthereum ? 'isEthereum' : ''}`}>
                <HeaderContainer>
                    <IconSwitch icon={"withdraw"} color="white" size={24}/>
                    <h3 className="fuente">Confirmación de retiro</h3>
                    <WithdrawIcon currency={current_wallet?.currency?.currency} />
                </HeaderContainer>

                <FromTo
                    addressValue={addressValue}
                    accountName={accountName}
                />

                <PriorityComponent
                    availableCosts={withdrawProvider?.provider?.costs}
                    currentPriority={currentPriority}
                    setPriority={setPriority}
                />

                {
                    isEthereum ? <HandleGas withdrawData={withdrawData} setWithdrawData={setWithdrawData}/> : <></>
                }

                <DetailContainer>
                    <DetailTemplateComponent
                        items={orderDetail}
                        skeletonItems={3}
                    />
                </DetailContainer>

                <ControlsContainer>
                    <SecondaryButton 
                        handleAction={closeModal}
                        label="Cancelar"
                    />
                    <ControlButton
                        loader={loader}
                        handleAction={handleSubmit}
                        formValidate={controlValidation}
                        label="Confirmar retiro"
                    />
                </ControlsContainer>
            </LayoutContainer>
            
    )
}


const HandleGas = ({withdrawData, setWithdrawData}) => {
    return(
        <GasLayout>
            <Pcontainer>
                <P variant="bold" size={15}>Gas</P>
                <P size={15} variant="number">{withdrawData?.gas_limit}</P>
            </Pcontainer>
            <input type="range" placeholder='gas' min="21000" max="80000" step="2" defaultValue={"25000"} onChange={({target:{value}}) => setWithdrawData(prevState => ({...prevState, gas_limit:value}))} />
            <Pcontainer>
                <P size={12}>Lento</P>
                <P size={12}>Rápido</P>
            </Pcontainer>
        </GasLayout>
    )
}


const FromTo = ({ addressValue, accountName }) => {
    return(
        <FromToCont>
            <From>
                <Img className="_firstStage">
                    <IconSwitch icon="coinsenda" color="var(--primary)" size={25}/>
                </Img>
                <Title className="fuente">De</Title>
                <CoinsendaLabel className="fuente">Coinsenda</CoinsendaLabel>
            </From>
            <To>
                <Img> 
                    <IconSwitch icon="qr" color="var(--primary)" size={20}/>
                </Img>
                <Title className="fuente">A ~ <span className={`${!accountName ? '_unregistered' : '_registered'}`}>{accountName || 'Wallet desconocida'}</span></Title>
                <AddressContainer
                    data-final-address={addressValue?.match(/..........$/g).toString()}
                >
                    <Address className="fuente2 address_">{addressValue}</Address>
                </AddressContainer>
            </To>
        </FromToCont>
    )
}



const WithdrawIcon = ({ currency }) => {
    return(
       <WithdrawIconContainer>
            <IconSwitch 
                icon={currency}
                color="var(--primary)" 
                size={40}

            />
       </WithdrawIconContainer>
    )
} 

export const ItemAddress = styled.div`
    display:grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    color:var(--paragraph_color);
    height: 40px;
    align-items: center;
    grid-template-areas: 
            "img title "
            "img address ";
`
export const From = styled(ItemAddress)`

`

export const To = styled(ItemAddress)`
    .address_,
    ${AddressContainer}::after {
        opacity: 1;
        color:var(--paragraph_color);
        line-height:initial;
    }

    ${Address}{
        margin:0;
    }
`