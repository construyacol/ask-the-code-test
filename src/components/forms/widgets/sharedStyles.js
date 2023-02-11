import styled, { keyframes } from "styled-components";
import { device } from '../../../const/const'
import { OnlySkeletonAnimation } from '../../widgets/loaders/skeleton'
import { HR } from 'components/widgets/headerAccount/styles'


export const Disclaimer = styled.div`
  padding: 7px 15px;
  height:auto;
  min-height:80px;
  border-radius:6px;
  display:none;

  &.disclaimer__deposit--usdt{
    position: absolute;
    top: 0;
    left: 0;
    p{
      margin: 0;
    }

    @media ${device.mobile} {
      bottom: 0;
      top: auto;
      position: relative;
    }
  }

  &.contolled{
    height:auto;
    min-height: auto;
    display: flex;
  }

  .disclaimer--message_p{
    margin: 10px 0 0;
    height: 50px;
    overflow: hidden;
    position:relative;
    &.disclaimer__open{
        height: auto;
    }
    &.disclaimer--showGradient{
        &::after{
            content:"";
            position:absolute;
            width:100%;
            height: 50px;
            bottom:0; 
            left: 0;
            pointer-events:none;
        }
    }
    &.pending,
    &.in_progress{
        &::after{
            background: linear-gradient(0deg, #f5e6ca 0%, transparent 75%);
        }
    }
    &.complete{
        &::after{
            background: linear-gradient(0deg, #e5ede5 0%, transparent 75%);
        }
    }
  }

  p{
    font-size: 13px;
    line-height:17px;
  }

  

  &.pending,
  &.warning,
  &.in_progress{
    background:#f5e6ca;
    display:initial;
    .disclaimer--message_p{
      color: #8f5d00;
    }
  }

  &.warning{
    margin-bottom: 15px;
    h2, h3{
      color: #8f5d00;
      text-align:left;
      margin:0;
    }
  }

  &.complete{
    background:#e5ede5;
    display:initial;
    .disclaimer--message_p{
        color: green;
    }
  }

  .verMas__p{
    margin: 12px 0 0;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
    color: var(--title1);
  }


  &.fullDisclaimer{
    padding:20px;
    max-width:calc(700px - 40px);
    align-self:end;
    .disclaimer--message_p{
      font-size: 14px;
      line-height:22px;
    }
  }

  @media ${device.mobile} {
    
  &.warning{
    h2, h3{
      text-align:center;
    }
  }
  }

`


export const TooltipContainer = styled.div`

  position: relative;
  display: inline-block;

  &:hover .tooltiptext {
    visibility: visible;
  }

  .tooltiptext {
    visibility: hidden;
    width: auto;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 12px !important;
    position: absolute;
    z-index: 1;
    top: 100%;
    margin: auto;
    left: -120%;
  }
 
`

export const MetaDataContainer = styled.div`
  min-height:100px;
  background:#f0f0f0;
  display:grid;
  align-self: end;
  padding:15px 20px;
  width:calc(100% - 40px);
  max-width:calc(700px - 40px);
  p{
    color:var(--paragraph_color);
  }
  ul{
    display: grid;
    align-items: center;
    row-gap: 10px;
    li{
      color:var(--paragraph_color);
      font-size:15px;
    }
  }
`


export const MetaContainer = styled.div`
  width:auto;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  column-gap: 15px;
  grid-template-rows: auto auto;
  align-self: center;
  row-gap: 3px;

  ._deleteAccount{
    &:hover{
      color:red !important;
    }
  }

  ${HR}{
    grid-column-start: 1;
    grid-row-start: 1;
    grid-row-end: 3;
  }

  &.uniqueRow{
    grid-template-rows: 1fr;
    ${HR}{
      grid-row-end: 2;
    }
  }

  p{
    margin:0;
    color:var(--paragraph_color);
    font-size:18px;
  }

  p:nth-child(3), 
  .metaText {
    font-size:13px;
    font-family: "Raleway",sans-serif;
    color: var(--placeholder);
  }

  .metaText{
    font-size:14px;
    span{
      color: var(--placeholder);
    }
    &.pending,
    &.in_progress{
      span{
        color: orange;
      }
    }
    &.complete{
      span{
        color: green;
      }
    }
    &.rejected,
    &.canceled{
      span{
        color: red;
      }
    }
  }

  &.__withdrawAccount{
    grid-template-columns: auto auto 1fr auto;
    column-gap: 7px;
    ${HR}{
      margin-right: 5px;
    }
    span{
      .complete{
        color:green;
      }
      .pending,
      .in_progress{
        color:orange;
      }
    }
  }
`

// export const WAccountMetaContainer = styled(MetaContainer)`
//   grid-template-columns: auto 1fr;

// `

export const OptionInputContainer = styled.div`
  display:grid;
  row-gap: 24px;
  grid-template-rows:auto 1fr;
  .pse p{
    text-transform: uppercase;
  }
`

export const Title = styled.h1`
    &.skeleton{
        position:relative;
        color:transparent;
        display: flex;
        justify-content: center;
        ${OnlySkeletonAnimation}
    }
    &.skeleton::after{
        content:"Crea una billetera";
        position:absolute;
        color:#bfbfbf;
        background:#bfbfbf;
        border-radius:4px;
    }
`
 
