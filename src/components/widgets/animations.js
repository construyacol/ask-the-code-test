import { keyframes } from "styled-components";
// import { skeleton } from "./loaders/skeleton";

// use: animation: swing-in-bottom-bck 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;


export const show = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`


export const getAtention = keyframes`
  0% {
    transform: rotate(0deg);
  }

  79% {
    transform: rotate(0deg);
  }

  80% {
    transform: rotate(2deg);
  }

  85% {
    transform: rotate(-2deg);
  }

  90% {
    transform: rotate(1deg);
  }

  95% {
    transform: rotate(-1deg);
  }

  100% {
    transform: rotate(0deg);
  }
`;

export const atentionAnimation = keyframes`
  0%,
  100% {
    -webkit-transform: translateX(0%);
            transform: translateX(0%);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
  }
  15% {
    -webkit-transform: translateX(-7px) rotate(-4deg);
            transform: translateX(-7px) rotate(-4deg);
  }
  30% {
    -webkit-transform: translateX(7px) rotate(4deg);
            transform: translateX(7px) rotate(4deg);
  }
  45% {
    -webkit-transform: translateX(-7px) rotate(-3deg);
            transform: translateX(-7px) rotate(-3deg);
  }
  60% {
    -webkit-transform: translateX(4px) rotate(2deg);
            transform: translateX(4px) rotate(2deg);
  }
  75% {
    -webkit-transform: translateX(-2px) rotate(-1deg);
            transform: translateX(-2px) rotate(-1deg);
  }
`;

export const rotate90HorizontalBck = keyframes`
  0% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
  }
  100% {
    -webkit-transform: rotateX(-90deg);
            transform: rotateX(-90deg);
  }
`;

export const rotate0HorizontalBck = keyframes`
  0% {
    -webkit-transform: rotateX(-90deg);
            transform: rotateX(-90deg);
  }
  100% {
    -webkit-transform: rotateX(0);
    transform: rotateX(0);
  }
`;

export const getOutAnimationKeyboard = keyframes`
    0% {
      -webkit-transform: translateY(0) rotateX(0) scale(1);
              transform: translateY(0) rotateX(0) scale(1);
      -webkit-transform-origin: 50% -1400px;
              transform-origin: 50% -1400px;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(600px) rotateX(30deg) scale(0);
              transform: translateY(600px) rotateX(30deg) scale(0);
      -webkit-transform-origin: 50% 100%;
              transform-origin: 50% 100%;
      opacity: 1;
    }
`;

export const getOutAnimation = keyframes`
  0%{
    opacity: 100%
  }
  100%{
    opacity: 0%;
  }
`;

export const keyAnimation = keyframes`
  0% {
    box-shadow: 0px 3px 0px 2px #cccccc;
    transform: scale(1);
  }
  50% {
    box-shadow: 0px 1px 0px 2px #5ce990;
    transform: scale(.8);
  }
  100% {
    box-shadow: 0px 3px 0px 2px #cccccc;
    transform: scale(1);
  }
`;

export const keyBoardAnimation = keyframes`
0% {
  -webkit-transform: translateY(600px) rotateX(30deg) scale(0);
          transform: translateY(600px) rotateX(30deg) scale(0);
  -webkit-transform-origin: 50% 100%;
          transform-origin: 50% 100%;
  opacity: 0;
}
100% {
  -webkit-transform: translateY(0) rotateX(0) scale(1);
          transform: translateY(0) rotateX(0) scale(1);
  -webkit-transform-origin: 50% -1400px;
          transform-origin: 50% -1400px;
  opacity: 1;
}
`;

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
`;

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
`;
