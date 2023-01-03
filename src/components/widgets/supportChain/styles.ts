import styled from 'styled-components'

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
    &.isActive{
        background: transparent;
        border-top: 1px solid var(--primary);
        color: var(--primary);
        transform: translateY(-1px);
    }
    p{
        text-transform: capitalize;
        font-weight: bold;
    }
`