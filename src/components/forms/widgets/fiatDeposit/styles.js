import styled from 'styled-components'
import {
    hideStage,
    showStage
} from '../sharedStyles'
import { Content } from '../../../widgets/modal/render/addressBook'
import { Header } from '../../../widgets/modal/render/addressBook/header'

const Layout = styled.div`
    grid-row-gap: 10px;
    display: grid;
    height: 100%;
    justify-items: center;
    align-items: center;
    perspective: 900px;3
    transform-style: preserve-3d; 
    text-align: center;
    width: calc(100% - 40px);
    padding: 0 20px;

    .botonForm{
        width:220px;
    }
`

export const AmountLayout = styled(Layout)`
    grid-template-rows: 120px 1fr 120px;
    &.hide_{
        animation: ${hideStage} .3s linear forwards;
    }

    &.show_{
        animation: ${showStage} .3s linear forwards;
    }

`

export const CostIdLayout = styled(Layout)`
    grid-template-rows: 120px 1fr 120px;
    opacity:0;
    &.hide_{
        animation: ${hideStage} .2s linear forwards;
    }
    &.show_{
        animation: ${showStage} .3s linear forwards;
    }

    @media (max-width: 768px) {
        ._costIdContent{
            padding: 0;
            width: 100%; 
            .mobileView{
                width: 100%;
                transform: scale(1) !important;
            }
        }
    }
`

export const DepositContent = styled(Content)`
  @media (max-width: 768px) {
    border-radius:0;     
  }
`

export const DepositHeader = styled(Header)`
@media (max-width: 768px) {
    border-radius:0;      
    width: 100%;
  }
`

export const SuccessModalCont = styled.section`
    position: absolute;
    height: calc(100vh - 80px);
    width: 100vw;
    padding: 40px 0;
    background: linear-gradient(to bottom right,#129a8e,#37ed7d);

    @media (max-width: 768px) {
        padding-bottom:50px;
        height: calc(100vh - 50px);
        
        &.ioSystem{
            padding-bottom:100px;
            height: calc(100vh - 100px);
        }
    }

   
`