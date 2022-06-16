import styled from 'styled-components'
import { device } from "../../../../const/const"
import { OnlySkeletonAnimation } from '../../../widgets/loaders/skeleton'


export const OptionInputContainer = styled.div`
  display:grid;
  row-gap: 24px;
  grid-template-rows:auto 1fr;
`


export const ButtonContainers = styled.div`
  position: sticky;
  bottom: 30px;  
  display: grid;
`


export const StageContainer = styled.div`
  display:grid;
  row-gap:20px;

  input{
    font-size:15px;
    color: var(--paragraph_color);
    &::-webkit-input-placeholder { 
        font-size:15px;
    }
  }

  ._inputLabelP{
    margin-top:10px !important;
  }

  ._pLabel{
    margin: 0;
    color: var(--paragraph_color);
  }

  
  &._identityComponent{
    grid-template-rows:auto auto 1fr;
  }

  &._infoAccount{
    grid-template-rows:auto auto 1fr;
  }

  &._withdrawProviderBank{
    grid-template-rows:auto auto 1fr;
  }

  .inputContainer__{
    height: 45px;
    max-width: 700px;
    margin: 15px 0 35px;
  }
  ._stickyPosition{
    background: #f9f9fb;
    position: sticky;
    top: 143px;
  }
`


export const Title = styled.h1`
    &.skeleton{
        position:relative;
        color:transparent;
        display: flex;
        justify-content: center;
        ${OnlySkeletonAnimation}
    }
    &.skeleton::after{
        content:"Crea una billetera";
        position:absolute;
        color:#bfbfbf;
        background:#bfbfbf;
        border-radius:4px;
    }
`

export const Option = styled.div`
  height: 142px;
  width: 172px;
  border: 1px solid #bfbfbf;
  position: relative;
  border-radius: 6px;
  display: grid;

  &::after{
    position: absolute;
    content: "";
    width: 50px;
    height: 45px;
    background: #bfbfbf;
    align-self: center;
    justify-self: center;
    border-radius: 5px;
    margin-bottom: 40px;
  }

  &::before{
    position: absolute;
    content: "";
    width: 100px;
    height: 15px;
    background: #bfbfbf;
    border-radius: 3px;
    justify-self: center;
    align-self:flex-end;
    margin-bottom: 15px;
  }
`

export const ButtonContainer = styled.div`
    height:80px;
    display: flex;
    place-content: center;
`

export const ListContainer = styled.div`
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    grid-template-rows: repeat(auto-fill, 150px);
    column-gap: 15px;
    row-gap: 15px;
    padding:25px 0;
    height:calc(100% - 50px);

    &.skeleton{
        ${Option}{
            ${OnlySkeletonAnimation}
        }
    }

    &::-webkit-scrollbar {
        width: 7px;
    }

    &::-webkit-scrollbar-thumb {
        background: #475a681f;
    }

    .__itemContainerL__ .item:hover{
        transform: scale(1) !important;
    }

    @media ${device.tablet} {

        padding:25px 0;


        .__itemContainerL__{
            display: grid;
            justify-items: center;
        }

        .__itemContainerL__ .item, ${Option}{
            width:160px;
            height:140px;
        }
        
    }
`

export const Content = styled.div`

    max-width:580px;
    height: calc(100% - 50px);
    width: calc(100% - 50px);
    padding: 25px;
    display:grid;
    grid-template-rows:auto auto 1fr auto;
    row-gap:20px;

    h1{
        color:var(--title1);
        font-size:1.5em;
        text-align:center;
    }

    @media ${device.mobile} {
        h1{
           margin-bottom:0;
        }
        height: calc(100% - 70px);
        width: calc(100% - 40px);
        padding: 20px 20px 50px;
    }

`

export const Layout = styled.section`
    width:100vw;
    height:100vh;
    background:white;
    display:flex;
    background:white;
    position:absolute;
    top:0;
    left:0;
    display: flex;
    place-content: center;
`

