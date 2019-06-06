import React, { Component } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import CreateReferralLink from './createReferralLink'
import ReferralLinkShare from './referralLinkShare'
import DashBoardReferralComponent from './dashboardReferral'


import './referrals.css'

class ReferralComponent extends Component {

  state = {
    success_referral:false,
    haveReferraLink:this.props.user.referral ? true : false,
    referralLink:this.props.user.referral && `https://coinsenda.com/ref_code?=${this.props.user.referral.ref_code}`
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.user.referral !== this.props.user.referral){
      this.setState({referralLink:`https://coinsenda.com/ref_code?=${nextProps.user.referral.ref_code}`})
    }

  }

  componentDidMount(){
    this.props.action.MenuItemActive('referral')
  }


  createLink = async(ref_code) =>{

    let res = await this.props.action.set_ref_code(ref_code)
    // console.log('Res refcode api =>', res)
    if(!res){return false}

    await this.setState({success_referral:true})

    setTimeout(()=>{
      this.setState({haveReferraLink:true})
    }, 300)
  }


  render(){
    
   const { haveReferraLink, success_referral, referralLink } = this.state

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
                    referralLink={referralLink}
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
