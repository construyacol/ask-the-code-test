import styled from "styled-components"
import { LeftText, RightText } from 'components/widgets/detailTemplate'


export const PaymentRequestContainer = styled.div`
  height: auto;
  min-height: 120px;
  width: 100%;
  display: flex;
  place-content: center;
  width: 100%;
  align-items: center;
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
  padding-top:15px;
  display: flex;
  flex-direction: column;
  row-gap: 25px;

  p{
    color:var(--paragraph_color);
  }

  ${LeftText}{
    font-weight: normal;
  }
`