export const Option = styled.div`
  height: 142px;
  width: 172px;
  border: 1px solid #bfbfbf;
  position: relative;
  border-radius: 6px;
  display: grid;

  &::after{
    position: absolute;
    content: "";
    width: 50px;
    height: 45px;
    background: #bfbfbf;
    align-self: center;
    justify-self: center;
    border-radius: 5px;
    margin-bottom: 40px;
  }

  &::before{
    position: absolute;
    content: "";
    width: 100px;
    height: 15px;
    background: #bfbfbf;
    border-radius: 3px;
    justify-self: center;
    align-self:flex-end;
    margin-bottom: 15px;
  }
`

export const ButtonContainer = styled.div`
    height:80px;
    display: flex;
    place-content: center;
`

export const ListContainer = styled.div`
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    grid-template-rows: repeat(auto-fill, 150px);
    column-gap: 15px;
    row-gap: 15px;
    padding:25px 0;
    height:calc(100% - 50px);

    &.skeleton{
        ${Option}{
            ${OnlySkeletonAnimation}
        }
    }

    &::-webkit-scrollbar {
        width: 7px;
    }

    &::-webkit-scrollbar-thumb {
        background: #475a681f;
    }

    .__itemContainerL__ .item:hover{
        transform: scale(1) !important;
    }

    @media ${device.tablet} {

        padding:25px 0;


        .__itemContainerL__{
            display: grid;
            justify-items: center;
        }

        .__itemContainerL__ .item, ${Option}{
            width:160px;
            height:140px;
        }
        
    }
`

// export const Content = styled.div`

//     max-width:580px;
//     height: calc(100% - 50px);
//     width: calc(100% - 50px);
//     padding: 25px;
//     display:grid;
//     grid-template-rows:auto auto 1fr auto;
//     row-gap:20px;

//     h1{
//         color:var(--title1);
//         font-size:1.5em;
//         text-align:center;
//     }

//     @media ${device.mobile} {
//         h1{
//            margin-bottom:0;
//         }
//         height: calc(100% - 70px);
//         width: calc(100% - 40px);
//         padding: 20px 20px 50px;
//     }

// `

// export const Layout = styled.section`
//     width:100vw;
//     height:100vh;
//     background:white;
//     display:flex;
//     background:white;
//     position:absolute;
//     top:0;
//     left:0;
//     display: flex;
//     place-content: center;
// `






















export const StageContainer = styled.div`
  display:grid;
  row-gap:20px;

  &.skeleton{
    width: 100vw;
    max-width: 700px;
    justify-self: baseline;
    align-self: baseline;

    p{
      background:var(--skeleton_color);
      border-radius:4px;
      color:transparent;
      width:fit-content;
      ${OnlySkeletonAnimation};
    }
    .onAccountList{
      background:var(--skeleton_color);
      ${OnlySkeletonAnimation};
    }

    img{
      display:none;
    }

    @media ${device.mobile} {
      width:100%;
    }

  }

  ._birArrow{
    fill: var(--paragraph_color);
    align-self: center;
    justify-self: end;
    opacity: 1;
  }

  input{
    font-size:15px;
    color: var(--paragraph_color);
    font-family: "Tomorrow", sans-serif;
    &::-webkit-input-placeholder { 
        font-size:15px;
    }
    &[type="button"]{
      color:white;
    }
  }

  ._inputLabelP{
    margin-top:10px !important;
  }

  ._pLabel{
    margin: 0;
    color: var(--paragraph_color);
  }


  &._withdrawAmount{
    .label___message{
      font-family: "Tomorrow", sans-serif !important;
    }
    ._balanceComponent{
      right:20px;
    }
  }
 
  &._infoAccount,
  &._withdrawAmount, 
  &._bankNameList,
  &._identityComponent{
    grid-template-rows:auto auto 1fr;
  }

  .inputContainer__{
    height: 45px;
    max-width: 700px;
    margin: 15px 0 10px;
  }
  ._stickyPosition{
    background: #f9f9fb;
    position: sticky;
    top: 143px;
    z-index:1;
  }

  @media ${device.mobile} {
    ._stickyPosition{
      top: 120px;
    }
    &._infoAccount, 
    &._bankNameList, 
    &._identityComponent{
      grid-template-rows:auto auto 1fr;
    }
  }

  input{
    font-family: "Tomorrow", sans-serif !important;
  }
`

export const ButtonContainers = styled.div`
  position: sticky;
  bottom: 30px;  
  display: grid;

  @media ${device.mobile} {
    background: #f9f9fb;
    z-index: 1;
    padding: 10px;
    bottom: 0px;  
  }
`

export const FormContainer = styled.div`
  width:100%;
  height:100%;
  display:grid;
  grid-template-columns:1fr minmax(auto, 350px);
  column-gap:20px;
  @media ${device.mobile}{
    grid-template-rows: 1fr auto;
    grid-template-columns:1fr;
    row-gap:25px;
    column-gap:0px;
  }
`

export const CriptoWithdrawForm = styled(FormContainer)`
  grid-template-columns:1fr minmax(auto, 380px);
  grid-template-rows: 1fr;
  position:relative;


  @media ${device.mobile}{
    grid-template-columns:1fr;
  }

`


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
    top: 0;
    left: 0;
    z-index:1000;
    &._identityKycLayout{
      @media ${device.mobile} {
        overflow:auto;
      }
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
    left: 0px;
    right:0;
  }
`


