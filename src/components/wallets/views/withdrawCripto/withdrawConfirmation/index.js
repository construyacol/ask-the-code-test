import { useState, useEffect } from 'react'
import styled from 'styled-components'
import IconSwitch from '../../../../widgets/icons/iconSwitch'
import PriorityComponent from './priorityComponent'
import { Text } from './styles'
import DetailTemplateComponent from '../../../../widgets/detailTemplate'
import ControlButton, { SecondaryButton } from "../../../../widgets/buttons/controlButton";
import { useActions } from "../../../../../hooks/useActions";
import BigNumber from "bignumber.js"
import FeeComponent from './IndicatorFee'
import { AddressContainer, Address } from '../tagItem'
import useViewport from '../../../../../hooks/useWindowSize' 
import P from 'components/widgets/typography/p'



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
    priority:{ currentPriority, setPriority, priorityList }
}){

    const [ loader, setLoader ] = useState(null)
    const [ orderDetail, setOrderDetail ] = useState([])
    const { isMovilViewport } = useViewport()
    const actions = useActions();
    const accountName = tagWithdrawAccount?.account_name?.value

    const handleSubmit = async() => {
        setLoader(true)
        const { network_data, gas_limit } = withdrawData
        await handleAction({cost_information:{cost_id:currentPriority}, network_data, gas_limit})
        setLoader(false)
    }

    const closeModal = () => {
        actions.renderModal(null)
        callback && callback()
    }

    const getOrderDetail = () => {
        const feeAmount = priorityList[currentPriority]?.fixed || 0
        const _amount = new BigNumber(amount)
        const _fixedCost = withdrawData.fixedCost || new BigNumber(feeAmount)
        const total = _amount.minus(_fixedCost)
        setWithdrawData(prevState => ({...prevState, total}))
        setOrderDetail([
            ["Cantidad", `${_amount.toString()}  ${currencySymbol}`],
            ["Tarifa de red", {Component:() => <FeeComponent currentPriority={currentPriority} value={`${withdrawData.timeLeft >= 0 ? `(${withdrawData.timeLeft})`:''} ${_fixedCost.toString()} ${currencySymbol}`}/>}],
            ["Total a recibir", `${total.toString()}   ${currencySymbol}`]
        ])
    } 

    useEffect(() => {
        getOrderDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority, withdrawData.fixedCost, withdrawData.timeLeft])
    

    return(
        
            <LayoutContainer className={`swing-in-bottom-bck ${withdrawData?.isEthereum ? 'isEthereum' : ''}`}>
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
                    withdrawData?.isEthereum ? <HandleGas withdrawData={withdrawData} setWithdrawData={setWithdrawData}/> : <></>
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
                        formValidate={withdrawData?.total?.isPositive()}
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

const Pcontainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const GasLayout = styled.div`
    padding: 0 20px;
    position: relative;
    height: 80px;
    display: grid;
    p{
        margin:0;
    }
`

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
                // icon={"withdrawConfirm"}
                color="var(--primary)" 
                size={40}

            />
       </WithdrawIconContainer>
    )
} 

const ControlsContainer = styled.div`

    height:100px;
    display:flex;
    justify-content:center;
    place-items: center;
    padding: 0 35px;
    column-gap: 15px;

    .botonForm{
        height: 50px;
        padding: 10px 20px;
        font-size: 15px !important;
        font-weight: 800;
    }

    .ioSystem{
        position: initial;
        bottom: auto;
    }

    @media (max-width: 768px) {
        position: fixed;
        bottom: 30px;
        width: calc(100vw - 70px);
        flex-direction: column;
    }
`

const DetailContainer = styled.div`
    display: grid;
    row-gap: 10px;
`

const Img = styled.div`
    grid-area: img;
    width: 40px;
    height: 40px;
    background: #f5f5f5;
    display: flex;
    place-content: center;
    border-radius: 50%;

    &._firstStage{
        position:relative;
        &::after{
            content: "";
            background: var(--primary);
            position: absolute;
            width: 2px;
            height: 30px;
            bottom: -32px;
        }
    }
`

const Title = styled(Text)`
    grid-area: title;
    font-weight:bold;
    font-size:15px;
    span{
        font-weight: 200;
        &._unregistered{
          color:#ff3939;  
        }
        &._registered{
          color:var(--primary);  
          ${'' /* color:#009100;   */}
        }
    }
`

const CoinsendaLabel = styled(Text)`
    grid-area: address;
    font-size:14px;
`

// const Address = styled(Text)`
//     grid-area: address;
//     font-size:12px;
// `

const itemAddress = styled.div`
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
const From = styled(itemAddress)`

`

const To = styled(itemAddress)`

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

const FromToCont = styled.div`
    padding: 10px 37px 0;
    display: flex;
    row-gap: 35px;
    flex-direction: column;
`

const WithdrawIconContainer = styled.div`
    width:76px;
    height:76px;
    background:white;
    position:absolute;
    border-radius: 50%;
    bottom: -38px;
    right: 20px;
    display: grid;
    place-items: center;
    .iconSty{
        position: absolute;
    }
`

const HeaderContainer = styled.div`
    background: linear-gradient(to bottom right, var(--title1), var(--primary));
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    display:flex;
    column-gap: 15px;
    position: relative;

    h3{
        color:white;
        margin:10px 0;
    }
`

const LayoutContainer = styled.section`
    width:100vw;
    background:white;
    justify-self: center;
    align-self: center;
    max-width:425px;
    max-height:600px;
    position:relative;
    border-radius:6px;
    display: flex;
    flex-direction: column;
    row-gap: 25px;

    position:absolute;
    z-index: 9999999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;

    &.isEthereum{
        max-height:700px;
    }

    ${DetailContainer}{
        padding:0 20px;
    }

    ${HeaderContainer}{
        padding:20px;
    }

    @media (max-width: 768px) {
        max-height:100vh;
        height: 100vh;
        border-radius: 0;
    }

`

  
