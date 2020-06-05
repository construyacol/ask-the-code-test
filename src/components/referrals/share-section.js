import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Title, ReferralBox, Divider, MAIN_COLOR } from './shareStyles'
import { device } from '../../const/const'
import { copy } from '../../utils'

const SECTION_TITLE = "Link de referidos"
const TWITTER_TEXT = "Amigos, este es mi link de referidos de Coinsenda:"
const FACEBOOK_INIT = () => {
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'))
}

const ShareSection = ({ referralLink }) => {
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${TWITTER_TEXT}&url=${encodeURI(referralLink)}`, "_blank")
  }

  const shareOnFacebook = () => {
    const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
    return window.open(`https://www.facebook.com/sharer.php?display=popup&u=${encodeURI(referralLink)}`,'sharer',options);
  }

  useEffect(() => {
    // FACEBOOK_INIT()
  }, [])

  return (
    <StyledShareSection>
      <Title>{SECTION_TITLE}</Title>

      <MidSection>
        <LinkIcon><i className="fas fa-link" /></LinkIcon>
        <p>{referralLink}</p>
        <LinkIcon button onClick={() => copy(referralLink)}><i className="fas fa-copy" /></LinkIcon>
      </MidSection>

      <BottomSection>
        <p>Compartir en:</p>
        <Divider height="65%" />
        <ShareButtons>
          <IconBox onClick={shareOnFacebook}><i className="fab fa-facebook-square" /></IconBox>
          <IconBox onClick={shareOnTwitter}><i className="fab fa-twitter" /></IconBox>
        </ShareButtons>
      </BottomSection>
      {/* <div id="fb-share-button" class="fb-share-button"
        data-href={referralLink}
        data-layout="button_count">Boton de prueba</div> */}
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
  @media ${device.tabletL} {
    height: 28px;
    width: 28px;
    margin-right: 6px;
  }
`

const ShareButtons = styled.div`
  justify-content: space-between;
  width: 110px;
  @media ${device.laptopL} {
    width: 104px;
  }
  @media ${device.tabletL} {
    width: 84px;
  }
`

const BottomSection = styled.div`
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  @media ${device.laptopL} {
    font-size: 14px;
  }
  @media ${device.tabletL} {
    ${Divider} {
      height: 50%;
    }
    margin-top: 0px;
  }
`

const MidSection = styled(ReferralBox)`
  justify-content: space-around;
  align-items: center;
  color: ${MAIN_COLOR};
  > p {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > i {
    font-size: 18px;
    margin-right: 8px;
  }
  @media ${device.tabletL} {
    > p {
      width: 75%;
    }
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
  @media ${device.tabletL} {
    height: 32px;
    width: 32px;
    border-radius: 5px;
  }
`

export default ShareSection
