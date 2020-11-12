import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { ButtonForms } from '../buttons/buttons'
// import proof from '../../../assets/deletewallet.png'
import SimpleLoader from '../loaders'
import IconSwitch from '../icons/iconSwitch'
import styled from 'styled-components'
import SwapVIewConfirm from './swapViewConfirmation'
import { IconClose } from '../shared-styles'

import './modal.css'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'

function ConfirmationModal({ modal_confirmation, loader, action, ...rest }) {
  const idCancelButton = useKeyActionAsClick(true, 'cancel-confirm-modal', 8, false, 'onkeyup', true)
  const idCloseButton = useKeyActionAsClick(true, 'close-confirm-modal', 27, false, 'onkeyup', true)
  const idAcceptButton = useKeyActionAsClick(true, 'accept-confirm-modal', 13, false, 'onkeyup', true)

  const handleClick = () => {
    const {
      payload,
      code
    } = modal_confirmation

    // Ejecutamos la acción desde redux, para eliminar wallet pasandole como parametro el id del wallet
    modal_confirmation.action(payload, code)
    action.confirmationModalToggle()
    action.confirmationModalPayload(null)
  }

  const cancelarClick = () => {
    const {
      cancelCallback
    } = modal_confirmation
    if (typeof cancelCallback === 'function') {
      cancelCallback()
    }
    action.confirmationModalToggle()
    action.confirmationModalPayload(null)
  }

  const {
    type
  } = modal_confirmation

  const props = {
    idCancelButton,
    idAcceptButton,
    idCloseButton,
    cancelarClick,
    handleClick,
    modal_confirmation,
    loader,
    action,
    ...rest
  }

  return (
    <>
      {
        loader ?
          <SimpleLoader />
          :
          <>
            {
              type === 'swap' ?
                <SwapVIewConfirm
                  {...props}
                />
                :
                <section className={`Modal aparecer`}>
                  <StandardTicket
                    {...props}
                  />
               </section>
            }
          </>
      }
    </>
  )
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


export const StandardTicket = props => {

  const { cancelarClick, handleClick, idAcceptButton, idCancelButton, idCloseButton } = props

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
    <div id={idCloseButton} className={`modalCont2 ConfirmationModal`} data-close_modal={true} onClick={_cancelarClick ? _cancelarClick : null}>

      <div className={`Mconfirmar ${type}`}>

        <IconClose
          theme="dark"
          size={20}
        />

        <div className="titleConfirmed">
          <h1 className="fuente" >{title}</h1>
        </div>

        <Wrapper>
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
                _id={idCancelButton}
                type="secundary"
                active={true}
                siguiente={cancelarClick}
              >{txtSecondary}
              </ButtonForms>
            }

            <ButtonForms
              _id={idAcceptButton}
              type="primary"
              active={true}
              siguiente={handleClick}
            >{txtPrimary}</ButtonForms>
          </div>
        </Wrapper>
      </div>

    </div>
  )


}


const Wrapper = styled.section`
  width: 100%;
  height: auto;
  background: white;
  display: grid;
  grid-row-gap: 50px;
  padding: 30px 0;
  border-radius: 6px;

  p{
    max-width: 450px;
    justify-self:center;
  }
`



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
