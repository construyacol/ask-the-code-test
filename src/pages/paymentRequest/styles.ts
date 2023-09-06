import styled from 'styled-components';
import { DisclaimerContainer } from 'components/widgets/shared-styles'
import { device } from 'const/const'



export const ViewerContainer = styled.span`
    position: absolute;
    filter: invert(1);
    color: gray;
    left: 18px;
    top: 15px;
    font-family: "Raleway",sans-serif;
    color: #50667a;
    font-size: 12px;
    z-index: 1;
`

export const UnloggedDisclaimer = styled(DisclaimerContainer)`
   background-color: #ff8c0024;
   border-left: 2px solid var(--orange_color);
   display: flex;
   flex-direction: column;
   row-gap: 10px;
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
   ._balanceComponent{
      right: 15px;
   }
   .itemAccountContainer.insufficient{
      border-left: 5px solid var(--red_color);
   }
   @media ${device.mobile} {
      .accountLabel{
         font-size: 14px;
      }
   }
`

export const PaymentRequestLayout = styled.div`
   display: flex;
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: calc(100vh - 3rem);
   z-index: 1;
   background: linear-gradient( to bottom right, #005894, #0198ff );
   justify-content: center;
   align-items: center;
   overflow-y: scroll;
   padding: 1.5rem 0;
   min-height: calc(100vh - 3rem);

   .payment--content{
      padding:35px 2.5rem;      
   }
   input{
      font-size: 15px !important;
   }
   @media ${device.mobile} {
      z-index: 99;
      .payment--content{
         padding:35px 1rem;      
         width: calc(100% - 2rem);
      }
      align-items: flex-start;
   }

   


`





export const ContentContainer = styled.div`
    p, input{
        font-size:15px;
        width: 100%;
    }

    .__contentDetail{
      width: calc(100% - 15px);
    }
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    margin: 20px 0;
`
