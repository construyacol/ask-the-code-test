import IconSwitch from "../../../widgets/icons/iconSwitch";
import InputForm from "../../../widgets/inputs/inputForm";
import ControlButton from "../../../widgets/buttons/controlButton";

// hooks
import useViewport from 'hooks/useViewport'
import useKeyActionAsClick from "hooks/useKeyActionAsClick";

// loadable components
import AddressBookCTA from "../../../widgets/modal/render/addressBook/ctas";
import AddressTagList from "./addressTagList";
import TagItem from "./tagItem";
import AvailableBalance from '../../../widgets/availableBalance'

// Styled components
import { IconsContainer, WithdrawForm } from './styles'


// third party 
import styled from 'styled-components'
import { MdSpeed } from 'react-icons/md';



const WithdrawFormComponent = ({
    setAddressState,
    handleChangeAddress,
    addressValue,
    currencySymbol,
    loader,
    tagWithdrawAccount,
    addressState,
    showQrScanner,
    setAddressValue,
    addressToAdd,
    deleteTag,
    minAmount,
    timeLeft,
    setAmountState,
    handleChangeAmount,
    amountState,
    handleMaxAvailable,
    balance,
    amountValue,
    handleSubmit,
    active_trade_operation,
    current_wallet,
    setShowModal,
    priority:{ currentPriority, setPriority }
}) => {

    const { isMobile } = useViewport()
    const idForClickeableElement = useKeyActionAsClick(true, "main-deposit-crypto-button", 13, false, "onkeyup");
    const priorityColor = {
        high:"#04c100",
        medium:"orange",
        low:"red"
    }

    console.log('currentPriority', currentPriority)

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
            label={`Ingresa la dirección ${currencySymbol}`}
            disabled={loader || tagWithdrawAccount}
            autoFocus={true}
            SuffixComponent={() => (
            <IconsContainer>
                <IconSwitch
                className="superImposed"
                icon={`${addressState === "good" ? "verify" : "wallet"}`}
                color={`${addressState === "good" ? "green" : "gray"}`}
                size={`${addressState === "good" ? 22 : 25}`}
                />
                <IconSwitch
                onClick={showQrScanner}
                icon="qr"
                color="gray"
                size={25}
                />
            </IconsContainer>
            )}
            AuxComponent={[
            () => (<AddressBookCTA setAddressValue={setAddressValue} addressToAdd={addressToAdd} />),
            () => (<AddressTagList addressState={addressState} show={addressValue && addressValue.match(/^@/g)} addressValue={addressValue} setAddressValue={setAddressValue}/>),
            () => (<TagItem withdrawAccount={tagWithdrawAccount} deleteTag={deleteTag}/>)
            ]} 
        />

        <InputForm 
            type="text"
            inputMode="number"
            minAmount={minAmount}
            placeholder={`${minAmount} ${timeLeft >= 0 ? ` (${timeLeft})` : ''}`}
            name="amount"
            handleStatus={setAmountState}
            handleChange={handleChangeAmount}
            label={`Ingresa la cantidad del retiro`}
            disabled={loader}
            state={amountState}
            setMaxWithActionKey={true}
            value={amountValue}
            SuffixComponent={({ id }) => (
                <SuffixContainer className="suffix_container">
                    <AvailableBalance 
                        id={id}
                        handleAction={handleMaxAvailable}
                        amount={balance.available}
                        wallet={current_wallet}
                    />
                    <SpeedPriorityContainer className={currentPriority} onClick={() => setShowModal('speedPriority')}>
                        <MdSpeed
                          size={25}
                          color={priorityColor[currentPriority]}
                        />
                        <BarSpeed/>
                    </SpeedPriorityContainer>
                </SuffixContainer>
            )}
            // PrefixComponent
        />
        <ControlButton
            id={idForClickeableElement}
            loader={loader}
            handleAction={handleSubmit}
            formValidate={!active_trade_operation && amountState === "good" && addressState === "good"}
            label="Enviar"
        />
        </WithdrawForm>
    )
}


export default WithdrawFormComponent


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

