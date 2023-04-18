import styled, { keyframes } from "styled-components";
import { OperationForm } from 'components/wallets/styles'
import { skeleton } from "components/widgets/loaders/skeleton";
import { device } from 'const/const'


export const ContAddress = styled.section`
  display: grid;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
  row-gap: 20px;

  .div_deposit--address{
    display: flex;
    row-gap: 20px;
    flex-direction: column;
    > p {
      text-align: center;
    }
  }

  .address{
    display: flex;
    column-gap:7px;
    p{
      font-size: 18px;
    }
  }

  strong{
    text-transform: capitalize
  }

  .usdt,
  .uppercase{
    text-transform: uppercase;
  }

  p{
    margin: 0 !important;
    color: var(--paragraph_color); 
  }

  .soloAd,
  .soloAd2 {
    max-width: 700px;
    width: 100%;
    text-align: left;
    font-size: 15px;
    line-height: 20px;
  }
  .soloAd{
    color:--var(paragraph_color);
    span{
      text-transform: capitalize;
    }
  }
  .soloAd2 {
    font-size: 16px !important;
    text-align: left;
  }
  .qrContainer {
    height: 180px;
    width: 180px;
    position: relative;
  }

`



export const IconProviderTypeCont = styled.div`
  position: absolute;
  background: #f9f9fb;
  padding: 6px;
  border-radius: 50%;

`


export const EtherDisclaimer = styled.div`
  right: 0px;
  top: 0px;
  padding: 5px 10px;
  background: #ebebeb;
  border-radius: 4px;
  font-size: 13px;
  color: var(--paragraph_color);
  position:absolute;

  @media ${device.mobile}{
    top: auto;
    bottom: -20px;
    right: auto;
    width: -webkit-fill-available;
  }

`


const qrScan = keyframes`
    0% {
      transform: translateY(90px);
    }
    50% {
      transform: translateY(-90px);
    }
    100% {
      transform: translateY(90px);
    }
`;

const qrScanOpacity = keyframes`
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
`;



export const QrProtectorCont = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    overflow: hidden;
    opacity: 0;
    display: grid;
    align-items: center;
    justify-items: center;
    transition: 0.3s;
    &.active{
      opacity: 0.99;
    }
    &::after {
    content: "";
    width: 100%;
    height: 5px;
    background: #37ed7d;
    position: absolute;
    transition: 0.3s;
    animation-name: ${qrScan}, ${qrScanOpacity};
    animation-duration: 1.3s, 0.6s;
    animation-iteration-count: infinite;
  }
  &.error::after {
    background: red;
    animation-duration: 0.3s, 0.1s;
  }
`



export const DepositForm = styled(OperationForm)`
  background: transparent;

  &.DepositView{
    grid-template-rows: 50% 25% 1fr;
    grid-template-columns: 1fr !important;
    p {
      text-align: center;
      margin: 0 !important;
      max-width: 400px;
      justify-self: center;
      color: var(--paragraph_color); 
    }
    .contIcontSwitch {
      display: grid;
      align-items: center;
      justify-items: center;
    }
    .contButtons {
      align-self: center;
      justify-items: center;
      display:grid;
    }   
    &.skeleton{
      justify-items:center;
    }
  }

  .qrContainer {
    transform: scale(0.95);
    position:relative;
    display: grid;
    place-items: center;
  }

  .ioSystem{
    padding-bottom: 150px;
  }

  @media ${device.mobile}{
    width: 100%;
    height: auto;
    padding: 80px 0 20px;
    background: transparent;

    .WithdrawView, .SwapView, .DepositView, #swapForm{
      background-color: transparent;
    }

    .qrContainer {
      transform: scale(1);
    }
  }
  &.skeleton .soloAd2,
  &.skeleton .soloAd,
  &.skeleton .dirDep,
  &.skeleton .verifyAddress {
    background: var(--skeleton_color);
    width: 100%;
    border-radius: 3px;
    height: 15px;
    align-self: center;
    left: 15px;
  }

  &.skeleton .soloAd2 {
    max-width: 150px;
    justify-self: flex-start;
  }

  &.skeleton .soloAd {
    max-width: 400px;
    justify-self: flex-start;
  }

  &.skeleton .dirDep {
    max-width: 250px;
  }

  &.skeleton .verifyAddress {
    max-width: 350px;
  }

  &.skeleton .qrContainer {
    background: var(--skeleton_color);
    border-radius: 6px;
  }

  &.skeleton p span{
    background: #bfbfbf;
    color: #bfbfbf;
    line-height: 1.6em;
  }

  &.skeleton .skeletonDepositIcon{
    width: 90px;
    height: 100px;
    border-radius: 6px;
    background: #bfbfbf;
  }

  &.skeleton {
    animation-name: ${skeleton};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: 0.5;
  }
`;
