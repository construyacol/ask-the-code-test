import { CAPACITOR_PLATFORM } from "components/utils";
import styled from "styled-components";
import { device } from '../../const/const'
import { show } from '../widgets/animations'


const Menu = styled.menu`
    margin:0;
    padding:0;
    @media ${device.mobile} {
       a.desktop{
           display:none;
       }
    }

    @media ${device.desktop} {
       a.mobile{
           display:none;
       }
    }
`
 

export const SubMenu = styled.div`
  height:60px;
  position:sticky;
  top:60px;
  display: grid;
  place-items: center;
  color: #666666;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  backdrop-filter: blur(5px);
  z-index: 3;
  background: rgb(239 239 239 / 85%);
  display:flex;
  padding: 0 25px;
  justify-content: center;
  column-gap:10px;

  justify-self: center;
  width: calc(100% - 50px);

  .menuItem{
    display: grid;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: 100%;
    grid-template-rows: auto 1fr;
    text-decoration: none;
    color: var(--paragraph_color);
    max-width: 150px;
  }


    .menuItem.is_safari{
      grid-template-rows: 1fr 1fr;
    }

    .menuItem p {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    align-self: center;
    }

    .menuItem.movil {
    grid-template-rows: 1fr auto;
    }

    .menuItem.movil p,
    .menuItem.active p {
      grid-template-rows: 1fr auto;
      color: var(--primary);
    }

    .menuItem.active{
      background: #f9f9fb;
      border-top: 2px solid var(--primary);
      border-top-right-radius: 2px;
      border-top-left-radius: 2px;
    }

    .menuItem:hover p {
    color: var(--primary);
    }

  .menuMovilIcon{
    width: 100%;
    height: 0;
    transition: 0.3s;
    overflow: hidden;
    display: grid;
    align-items: flex-end;
    justify-items: center;
    opacity: 0;
    transform: scale(0.7);
  }


.menuMovilIcon {
  width: 100%;
  height: 0;
  transition: 0.3s;
  overflow: hidden;
  display: grid;
  align-items: flex-end;
  justify-items: center;
  opacity: 0;
  transform: scale(0.7);
}

.menuMovilIcon.active {
  height: 30px;
  opacity: 1;
  transform: scale(1);
}

.menuMovilItem:hover {
  color: var(--primary) !important;
  transition: 0.3s;
}

.menuItem:hover .menuMovilIcon {
  height: 30px;
  opacity: 1;
  transform: scale(1);
}

.menuMovilIcon.is_safari{
  height: 30px;
  opacity: 1;
  transform: scale(1);
}

@media ${device.mobile} {
  padding:0;
  width:100%;

  .menuMovilIcon{
    height: 30px;
    opacity: 1;
    transform: scale(1);
    align-items: center;
    svg{
      fill: gray;
    }
    &.active {
      svg{
        fill: var(--primary);
      }
    }
  }
  .menuItem{
    grid-template-rows: 1fr !important;
  }
  p{
    display:none;
  }
}

`


export const MainMenuContainer = styled(Menu)`
    height:60px;
    position:sticky;
    top:0px;
    z-index:3;
    background: linear-gradient(90deg,#202830,#101418);
    background: linear-gradient(90deg,#202830fa,#101418ed);
    display:flex;
    justify-content: center;
    backdrop-filter: blur(6px);
`


export const LaptopSideMenuContainer = styled(Menu)`
    width:70px;
    background: linear-gradient(to bottom right,#2b3742,#101418);
    display:grid;
    grid-template-rows:auto 1fr;
    position:relative;
    @media ${device.mobile} {
        position: absolute;
        left: -100px;
    }
`

export const LaptopLogoContainer = styled.div`
    display: flex;
    place-content: center;
    place-items: center;
    height:60px;
`

export const SideMenuContainer = styled(Menu)`
  min-width: 280px;
  background: linear-gradient(to bottom right,#2b3742,#101418);
  display:grid;
  grid-template-rows:auto 1fr;

  @media ${device.mobile} {
    transition:.3s;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: ${CAPACITOR_PLATFORM === 'ios' ? '100px' : 0};
    z-index: 4;
    max-width:250px;

        &::after{
            content: "";
            width: 100vw;
            height: 100vh;
            position: absolute;
            z-index: -1;
            opacity:0;
            animation-fill-mode: forwards;
            backdrop-filter: blur(4px);
        }
    }

    &._show{
        left: 0;
        &::after{
            animation-name: ${show};
            animation-duration: .3s;
            animation-delay:.2s;
            background: #0000009c;
        }
    }
    &._hide{
        left: -101vw;
        &::after{
            transition:.0s;
            background:transparent;
            backdrop-filter: blur(0px);
        }
    }
  }
`


export const UserName = styled.p`
    margin:0 0 10px;
    &._capitalize{
        text-transform: capitalize;
    }
`

export const AcronymCont = styled.div`
    position:relative;
    padding-top: 15px;
    .perfilPic{
        width: 62px;
        height: 62px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10px;
        background: #0198ff;
        display: grid;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 14px -2px rgb(0 0 0 / 30%);
    }
`

export const LogoCont = styled.div`
    padding-left: 22px;
    display: grid;
    align-items: center;
    justify-self: flex-start;
    i {
      display: none;
    }

    @media ${device.mobile} {
        img{
            display:none;
        }
        i{
            display: initial;
            color: #fff;
            font-size: 20px;
            margin-left: 5px;
        }
    }

`

export const UserInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows:60px;
    grid-auto-rows: auto;
    justify-items: center;
    row-gap: 7px;
    background: linear-gradient(to bottom right,#2b3742,#151b20);
    padding-bottom: 15px;
    p{
        color:white;
    }
`



export const MenuItemsContainer = styled.div`
    background: linear-gradient(to bottom right,#2b3742,#101418);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    ${'' /* font-weight: bold; */}
    padding: 15px 0 50px;
    
`
