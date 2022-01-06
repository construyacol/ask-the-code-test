import styled, { keyframes } from "styled-components";



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
        filter:blur(0px);
        opacity:1;
    }
    60% {
        transform: translateY(5px);
        filter:blur(3px);
        opacity:1;
    }
    100%{
        transform: translateY(-70px);
        filter:blur(5px);
        opacity:0;
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

    perspective: 500px;
    perspective-origin: calc(50% + 120px) 50%;

    .flip-in-ver-right {
	    ${'' /* animation: ${flipInVerRight} 0.5s .4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; */}
        animation: ${tiltInFwdTl} 0.6s .35s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    
    }
    display: grid;
    align-items: center;
    justify-items: center;
    row-gap: 15px;
    transform: translateY(50px);
    opacity:0;

    h1{
        color: #0198ff;
        font-size: 45px;
        margin: 0;
    }
    span{
        font-size:45px;
    }
`


export const Layout = styled.div`
    display: grid;
    width: 100vw;
    height: 100vh;
    background: #fffffffa;
    position: absolute;
    justify-items: center;
    top: 0;
    left: 0;
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
    ${'' /* left: 0px;
    right:0; */}
  }
`