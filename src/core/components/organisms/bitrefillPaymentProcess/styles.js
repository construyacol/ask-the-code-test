import styled from 'styled-components'


export const PaymentProcessContainer = styled.div`
   position: absolute;
   width: calc(100%);
   height: 100%;
   top: 100%;
   transition: .3s;
   background: #ffffffd9;
   top: 0;
   backdrop-filter: blur(6px);
   display: grid;
   row-gap: 1rem;
   grid-template-rows: 1fr 3.2rem;

   .message{
      background: #f9f9f9;
      display: flex;
      align-items: center;
      padding:0 0.7rem 0 0.8rem;
      border-left: 2px solid var(--primary);
      font-size: .9rem;
   }
   &.visible{
      opacity: 1;
   }
   &.hidden{
      opacity: 0;
      pointer-events: none;
   }
`