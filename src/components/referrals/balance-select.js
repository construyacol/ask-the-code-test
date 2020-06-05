import React from 'react'
import styled, { css } from 'styled-components'
import { ReferralBox, Divider, Number, MAIN_COLOR, Title } from './shareStyles'
import * as Icons from '../widgets/icons'
import { device } from '../../const/const'

const SECTION_TITLE = "Saldo disponible"
const ITEMS = [
    {name: 'Ethereum', icon: 'Ethereum', coinCode: 'ETH', mockBalance: 0.00136},
    {name: 'Bitcoin', icon: 'Bitcoin2', coinCode: 'BTC', mockBalance: 0.00136},
    {name: 'Cardano', icon: 'Bitcoin', coinCode: 'ADA', mockBalance: 0.00136}
]

const BalanceSelect = () => {

  return (
    <StyledShareSection>
        <Title>{SECTION_TITLE}</Title>
        <SelectConainer>
            {ITEMS.map((item, index) => {
                const Icon = Icons[item.icon]
                return (
                    <SelectItem key={index}>
                        <MainButton>
                            <IconContainer><Icon/></IconContainer>
                            {item.name}
                            <PriceContainer>
                                <Number style={{ marginRight: 6 }} fontSize="28px">{item.mockBalance}</Number>
                                <Number fontSize="14px"> {item.coinCode}</Number>
                            </PriceContainer>
                        </MainButton>
                        <HideButton>
                            <i className="fas fa-arrow-up" />
                            <p>Retirar</p>
                        </HideButton>
                    </SelectItem>
                )
            })}
        </SelectConainer>
    </StyledShareSection>
  )

}

const HideButton = styled.div`
    background: #22283a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 90px;
    position: absolute;
    color: #36ceb9;
    font-size: 20px;
    left: calc(100% - 59px);
    top: 1px;
    cursor: pointer;
    p {
        font-size: 12px;
        margin: 0;
        margin-top: 10px;
    }
    &:hover {
        box-shadow: inset 0px 0px 0px 2px ${MAIN_COLOR};
    }
    @media ${device.laptopL} {
        height: 72px;
    }
`

const hoverStyle = css`
    border: 1px solid lightgrey;
    left: -8px;
    width: calc(100% - 80px);
    box-shadow: 3px 4px 10px -5px rgba(0,0,0,0.54);
    color: ${MAIN_COLOR};
`

const IconContainer = styled.div`
    width: 38px;
    img, svg {
        width: 33px;
        height: 33px;
    }
`

const PriceContainer = styled.div`
    display: flex;
    align-items: baseline;
    width: 75%;
    justify-content: flex-end;
`

const MainButton = styled.div`
    background: white;
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 15px;
    border: 1px solid transparent;
    border-bottom: 1px solid lightgrey;
    transition: all 500ms ease;
    position: relative;
    left: 0;
    top: 0;
    z-index: 9;
    @media ${device.laptopL} {
        height: 72px;
    }
`

const SelectItem = styled.div`
    display: flex;
    position: relative;
    &:hover ${MainButton} {
        ${hoverStyle}
    }
`

const SelectConainer = styled(ReferralBox)`
    position: relative;
    &>:first-child >:first-child {
        border-radius: 5px 5px 0 0;
    }
    &>:first-child >:last-child {
        border-radius: 0 5px 0 0;
    }
    &>:last-child >:first-child {
        border-radius: 0 0 5px 5px;
    }
    &>:last-child >:last-child {
        border-radius: 0 0 5px 0;
    }
`

const StyledShareSection = styled.div`
  grid-area: bottom-left;
  
`

export default BalanceSelect
