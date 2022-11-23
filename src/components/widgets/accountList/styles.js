import styled, { css } from "styled-components";
import { device } from '../../../const/const'

export const InputKeyActionHandler = styled[
  `${window.innerWidth > 900 ? "input" : "div"}`
]`
  width: 0;
  height: 0; 
  opacity: 0;
`;

export const AccountListContainer = styled.section`
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  justify-items: center;
  grid-template-rows: repeat(auto-fill, 200px);
  row-gap: 20px;
  column-gap: 20px;
  align-items: center;

  &.contet-center{
    justify-content:center;
  }

  @media ${device.mobile} {
      justify-content:center;
  }
`;

export const ACta = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 4;
`;

export const BarIconCont = styled.div`
  position: relative;
  display: ${(props) => props.account_type === "withdraw_accounts" ? "none" : "initial"};

  &.retweetCont {
    display: grid;
    align-items: center;
    justify-items: center;
    height: 20px;
    align-self: flex-end;
    margin-bottom: 10px;
  }
`;

export const Icon = styled.i`
  &.Ideposit:hover {
    color: #00ff00;
  }

  &.IRetiro:hover {
    color: #ff6161;
  }

  &:hover {
    color: #ff6161;
  }

  &.IdeleteButton {
    right: 7px;
    font-size: 18px;
    color: white;
    font-weight: 400 !important;
    z-index: 5;
    transition: 0.3s;
    transform: scale(1);
  }

  &.IdeleteButton.tooltip {
    position: absolute;
  }

  &.tooltip:hover .tooltiptext2 {
    visibility: visible !important;
  }

  .tooltiptext2 {
    top: -25% !important;
    left: -230% !important;
    visibility: hidden;
    width: 60px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    font-size: 12px !important;
    position: absolute;
    z-index: 1;
    margin-left: -30px;
  }
