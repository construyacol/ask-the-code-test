import styled from 'styled-components'
import { device } from 'const/const'

export const ButtonsContainer = styled.div`
   display: flex;
   bottom:0;
   position: sticky;
   justify-content: center;
   column-gap: 15px;
   margin-top: ${props => props.marginTop ? `${props.marginTop}px` : '0'};

   button{
      font-size: 16px !important;
   }
   &.insufficient{
      max-height: 45px;
      height: auto;
      align-self: center;
      justify-self: end;
      display: flex;
      button{
         font-size: 15px !important;
      }
   }
   @media ${device.mobile} {
      flex-direction: column-reverse;
      row-gap: 15px;
      background: white;
   }
`

export const HeaderContainer = styled.div`
    display: flex;
    place-content: center;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.palette.skeleton_color};
`