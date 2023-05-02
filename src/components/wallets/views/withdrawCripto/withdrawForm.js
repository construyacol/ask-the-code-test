import { useEffect } from 'react'
import IconSwitch from "../../../widgets/icons/iconSwitch";
import InputForm from "../../../widgets/inputs/inputForm";
import { QrReader } from 'core/components/molecules'
// import ControlButton from "../../../widgets/buttons/controlButton";

import AddressBookCTA from "../../../widgets/modal/render/addressBook/ctas";
import AddressTagList from "./addressTagList";
import TagItem from "./tagItem";
import AvailableBalance from '../../../widgets/availableBalance'
import ControlButton from "components/widgets/buttons/controlButton";

// Styled components
import { 
    IconsContainer, 
    WithdrawForm,
    HandlePriorityCont
} from './styles'

// third party 
import styled from 'styled-components'
import { OptionInput } from 'components/molecules'
import { formatToCurrency } from "utils/convert_currency";
import BigNumber from "bignumber.js";
import { MdSpeed } from 'react-icons/md';
import { parseSymbolCurrency } from 'core/config/currencies'
import withdrawQrHoc from 'components/hoc/withdrawQrHoc'



const WithdrawQrReader = withdrawQrHoc(QrReader)

const WithdrawFormComponent = ({
    setAddressState,
    handleChangeAddress,
    addressValue,
    currencySymbol,
    loader,
    tagWithdrawAccount,
    addressState,
    setAddressValue,
    addressToAdd,
    deleteTag,
    setAmountState,
    handleChangeAmount,
    amountState,
    handleMaxAvailable,
    amountValue,
    setIsOpenPanel,
    active_trade_operation,
    current_wallet,
    isMobile,
    provider:{ withdrawData:{ takeFeeFromAmount, totalBalance, availableBalance, fixedCost, amount, minAmount }, setWithdrawData },
    priority:{ currentPriority, priorityConfig },
    withdrawProviders
}) => {

    // const idForClickeableElement = useKeyActionAsClick(true, "main-deposit-crypto-button", 13, false, "onkeyup");
    const switchFixedCost = () => {
        let inputEl = document.querySelector('[name="amount"]')
        if(inputEl?.value) inputEl.value = '';
        setWithdrawData(prevState => ({...prevState, total:BigNumber(0), amount:'0', takeFeeFromAmount:!takeFeeFromAmount}))
    }

    const togglePanel = () => setIsOpenPanel(prevState => !prevState)

    useEffect(() => {
        // Handle amount state
        if(minAmount){
            let avBalance = takeFeeFromAmount ? totalBalance : totalBalance?.minus(fixedCost)
            let _amount = formatToCurrency(amount, current_wallet.currency)
            if(_amount.isGreaterThan(avBalance)) setAmountState('bad')
            if(!takeFeeFromAmount && _amount.isLessThanOrEqualTo(avBalance) && _amount.isGreaterThanOrEqualTo(minAmount)) setAmountState('good')
            if(takeFeeFromAmount && _amount.isLessThan(minAmount)) setAmountState('bad')
            if(takeFeeFromAmount && _amount.isGreaterThanOrEqualTo(minAmount)) setAmountState('good')
            if(minAmount.isLessThanOrEqualTo(0)) setAmountState('bad')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fixedCost, minAmount])

    return(
        <WithdrawForm
        id="withdrawForm"
        className={`${isMobile ? "movil" : ""}`}
        onSubmit={(e) => e.preventDefault()}
        >
        <InputForm  
            type="text" 
            placeholder={"Escribe @ para ver tu lista de direcciones..."}
            name="address" 
            handleStatus={setAddressState}
            isControlled 
            handleChange={handleChangeAddress}
            value={addressValue}
            label={() => <LabelAddress currencySymbol={currencySymbol} withdrawProvider={withdrawProviders?.current}   />}
            disabled={loader || tagWithdrawAccount}
            autoFocus={true}
            currentNetwork={withdrawProviders?.current}
            SuffixComponent={() => (
                <IconsContainer>
                    {
                        addressState === "good" ?
                        <IconSwitch
                            className="superImposed"
                            icon={`verify`}
                            color={`green`}
                            size={22}
                        />
                        : 
                        <WithdrawQrReader networks={withdrawProviders} callback={setAddressValue}/>
                        
                    }
                </IconsContainer>
            )}
            AuxComponent={[
                () => (<AddressBookCTA currentNetwork={withdrawProviders?.current} setAddressValue={setAddressValue} addressToAdd={addressToAdd} />),
                () => (<AddressTagList currentNetwork={withdrawProviders?.current} addressState={addressState} show={addressValue && addressValue.match(/^@/g)} addressValue={addressValue} setAddressValue={setAddressValue}/>),
                () => (<TagItem withdrawAccount={tagWithdrawAccount} deleteTag={deleteTag}/>)
            ]} 
        />
                <InputForm  
                    className={addressState !== "good" ? 'hide' : 'isReady'}
                    type="text"
                    inputMode="number"
                    minAmount={minAmount}
                    placeholder={`Min: ${minAmount}`}
                    name="amount"
                    handleStatus={setAmountState}
                    handleChange={handleChangeAmount}
                    label={`Ingresa la cantidad a enviar`}
                    disabled={loader} 
                    state={amountState}
                    // customError={withdrawProviders?.current?.provider?.name && warningMessage[withdrawProviders?.current?.provider?.name]}
                    setMaxWithActionKey={true}
                    value={amountValue}
                    availableBalance={availableBalance}
                    SuffixComponent={
                        ({ id }) => (
                            <IconsContainer>
                                <AvailableBalance 
                                    id={id}
                                    handleAction={handleMaxAvailable}
                                    amount={availableBalance}
                                    wallet={current_wallet}
                                />
                                {
                                    isMobile &&
                                    <HandlePriorityCont onClick={togglePanel}>
                                        <MdSpeed
                                            size={25}
                                            color={priorityConfig[currentPriority].color} 
                                        />
                                    </HandlePriorityCont>
                                }
                            </IconsContainer>
                        ) 
                    }
                    AuxComponent={[
                        withdrawProviders?.current?.provider_type !== 'internal_network' ?  () => (<TakeCostFromWithdrawAmount checked={takeFeeFromAmount} onChange={switchFixedCost}/>) : () => null
                    ]} 
                />
                {
                    (isMobile && addressState === "good") &&
                    <ControlButton
                        // id={idForClickeableElement}
                        loader={loader}
                        handleAction={togglePanel}
                        formValidate={!active_trade_operation && amountState === "good" && addressState === "good"}
                        label="Enviar"
                    />
                }
        </WithdrawForm>
    )
}



// withdrawQrHoc(QrReader)
// crear HOC para qrReader con contexto de retiro cripto el cual se le delegará la responsabilidad para el manejo de interpretación de qr de pago
// useEffect(() => {
//     if(history.location.search){
//       const params = getAllUrlParams(history.location.search)
//       console.log('paramsFromWithdraw', params)
//       if(params?.address && params?.network === withdrawProviders?.current?.provider_type)setAddressValue(params?.address?.replace(" ", "+"))
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [withdrawProviders])
// useEffect(() => {
//     if(history.location.search){
//       const params = getAllUrlParams(history.location.search)
//       if(params.network && networks[params.network]) toggleNetwork(params.network);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [history.location.search, networks])





