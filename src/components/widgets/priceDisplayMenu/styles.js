import styled from 'styled-components'
import { OnlySkeletonAnimation } from 'components/widgets/loaders/skeleton'

import {
    HoverControl,
    ControlsContainer,
    showControls
} from 'components/widgets/priceControlsMenu/styles'

export const PriceContainer = styled.div`
    width:auto;
    max-width:500px;
    height:100%;
    display:grid;
    grid-template-rows:1fr;
    grid-template-columns:1fr auto 1fr;
    place-items: center;
    column-gap: 10px;
    position: relative;
    cursor: pointer;
    overflow: hidden;

    &.mobile{
    grid-template-columns:1fr;
    }
    &:hover{
        ${HoverControl}{
            opacity: 1;
        }
        ${ControlsContainer}{
            animation: ${showControls} .15s .15s linear forwards;
        }
    }
`


export const LabelPrice = styled.div`
    display:grid;
    grid-template-rows:auto 1fr;
    place-items:center;
    row-gap:5px;

    p{
        text-align: center;
        color:white;
        font-size:10px;
        width: max-content;
    }

    h3{
        text-align:center;
        font-weight: bold;
        font-size: 21px;
        font-family: Tomorrow;
        color: rgb(31, 228, 123);
    }

    p, h3{
        margin:0;
        letter-spacing: 4px;
    }

    &.skeleton{
        p{
            font-size:12px;
        }
        h3{
            width:100%;

        }
        p, h3{
            ${OnlySkeletonAnimation};
        }
    }
`


export const Hr = styled.div`
    height: 30px;
    width: 2px;
    margin: 0px 4em;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
    transform: rotate(10deg);
    margin: 0 10px;
`