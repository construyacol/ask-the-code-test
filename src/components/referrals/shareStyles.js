import styled, { css } from "styled-components";
import { device } from "../../const/const";

export const MAIN_COLOR= '#0e95f8'

export const ReferralBox = styled.div`
width: 100%;
border-radius: ${props => props.radius ? props.radius : "5px"};
${props => props.highlight ? 
    css`border: 2px solid ${MAIN_COLOR};` :
    css`border: 1px solid lightgrey;`
}
`
export const Title = styled.p`

`

export const Divider = styled.div`
    border: 1px solid lightgrey;
    width: -1px;
    height: ${props => props.height ? props.height : "75%"};
    min-height: 20px;
    margin: 0 ${props => props.margin ? props.margin : "20px"};
    opacity: 0.8;
`

export const Number = styled.p`
    font-weight: 600;
    opacity: 0.7;
    margin: 0;
    font-size: ${props => props.fontSize ? props.fontSize : "36px"};
    @media ${device.laptopL} {
        font-size: ${props => props.fontSize ? `calc(${props.fontSize} - 6px)` : "32px"};
    }
`