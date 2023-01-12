import styled from 'styled-components'
import { device } from 'const/const'

export const Chains = styled.div`
    width: auto;
    height: auto;
    display: flex;
`

export const Container  = styled.div`
    top: -15px;
    left:0;
    display: flex;
    position: absolute;
    z-index: 3;
    color: var(--paragraph_color);
    font-size: 15px;
    
    @media ${device.mobile} {
        top: 197px;
        transform: translateY(-15px);
        justify-self: start;
        left: 0;
        display: flex;
        position: sticky;
        z-index: 3;
        color: var(--paragraph_color);
        font-size: 15px;
    }
    
    h4{
        width: fit-content;
        margin:0;
        height: 100%;
        display: flex;
        align-items: center;
        /* background: var(--secondary_background); */
        padding: 0 10px;
        font-weight: normal;
    }

    p{
        margin: 0;
        padding: 12px 17px;
        width: auto;
        min-width: 70px;
        text-align: center;
    }
`

export const Chain = styled.div`
    background: var(--secondary_background);
    cursor: pointer;
    display: flex;
    span{
        font-size: 12px;
        opacity: .5;
        font-weight: 400;
        color: var(--paragraph_color);
    }
    &.isActive{
        background: transparent;
        border-top: 1px solid var(--primary);
        color: var(--primary);
        transform: translateY(-1px);
        column-gap: 7px;
        padding-left: 12px;
    }
    p{
        text-transform: capitalize;
        font-weight: bold;
        &.active{
            padding-left: 0;
        }
    }
`