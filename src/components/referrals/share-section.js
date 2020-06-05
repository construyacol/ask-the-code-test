import React from 'react'
import styled, { css } from 'styled-components'
import { Title, ReferralBox, Divider, MAIN_COLOR } from './shareStyles'
import { device } from '../../const/const'

const SECTION_TITLE = "Link de referidos"

const ShareSection = ({referralLink}) => {

  return (
    <StyledShareSection>
      <Title>{SECTION_TITLE}</Title>

      <MidSection>
        <LinkIcon><i className="fas fa-link" /></LinkIcon>
        <p>{referralLink}</p>
        <LinkIcon button><i className="fas fa-copy" /></LinkIcon>
      </MidSection>

      <BottomSection>
        <p>Compartir en:</p>
        <Divider height="65%" />
        <ShareButtons>
          <IconBox><i className="fab fa-facebook-square" /></IconBox>
          <IconBox><i className="fab fa-twitter" /></IconBox>
        </ShareButtons>
      </BottomSection>

    </StyledShareSection>
  )

}

const LinkIcon = styled.div`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  color: white;
  border: 0.5px solid transparent;
  ${props => props.button ? css`
    color: ${MAIN_COLOR};
    transition; all 500ms ease;
    &:hover {
      cursor: pointer;
      border: 0.5px solid ${MAIN_COLOR};
    }
  ` : css`
    background: ${MAIN_COLOR};
  `}
  margin-left: 8px;
  @media ${device.laptopL} {
    height: 32px;
    width: 32px;
  }
`

const ShareButtons = styled.div`
  justify-content: space-between;
  width: 110px;
  @media ${device.laptopL} {
    width: 104px;
  }
`

const BottomSection = styled.div`
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  @media ${device.laptopL} {
    font-size: 14px;
  }
`

const MidSection = styled(ReferralBox)`
  justify-content: space-around;
  align-items: center;
  color: ${MAIN_COLOR};
  > p {
    width: 80%;
  }
  > i {
    font-size: 18px;
    margin-right: 8px;
  }
`

const StyledShareSection = styled.div`
  grid-area: mid-left;
  display: flex;
  flex-direction: column;
  > div {
    height: 50px;
  }
  div {
    display: flex;
    align-items: center;
  }
  @media ${device.laptopL} {
    ${MidSection} {
      height: 42px;
    }
  }
`

const IconBox = styled(ReferralBox)`
  height: 44px;
  width: 44px;
  justify-content: center;
  border-radius: 10px;
  transition: all 500ms ease;
  &:hover {
    cursor: pointer;
    color: ${MAIN_COLOR};
    border: 0.5px solid ${MAIN_COLOR};
  }
  @media ${device.laptopL} {
    height: 40px;
    width: 40px;
    border-radius: 6px;
  }
`

export default ShareSection
