/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import styled from "styled-components";
import { ItemList } from "../../../widgets/modal/render/addressBook/itemList";
import { selectWithdrawAccounts } from "selectors";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
 
const AddressTagList = ({ show, addressValue, setAddressValue, addressState, currentNetwork }) => {

  const [{ current_wallet }] = WithdrawViewState()
  const withdrawAccounts = useSelector((state) => selectWithdrawAccounts(state, { provider_type:currentNetwork?.provider_type, currency:current_wallet.currency } ));
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    (() => {
      if(!withdrawAccounts || !addressValue || !show)return;
      const value = addressValue.replace(/^@/g, "");
      const result = withdrawAccounts.filter((withdrawAccount) => withdrawAccount?.info?.label?.toLowerCase()?.includes(value.toLowerCase()) );
      if (result.length < withdrawAccounts.length) setSearchList(result);
    })()
  }, [addressValue]);

  useEffect(() => {
    if (searchList.length === 1) {
      setAddressValue(searchList[0]?.info?.address || searchList[0]?.info?.identifier);
      console.log(searchList, searchList.length)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchList]);

  const handleEventClick = (e) => {
    e.stopPropagation()
    if ((e.target.classList && !e.target.classList.contains("search-component")) && !document.querySelector('#tagAddress') && !addressValue) setAddressValue("");;
  };

  useEffect(() => {
    if(!isEmpty(withdrawAccounts)) window.addEventListener("click", handleEventClick);
    return () => window.removeEventListener("click", handleEventClick);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <SearchComponentWrapper id="addressTagList">
      <SearchComponentContainer className="search-component">
        {searchList.length
          ? searchList.map((item, index) => {
              return (
                <ItemList
                  key={index}
                  item={item}
                  setAddressValue={setAddressValue}
                />
              );
            })
          : withdrawAccounts.map((item, index) => {
              return (
                <ItemList
                  key={index}
                  item={item}
                  setAddressValue={setAddressValue}
                  // number={index}
                  // setCurrentSelection={setCurrentSelection}
                  // focusedId={`account-item-${index}`}
                />
              );
            })}
      </SearchComponentContainer>
    </SearchComponentWrapper>
  );
};

export default AddressTagList;

const SearchComponentWrapper = styled.section`
  width: 100%;
  height: auto;
  max-height: 310px;
  overflow-x: hidden;
  position: absolute;
  top: 135px;
  left: 0;
  z-index: 2;
  background: white;
  border-radius: 4px;
  box-shadow: 5px 5px 9px -3px rgba(0,0,0,0.15);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #b1b1b1;
  }
`;

const SearchComponentContainer = styled.div`
  height: auto;
  width: 100%;
  position: relative;

  ${"" /* &::after{
    content: '';
    top: 0;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: gray;
  } */}

  #cubeContainer, #frontCube, #itemListContainer {
    height: 60px;
  }

  #cubeContainer {
    margin: 12px 0;
    :hover {
      background: #ececec;
    }
  }

  #frontCube {
    #acronymContainer {
      transform: scale(0.9);
    }
  }

  i {
    display: none;
  }
`;
