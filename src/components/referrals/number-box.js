import React from 'react'
import styled, { css } from 'styled-components'
import { ReferralBox, Divider, Number, MAIN_COLOR } from './shareStyles'
import { device } from '../../const/const'

const NumberBox = (props) => {

    return (
        <StyledShareSection {...props} radius="10px">
            <Icon><props.Icon /></Icon>
            <Divider height="55px" margin="15px" />
            <Counter>
                <Number>{props.quantity}</Number>
                <p className="sub-text" dangerouslySetInnerHTML={{ __html: props.definition }} />
            </Counter>

            {props.highlight && (<RibbonContainer><Ribbon /></RibbonContainer>)}
            {props.bottomText && (<BottomText dangerouslySetInnerHTML={{ __html: props.bottomText }} />)}
        </StyledShareSection>
    )

}

const BottomText = styled.div`
    width: 100%;
    heigh: 30px;
    text: white;
    background: #c9c9c9;
    position: absolute;
    bottom: 0;
    border-radius: 0 0 5px 5px;
    color: white;
    p {
        margin: 12px;
        font-size: 12px;
        font-weight: 600;
    }
`

const Icon = styled.div`
    min-width: 70px;
    width: 70px;
    height: 70px;
    font-size: 30px;
    border: 1.5px solid ${MAIN_COLOR};
    border-radius: 50%;
    background-color: aliceblue;
    color: ${MAIN_COLOR};
    @media ${device.laptopL} {
        min-width: 60px;
        width: 60px;
        height: 60px;
        font-size: 26px;
    }  
`
const Counter = styled.div`
    flex-direction: column;
    width: 80%;
    align-items: start !important;
    .sub-text {
        font-size: 14px;
        margin-bottom: 0;
        opacity: 0.8;
        margin-top: 8px;
    }
`

const RibbonContainer = styled.div`
    height: 100%;
    display: block !important;
`
const Ribbon = styled.div`
    width: 24px;
    height: 20px;
    background: ${MAIN_COLOR};
    position: relative;
    border-radius: 4px 4px 0 0;
    top: -1px;
    &:after {
        content: "";
        position: absolute;
        height: 0;
        width: 0;
        border-left: 12px solid ${MAIN_COLOR};
        border-right: 12px solid ${MAIN_COLOR};
        border-bottom: 10px solid transparent;
        bottom: -9px;
      }
`

const StyledShareSection = styled(ReferralBox)`
    ${props => props.css && css(props.css)}
    width: unset;
    align-self: ${props => props.center ? 'center' : 'end'};
    display: flex;
    position: relative;
    ${props => props.withRibbon ? css`border: 2px solid ${MAIN_COLOR};` : ''}
    height: ${props => props.height ? props.height : '75%'};
    padding: 0 20px;
    ${props => props.withPadding ? css`padding-bottom: 30px;` : ''}
    ${props => props.height ? css`max-height: ${props.height};` : ''}
    justify-content: space-around;
    align-items: center;
    > div {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    @media ${device.laptopL} {
        ${props => props.height ? css`max-height: 114px;` : ''}
    }
`

export default NumberBox
