import styled from 'styled-components';
import { DisclaimerContainer } from 'components/widgets/shared-styles'


export const UnloggedDisclaimer = styled(DisclaimerContainer)`
   background-color: #ff8c0024;
   border-left: 2px solid var(--orange_color);
   display: flex;
   flex-direction: column;
   row-gap: 10px;
`

export const ButtonsContainer = styled.div`
   display: flex;
   bottom:0;
   position: sticky;
   justify-content: center;
   column-gap: 15px;
   button{
      font-size: 16px !important;
   }
   &.insufficient{
      max-height: 50px;
      height: auto;
      align-self: center;
      justify-self: end;
      display: flex;
   }
`

export const IsLoggedLayout = styled.div`
   .skeleton{
      .accountLabel--skeleton__p, .accountBalance--skeleton__p{
         font-size: 16px;
      }
   }
   .BalanceComponent{
      width: fit-content;
   }
   .accountLabel{
      font-size: 16px;
   }
   .itemAccountContainer{
      height: 80px;
   }
   p.insufficient{
      color: red;
   }

   .itemAccountContainer.insufficient{
      border-left: 5px solid var(--red_color);
   }
`

export const PaymentRequestLayout = styled.div`
   display: flex;
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 1;
   background: linear-gradient( to bottom right, #005894, #0198ff );
   justify-content: center;
   align-items: center;
   .payment--content{
      padding:35px 45px;      
   }
   input{
      font-size: 15px !important;
   }
   
`

export const HeaderContainer = styled.div`
    display: flex;
    place-content: center;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.palette.skeleton_color};
`



export const ContentContainer = styled.div`
    p, input{
        font-size:15px;
        /* color: ${props => props.theme.palette.text_color}; */
        width: 100%;
    }
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    margin: 20px 0;
`
