import styled from 'styled-components'

export const Text = styled.p`
    margin:0;
    color:var(--paragraph_color);
`

export const PriorityContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    padding:15px 20px 0;
`

export const Pcontainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const GasLayout = styled.div`
    padding: 0;
    position: relative;
    height: auto;
    display: grid;
    row-gap:10px;
    p{
        margin:0;
    }
`

export const ControlsContainer = styled.div`

    height:100px;
    display:flex;
    justify-content:center;
    place-items: center;
    padding: 0 35px;
    column-gap: 15px;

    .botonForm{
        height: 50px;
        padding: 10px 20px;
        font-size: 15px !important;
        font-weight: 800;
    }

    .ioSystem{
        position: initial;
        bottom: auto;
    }

    @media (max-width: 768px) {
        position: fixed;
        bottom: 30px;
        width: calc(100vw - 70px);
        flex-direction: column;
    }
`

export const DetailContainer = styled.div`
    display: grid;
    row-gap: 10px;
`

export const Img = styled.div`
    grid-area: img;
    width: 40px;
    height: 40px;
    background: #f5f5f5;
    display: flex;
    place-content: center;
    border-radius: 50%;

    &._firstStage{
        position:relative;
        &::after{
            content: "";
            background: var(--primary);
            position: absolute;
            width: 2px;
            height: 30px;
            bottom: -32px;
        }
    }
`

export const Title = styled(Text)`
    grid-area: title;
    font-weight:bold;
    font-size:15px;
    span{
        font-weight: 200;
        &._unregistered{
          color:#ff3939;  
        }
        &._registered{
          color:var(--primary);  
          ${'' /* color:#009100;   */}
        }
    }
`

export const CoinsendaLabel = styled(Text)`
    grid-area: address;
    font-size:14px;
`

export const FromToCont = styled.div`
    padding: 10px 37px 0;
    display: flex;
    row-gap: 35px;
    flex-direction: column;
`

export const WithdrawIconContainer = styled.div`
    width:76px;
    height:76px;
    background:white;
    position:absolute;
    border-radius: 50%;
    bottom: -38px;
    right: 20px;
    display: grid;
    place-items: center;
    .iconSty{
        position: absolute;
    }
`

export const HeaderContainer = styled.div`
    background: linear-gradient(to bottom right, var(--title1), var(--primary));
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    display:flex;
    column-gap: 15px;
    position: relative;

    h3{
        color:white;
        margin:10px 0;
    }
`

export const LayoutContainer = styled.section`
    width:100vw;
    background:white;
    justify-self: center;
    align-self: center;
    max-width:425px;
    max-height:600px;
    position:relative;
    border-radius:6px;
    display: flex;
    flex-direction: column;
    row-gap: 25px;

    position:absolute;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;

    &.isEthereum{
        max-height:700px;
    }

    ${DetailContainer}{
        padding:0 20px;
    }

    ${HeaderContainer}{
        padding:20px;
    }

    @media (max-width: 768px) {
        max-height:100vh;
        height: 100vh;
        border-radius: 0;
    }

`

  