export default WithdrawFormComponent

const LabelAddress = ({ currencySymbol, withdrawProvider  }) => {
    const user_friendly = withdrawProvider?.user_friendly
    const LABELS = {
        default:() => <p className="fuente">{`Ingresa la dirección de destino ${parseSymbolCurrency(currencySymbol)}`} <span className='fuente2 protocolName'>{`(${user_friendly?.token_protocol || user_friendly?.network})`}</span> </p>,
        internal_network:() => <p className="fuente">Ingresa la dirección de <strong>correo electónico</strong> destino {parseSymbolCurrency(currencySymbol)} <span className='fuente2 protocolName'>{`(Coinsenda)`}</span> </p>            
    }
    const RenderComponent = LABELS[withdrawProvider?.provider_type] || LABELS.default
    return <RenderComponent/>
}

export const TakeCostFromWithdrawAmount = (props) => {
    return(
        <CheckWrapper>
            <OptionInput
                {...props}
                type={"checkbox"}
                size={"medium"}
                color={"text_color"}
                uiName={"Cobrar tarifa de la cantidad a enviar"}
            />
        </CheckWrapper>
    )
}
export const CheckWrapper = styled.div`
    position:absolute;
    bottom: -60px;
    left: 0;
`
export const BarSpeed = styled.div`
    width: 100%;
    height: 3px;
    background: #c3c3c3;
    position: relative;
    border-radius: 3px;
    overflow:hidden;

    &::after{
        content: "";
        position: absolute;
        left: 0;
        height: 100%;
        transition:.3s;
        width: 0%;
    }
`
export const SpeedPriorityContainer = styled.div`
    display: flex;
    padding: 0 5px;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    position:relative;

    &.high ${BarSpeed}{
        &::after{
            background:#04c100;
            width: 100%;
        }
    }

    &.medium ${BarSpeed}{
        &::after{
            background:orange;
            width: 60%;
        }
    }

    &.low ${BarSpeed}{
        &::after{
            background:red;
            width: 20%;
        }
    }
    
    &:hover{
        background: #f5f5f5;
        border-radius: 3px;
    }

    &::before{
        content: '';
        position:absolute;
        height: 70%;
        width: 3px;
        left:0;
        border-left: 1px solid var(--paragraph_color);
        top:0;
        bottom:0;
        margin: auto;
        left: -10px;
    }
`
export const BalanceContainer = styled.div`
    position: relative;
    background:red;
`
export const SuffixContainer = styled.div`
    display:flex;
    width:auto;
    height: 80%;
    column-gap:14px;
    cursor:pointer;
    ._balanceComponent{
        position:relative;
    }

` 

