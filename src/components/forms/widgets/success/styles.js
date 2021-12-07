import styled from "styled-components"

export const LayoutContainer = styled.section`
    display: grid;
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
    grid-template-rows: auto auto auto 1fr;
    justify-items: center;
    padding: 50px 20px;
    position: absolute;
    background: white;
    
    h1{
        margin-bottom:10vh;
    }

    &>p{ 
        margin-top:10vh;
        font-size:23px;
        max-width: 500px;
        text-align: center;
        font-weight: 500;
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
        font-size:18px;
    }
`