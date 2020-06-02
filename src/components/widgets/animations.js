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
