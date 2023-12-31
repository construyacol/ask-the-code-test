import styled from 'styled-components'
import { device } from 'const/const'

export const NetworkItemCont = styled.div`
    display: flex;
    column-gap: 10px;
    p{
        text-transform: capitalize;
        margin: 0;
    }
    span{
        margin-left: 5px;
        font-weight: normal;
        opacity: .5;
    }
`



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
    
    h3{
        width: fit-content;
        margin:0;
        height: 100%;
        display: flex;
        align-items: center;
        /* background: var(--secondary_background); */
        padding: 0 10px;
        /* font-weight: normal; */
    }

    p{
        margin: 0;
        width: auto;
        min-width: 70px;
        text-align: center;
    }
`

export const Chain = styled.div`
    background: var(--secondary_background);
    cursor: pointer;
    display: flex;
    padding: 12px 17px;
    column-gap: 7px;

    span{
        font-size: 12px;
        opacity: .5;
        font-weight: 400;
        color: var(--paragraph_color);
    }
    &.isActive{
        background: transparent;
        border-top: 2px solid var(--primary);
        color: var(--primary);
        transform: translateY(-1px);
    }
    p{
        text-transform: capitalize;
        font-weight: bold;
        font-size: 15px;
    }
`