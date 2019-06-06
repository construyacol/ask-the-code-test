import React, { Component } from 'react'
import IconSwitch from '../widgets/icons/iconSwitch'
import Coinsenda from '../widgets/icons/logos/coinsenda'

class DashBoardReferralComponent extends Component{

  render(){

    return(
      <div className="DashBoardReferralComponent">

        {/* WITHDRAW BUTTON */}
        <div id="withdrawButton" className="withdrawButton wbutt fuente">
          <IconSwitch
            icon="withdraw"
            size={18}
            color="white"
          />
          <div className="textCtaBut">
            <p className="fuente">Retirar</p>
          </div>
        </div>


        <div className="iconsRef">
          <div className="contIconRefCircle">
            <IconSwitch
              icon="referralPerson"
              size={40}
            />
          </div>
          <div className="logoCoinsen">
            <Coinsenda
              size={50}
              color="#0378c5"
            />
          </div>
        </div>


        {/* CANTIDAD DE REFERIDOS */}
        <div className="referralsCount">
          <p className="fuente2 textRefer1">35</p>
          <p className="fuente textRefer">Cantidad referidos</p>
        </div>


        {/* GANANCIA POR REFERIDOS */}
        <div className="referralAwards">
          <p id="referAward" className="fuente2 textRefer1">0.8</p>
          <p className="fuente textRefer">Ganancia en BTC</p>
        </div>

      </div>
    )

  }

}

export default DashBoardReferralComponent
