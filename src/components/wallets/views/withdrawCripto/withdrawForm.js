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
import styled from 'styled-components'



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
    current_wallet
}) => {

    const { isMobile } = useViewport()
    const idForClickeableElement = useKeyActionAsClick(true, "main-deposit-crypto-button", 13, false, "onkeyup");

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
            type="number" 
            minAmount={minAmount}
            placeholder={`${minAmount ? minAmount?.toFormat(8) : ''} ${timeLeft >= 0 ? ` (${timeLeft})` : ''}`}
            name="amount"
            handleStatus={setAmountState}
            handleChange={handleChangeAmount}
            label={`Ingresa la cantidad del retiro`}
            disabled={loader}
            state={amountState}
            setMaxWithActionKey={true}
            value={amountValue}
            SuffixComponent={({ id }) => (
                <SuffixContainer>
                    <AvailableBalance 
                        id={id}
                        handleAction={handleMaxAvailable}
                        amount={balance.available}
                        wallet={current_wallet}
                    />
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


export const SuffixContainer = styled.div`
    display:flex;
` 

export const SpeedPriorityContainer = styled.div`

`