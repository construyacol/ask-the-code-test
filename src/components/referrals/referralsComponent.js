import React, { Component, Fragment } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import CreateReferralLink from './createReferralLink'
import InputForm from '../widgets/inputs'
import ReferralLinkShare from './referralLinkShare'
import DashBoardReferralComponent from './dashboardReferral'


import './referrals.css'

class ReferralComponent extends Component {

  state = {
    success_referral:false,
    haveReferraLink:false
  }

  componentDidMount(){
    this.props.action.MenuItemActive('referral')
  }



  createLink = async() =>{
    await this.setState({success_referral:true})
    setTimeout(()=>{
      this.setState({haveReferraLink:true})
    }, 300)
  }


  render(){
   const { user } = this.props
   const { linkActive, haveReferraLink, success_referral } = this.state

    return(

      <DetailContainerLayout
        title="Referidos"
        >
        <div className="referralCont">
            <div className="textReferral">
              <p className="fuente titleReferr">¡Invita amigos y gana!</p>
              <p className="fuente parraFerrer">Por cada amigo que se registre con tu link de referido ganas el 0.5% de todas las operaciones de compra y venta que tu amigo realice.</p>
            </div>

            {
              !haveReferraLink ?
              <div className={`contReferral createReferralink ${success_referral ? 'desaparecer' : '' }`}>
                <CreateReferralLink
                  createLink={this.createLink}
                  {...this.state}
                  {...this.props}
                />
              </div>
              :
              <div className={`contReferral ${success_referral ? 'aparecer' : '' }`}>
                <div className="haveReferral">

                  <ReferralLinkShare
                    referralLink='https://coinsenda.com/ref_code?=andres_referral'
                  />

                  <DashBoardReferralComponent/>

                </div>
              </div>
            }
        </div>



      </DetailContainerLayout>
    )
  }

}



function mapStateToProps(state, props){

  const { user, user_id } = state.model_data
  return{
    user:user && user[user_id]
  }

}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralComponent)
