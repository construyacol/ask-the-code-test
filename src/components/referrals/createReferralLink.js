import React, { Component, Fragment } from 'react'
import btcoin from '../../assets/btc.png'
import person2 from '../../assets/person2.png'
import person1 from '../../assets/person1.png'
import gift from '../../assets/gift.png'


class CreateReferralLink extends Component {
  render(){
    return(
      <Fragment>
        <div className="referralImg">
          <img id="btcAward" src={btcoin} alt=""/>
          <img id="person1" src={person1} alt=""/>
          <img id="person2" src={person2} alt=""/>
          <img id="gift" src={gift} alt=""/>
        </div>

        <div className="formControl">

        </div>
      </Fragment>
    )
  }
}


export default CreateReferralLink
