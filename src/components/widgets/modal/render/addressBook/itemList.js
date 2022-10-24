import React, { useState } from "react";
import { useCoinsendaServices } from "../../../../../services/useCoinsendaServices";
import useToastMessage from "../../../../../hooks/useToastMessage";
import { Icon, Front, Top, CubeObject } from "../../../shared-styles";
import styled from "styled-components";
import SimpleLoader from "../../../loaders";
import { useActions } from "../../../../../hooks/useActions";
import { InputKeyActionHandler } from "../../../accountList/styles";
import { useItemsInteractions } from "../../../../../hooks/useNavigationKeyActions";
import useKeyActionAsClick from "../../../../../hooks/useKeyActionAsClick";

export const ItemList = (props) => {

  const {
    item: {
      id,
      info : { address, label }
    },
    setAddressValue,
  } = props;


  const getAcronym = () => {
    let patt1 = /^.|\s./g;
    let result = label.match(patt1);
    return result.toString().replace(/,/g, "").toUpperCase();
  };

  const [deleting, setDeleting] = useState("");
  const [coinsendaServices] = useCoinsendaServices();
  const [toastMessage] = useToastMessage();
  const actions = useActions();
  const [isSelected] = useItemsInteractions(
    {...props, uniqid: id},
    { suprKeyAction: () => null, enterKeyAction: () => handleClick() },
    false
  );

  if(!address || !label){return null}

  
  const setDeletingState = (payload) => {
    setDeleting(payload);
    setTimeout(() => {
      setDeleting("");
    }, 300);
  };

  const deleteItem = async (e) => {
    if (!e.target.dataset.action) {
      return;
    }
    const blockerActive = document.getElementById(`blocker`);
    const searchInput = document.getElementById(`searchInput`);

    switch (e.target.dataset.action) {
      case "open":
        blockerActive.classList.add("deleting");
        searchInput.setAttribute("disabled", true);
        return setDeleting("rotate");

      case "close":
        blockerActive.classList.remove("deleting");
        searchInput.removeAttribute("disabled");
        return setDeletingState("unrotate");

      case "delete":
        const loaderDeleteItem = document.getElementById(`loader_${id}`);
        loaderDeleteItem.classList.add("deleting");
        const { error } = await coinsendaServices.deleteAccount(id);
        if (error) { 
          loaderDeleteItem.classList.remove("deleting");
          blockerActive.classList.remove("deleting");
          return toastMessage(
            error?.message,
            "error"
          );
        }
        await coinsendaServices.fetchWithdrawAccounts();
        searchInput.removeAttribute("disabled");
        loaderDeleteItem.classList.remove("deleting");
        blockerActive.classList.remove("deleting");
        setDeletingState("unrotate");
        actions.success_sound();
        return toastMessage(
          "¡La cuenta ha sido eliminada con éxito!",
          "success"
        );
      default:
        return setDeletingState("unrotate");
    }
  };

  const handleClick = (e) => {
    if (e && e.target && e.target.dataset && e.target.dataset.delete) {
      return;
    }
    setAddressValue(address);
    actions.renderModal(null);
  };

  return (
    <ItemContainer
      id="cubeContainer"
      className={`${deleting} ${isSelected && "isSelected"}`}
    >
      <KeyActionHandler
        name="itemFromList"
        autoComplete="off"
        id={props.focusedId}
      />
      <FrontCont id="frontCube" onClick={handleClick}>
        <ItemListContainer id="itemListContainer">
          <AcronymContainer id="acronymContainer">
            <p className="fuente">{getAcronym()}</p>
          </AcronymContainer>
          <ItemTextContainer>
            <div>
              <p className="fuente label">{label}</p>
              <NewElement id={id} className="fuente">
                Nuevo
              </NewElement>
            </div>
            <AddressContainer
              data-final-address={address.match(/..........$/g).toString()}
            >
              <Address className="fuente2 withdrawAddress">{address}</Address>
            </AddressContainer>
          </ItemTextContainer>
          <DeleteButton>
            <Icon
              className="fas fa-trash-alt tooltip"
              data-action="open"
              data-delete
              onClick={deleteItem}
            >
              <span className="tooltiptext fuente">Eliminar</span>
            </Icon>
          </DeleteButton>
        </ItemListContainer>
      </FrontCont>
      <Top id="faceTop">
        <DeleteComponent itemId={id} handleAction={deleteItem} />
      </Top>
    </ItemContainer>
  );
};

const FrontCont = styled(Front)`
  width: calc(100% - 40px);
`;

