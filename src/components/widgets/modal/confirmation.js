import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { ButtonForms } from '../buttons/buttons'
// import proof from '../../../assets/deletewallet.png'
import PairList from '../../wallets/views/swap_pair_list'
import SimpleLoader from '../loaders'
import IconSwitch from '../icons/iconSwitch'
import InputForm from '../inputs'

import './modal.css'

class ConfirmationModal extends Component {



  handleClick = async() =>{
    const {
      action,
      payload,
      code
    } = this.props.modal_confirmation

    // Ejecutamos la acción desde redux, para eliminar wallet pasandole como parametro el id del wallet
    action(payload, code)
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload(null)
  }

  cancelarClick = () => {
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload(null)
  }


  render(){

    // console.log('- - - - - ConfirmationModal - - - - -', this.state)

    const {
      visible,
      title,
      description,
      txtPrimary,
      txtSecondary,
      img,
      svg,
      type,
      from,
      to,
      spent,
      bought
    } = this.props.modal_confirmation

    const {
      loader
    } = this.props




    const atributos ={
      icon:svg,
      size:80,
      color:`#1babec`
    }

    // console.log(' - - ConfirmationModal - - ', this.props )
      return(
        <Fragment>
          {
                  loader ?
                    <SimpleLoader/>
                  :
                <section className={`Modal aparecer`}>
                  <div className={`modalCont2 ConfirmationModal`}>

                      <div className="Mconfirmar" style={{gridTemplateRows:type === 'swap' ? '70px auto' : 'repeat(auto-fill, minmax(80px, 1fr))' }}>
                        {
                          type === 'swap' &&
                          <h1 className="fuente" >{title}</h1>
                        }
                          <Fragment>
                            {
                              (type !== 'swap') ?
                                  img ?
                                  <img className="itemFuera" src={require(`../../../assets/${img}.png`)} width="80" alt="" id={img} title={img} />
                                  :
                                  svg &&
                                  <IconSwitch {...atributos} />
                              :
                              <div className="confirSwap">
                                <div>
                                  <IconSwitch icon={from} size={60} />
                                  <span className="textSwaPcON textRed">- {spent} / {from}</span>
                                </div>
                                <IconSwitch icon="transaction" size={35} color="#347fe6" />
                                <div>
                                  <IconSwitch icon={to} size={60} />
                                  <span className="textSwaPcON textGreen">+ {bought} / {to}</span>
                                </div>
                              </div>
                            }
                            {
                              type !== 'swap' &&
                              <h1 className="fuente" >{title}</h1>
                            }

                            <p  className="fuentePrin" style={{alignSelf:type === 'swap' ? 'center' : 'start' }}>{description}</p>

                            <div className="CMControls">
                              <ButtonForms
                                type="secundary"
                                active={true}
                                siguiente={this.cancelarClick}
                                >{txtSecondary}</ButtonForms>

                                <ButtonForms
                                  type="primary"
                                  active={true}
                                  siguiente={this.handleClick}
                                  >{txtPrimary}</ButtonForms>
                            </div>
                          </Fragment>
                      </div>

                  </div>

                </section>
            }
        </Fragment>
      )
  }
}


function mapStateToProps(state, props){
  return{
    modal_confirmation:state.ui.modal_confirmation,
    loader:state.isLoading.loader
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (ConfirmationModal)
// ConfirmationModal