`;

export const OptionsLayout = styled.div`
  width: 30px;
  height: 100%;
  background: #0000009e;
  position: absolute;
  z-index: 5;
  display: grid;
  transition: 0.3s;
  right: -40px;
  grid-template-rows: 30px 30px 1fr;
  align-items: center;
  grid-row-gap: 5px;
  background: linear-gradient(to bottom, #0000006e, #000000b0);

  &.noVisible {
    display: none !important;
  }

  &.withdraw_accounts {
    grid-template-rows: 1fr !important;
  }
`;

export const AccountLayout = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  width: calc(100% - 30px) !important;
  transform-style: preserve-3d;
  perspective: 2000px;
  position: relative;

  &.deleting {
    transition: 0.3s !important;
    transform: scale(0.9);
    opacity: 0.7;
  }

  &.deleted {
    opacity: 0.5;
    animation-name: walletDeleted;
    animation-duration: 0.4s;
    animation-timing-function: cubic-bezier(1, 1, 1, 1);
    animation-fill-mode: forwards;
  }

  @keyframes walletDeleted {
    0% {
      transform: scale(0.9);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: scale(0.5);
    }
  }

  ${'' /* @media screen and (max-width:768px) {
    width: 100% !important;
  }

  @media screen and (max-height: 800px) and (max-width: 1366px) {
    transform: scale(0.9);
  }

  @media screen and (max-height: 830px) and (max-width: 900px) {
    transform: none;
  } */}
`;

const selected = css`
  -webkit-box-shadow: 0px 0px 1px 3px #54e783;
  -moz-box-shadow: 0px 0px 1px 3px #54e783;
  box-shadow: 0px 0px 1px 3px #54e783;
`;

export const ItemAccountL = styled.div`
  color: white !important;
  position: relative;
  width: 100%;
  height: 155px;
  max-width: 255px;
  border-radius: 6px;
  padding: 15px; 
  display: grid;
  transform: scale(1);
  transition: 0.2s;
  cursor: pointer;
  grid-row-gap: 3px;
  overflow: hidden;
  overflow: -webkit-paged-y;
  transform-origin: top;
  grid-template-rows: ${(props) =>
    props.wallet ? "35px 25px 1fr" : "35px 20px 25px 20px 1fr"};
  -webkit-box-shadow: 0px 0px 56px 3px rgba(0, 0, 0, 0.04);
  -moz-box-shadow: 0px 0px 56px 3px rgba(0, 0, 0, 0.04);
  box-shadow: 0px 0px 56px 3px rgba(0, 0, 0, 0.04);

  &.loading::after {
    content: "";
    position: absolute;
    z-index: 2;
    background: rgba(255, 255, 255, 0.7);
    width: 100%;
    height: 100%;
    padding: 0 15px;
  }

  &.deleted {
    animation-name: WItemDeleted;
    animation-duration: 0.3s;
    /*animation-delay: .12s;*/
    animation-timing-function: cubic-bezier(1, 1, 1, 1);
    animation-fill-mode: forwards;
    transform: rotateY(0deg);
  }

  @keyframes WItemDeleted {
    0% {
      transform: rotateX(0deg);
    }

    100% {
      transform: rotateX(90deg);
    }
  }

  #backCard {
    opacity: 0.08;
    z-index: 2;
    position: absolute;
    align-self: center;
  }

  &:hover ${OptionsLayout} {
    right: 0 !important;
  }

  &:hover .IdeleteButton {
    opacity: 1;
  }

  &:hover {
    -webkit-box-shadow: 0px 0px 56px 3px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 0px 56px 3px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 56px 3px rgba(0, 0, 0, 0.2);
    transform: scale(1.01);
  }

  ${(props) => (props.isSelected ? selected : "")}

  &.loader:hover {
    box-shadow: 0px !important;
    transform: scale(1) !important;
    background: #f9f9fb;
  }

  &.loader div {
    background: #cacaca;
    border-radius: 6px;
  }

  &.loader {
    border: 1px solid #cacaca;
    grid-row-gap: 12px;
    animation-name: accountLoader;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    opacity: 0.35;
    @media screen and (max-height: 800px) and (max-width: 1366px) {
      transform: scale(0.9);
    }
  }

  &.loader.dos {
    animation-delay: 0.4s;
  }

  &.loader.tres {
    animation-delay: 0.8s;
  }

  @keyframes accountLoader {
    0% {
      opacity: 0.35;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0.35;
    }
  }

  .tobe_continue {
    display: block !important;
    margin-left: 2px;
    max-width: 240px;
    overflow: hidden;
    padding-left: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .IWText {
    position: relative;
    z-index: 3;
  }

  h1 {
    margin: 0 !important;
    font-size: 18px;
  }

  > p {
    margin: 0 !important;
    font-size: 15px;
  }
`;

export const WalletLayout = styled(ItemAccountL)`
  background: linear-gradient(to right, #bfbfbf, #a0a0a0);
  .iconWallet {
    position: absolute;
    align-self: center;
    right: -75px;
    z-index: 1;
  }

  &.cop,
  &.usdt,
  &.usdt_testnet,
  &.usd {
    background: linear-gradient(to right, #11998e, #38ef7d);
  }

  &.bitcoin,
  &.bitcoin_testnet {
    background: linear-gradient(to right, #f9a847, #cf7507);
  }

  &.ethereum,
  &.ethereum_testnet {
    background: linear-gradient(to right, #444444, #8c8c8c);
  }

  &.dash {
    background: linear-gradient(to right, #2c8fe0, #155a93);
  }

  &.litecoin,
  &.litecoin_testnet {
    background: linear-gradient(to right, #bfbfbf, #a0a0a0);
  }

  .IWcurrencyText {
    font-size: 15px;
  }
`;

export const WithdrawAccountL = styled(ItemAccountL)`
  &.withdrawAccount {
    background: linear-gradient(to right, #11998e, #38ef7d);
  }

  ${(props) =>
    !props.inscribed &&
    css`
      background: gray !important;
      opacity: 0.7;
    `}

  .IWLittleTitle {
    font-size: 14px !important;
  }

  .contSuscribed {
    display: flex;
    align-items: center;
  }

  .contSuscribed i {
    color: #00ff60;
    margin: 0 6px;
  }

  .contLoader2 .lds-roller div:after {
    background: white !important;
  }

  .contLoader2 {
    transform: scale(0.5);
    width: 40px;
    position: relative;
    display: block;
    top: -6px;
    left: -10px;
  }

  .contLoader2 .lds-roller {
    width: inherit !important;
    height: inherit !important;
  }

  .iconBank {
    position: absolute;
    top: 10px;
    right: 20px !important;
    z-index: 1;
  }
`;
