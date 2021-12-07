import React from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

const TagItem = ({ withdrawAccount, deleteTag }) => {
  // console.log('||||||||||||||||||||| withdrawAccount : ', withdrawAccount)
  // debugger

  if (!withdrawAccount) {
    return null;
  }

  const address = withdrawAccount.info && withdrawAccount.info.address;

  return (
    <>
      <TagBlocker />
      <TagContainer id="tagAddress">
        <LabelTextCont>
          <p className="fuente label_">{withdrawAccount.info && withdrawAccount.info.label}</p>
          <AddressContainer
            data-final-address={address.match(/..........$/g).toString()}
          >
            <Address className="fuente2 address_">{address}</Address>
          </AddressContainer>
        </LabelTextCont>
        <DeleteButton onClick={deleteTag}>
          <AiOutlineClose size={16} color="white" />
        </DeleteButton>
      </TagContainer>
    </>
  );
};

export default TagItem;

const DeleteButton = styled.div`
  width: 18px;
  height: 18px;
  background: gray;
  justify-self: center;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s;
  transform: scale(1);
  cursor: pointer;
  position: relative;
  top: 6px;

  &:hover {
    transform: scale(1.1);
  }
`;

export const Address = styled.p`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13px;
`;

export const AddressContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  cursor: pointer;

  &::after {
    transition: 0.15s;
    content: attr(data-final-address);
    position: absolute;
    right: -75px;
    top: 0;
    color: #505050;
    font-size: 13px;
    line-height: 30px;
    opacity: 0;
  }

  @media (max-width: 768px) {
    max-width: 100px;
  }
`;

const LabelTextCont = styled.div`
  height: 60px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  position: relative;
  transition: 0.3s;
  top: 0;

  p {
    line-height: 30px;
    transition: 0.15s;
  }

  .address_ {
    opacity: 0;
    font-size: 13px;
  }
`;

const TagContainer = styled.div`
  overflow: hidden;
  position: absolute;
  bottom: 9px;
  left: 12px;
  height: 30px;
  background: #d8d8d8;
  border-radius: 4px;
  display: grid;
  width: auto;
  grid-template-columns: minmax(210px, 275px) 38px;
  cursor: pointer;

  @media (max-width: 768px) {
    grid-template-columns: minmax(90px, 180px) 38px;
  }

  &:hover {
    ${LabelTextCont} {
      top: -30px;
      .label_ {
        opacity: 0;
      }

      .address_,
      ${AddressContainer}::after {
        opacity: 1;
      }
    }
  }

  &.disappear {
    transform: translateY(10px);
    opacity: 0;
  }

  &.appear {
    transform: translateY(0);
    opacity: 1;
  }

  p {
    margin: 0;
    padding-left: 15px;
    color: #505050;
  }
`;

const TagBlocker = styled.section`
  content: "";
  position: absolute;
  bottom: 5px;
  width: calc(100% - 2px);
  height: 40px;
  left: 2px;
  ${"" /* background: rgb(255 255 255 / 51%); */}
  background: linear-gradient(to right, rgb(255 255 255), rgb(255 255 255), transparent);
  backdrop-filter: blur(1px);
`;
