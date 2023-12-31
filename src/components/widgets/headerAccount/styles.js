import styled from 'styled-components'
import { CAPACITOR_PLATFORM, device } from '../../../const/const'


export const HeaderContainer = styled.div`
heigth: auto;
min-heigth:80px;
display:grid;
grid-template-columns:auto 1fr;

@media ${device.mobile} {
  grid-template-columns: auto auto;
}
`


export const HR = styled.div`
  height: ${props => props.height ? `${props.height}px` : `40px`};
  width: 1px;
  background: #cdcdcd;
  align-self: center;
`

export const BalanceContainer = styled.div`
  min-width: 50px;
  display:flex;
  column-gap: 15px;
  p{
    color: var(--paragraph_color);
  }

  .balanceTitle{
    margin:0;
    color: #9d9d9d;
    font-size: 13px !important;
    text-transform: uppercase;
  }

  .BalanceComponent{
    grid-template-rows: auto 1fr !important;
    width:${props => props.width || 'auto'}
  }

  .textin{
    text-shadow: none;
    font-size:23px !important;
    width: max-content;
    position:relative;
    display:grid;
    
    span{
      position:absolute;
      left: -9px;
      align-self:center;
    }
  }

  ${'' /* @media ${device.mobile} {
    .BalanceComponent{
      grid-template-areas: none !important;
      grid-template-rows: 1fr !important; 
      grid-template-columns: 1fr !important;
    }
    .textin{
      font-size:18px !important;
    }
    .balanceTitle{
        display:none;
      }
  } */}
`

export const IconAccount = styled.div`
  height:40px;
  width:40px;
  border-radius:50%;
  background: #efefef;
  display: flex;
  place-content: center;
  overflow: hidden;
  border: 3px solid #efefef;
  align-items: center;



  &.fit{
    height:fit-content !important;
    width:fit-content !important;
    padding: 4px;
  }

  @media ${device.mobile} {
    height:25px;
    width:25px;
    &.onAccountList{
      height:30px;
      width:30px;
    }
  }
`

export const P = styled.p`
  font-family: "Raleway", sans-serif;
  margin:0;
  &.numberFont{
    font-family: "Tomorrow", sans-serif;
  }
`

export const AccountLabel = styled(P)`
  color: var(--paragraph_color);
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  column-gap: 5px;


  &._aux{
    font-size: 13px !important;
    color: var(--placeholder);
    font-weight: normal;
  }
  &.skeleton{
    background: var(--skeleton_color);
    color: var(--skeleton_color);
    width: fit-content;
    border-radius: 4px;
  }

  @media ${device.mobile} {
    font-size: 1rem;
    &.wallet{
      font-size: 14px;
      color: #afafaf;
    }
  }

  ${CAPACITOR_PLATFORM === 'ios' && `@media ${device.mobile} {
    display: unset;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }`}
`

export const CurrencyLabel = styled(P)`
    text-transform: uppercase;
    color: #9d9d9d;
    font-size: 13px;
    span{
      font-size:12px;
    }
    @media ${device.mobile} {
      display:none;
      &.visible{
        display: initial;
      }
    }
`


export const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 3px;
  padding-right:10px;
`

export const HeaderMainContainer = styled.div`
  height: 100%;
  width: auto;
  min-width:200px;
  place-self: flex-end;
  align-items: center;
  column-gap: 15px;
  display: grid;
  ${'' /* grid-template-columns: auto minmax(105px, auto) auto; */}
  grid-template-columns: auto minmax(105px, 1fr) auto;

`
