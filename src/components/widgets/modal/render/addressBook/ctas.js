import React from "react";
import { useActions } from "../../../../../hooks/useActions";
import styled from "styled-components";
import AddressBook from "./";
// import { getAtention } from "../../../animations";
import useKeyActionAsClick from "../../../../../hooks/useKeyActionAsClick";
import useViewport from "../../../../../hooks/useWindowSize";
import { useSelector } from "react-redux";


const AddressBookCTA = ({ addressToAdd, setAddressValue }) => {
  const idForCreateNewAccount = useKeyActionAsClick(
    true, 
    "open-address-book",
    65,
    true,
    "onkeyup"
  );
  const { isMovilViewport } = useViewport();
  const actions = useActions();
  const { keyActions } = useSelector((state) => state.ui);

  const openAddressBook = async () => {
    actions.renderModal(() => (
      <AddressBook
        setAddressValue={setAddressValue}
        addressToAdd={addressToAdd}
      />
    ));
  };

  return (
    <AddressBookContainer
      className={`${addressToAdd ? "addressToAdd" : ""} `}
      id={idForCreateNewAccount}
      onClick={openAddressBook}
    >
      <p className="fuente">
        {!isMovilViewport && keyActions ? "[A] " : ""}
        {addressToAdd
          ? `+ Agregar cuenta de retiro`
          : "Gestionar direcciones >>"}
      </p>
    </AddressBookContainer>
  );
};

export default AddressBookCTA;

const AddressBookContainer = styled.div`
  position: absolute;
  height: 25px;
  right: 0;
  bottom: -40px;
  cursor: pointer;
  display: flex;

  p {
    margin: 0;
    font-size: 14px;
    color: #b48728;
    font-weight: bold;
  }

  p:hover {
    text-decoration: underline;
  }

  &.addressToAdd {
    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transition: 0.15s;
      transform: scale(0.98);
    }

    transform: scale(1);
    transition: 0.3s;
    border: 1px solid #0198ff;
    border-radius: 6px;
    height: 35px;
    bottom: -45px;
    padding: 0 10px;

    p {
      color: #0198ff;
      font-weight: bold;
      line-height: 35px;
    }
    p:hover {
      text-decoration: none;
    }

    ${"" /* animation: ${getAtention} 4s ease-in-out infinite; */}
  }

  @keyframes blurs {
    0% {
      text-shadow: 0px 1px 8px rgba(255, 173, 0, 0);
      transform: scale(1);
    }
    50% {
      text-shadow: 0px 1px 8px rgba(255, 173, 0, 0.7);
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
      text-shadow: 0px 1px 8px rgba(255, 173, 0, 0);
    }
  }
`;
