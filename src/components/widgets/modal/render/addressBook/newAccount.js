import React, { useState } from "react";
import styled from "styled-components";
import { useCoinsendaServices } from "../../../../../services/useCoinsendaServices";
import WithdrawViewState from "hooks/withdrawStateHandle";
import useToastMessage from "../../../../../hooks/useToastMessage";
import IconSwitch from "../../../icons/iconSwitch";
import InputForm from "../../../inputs/inputForm";
import { ControlButtonContainer } from "../../../shared-styles";
import ControlButton from "../../../buttons/controlButton";
import useKeyActionAsClick from "../../../../../hooks/useKeyActionAsClick";

const NewAccount = ({ provider_type, switchView, addressToAdd }) => {
  const [addressState, setAddressState] = useState();
  const [addressValue, setAddressValue] = useState(addressToAdd);
  const [nameState, setNameState] = useState();
  const [loader, setLoader] = useState();

  const [coinsendaServices, , actions, dispatch] = useCoinsendaServices();
  const [{ withdraw_accounts, current_wallet }] = WithdrawViewState();
  const [toastMessage] = useToastMessage();
  const idForCreateAccount = useKeyActionAsClick(
    true,
    "accept-confirm-modal",
    13,
    false,
    "onkeyup",
    true
  );

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setLoader(true);
    const form = new FormData(document.getElementById("newAccount"));
    const label = form.get("name-account");
    const address = form.get("address-account");
    const thisAccountExist = withdraw_accounts[address];
    if (thisAccountExist && thisAccountExist.info.label === provider_type) {
      // Si la cuenta existe y su label es igual al provider_type, es una cuenta anónima, por lo tanto se oculta la misma para crear una cuenta asociada al nuevo label
      const hideAccount = await coinsendaServices.deleteAccount(
        thisAccountExist.id
      );
      if (!hideAccount) {
        toastMessage("No se pudo ocultar la cuenta anónima", "error");
        return setLoader(false);
      }
    } else if (
      thisAccountExist &&
      thisAccountExist.info.label !== provider_type
    ) {
      toastMessage("Esta cuenta de retiro ya existe", "error");
      return setLoader(false);
    }

    const newWithdrawAccount = await coinsendaServices.addNewWithdrawAccount(
      {
        currency: current_wallet.currency,
        provider_type: provider_type,
        label,
        address,
        // country: current_wallet.country,
      },
      "cripto"
    );

    if (!newWithdrawAccount) {
      toastMessage("No se pudo crear la cuenta", "error");
      return setLoader(false);
    }
    // idNewAccount
    await toastMessage("¡La cuenta ha sido creada con éxito!", "success");
    await coinsendaServices.fetchWithdrawAccounts();
    await dispatch(actions.success_sound());
    await switchView("addressList");
    let idNewAccount = document.getElementById(newWithdrawAccount.id);
    idNewAccount.classList.add("shower");
    setAddressValue();
  };

  return (
    <NewAccountContainer>
      <ProviderTypeIcon>
        <IconSwitch icon={provider_type} size={45} />
        <p className="fuente">{provider_type}</p>
      </ProviderTypeIcon>
      <Form id="newAccount" onSubmit={handleSubmit}>
        <InputForm
          classes="fuente"
          type="text"
          name="name-account"
          label="Nombre de la cuenta"
          autoFocus={true}
          autoComplete="off"
          handleStatus={setNameState}
        />
 
        <InputForm
          classes="fuente2"
          type="text"
          name="address-account"
          label={`Dirección ${provider_type}`}
          handleStatus={setAddressState}
          autoComplete="off"
          isControlled
          handleChange={(_, value) => setAddressValue(value)}
          value={addressValue}
          SuffixComponent={() => (
            <IconSwitch
              icon={`${addressState === "good" ? "verify" : "wallet"}`}
              color={`${addressState === "good" ? "green" : "var(--paragraph_color)"}`}
              size={`${addressState === "good" ? 22 : 25}`}
            />
          )}
        />
        <ControlButtonContainer bottom={0}>
          <ControlButton
            label="Crear"
            formValidate={addressState === "good" && nameState === "good"}
            handleAction={handleSubmit}
            loader={loader}
            id={idForCreateAccount}
          />
        </ControlButtonContainer>
      </Form>
    </NewAccountContainer>
  );
};

export default NewAccount;

const NewAccountContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 10px;
  padding: 40px 22px;
  height: calc(100% - 80px);

  .labelText {
    font-size: 15px;
  }

  input {
    font-size: 14px;
  }
`;

const ProviderTypeIcon = styled.div`
  height: 100px;
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p{
    color:var(--paragraph_color);
  }
`;

const Form = styled.form`
  position: relative;
  .inputElement.address-account{
    font-size:13px;
  }
`;
