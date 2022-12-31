import styled from 'styled-components'

export const Chains = styled.div`
    width: auto;
    height: auto;
    display: flex;
`

export const Container  = styled.div`
    display: flex;
    position: absolute;
    z-index: 2;
    top: -15px;
    color: var(--paragraph_color);
    font-size: 14px;
    
    h4{
        width: fit-content;
        margin:0;
        margin: 0 20px 0 10px;
        align-self: center;
    }

    p{
        margin: 0;
        padding:8px 15px;
        width: auto;
        min-width: 70px;
        text-align: center;
    }
`

export const Chain = styled.div`
    background: var(--secondary_background);
    &.isActive{
        background: transparent;
        border-top: 1px solid var(--primary);
        color: var(--primary);
        transform: translateY(-1px);
    }
`