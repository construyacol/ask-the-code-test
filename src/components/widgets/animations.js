import styled, { keyframes } from 'styled-components'


// use: animation: swing-in-bottom-bck 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
export const swing_in_bottom_bck = keyframes`
  0% {
    -webkit-transform: rotateX(-70deg);
    transform: rotateX(-70deg);
    -webkit-transform-origin: bottom;
    transform-origin: bottom;
    opacity: 0;
  }

  100% {
    -webkit-transform: rotateX(0);
    transform: rotateX(0);
    -webkit-transform-origin: bottom;
    transform-origin: bottom;
    opacity: 1;
  }
`;

export const gotoTx = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px) scale(1.2);
  }
  100% {
    transform: translateX(0);
  }
`;

export const deletedOrderAnim = keyframes`
  0%{
    transform: rotateX(20deg) scale(.95);
  }
  10%{
    opacity: 1;
  }
  100%{
    opacity: 0;
    transform: rotateX(90deg) scale(0.7);
  }
`;


export const newOrderStyleAnim = keyframes`
  0%{
    opacity: 0;
    transform: rotateX(-90deg);
  }
  40%{
    opacity: 1;
  }
  60%{
    transform: rotateX(30deg);
  }
  80%{
    transform: rotateX(-30deg);
  }
  100%{
    transform: rotateX(0deg);
  }
`;

export const containerDepositAnim = keyframes`
  0% {
    transform: scale(0.9) ;
  }
  100% {
    transform: scale(1) ;
  }
`;




export const socketIconContainerIntro = keyframes`
  0% {
    transform: translateY(15px) scale(0);
  }
  60% {
    transform: translateY(15px) scale(1.15);
  }
  100% {
    transform: translateY(15px) scale(1);
  }
`


export const backTopSection = keyframes`
  0% {
    left:0%;
    top:0%;
  }
  25%{
    left:-20%;
    top:0%;
  }
  50%{
    left:-20%;
    top:-20%;
  }
  75%{
    left:0%;
    top:-20%;
  }
  100% {
    left:0%;
    top:0%;
  }
`
