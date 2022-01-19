import styled from 'styled-components'


const Layout = styled.div`
    grid-row-gap: 10px;
    display: grid;
    height: 100%;
    justify-items: center;
    align-items: center;
    perspective: 900px;3
    transform-style: preserve-3d; 
    text-align: center;
    width: calc(100% - 40px);
    padding: 0 20px;

    .botonForm{
        width:220px;
    }
`

export const AmountLayout = styled(Layout)`
    grid-template-rows: 120px 1fr 120px;
`

export const CostIdLayout = styled(Layout)`
    grid-template-rows: 120px 1fr 120px;

    @media (max-width: 768px) {
        ._costIdContent{
            padding: 0;
            width: 100%; 
            .mobileView{
                width: 100%;
                transform: scale(1) !important;
            }
        }
    }
`

export const SuccessModalCont = styled.section`
    position: absolute;
    height: calc(100vh - 80px);
    width: 100vw;
    padding: 40px 0;
    background: linear-gradient(to bottom right,#129a8e,#37ed7d);
`