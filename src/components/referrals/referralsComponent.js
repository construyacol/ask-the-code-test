import React, { useState, useEffect } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import ShareSection from './share-section'
import { useActions } from '../../hooks/useActions'
import sleep from '../../utils/sleep'
import styled from 'styled-components'
import ReferralCounter from './referral-counter'
import BalanceSelect from './balance-select'
import WithdrawAd from './withdraw-ad'
import { device } from '../../const/const'
import CreateCode from './create-code'
import { FONT_COLOR } from './shareStyles'
import { scroller } from 'react-scroll'

const REFERRAL_LINK = (refCode) => `https://coinsenda.com/ref_code?=${refCode}`

const ReferralComponent = (props) => {
  const { user: { referral } } = props

  const actions = useActions()
  const [wasReferralCodeCreated, setWasReferralCodeCreated] = useState(false)
  const [haveReferraLink, setHaveReferralLink] = useState(true)
  const [referralLink, setReferralLink] = useState('')

  useEffect(() => {
    window.requestAnimationFrame(() => {
      scroller.scrollTo('firstInsideContainer', {
        offset: 0,
        duration: 0,
        smooth: true,
        containerId: 'containerElement'
      })
    })
  }, [])

  useEffect(() => {
    if (referral) {
      setReferralLink(REFERRAL_LINK(referral.ref_code))
    }
  }, [referral])

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
          <FirstText>
            Invita amigos con tu link de referido gana el <strong>0.05%</strong> de comisión sobre todas sus operaciones.
          </FirstText>
          <ShareSection referralLink={referralLink} />
          <ReferralCounter />
          <BalanceSelect />
          <WithdrawAd />
        </ReferralGrid>
      )}
    </DetailContainerLayout>
  )

}

const FirstText = styled.p`
  grid-area: top;
  font-size: 20px;
  color: black;
  font-weight: 100;
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
  grid-template-rows: 0.4fr 0.5fr 1.5fr;
  gap: 0px 8%;
  grid-template-areas: "top top top top" "mid-left mid-left mid-left mid-right" "bottom-left bottom-left bottom-left bottom-right";
  color: ${FONT_COLOR};
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

export default connect(mapStateToProps)(ReferralComponent)
