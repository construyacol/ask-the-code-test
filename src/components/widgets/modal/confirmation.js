import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { ButtonForms } from '../buttons/buttons'
// import proof from '../../../assets/deletewallet.png'
import SimpleLoader from '../loaders'
import IconSwitch from '../icons/iconSwitch'
// import styled from 'styled-components'
import SwapVIewConfirm from './swapViewConfirmation'

import './modal.css'

class ConfirmationModal extends Component {

  handleClick = () => {
    const {
      action,
      payload,
      code
    } = this.props.modal_confirmation

    // Ejecutamos la acción desde redux, para eliminar wallet pasandole como parametro el id del wallet
    action(payload, code)
    this.props.action.confirmationModalToggle()
    this.props.action.confirmationModalPayload(null)
  }

  cancelarClick = () => {
    this.props.action.confirmationModalToggle()
    this.props.action.confirmationModalPayload(null)
  }

  componentDidMount() {
    this.keyActions()
  }

  keyActions() {
    document.onkeydown = (event) => {
      // backspace
      if (event.keyCode === 8 || event.keyCode === 46) {
        this.cancelarClick()
        // event.preventDefault();
      }
      // enter
      if (event.keyCode === 13) {
        event.preventDefault()
        this.handleClick()
      }
      // esc
      if (event.keyCode === 27) {
        this.cancelarClick()
        // event.preventDefault();
    }
    }
  }

  componentWillUnmount() {
    document.onkeydown = false
  }


  render() {
    const {
      loader
    } = this.props

    const {
      type
    } = this.props.modal_confirmation

    return (
      <>
        {
          loader ?
            <SimpleLoader />
            :
            <section className={`Modal aparecer`}>
              {
                type === 'swap' ?
                  <SwapVIewConfirm
                    cancelarClick={this.cancelarClick}
                    handleClick={this.handleClick}
                    {...this.props}
                  />
                  :
                  <StandardTicket
                    cancelarClick={this.cancelarClick}
                    handleClick={this.handleClick}
                    {...this.props}
                  />
              }
            </section>
        }
      </>
    )
  }
}


function mapStateToProps(state, props) {
  return {
    modal_confirmation: state.ui.modal_confirmation,
    loader: state.isLoading.loader
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal)
// ConfirmationModal




export const StandardTicket = props => {

  const { cancelarClick, handleClick } = props

  const {
    title,
    description,
    txtPrimary,
    txtSecondary,
    img,
    svg,
    type
  } = props.modal_confirmation

  const atributos = {
    icon: svg,
    size: type === 'select_country' ? 100 : 80,
    color: `#1babec`
  }

  const _cancelarClick = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      cancelarClick()
    }
  }

  return (
    <div className={`modalCont2 ConfirmationModal`} data-close_modal={true} onClick={_cancelarClick ? _cancelarClick : null}>

      <div className={`Mconfirmar ${type}`}>
        <div className="titleConfirmed">
          <h1 className="fuente" >{title}</h1>
        </div>

        <>
          {
            img ?
              <img className="itemFuera" src={require(`../../../assets/${img}.png`)} width="80" alt="" id={img} title={img} />
              :
              svg &&
              <IconSwitch {...atributos} />
          }

          <p className='fuente' style={{ alignSelf: 'start' }}>{description}</p>

          <div className="CMControls">
            {
              txtSecondary &&
              <ButtonForms
                type="secundary"
                active={true}
                siguiente={cancelarClick}
              >{txtSecondary}
              </ButtonForms>
            }

            <ButtonForms
              type="primary"
              active={true}
              siguiente={handleClick}
            >{txtPrimary}</ButtonForms>
          </div>
        </>
      </div>

    </div>
  )


}




// export const ConfirmSwapComponent = ({ from, spent, to, bought, type, description }) => {
//
//   return(
//     <div className="confirSwap">
//       <ChangeCotization/>
//
//         <SwapCurrencies>
//           <div>
//             <IconSwitch icon={from} size={60} />
//             <span className="textSwaPcON textRed fuente2">- {spent} / {from}</span>
//           </div>
//           <IconSwitch icon="transactional" size={35} color="#347fe6" />
//           <div>
//             <IconSwitch icon={to} size={60} />
//             <span className="textSwaPcON textGreen fuente2">+ {bought} / {to}</span>
//           </div>
//         </SwapCurrencies>
//
//       <p  className={`${type === 'swap' ? 'fuente2' : 'fuente'}  `} style={{alignSelf:type === 'swap' ? 'center' : 'start' }}>{description}</p>
//     </div>
//   )
//
// }


// export const ChangeCotization = props => {
//   return(
//       <ChangeCotizationLayout>
//         <p className="fuente2">La tasa de cambio estará vigente durante 30 Segundos</p>
//         <div>
//           <h1 className="fuente2">30</h1>
//         </div>
//       </ChangeCotizationLayout>
//   )
// }
//
// export const ChangeCotizationLayout = styled.section`
//   display: grid;
//   grid-template-columns: 1fr;
//   grid-template-rows: auto 1fr;
//   grid-column: 1 / 4;
//   height: auto;
//   width: 100%;
//
//   h1{
//     font-size: 50px;
//     margin: 0;
//     color: #2fa08c;
//     font-weight: 500;
//   }
//
//   p{
//     font-size: 14px;
//   }
//
//   div{
//     height: 50px;
//     display: grid;
//     align-items: center;
//     justify-items:center;
//   }
//
//
// `


// export const SwapCurrencies = styled.div`
//   grid-template-columns: repeat(3, 1fr);
//   grid-column: 1 / 4;
// `
