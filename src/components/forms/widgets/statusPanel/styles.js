import styled from 'styled-components'
import { LeftText, RightText } from 'components/widgets/detailTemplate'
import { device } from 'const/const'

export const PanelContainerComponent = styled.div`
    width:auto;
    max-width:calc(350px - 20px);
    background:var(--secondary_background);
    display:grid;
    grid-template-rows:1fr auto;
    padding:20px;
    row-gap:20px;
    position: sticky;
    top: 195px;
    &.criptoWithdraw{
      max-width:calc(440px - 20px);
      @media ${device.mobile}{
        #controlsContainer.ioSystem{
          padding-bottom: 100px;
        }
        &.isOpen{
          transform: translateX(0px);
        }
        transform: translateX(100%);
        transition: .3s;
        position: fixed;
        top: 0;
        z-index: 99;
        left: 0;
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
        .criptoWithdrawCont{
          top:50px;
        }
      }
    }
`


export const ContentRight = styled.div`
  display:flex;
  align-items: center;
  column-gap: 6px;
  ${RightText}{
    text-transform:capitalize;
  }
`

export const StatusContainer = styled.div`
  width:100%;
  height:auto;
  display: flex;
  flex-direction: column;
  row-gap: 25px;

  .criptoHelper{
    row-gap:20px;
  }

  &.borderBottom{
    border-bottom: 1px solid var(--skeleton_color);
    padding-bottom:20px;
  }

  p{
    color:var(--paragraph_color);
  }

  ${LeftText}{
    font-weight: normal;
  }
`

export const StatusHeaderContainer = styled.div`
    position: sticky;
    top: 190px;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 15px;
    grid-template-rows: auto 1fr;
    height: auto;
    max-height: 300px;

    &.criptoWithdrawCont{
        display: flex;
        row-gap: 20px;
        flex-direction: column;
        max-height:none;
    }
`



export const TitleContainer = styled.div`
  h1{
    font-size: 22px;
    font-size: 20px;
    color: var(--paragraph_color);
  }
  border-bottom: 1px solid var(--skeleton_color);
`
