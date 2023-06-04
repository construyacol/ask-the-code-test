import styled from 'styled-components'
import { device } from 'const/const';

export const TagCont = styled.div`
    padding: 5px 10px;
    background-color: red;
    width: fit-content;
    height: fit-content;
    border-radius: 3px;
    align-self: center;
    justify-self: end;
    p{
        margin: 0;
        color: white !important;
    }
    @media ${device.mobile} {
        position: absolute;
        right: 1.5rem;
    }
`