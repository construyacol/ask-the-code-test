import styled, { keyframes }  from "styled-components"



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