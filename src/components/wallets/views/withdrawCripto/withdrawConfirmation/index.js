
import { useState, useEffect } from 'react'
import Layout from '../../../../forms/widgets/layout'
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

export default function WithdrawConfirmation({ 
    addressValue, 
    tagWithdrawAccount, 
    current_wallet, 
    withdrawProvider, 
    amount,
    currencySymbol,
    handleAction
}){

    const [ currentPriority, setPriority ] = useState('medium_priority')
    const [ priorityList ] = useState(withdrawProvider?.provider?.costs || [])
    const [ loader, setLoader ] = useState(null)
    const [ orderDetail, setOrderDetail ] = useState([])
    const { isMovilViewport } = useViewport()
    const actions = useActions();
    const accountName = tagWithdrawAccount?.account_name?.value


    const handleSubmit = async() => {
        setLoader(true)
        await handleAction()
        setLoader(false)
        // actions.renderModal(null)
    }

    const closeModal = () => {
        actions.renderModal(null)
    }

    const getOrderDetail = () => {

        const feeAmount = priorityList[currentPriority]?.fixed || 0
        const _amount = new BigNumber(amount)
        const _fee = new BigNumber(feeAmount)
        const _total = _amount.minus(_fee)

        setOrderDetail([
            ["Cantidad", `${_amount.toString()}  ${currencySymbol}`],
            ["Tarifa de red", {Component:() => <FeeComponent currentPriority={currentPriority} value={`${_fee.toString()} ${currencySymbol}`}/>}],
            ["Total a recibir", `${_total.toString()}   ${currencySymbol}`]
        ])

    }

    useEffect(() => {
        getOrderDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPriority])

    return(
        <Layout 
            closeControls={isMovilViewport}
            className="_show"
        >
            <LayoutContainer className="swing-in-bottom-bck">
                <HeaderContainer>
                    <IconSwitch icon={"withdraw"} color="white" size={24}/>
                    {/* <IconSwitch icon={current_wallet?.currency?.currency} size={30}/> */}
                    <h3 className="fuente">Confirmación de retiro</h3>
                    <WithdrawIcon currency={current_wallet?.currency?.currency} />
                </HeaderContainer>

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

                <PriorityComponent
                    availableCosts={withdrawProvider?.provider?.costs}
                    currentPriority={currentPriority}
                    setPriority={setPriority}
                />

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
                        formValidate
                        label="Confirmar retiro"
                    />
                </ControlsContainer>

            </LayoutContainer>
        </Layout>
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

  