const KeyActionHandler = styled(InputKeyActionHandler)`
  position: absolute;
`;



const DeleteComponent = ({ handleAction, itemId }) => {
  const idForDeleteItem = useKeyActionAsClick(
    true,
    "delete-item-account",
    80,
    true,
    "onkeyup",
    true
  );

  return (
    <DeleteContainer className="deleteContainer">
      <LoaderDeleteItem id={`loader_${itemId}`}>
        <SimpleLoader loader={2} color="var(--primary)" justify="center" />
      </LoaderDeleteItem>
      <p className="fuente confirmText">
        ¿Estás seguro que deseas eliminar esta cuenta de retiro?
      </p> 
      <DeleteControls>
        {/* <p className="fuente cancel"  onClick={()=>handleAction('unrotate')}>Cancelar</p> */}
        <p className="fuente cancel" data-action="close" onClick={handleAction}>
          Cancelar
        </p>
        <p
          id={idForDeleteItem}
          className="fuente delete"
          data-action="delete"
          onClick={handleAction}
        >
          Eliminar
        </p>
      </DeleteControls>
    </DeleteContainer>
  );
};

const LoaderDeleteItem = styled.div`
  background: #ffffffe8;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: grid;
  align-items: center;
  justify-items: center;
  display: none;

  &.deleting {
    display: grid;
  }
`;

const DeleteControls = styled.div`
  display: grid;
  width: 100%;
  max-width: 200px;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;

  .delete {
    background: red;
    color: white;
    font-weight: bold;
  }

  .cancel {
    color: var(--paragraph_color);
  }

  p {
    cursor: pointer;
    border-radius: 3px;
    display: grid;
    align-items: center;
    text-align: center;
    padding: 0 12px;
  }
`;

const DeleteContainer = styled.div`
  width: 100%;
  height: calc(100% - 20px);
  padding: 10px 0;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
  position: relative;
  row-gap:0px;

  p{
    max-width: 70%;
    font-size: 13px;
    color: black;
    margin: 0;
    text-align: center;
  }
`;

export const Address = styled.p`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DeleteButton = styled.div`
  border-radius: 50%;
  position: absolute;
  align-self: center;
  transition: 0.15s;
  right: 0;
  display: grid;
  opacity: 0;
`;

const ItemListContainer = styled.div`
  align-items: center;
  width: 100%;
  height: 80px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr;
  column-gap: 15px;
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.8;
  position: relative;
  &:hover {
    opacity: 1;
    color: var(--primary);
    ${DeleteButton} {
      right: 10px;
      opacity: 1;
    }
  }
`;

const AcronymContainer = styled.div`
  width: 45px;
  height: 45px;
  background: var(--primary);
  border-radius: 50%;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  position: relative;
  transition: 0.3s;

  p {
    color: white;
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 40px;
  }
`;

const ItemTextContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  max-height: 40px;
  align-content: center;

  > div {
    display: flex;
  }

  .label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: auto;
    max-width: 200px;
  }
  p {
    margin: 0;
    &.withdrawAddress {
      font-size: 12px;
      color: var(--paragraph_color);
      padding-left: 14px;
      position: relative;
      &::before {
        content: "- ";
        position: absolute;
        color: white;
        width: 6px;
        height: 7px;
        border-bottom-style: dotted;
        border-left-style: dotted;
        border-color: gray;
        left: 0px;
        border-bottom-width: 2px;
        border-left-width: 2px;
        top: 2px;
      }
    }
  }
`;

const NewElement = styled.p`
  font-size: 12px;
  color: white;
  background: red;
  margin-left: 10px !important;
  padding: 4px 5px;
  border-radius: 4px;
  font-weight: bold;
  ${"" /* transform: scale(0); */}
  animation-name: nuevo;
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  display: none;
  &.shower {
    display: block;
  }

  @keyframes nuevo {
    0% {
      transform: scale(0);
    }
    65% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const AddressContainer = styled.div`
  position: relative;
  width: 150px;
  cursor: pointer;

  &::after {
    content: attr(data-final-address);
    position: absolute;
    left: 100%;
    top: 0;
    font-size: 12px;
    color: var(--paragraph_color);
  }
  &:hover {
    width: auto;
  }
  &:hover::after {
    display: none;
  }
`;


const ItemContainer = styled(CubeObject)`
  position: relative;
  padding: 0 20px;
  width: calc(100% - 40px);
  transition: 0.3s;

  &:hover {
    ${"" /* background: #ececec; */}
  }

  ${ItemListContainer} {
    &.isSelected {
      opacity: 1;
      color: var(--primary);
    }
  }
`;
