import React, { useState, useEffect } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import ShareSection from './share-section'
import { useActions } from '../../hooks/useActions'
import sleep from '../../utils/sleep'
import styled from 'styled-components'
import ReferralCounter from './referral-counter'
import BalanceSelect from './balance-select'
import WithdrawAd from './withdraw-ad'
import { device } from '../../const/const'
import CreateCode from './create-code'

import './referrals.css'

const REFERRAL_LINK = (refCode) => `https://coinsenda.com/ref_code?=${refCode}`

const ReferralComponent = (props) => {
  const { user: { referral } } = props

  const actions = useActions()
  const [wasReferralCodeCreated, setWasReferralCodeCreated] = useState(false)
  const [haveReferraLink, setHaveReferralLink] = useState(false)
  const [referralLink, setReferralLink] = useState('')

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
      {...props}
    >
      {!haveReferraLink ? (
        <CreateCode 
          createLink={createLink} 
          wasReferralCodeCreated={wasReferralCodeCreated}
         />
      ) : (
        <ReferralGrid>
          <div className="top">
            <FirstText>
              Invita amigos con tu link de referido gana el <strong>0.05%</strong> de comisión sobre todas sus operaciones.
            </FirstText>
          </div>
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
  font-size: 20px;
  color: black;
  font-weight: 100;
  @media ${device.laptopL} {
    font-size: 17px;
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
  color: #696969;
  transition; all 500ms ease;
  .top { grid-area: top; }
  @media ${device.laptopL} {
    width: 90%;
    padding: 0 5%;
  }
`;

function mapStateToProps(state, props) {

  const { user } = state.modelData
  return {
    user: user
  }

}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralComponent)
