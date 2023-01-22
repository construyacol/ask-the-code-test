import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useActions } from "../../../../../hooks/useActions";
import OtherModalLayout from "../../otherModalLayout";
import { useSelector } from "react-redux";
import { setAnimation } from "../../../../../utils";
import WithdrawViewState from "hooks/withdrawStateHandle";
import EmptyState from "./emptyState"; 
import NewAccount from "./newAccount";
import AddressBookComponent from "./addressBookList";
import HeaderComponent from "./header";
import { swing_in_bottom_bck } from "../../../animations";
import { selectWithdrawAccounts } from "selectors";
import { IconClose } from "../../../shared-styles"; 
import useViewport from 'hooks/useWindowSize'
// import { selectWithdrawAccountsByNetWork } from "selectors";


const AddressBook = ({ addressToAdd, setAddressValue, currentNetwork }) => {

  // const mainContainerRef = useRef()
  const actions = useActions(); 
  const [{ current_wallet, path, withdrawProvidersByName }] = WithdrawViewState();
  // const provider_type = current_wallet && withdrawProvidersByName[current_wallet.currency]?.provider_type;
  const provider_type = currentNetwork?.provider_type
  const withdrawAccounts = useSelector((state) => selectWithdrawAccounts(state, { provider_type, currency:current_wallet.currency }));
   

  const [view, setView] = useState("addressList");
  const { isMovilViewport } = useViewport()

  const cerrar = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null);
    }
  };

  const switchView = async (payload) => {
    if(!isMovilViewport){
      await setAnimation("disappear", "mainContainerAB", 150);
      setView(payload);
      await setAnimation("appear", "mainContainerAB", 150);
    }else{
      setView(payload);
    }
  };

  useEffect(() => {
    if (addressToAdd) {
      switchView("newAccount");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressToAdd]);



  useEffect(() => {
    const appearTransition = async () => {
      await setAnimation("appear", "containerLayout", 700);
      const element = document.getElementById("containerLayout");
      element && element.classList.add("keepOpacity");
    };

    appearTransition();
  }, []);

  if (!current_wallet || path !== "withdraw") {
    cerrar();
    return <></>;
  }


  return (
    // Dato de onkeydown y otros events.
    // No pueden ser reutilizados, lo puse en false(onkeydown), porque estaba siendo utilizado por el useNavigationKeyActions
    <OtherModalLayout
      id="close-button-with-OtherModalLayout"
      onkeydown={false}
      on_click={cerrar}
    >
      <ContainerLayout id="containerLayout">
        <IconClose
          handleAction={() => actions.renderModal(null)}
          theme="dark"
          size={20}
        />
        <HeaderComponent
          uiName={currentNetwork?.provider?.ui_name || withdrawProvidersByName[current_wallet.currency]?.provider?.ui_name}
          view={view}
          switchView={switchView}
        />
        <Content id="mainContent">
          <Container id="mainContainerAB">
            {view === "addressList" && withdrawAccounts.length ? (
              <AddressBookComponent
                withdrawAccounts={withdrawAccounts}
                switchView={switchView}
                setAddressValue={setAddressValue}
              />
            ) : view === "newAccount" ? (
              <NewAccount
                provider_type={provider_type}
                currentNetwork={currentNetwork}
                currency={current_wallet.currency}
                providerName={currentNetwork?.provider?.ui_name || withdrawProvidersByName[current_wallet.currency]?.provider?.ui_name}
                switchView={switchView}
                addressToAdd={addressToAdd}
              />
            ) : (
              <EmptyState switchView={switchView}></EmptyState>
            )}
          </Container>
        </Content>
      </ContainerLayout>
    </OtherModalLayout>
  );
};

export default AddressBook;

const Container = styled.div`
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  padding: 1px;
  transition: 0.15s;

  &.disappear {
    transform: translateY(22px);
    opacity: 0;
  }

  &.appear {
    transform: translateY(0px);
    opacity: 1;
  }
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 6px;
  position: relative;
`;


export const ContainerLayout = styled.div`
  width: 100%;
  max-width: 400px;
  height: 650px;
  display: grid;
  grid-template-rows: 80px 1fr;
  transform-style: preserve-3d;
  opacity: 0;

  &.appear{
    -webkit-animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
  }

  &.keepOpacity{
    opacity: 1;
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding-bottom:50px;
    &.ioSystem{
      padding-bottom:100px;
    }
  }
`;
