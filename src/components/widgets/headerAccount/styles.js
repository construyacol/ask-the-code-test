import styled from 'styled-components'
import { device } from '../../../const/const'


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
  height: 40px;
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
    width:${props => props.width}
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
  @media ${device.mobile} {
    height:25px;
    width:25px;
  }
`

export const P = styled.p`
  font-family: "Raleway", sans-serif;
  margin:0;
`

export const AccountLabel = styled(P)`
  color: var(--paragraph_color);
  font-size: 18px;
  font-weight: 600;
`

export const CurrencyLabel = styled(P)`
    text-transform: uppercase;
    color: #9d9d9d;
    font-size: 13px;
    @media ${device.mobile} {
      display:none;
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
