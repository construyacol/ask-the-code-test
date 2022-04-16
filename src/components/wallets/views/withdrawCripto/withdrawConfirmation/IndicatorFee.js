
import styled from 'styled-components'
import { RightText } from '../../../../widgets/detailTemplate'
import { COLOR_FEES } from '../../../../../const/const'



export default function FeeComponent ({ currentPriority, value }) {
    return(
        <TextContainer>
            <IndicatorFee priority={currentPriority}/>
            <RightText className="fuente2">
                {value}
            </RightText>
        </TextContainer>
    )
}



const IndicatorFee = styled.div`
    background:${props => props?.priority ? COLOR_FEES[props?.priority]?.color : 'gray'};
    height:12px;
    width:12px;
    border-radius:3px;
`

const TextContainer = styled.div`
   display:flex; 
   padding-left:15px;
   column-gap:7px;
   place-items: center;

   ${RightText}{
       padding:0;
   }
`