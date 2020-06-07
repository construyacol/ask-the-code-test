import React from 'react'
import styled, { css } from 'styled-components'
import { ReferralBox, Number, MAIN_COLOR, Title, skeletonStyle } from './shareStyles'
import * as Icons from '../widgets/icons'
import { device } from '../../const/const'

const SECTION_TITLE = "Saldo disponible"
const ITEMS = [
    {name: 'Ethereum', icon: 'Ethereum', coinCode: 'ETH', mockBalance: 0.00136},
    {name: 'Bitcoin', icon: 'Bitcoin2', coinCode: 'BTC', mockBalance: 0.00136},
    {name: 'Cardano', icon: 'Cardano', coinCode: 'ADA', mockBalance: 0.00136}
]

const BalanceSelect = ({loading}) => {

  return (
    <StyledShareSection>
      <Title loading={loading}>{SECTION_TITLE}</Title>
        <SelectConainer loading={loading}>
            {ITEMS.map((item, index) => {
                const Icon = Icons[item.icon]
                return (
                  <ItemComponent item={item} Icon={Icon} index={index} key={index} />
                )
            })}
        </SelectConainer>
    </StyledShareSection>
  )

}

const ItemComponent = ({ item, Icon, index }) => {
    Icon = Icon || <div/>
    return (
        <SelectItem key={index}>
            <MainButton>
                <IconContainer><Icon/></IconContainer>
                <p>{item.name}</p>
                <PriceContainer>
                    <Number className="numberC" style={{ marginRight: 6 }} fontSize="28px">{item.mockBalance}</Number>
                    <Number fontSize="14px"> {item.coinCode}</Number>
                </PriceContainer>
            </MainButton>
            <HideButton>
                <i className="fas fa-arrow-up" />
                <p>Retirar</p>
            </HideButton>
        </SelectItem>
    )
}

const HideButton = styled.div`
    background: #22283a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: calc(100% - 2px);
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
    height: 38px;
    margin-right: 10px;
    img, svg {
        width: 33px;
        height: 33px;
    }
`

const PriceContainer = styled.div`
    display: flex;
    align-items: baseline;
    width: 60%;
    justify-content: flex-end;
`

const MainButton = styled.div`
    background: white;
    width: 100%;
    height: calc(100% - 2px);
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
    > p {
        flex: 1 1 auto;
    }

`

const SelectItem = styled.div`
    display: flex;
    position: relative;
    height: 90px;
    &:hover ${MainButton} {
        ${hoverStyle}
    }
    @media ${device.laptopL} {
        height: 72px;
    }
    @media ${device.tabletL} {
        height: 8vh;
        min-height: 62px;
    }
`

const SelectConainer = styled(ReferralBox)`
    ${props => props.loading && css`
      .numberC{
        font-size: 20px !important;
      }
        p {
            ${skeletonStyle}
            width: fit-content;
        }
        ${IconContainer} {
            ${skeletonStyle}
            border-radius: 50%;
            img, svg {
                display: none;
            }
        }
        ${SelectItem} {
            pointer-events: none;
        }
    `}
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
