import styled from 'styled-components';
import { device } from 'const/const';

interface ctasContainerProps {
   marginTop?: string | number;
 } 

export const CtasContainer = styled.div<ctasContainerProps>`
   display: flex;
   column-gap: 20px;
   flex-wrap: wrap;
   &.column{
      flex-direction: column;
      row-gap: 15px;
   }
   &.align-center{
      place-content: center;
      align-items: center;
   }

   margin-top: ${props => props.marginTop ? `${props.marginTop}px` : '0px'};

   @media ${device.mobile}{
      row-gap:17px;
   }
`