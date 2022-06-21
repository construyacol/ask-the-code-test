import styled, { keyframes }  from "styled-components"
import { TotalAmount } from '../../../widgets/shared-styles'
import { device } from '../../../../const/const'
import { 
    ItemAccountContainer,
    MobileBalance
} from '../../../widgets/accountList/listView'
import {
    // HeaderContainer,
    IconAccount,
    LabelContainer,
    CurrencyLabel,
} from '../../../widgets/headerAccount/styles'
import {
    ButtonContainer
  } from '../newWallet/styles'

export const showAnim = keyframes`
    0% {
        transform: translateY(50px);
        opacity:0;
    }
    100%{
        transform: translateY(0px);
        opacity:1;
    }
`;


export const LayoutContainer = styled.section`
    
    display: grid;
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
    grid-template-rows: auto auto auto 1fr;
    justify-items: center;
    padding: 50px 20px;
    position: absolute;
    background: white;
    transform: translateY(50px);
    opacity:0;
    
    h1{
        margin-bottom:10vh;
        margin-top:0;
        font-size: 2em;
        color:var(--title1);
    }

    &>p{ 
        margin-top:10vh;
        font-size:23px;
        max-width: 500px;
        text-align: center;
        font-weight: 500;
        color:var(--paragraph_color)
    }

    &.show{
        animation: ${showAnim} .3s linear forwards;
    }

    @media (max-width: 768px) {
        padding: 0 20px;
        width: calc(100vw - 40px);
        height: 100vh;

        h1, p{
            text-align:center;
        }
    }
`

export const ControlContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-bottom: 30px;
    p{
        margin-bottom:40px;
        color: var(--paragraph_color);
        font-size: 16px;
    }

`






export const SuccessViewContent = styled.div`
    height:auto;
    width:100%;
    display:grid;
    max-width: 760px;
    z-index: 2;
    position: relative;
    row-gap: 20px;
    padding: 20px 0 40px;
    min-height: calc(100vh - 60px);
    grid-template-rows: auto 1fr auto;

    &.withdrawAccountSuccess{
        grid-template-rows: auto auto 1fr;
    }

    &.withdrawSuccess{
        grid-template-rows: auto auto auto;
        padding-bottom:70px;
    }

    .iconSuccess{
        display: grid;
        justify-items: center;
        transform: scale(0.75);
    }

    ._fromTo{
        margin-bottom:0;
        color:var(--paragraph_color);
    }

`

export const SuccessViewLayout = styled.div`
    width:100vw;
    height:100vh;
    background:#F9F9FB;
    position:absolute;
    top:0;
    left:0;
    display: grid;
    justify-items: center;
    overflow-y:scroll;

    &::after{
        content: "";
        width: 100vw;
        height: 25vh;
        background: linear-gradient(to bottom right,#129a8e,#57cd85);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
    }
`

export const Title = styled.h2`
    text-align: center;
    color: white;
    letter-spacing: 1px;
    font-size: 22px;
`


export const Header = styled.div`
    height: 130px;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    ${Title}{
        margin:0;
    }
`


export const ContentDetail = styled.div`
    display:flex;
    flex-direction: column;
    row-gap: 12px;
    p{
        font-weight: normal;
    }
    &.onBottom{
        border-bottom: 1px solid #E9E9E9;
        padding-bottom: 40px;
    }
`

export const AccountMetaData = styled.div`
    min-height:80px;
    height:auto;
    background:#F9F9F9;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 10px;
`


export const SubTitle = styled.h3`
    color:var(--paragraph_color);
`







export const Content = styled.div`
    background: white;
    border-radius: 6px;
    border:1px solid #E7E7E7;
    padding: 15px 45px;
    display:flex;
    flex-direction: column;
    row-gap: 15px;
    position:relative;

    &.withdrawAccountSuccess{
        position:relative;
        display: grid;
        min-height: 100px;

        p{
            text-align:center;
            max-width: 500px;
            justify-self: center;
            color:var(--primary);
            height: auto;
            align-self:center;
        }
        &::after{
            content: "";
            position: absolute;
            width: 97%;
            height: 78%;
            border: 1px solid var(--primary);
            top: 0;
            bottom: 0;
            margin: auto;
            left: 0;
            right: 0;
            border-radius: 5px;
        }
    }

    ${TotalAmount}{
        .amount{
            font-size:26px;
        }
        display:grid;
        row-gap: 3px;
        display: grid;
        margin-top: 24px;
    }
    
    ._itemAccountContainer{
        grid-template-columns: auto 1fr;
    }

    ${ItemAccountContainer}{
        border-left:5px solid var(--primary);
    }

    ${MobileBalance}{
        justify-self: end;
        column-gap: 22px;
    }

    ${LabelContainer},
    ${MobileBalance}{
        row-gap: 3px;
    }

    ${IconAccount}{
        height:50px;
        width:50px;
    }

    ${CurrencyLabel},
    ._balanceTextLab{
        text-transform: none;
        font-size: 13px;
    }

    ${ButtonContainer}._sticky{
        display:none;
    }

    @media ${device.mobile} {
       padding: 15px 10px;
        ${ButtonContainer}._sticky{
            display:flex;
            position:sticky;
            top:0;
        }
    }

`
