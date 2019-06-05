import React, { Component, Fragment } from 'react'
import IconSwitch from '../icons/iconSwitch'
import QRCode from 'qrcode'
import { InputFormAuth } from '../inputs'
import AuthReq from '../itemSettings/modal_views/authreq'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SuccessComponentScreen from '../success_screen/success_screen'

import './2fa.css'


class TwoFactorActivate extends Component {

  state={
    qr:null,
    inputFocus:false,
    private_key:'238A9SD89AF9AS8D9',
    success_screen:false,
    switch_to_success:false
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    let qr = await QRCode.toDataURL(this.state.private_key)
    this.setState({
      qr:qr
    })
  }


  handleFocus = () =>{
    this.setState({inputFocus:true})
  }

  handleBlur = () =>{
    this.setState({inputFocus:false})
  }

  success_event = async() => {
    this.props.action.Loader(true)
    this.setState({success_screen:true})
    let user_update = {
      ...this.props.user,
      security_center:{
        ...this.props.user.security_center,
        authenticator:{
          ...this.props.user.security_center.authenticator,
          auth:true
        }
      }
    }
    await this.props.action.update_user(user_update)
    this.props.action.Loader(false)
    setTimeout(()=>{
      this.setState({switch_to_success:true})
    }, 500)
  }

  finish_process = async() =>{
      this.props.action.ToggleModal()
  }


  render(){

    const { qr, inputFocus, private_key, success_screen, switch_to_success } = this.state

    return(
      <div className={`TwoFactorActivate ${!switch_to_success ? 'TwoFactorActivateOn' : '' }`}>

      {
        !switch_to_success ?
        <div className={`TwoFactorActivate ${success_screen ? 'desaparecer' : ''}`}>
          <div className="TLayout layer1" style={{opacity:inputFocus ? '0.03' : '1'}}>
            <div className="header2fa"></div>
            <div className="body2fa">
              <div className="bodySon" >
                <p className="fuente">Abre Google Authenticator y escanea el codigo QR</p>
                {
                  qr &&
                  <img src={qr} alt="" width="200px"/>
                }
              </div>
              <div className="footer2fa"></div>
            </div>
          </div>

          <div className="TLayout layer2">
            <div className="header2fa">
              <h3 className="fuente">Habilitar <span className="fuente2">2FA</span></h3>
              <IconSwitch icon="2auth" size={75} color="#1babec" />
            </div>
            <div className="body2fa">
              <div className="bodySon" style={{height:inputFocus ? '10%' : '50%'}}></div>
              <div className="footer2fa">
                <div className="footer2faText">
                  <div className={`footer2faTextDes ${inputFocus ? 'desp' : 'desaparecer'}`} >
                    <p className="fuente">Recuerda que en caso de perdida de tu dispositivo movil, solo podrás reactivar el 2FA con el codigo secreto <span className="secretCode fuente2">{private_key}</span> escribelo en papel y guardalo, es tu responsabilidad</p>
                  </div>
                  <p className={`fuente ${inputFocus ? 'desaparecer' : 'aparecer'}`}>Ó ingresa el codigo secreto manualmente</p>
                  <p className={`fuente2 secretCode ${inputFocus ? 'desaparecer' : 'aparecer'}`}>{private_key}</p>
                </div>
                <AuthReq
                  handleFocus={this.handleFocus}
                  handleBlur={this.handleBlur}
                  authenticated={this.success_event}
                />
              </div>
            </div>
          </div>
        </div>

        :

        <div className={`TwoFactorActivate success ${success_screen ? 'aparecer' : ''}`}>
          <SuccessComponentScreen
            title="Segundo factor de autenticación activado"
            cta_text="El proceso de activación se ha realizado satisfactoriamente."
            confetti={true}
            cta_secondary={false}
            cta_primary_text='Finalizar'
            user_name={this.props.user.name}
            siguiente={this.finish_process}
          />
        </div>

      }
      </div>
    )
  }
}


function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){
  const { user, user_id } = state.model_data
  return{
    user:user[user_id]
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (TwoFactorActivate)
