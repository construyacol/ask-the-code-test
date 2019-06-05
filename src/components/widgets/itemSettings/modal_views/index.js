import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../../actions'
import SimpleLoader from '../../loaders'
import PhoneView from './phone'
import PassView from './pass'
import IconSwitch from '../../icons/iconSwitch'
import { ButtonForms } from '../../buttons/buttons'
import AuthReq from './authreq'
import OtherModalLayout from '../../modal/otherModalLayout'
import MVList from './listView'

import './viewSettings.css'
// import ItemLayout from '../../widgets/items/itemLayout'

export class ModalSettingsView extends Component {


  state = {
    buttonActive:false,
    auth:this.props.params.authenticator.auth,
    section:"",
    data:null,
    action_triger:null,
    animOn:false,
    loader:false,
    success:false
  }

  close_modal = () => {
  this.props.action.other_modal_toggle()
  }

  authenticated = () =>{
    this.setState({
      auth:false
    })
  }

componentDidMount(){

  const {
    params
   } = this.props

   const {
     code
    } = params

    this.setState({
      section:code
    })
}

update_state = (payload) =>{
  this.setState(payload)
}



  view_switch = props => {

      const {
        code
      } = props

// console.log('|||||||||||| - - - -   MODAL SWITCH', code)
      switch (code) {
        case 'phone':
          return(
            <PhoneView {...props} {...this.state} cancelarClick={this.close_modal} update_state={this.update_state} />
          )
          case 'pass':
            return(
              <PassView {...props} {...this.state} cancelarClick={this.close_modal} update_state={this.update_state} />
            )
          case 'transactional':
          case 'withdraw':
          case '2auth':
             this.success(props)
             return <SimpleLoader
                      label="Actualizando"
                    />
          case 'country':
             return <MVList
                      type={code}
                    />
          case 'currency':
             return <MVList
                      type={code}
                    />
        default:
        return(
          <PhoneView {...props} {...this.state} cancelarClick={this.close_modal} update_state={this.update_state}/>
        )
      }
  }


  toggle_anim = payload =>{
    this.setState({animOn:!this.state.animOn})

    if(payload){
      setTimeout(()=>{
        this.setState({
          section:payload
        })
      },200)
    }

    setTimeout(()=>{
      this.setState({animOn:!this.state.animOn})
    }, 2000)
  }

  handleClick = payload =>{
    // console.log(`actualizando, sección : ${this.state.section}, enviando el parametro: ${this.state.data}`)
    this.setState({
      loader:true
    })

    setTimeout(()=>{
      this.success()
    }, 1000)
  }

  success = (payload) =>{
    const { code } = payload


      setTimeout(async()=>{
        await this.props.action.Loader(true)
        const { other_state } = payload
        // console.log('||||||| success', payload)

        let user_update = {
          ...this.props.user
        }
        // console.log('||||||| user_update1', user_update)

        if(code === 'transactional'){
          user_update.security_center.authenticator.transactional = other_state === 'to_disable' ? false : true
          await this.props.action.update_user(user_update)
        }
        if(code === 'withdraw'){
          user_update.security_center.authenticator.withdraw = other_state === 'to_disable' ? false : true
          await this.props.action.update_user(user_update)
        }
        if(code === '2auth'){
          user_update.security_center.authenticator.auth = other_state === 'to_disable' ? false : true
          user_update.security_center.authenticator.transactional = other_state === 'to_disable' ? false : true
          user_update.security_center.authenticator.withdraw = other_state === 'to_disable' ? false : true
          await this.props.action.update_user(user_update)
        }
        // console.log('||||||| user_update2', user_update)

        await this.props.action.Loader(false)
        this.setState({
          loader:false,
          success:true,
          section:"success",
          buttonActive:true
        })
      },600)
  }



// PassWordView
  render(){

    // console.log('ModalSettingsView - - componentDidMount', this.props)
    const {
      params
    } = this.props

    const {
      title,
      txtPrimary,
      txtSecondary,
      code
    } = params

    const {
      buttonActive,
      auth,
      animOn,
      section,
      loader,
      success
    } = this.state

    const atributos ={
      icon:`${auth ? '2auth' : section}`,
      size:80,
      color:`${success ? '#59b200' : '#1babec' }`
    }
    let movil_viewport = window.innerWidth < 768

// console.log(' || |||| ModalSettingSwitch - -- - ', this.props)

    return(

      <OtherModalLayout title={title} close_modal={this.close_modal}>

              {/* <p className="OtherModalFind"></p> */}

              <section className={` ${(code === 'country' || code === 'currency') ? 'MVList' : ''}  ${section === 'pass' ? 'PassView' : success ? 'SuccessOtherView' : ''} PhoneView`}>

              {
                (code === 'country' || code === 'currency') ?
                <this.view_switch  {...params} />
                :
                <Fragment>
                      <IconSwitch {...atributos} animOn={animOn} />
                      {
                        success ?
                        <div className="contenidoView">
                          <p id="successOperation" className="fuente">Operación Exitosa</p>
                        </div>
                        :
                        <div className="contenidoView phoneView fuentePrin" >
                          {
                            !loader ?
                                auth ?
                                <AuthReq
                                  label="Digita el codigo Authenticator aquí:"
                                  authenticated={this.authenticated}
                                  toggle_anim={this.toggle_anim}
                                />
                                :
                                <this.view_switch  {...params} />
                            :
                            <SimpleLoader/>
                          }
                        </div>
                      }
                </Fragment>

              }





                  <div className="CMControls">
                    {
                      !success && !movil_viewport ?
                      <Fragment>
                          <ButtonForms
                            type="secundary"
                            active={true}
                            siguiente={this.close_modal}
                            >
                              {txtSecondary}
                          </ButtonForms>

                          <ButtonForms
                            type="primary"
                            active={buttonActive}
                            siguiente={this.handleClick}
                            >
                              {txtPrimary}
                            </ButtonForms>
                      </Fragment>
                      :
                      <ButtonForms
                        type="primary"
                        active={buttonActive}
                        siguiente={this.close_modal}
                        >
                          Finalizar
                        </ButtonForms>
                    }
                  </div>

              </section>

      </OtherModalLayout>
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
    params:state.ui.current_section.params.settings,
    user:user[user_id]
  }
}
export default connect(mapStateToProps, mapDispatchToProps) (ModalSettingsView)
