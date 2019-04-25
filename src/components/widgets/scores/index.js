import React, { Component, Fragment } from 'react'
import { Medal } from '../icons'
import { connect } from 'react-redux'
import actions from '../../../actions'
import { bindActionCreators } from 'redux'
import './scores.css'


class ScoresComponent extends Component {

  state = {
    level_progress_width:0,
    level:0,
    stars:0,
    message:"Bienvenido"
  }

  componentDidMount(){
    const { user } = this.props
    this.calculate_width_bar(user)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.user.security_center !== this.props.user.security_center){
      this.calculate_width_bar(nextProps.user)
    }
  }


  calculate_width_bar = async(user) =>{
    const { advanced, basic, financial  } = user.security_center.kyc
    const { auth, transactional, withdraw  } = user.security_center.authenticator

    // console.log('||||| ScoresComponent_calculate_width_bar - ', `financial : ${financial}, basic:${basic}, advanced: ${advanced} `)
    let basic_percent = basic === 'confirmed' ? 12 : basic === 'accepted' ? 24 : 0
    let advanced_percent = advanced === 'confirmed' ? 12 : advanced === 'accepted' ? 24 : 0
    let financial_percent = financial === 'confirmed' ? 12 : financial === 'accepted' ? 24 : 0
    let auth_percent = auth ? 12 : 0
    let transactional_percent = transactional ? 12 : 0
    let withdraw_percent = withdraw ? 12 : 0
    let level_progress_width = financial_percent+ advanced_percent+basic_percent+auth_percent+transactional_percent+withdraw_percent
    // console.log('||||| percents - ', `financial : ${financial_percent}, basic:${basic_percent}, advanced: ${advanced_percent} `)
    // console.log('||||| total_percent', level_progress_width)

    const { verification_level } = this.props.user
    let level = verification_level === 'level_1' ? 1 :
                verification_level === 'level_2' ? 2 :
                verification_level === 'level_3' ? 3 : 0


    let message = !basic ? 'Completa la verificación basica' :
                  (basic === 'confirmed' && !advanced) ? 'Completa la verificación avanzada' :
                  (basic === 'confirmed' && advanced === 'confirmed') ? 'Estamos verificando tu identidad' :
                  (basic === 'accepted' && advanced === 'accepted') ? 'Eres un miembro de confianza..' :
                  (financial === 'confirmed') ? 'Estamos verificando tus datos financieros' : ''

    let i = 0
    let stars = []
    for (i; i < level; i++) {
      let id = i
      stars.push({id})
    }

    await this.setState({
      level_progress_width,
      level,
      stars,
      message
    })

    // console.log('||||| total_percent', this.state)


  }



  render(){

    const { level_progress_width, level, stars, message } = this.state
    const { verification_level } = this.props.user

    return(
      <div className="scores">
          <div className="barra">
            <div className="progresado" style={{width:`${level_progress_width}%`}}></div>
            <div className="levelBar">
              <Medal size={25} />
              <p className="score" id="score">{message}</p>
            </div>
              <div className="level">Nivel:
                <span className="fuente2">{level}</span>
              </div>
              <div className="stars">
                {
                  stars &&
                    stars.map(star => {
                      return <i key={star.id} className="fas fa-star star_icon"></i>
                    })
                }
              </div>
          </div>
      </div>
    )

  }

}

function mapDispatchToProps(dispatch){
  return {
      action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){
  const { user, user_id } = state.model_data

  return{
    user:user[user_id],
    menu_item_active:state.ui.menu_item_active,
    // user:state.model_data.user ? user : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (ScoresComponent)
