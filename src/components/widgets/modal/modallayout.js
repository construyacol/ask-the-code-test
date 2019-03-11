import React, {Component} from 'react'
import './modal.css'
import {ButtonModalClose, ButtonModalBack} from '../buttons/buttons'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import actions from '../../../actions'
import { withRouter } from 'react-router-dom';


class ModalLayout extends Component {

  volver = () =>{

    const {
      uiAnimation
    } = this.props

    if(uiAnimation){return this.props.action.FlowAnimationLayoutAction('backV', 'back', this.props.current)}
    this.props.action.ReduceStep(this.props.current)

  }

  salir = async() => {

    const{
      deposit_direct_access,
      current,
      sub_section
    } = this.props



    if(current === 'deposit' || current === 'withdraw'){
      await this.props.action.CurrentForm('wallets')
      // await this.props.action.current_section_params({current_wallet:null})
      this.props.action.section_view_to('initial')
    }

    if(sub_section && !deposit_direct_access && (current === 'deposit' || current === 'withdraw')){
      this.props.action.section_view_to('detail')
    }else{
      this.props.history.push(`/${this.props.redux_route}`)
    }

    this.props.action.ToggleModal()
    if(current === 'withdraw' || current === 'bank'){
      this.props.action.CleanForm('bank')
      this.props.action.CleanForm('withdraw')
    }
  }


salirTicket = async() =>{

  const {
    current
  } = this.props

  this.props.action.ModalView('modalView')
  this.props.action.CleanForm(current)

  return  this.props.action.ToggleModal()
}

render(){

// console.log('ModalLayout - - - - - ', this.props.step)
// console.log('ModalLayout - - - - - ', this.props)
// modalview recibe los siguientes parametros
// modalView: vista de modal fondoblanco habilita botones de navegación del modal
// modalSuccess: vista final de un proceso realizado con exito (fondo verde)
// modalRejected: vista final de un proceso NO REALIZADO (fondo rojo)

  const {
    modalView,
    loader,
    step,
    children,
    action,
    current
  } = this.props

  return(
    <section className={`Modal aparecer`}>
      <div className={`modalCont ${modalView}`}>
        {children}

        {
          (!loader && modalView === "modalView") &&
            <ButtonModalClose toggleModal={this.salir}>
              { window.innerWidth>768 &&
                'Salir'
              }
            </ButtonModalClose>
        }

        {
          (!loader && current === "ticket") &&
            <ButtonModalClose
              color="white"
              toggleModal={this.salirTicket}>
              { window.innerWidth>768 &&
                'Salir'
              }
            </ButtonModalClose>
        }

        {
          (step>1  && current === "ticket") &&
            <ButtonModalBack
              color="white"
              volver={this.volver}>
              { window.innerWidth>768 &&
                'volver'
              }
            </ButtonModalBack>
        }

        {
          (current === 'bank' && step>2 && !loader && modalView === "modalView" || current !== 'bank' && step>1 && !loader && modalView === "modalView") &&
          // (current !== 'bank' && step>1 && !loader && modalView === "modalView") &&
            <ButtonModalBack volver={this.volver}>
              { window.innerWidth>768 &&
                'volver'
              }
            </ButtonModalBack>
        }

      </div>
    </section>
  )
}

}

function mapStateToProps(state, props){
  // console.log('modal_LAYOUT STATE::::', state)
  const { current, form_wallet, form_bank, form_deposit, form_kyc_basic } = state.form
  const steped = (
    current === 'wallets' ?  `form_wallet` :
    current === 'kyc_advance' ? 'form_kyc_basic' :
    `form_${current}`)

  // console.log('modal_LAYOUT STATE::::', current)

  return {
      step:state.form[steped] && state.form[steped].step,
      current:state.form.current,
      redux_route:state.ui.menu_item_active,
      sub_section:state.ui.current_section.params.current_sub_section,
      deposit_direct_access:state.ui.current_section.params.deposit_direct_access,
      uiAnimation:state.ui.flowAnimationActive
  }
}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(ModalLayout))
