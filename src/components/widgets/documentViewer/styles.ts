import styled, { keyframes } from 'styled-components'
import { device } from 'const/const'

export const CtaCont = styled.div`
    position: sticky;
    bottom:50px;
    width: auto;
    height:auto;
    justify-self: center;
    z-index: 2;
    p{
        margin:0;
        color:white;
    }

    @media ${device.mobile}{
        bottom:0px;
        width: 100%;
        button{
            padding: 1rem;
            width: 100%;
        }
    }

`

export const DocumentManagerContainer = styled.div`
    background: #242424;
    height: calc(100% - 40px);
    border-radius: 5px;
    overflow-y: scroll;
    display: grid;
    position:relative;
    grid-template-rows: 1fr;
    width: calc(100% - 80px);
    padding:40px 40px 0;
  
    .kycDeleteButton~img{
        opacity:.1;
    }

    img{
        object-fit: cover;
        width: 100%;
        align-self:center;
        border-radius:4px;
    }

    @media ${device.mobile}{
        padding: 15px;
        height: calc(100% - 30px);
        width: calc(100% - 30px);
    }


`


export const flipAnimation = keyframes`
  0%{
    transform: rotateY(0);
  }
  30%{
    transform: translateZ(100px) rotateY(0);
  }
  80%{
    transform: translateZ(100px) rotateY(180deg);
  }
  100% {
    transform: translateZ(0px) rotateY(180deg);
  }
`;

export const DoubleSidedElement = styled.div`
    transform-style: preserve-3d;
    height: 190px;
    border-radius: 4px;
    position:relative;
    &.pasaporte,
    &.selfie{
        /* height: 250px; */
    }
    &.id_back{
        animation: ${flipAnimation} 1.3s cubic-bezier(0.455, 0.030, 0.515, 0.955) forwards;
    }
    img[alt="selfie"]{
        display:none;
    }
    &.selfie{
        img[alt="selfie"]{
            display:block;
        } 
        img[alt="id_front"]{
            display:none;
        }   
    }
`
const SideElement = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 4px;
    display:flex;
    place-items:center;
    place-content:center;
    font-size:40px;
    color:white;
    backface-visibility: hidden;
    img{
        height: 100%;
    }
`

export const FrontElement = styled(SideElement)`
    z-index: 20;
`

export const BackElement = styled(SideElement)`
    z-index: 10;
    transform: rotateY(180deg);
`

export const DocumentViewerContainer = styled.div`
    width: auto; 
    height: auto;
    transform-style: preserve-3d;
    perspective-origin: center;
    perspective: 1000px;
`

// export const OnlySkeletonAnimation = css`
//   animation-name: ${skeleton};
//   animation-duration: 1s;
//   animation-iteration-count: infinite;
//   opacity: 0.5;
// `;