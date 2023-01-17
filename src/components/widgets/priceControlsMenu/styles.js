import styled, { keyframes } from 'styled-components'



export const CurrencyListContainer = styled.div`
    max-height: 38px;
    overflow: hidden;
`
export const CurrencyList = styled.div`
    transition: .3s;
    height: ${props => props.height ? `${props.height*100}%` : "100%"};
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    transition: .3s;
    top:${props => props.position ? `-${props.position*100}%` : 0};
    position: relative;
`
export const CurrencyItem = styled.div`
    margin:0;
    color: rgb(31,228,123);
    height: 38px;
    padding: 0 15px;
    display: flex;
    place-items: center;
    column-gap: 7px;
    p{
        margin: 0;
    }
`

export const SwitchControls = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 2px;
`




export const HoverControl = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #242b3185;
    backdrop-filter: blur(8px);
    transition: .15s;
    opacity: 0;
    /* opacity: 1; */
    display: grid;
    place-content: center;
    grid-template-columns: auto auto;

    .button__prices--show-prices{
        padding: 10px 18px;
        height: fit-content;
        width: fit-content;
        color: rgb(31,228,123);
        background: #242b31ad;
        backdrop-filter: blur(1px);
        border: 1px solid transparent;
    }

    .button__prices--switch-price{
        color: rgb(31,228,123);
        background: #242b31;
        padding: 1px 4px;
        &.disabled{
            color: gray;
            opacity:.3;
        }
    }
`

export const showControls = keyframes`
  0%{
    opacity: 0;
    transform: translateY(20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0px);
  }
`

export const ControlsContainer = styled.div`
  opacity: 0;
  display: flex;
  column-gap: 7px;
  transform: translateY(20px);

`

