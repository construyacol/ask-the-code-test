import styled from 'styled-components'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const PopUpLayout = styled(Popup)`

@keyframes anvil {
    0% {
      transform: scale(1) translateY(0px);
      opacity: 0;
      box-shadow: 0 0 0 rgba(241, 241, 241, 0);
    }
    1% {
      transform: scale(0.99) translateY(-7px);
      opacity: 0;
      box-shadow: 0 0 0 rgba(241, 241, 241, 0);
    }
    100% {
      transform: scale(1) translateY(0px);
      opacity: 1;
      box-shadow: 0 0 500px rgba(241, 241, 241, 0);
    }
  }


  &-content {
    background-color: #303c45;
    color: white;
    backdrop-filter: blur(8px);
    width: 260px !important;
    -webkit-animation: anvil 0.2s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards;

  }

  &-arrow {
    color: #303c45;
    display: none;
  }



`

export const ContainerPopUp = styled.div`
  position: relative;
  background-color: red;
`


export const TriggerButton = styled.div`
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
`

export const WrapperAsolute = styled.div`
    position: absolute;
    right: 25px;
    height: 100%;
    min-width: 10px;
    display: flex;
    align-items: center;
`

export const WrapperContainer = styled.div`
    position: relative;
    display: grid;
    width: 100%;
    height: 80%;

    &.menu_option--element{
        grid-template-columns: auto auto 15px;
        column-gap: 7px;
        grid-template-rows: 1fr;
        height: 100%;
        align-items: center;
    }

    p{
        margin:0 2px 0;
    }

    &.menu_option--trigger-action::after{
        content: "";
        position:absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        cursor: pointer;
    }

    &.menu_option--trigger-action{
        padding: 0 11px;
    }

    &.menu_option--trigger-action:hover,
    &.isActive{
        background: #303c46;
        border-radius: 4px;
    }
`


export const UserOptionContainer = styled.section`
    position: absolute;
    align-self: center;
    align-items: center;
    justify-items:center;
    display: grid;
    grid-template-columns: auto auto 20px;

  &.sectionActive::after{
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: red;
  }

`

export const HandleAction = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: pointer;
`

export const UserOptionPic = styled.div`
  height: ${props => props.size ? `${props.size}` : `35px`};
  width: ${props => props.size ? `${props.size}` : `35px`};
  border-radius: 50%;
  overflow: hidden;
  background: ${props => props.theme.palette.primary};
  box-shadow: 0 1px 14px -2px rgb(0 0 0 / 30%);
  display:grid;
  place-content: center;
`

export const IconContainer = styled.div`
  transform: ${props => props.orientation === 'open' ? "rotate(0deg)" : "rotate(180deg)"};
  transition: .2s;
`

export const PanelOption = styled.section`
    opacity: 0;
    border-radius: 6px;
    width:200px;
    height: 200px;
    background: linear-gradient(to right, #2B3742 , #101418);
    position: absolute;
    right: 0;
    transition: .25s;
    animation: ${props => props.orientation ? `show .3s linear forwards` : ``};
    bottom: 100px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 50px;
    align-items: center;
    justify-items:center;

    @keyframes show{
      0%{
        opacity: 0;
        bottom: 100px;
      }
      10%{
        opacity: 0;
        bottom: -200px;
      }
      100%{
        opacity: 1;
        bottom: -205px;
      }
    }
`