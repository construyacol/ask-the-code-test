import styled, { keyframes } from 'styled-components'


const scanning = keyframes`
    0% {
        top:0%
    }
    15%{
        top:30%
    }
    35%{
        top:70%
    }
    50%{
        top:100%
    }
    65%{
        top:70%
    }
    85%{
        top:30%
    }
    100%{
        top:0%;
    }
`;


export const Scanner = styled.div`
    height: 3px;
    width: 100%;
    position: absolute;
    top: 0%;
    transition: .3s;
    filter: blur(0.1em);
    background: rgb(255 255 255 / 10%);;
    animation: ${scanning} 1.2s linear infinite;
    &.scanning{
    background: #2ad083;
    }
`