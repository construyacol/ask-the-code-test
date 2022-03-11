import styled, { keyframes } from "styled-components";



export const showButton = keyframes`
    0% {
      filter: grayscale(1) blur(1px);
        opacity:.1;
    }
    20% {
      filter: grayscale(1) blur(0px);
      opacity:.1;
    }
    90% {
      filter: grayscale(1) blur(0px);
      opacity:.1;
    }
   
    100%{
      filter: grayscale(0) blur(0px);
        opacity:1;
    }
`;

export const Button = styled.button`
  background: #0198ff;
  font-size: 17px;
  font-weight: bold;
  width:270px;
  height:60px;
  border-radius:5px;
  border: none;
  color: white;
  cursor:pointer;
  position:absolute;
  bottom:40px;
  opacity:.1;
  filter: grayscale(1) blur(1px);

  &.showButton{
    animation: ${showButton} .8s linear forwards;
  }

`

export const showWelcome = keyframes`
    0% {
        transform: translateY(50px);
        filter:blur(5px);
        opacity:0;
    }
    50% {
        transform: translateY(50px);
        filter:blur(1px);
        opacity:0;
    }
    100%{
        transform: translateY(0px);
        filter:blur(0px);
        opacity:1;
    }
`;

export const hideWelcome = keyframes`
    0% {
        transform: translateY(0px);
        filter:blur(0px) grayscale(0.2);
        opacity:1;
        
    }
    60% {
        transform: translateY(5px);
        filter:blur(3px) grayscale(1);
        opacity:1;
    }
    100%{
        transform: translateY(-70px);
        filter:blur(5px) grayscale(1);
        opacity:0;
    }
`;

export const hideStage = keyframes`
    0% {
        transform: translateY(0px);
        filter:blur(0px) grayscale(0.2);
        opacity:1;
        
    }
    100%{
        transform: translateY(-15px);
        filter:blur(1px);
        opacity:0;
    }
`;


export const showStage = keyframes`
    0% {
        transform: translateY(10px);
        filter:blur(1px);
        opacity:0;
    }
    100%{
        transform: translateY(0px);
        filter:blur(0px);
        opacity:1;
    }
`;



export const flipInVerRight = keyframes`
  0% {
    transform: rotateY(80deg);
    opacity: 0;
  }
  100% {
    transform: rotateY(0);
    opacity: 1;
  }
`;

export const tiltInFwdTl = keyframes`
    0% {
            transform: rotateY(-65deg) rotateX(35deg) translate(-60px, -60px) skew(45deg, -20deg);
    opacity: 0;
  }
  50%{
    opacity: 1;
  }
  100% {
            transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
    opacity: 1;
  }
`;


export const Container = styled.div`
    &.show_{
        animation: ${showWelcome} .5s linear forwards;
    }
    &.hide_{
        animation: ${hideWelcome} .5s linear forwards;
    }

    row-gap: ${props => props.rowGap ? `${props.rowGap}px` : 0};

    perspective: 500px;
    perspective-origin: calc(50% + 120px) 50%;

    .flip-in-ver-right {
        animation: ${tiltInFwdTl} 0.6s .25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    
    }
    display: grid;
    align-items: center;
    justify-items: center;
    transform: translateY(50px);
    opacity:0;

    h1, h2{
        color: var(--paragraph_color);
        font-size: 30px;
        margin: 0;
        font-weight:300;
    }
    span{
        font-size:45px;
    }
`


export const Layout = styled.div`
    display: grid;
    width: 100vw;
    height: 100vh;
    background: #ffffffff;
    position: absolute;
    justify-items: center;
    top: 0;
    left: 0;
    z-index:1000;
  @media screen and (max-height: 900px){
  }
`

export const ContentContainer = styled.div`
  position:relative;
  width:100vw;
  height:auto;
  max-width:800px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto auto;
  height: calc(100vh - 80px);
  padding: 40px 0;
`

export const Content = styled.section`
  width:100vw;
  height:100vh;
  display:grid;
  position:relative;
  align-items:center;
  justify-items:center;
  
  [alt="isoType"]{
    position: absolute;
    margin: auto;
    top: 30px;
    left: 40px;
    left: 0px;
    right:0;
  }
`