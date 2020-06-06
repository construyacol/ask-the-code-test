import React, { useState, useEffect } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import ShareSection from './share-section'
import { useActions } from '../../hooks/useActions'
import sleep from '../../utils/sleep'
import styled, { css } from 'styled-components'
import ReferralCounter from './referral-counter'
import BalanceSelect from './balance-select'
import WithdrawAd from './withdraw-ad'
import { device } from '../../const/const'
import CreateCode from './create-code'
import { FONT_COLOR, skeletonStyle } from './shareStyles'
import { scroller } from 'react-scroll'

const REFERRAL_LINK = (refCode) => `https://coinsenda.com/ref_code?=${refCode}`

const ReferralComponent = (props) => {
  const { user } = props

  const actions = useActions()
  const [wasReferralCodeCreated, setWasReferralCodeCreated] = useState(false)
  const [haveReferraLink, setHaveReferralLink] = useState(true)
  const [referralLink, setReferralLink] = useState('')
  const [loading, setLoading] = useState(props.setSkeleton ? true : false)

  useEffect(() => {
    window.requestAnimationFrame(() => {
      scroller.scrollTo('firstInsideContainer', {
        offset: 0,
        duration: 0,
        smooth: true,
        containerId: 'containerElement'
      })
    })

    // The code below is for test purpose on view skeleton UI
    setTimeout(() => setLoading(false), 3000)
  }, [])

  useEffect(() => {
    if (user && user.referral) {
      setReferralLink(REFERRAL_LINK(user.referral.ref_code))
    }
  }, [user])

  const createLink = async code => {
    const res = await actions.set_ref_code(code)

    if (!res) return

    setWasReferralCodeCreated(true)
    await sleep(300)
    setHaveReferralLink(true)
  }

  return (
    <DetailContainerLayout
      title="Referidos"
      customClass="referral-layout"
      {...props}
    >
      {!haveReferraLink ? (
        <CreateCode 
          createLink={createLink} 
          wasReferralCodeCreated={wasReferralCodeCreated}
         />
      ) : (
        <ReferralGrid>
          <FirstText loading={loading}>
            <p>Invita amigos con tu link de referido y gana el <strong>0.05%</strong> de comisión sobre todas sus operaciones.</p>
          </FirstText>
          <ShareSection loading={loading} referralLink={referralLink} />
          <ReferralCounter loading={loading} />
          <BalanceSelect loading={loading} />
          <WithdrawAd loading={loading} />
        </ReferralGrid>
      )}
    </DetailContainerLayout>
  )

}

const FirstText = styled.div`
  grid-area: top;
  font-size: 20px;
  color: black;
  font-weight: 100;
  p {
    ${props => props.loading && css`
      ${skeletonStyle}
      width: fit-content;
    `}
  }
  @media ${device.laptopL} {
    font-size: 17px;
  }
  @media ${device.tabletL} {
    display: none;
  }
`

const ReferralGrid = styled.div`
  padding: 0 10%;
  padding-top: 100px;
  width: 80%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr 1.5fr;
  grid-template-rows: 0.35fr 0.5fr 1.5fr;
  gap: 0px 8%;
  grid-template-areas: "top top top top" "mid-left mid-left mid-left mid-right" "bottom-left bottom-left bottom-left bottom-right";
  color: ${FONT_COLOR};
  font-family: 'Raleway', sans-serif;
  transition; all 500ms ease;
  @media ${device.laptopL} {
    width: 90%;
    padding: 0 5%;
  }
  @media ${device.tabletL} {
    height: calc(100vh - 100px);
    min-height: 700px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 90vw;
    padding: 0 0vw;
  }
`;

function mapStateToProps(state, props) {

  const { user } = state.modelData
  return {
    user: user
  }

}

export const ReferralComponentAsSkeleton = () => (<ReferralComponent setSkeleton={true} />)

export default connect(mapStateToProps)(ReferralComponent)
