import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ButtonModalClose, ButtonModalBack } from '../buttons/buttons'
import { useActions } from '../../../hooks/useActions'

import './modal.css'

const ModalLayout = (props) => {
  const {
    modalView,
    loader,
    step,
    children,
    current,
    isAppLoaded
  } = props
  const actions = useActions()
  const el = window
  
  const volver = () => {
    if(step === 1) return
    const { uiAnimation } = props
    if (uiAnimation) { return actions.FlowAnimationLayoutAction('backV', 'back', props.current) }
    actions.ReduceStep(props.current)
  }
  
  const salir = async (callback) => {
    const { current } = props
    actions.CleanForm('deposit')
    actions.CleanForm('withdraw')
    actions.CleanForm('bank')
    actions.CleanForm(current)
  }
  
  const salirTicket = async () => {
    const { current } = props

    actions.ModalView('modalView')
    actions.CleanForm(current)
    
    return actions.toggleModal()
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      el.onkeydown = (event) => {
        if (event.keyCode === 27) {
          el.onkeydown = false
          salir()
        }
      }
    }, 0)
    return () => {
      clearTimeout(timeId)
      el.onkeydown = false
    }
  }, [el.onkeydown])

  return (
    <section className={`Modal ${isAppLoaded ? 'aparecer' : 'show_loader_app'}`}>
      <div className={`modalCont ${modalView}`}>
        {children}

        {
          (!loader && modalView === "modalView" && isAppLoaded) &&
          <ButtonModalClose toggleModal={salir}>
            {window.innerWidth > 768 &&
              'Salir'
            }
          </ButtonModalClose>
        }

        {
          (!loader && current === "ticket" && isAppLoaded) &&
          <ButtonModalClose
            color="white"
            toggleModal={salirTicket}>
            {window.innerWidth > 768 &&
              'Salir'
            }
          </ButtonModalClose>
        }

        {
          (step > 1 && current === "ticket") &&
          <ButtonModalBack
            color="white"
            volver={volver}>
            {window.innerWidth > 768 &&
              'volver'
            }
          </ButtonModalBack>
        }

        {
          ((current === 'bank' && step > 2 && !loader && modalView === "modalView") || (current !== 'bank' && step > 1 && !loader && modalView === "modalView")) &&
          <ButtonModalBack volver={volver}>
            {window.innerWidth > 768 &&
              'volver'
            }
          </ButtonModalBack>
        }

      </div>
    </section>
  )
}

function mapStateToProps(state) {
  const { current } = state.form
  const steped = (
    current === 'wallets' ? `form_wallet` :
      current === 'kyc_advance' ? 'form_kyc_basic' :
        `form_${current}`)

  const { isAppLoaded } = state.isLoading

  return {
    step: state.form[steped] && state.form[steped].step,
    current: state.form.current,
    redux_route: state.ui.menu_item_active,
    sub_section: state.ui.current_section.params.current_sub_section,
    deposit_direct_access: state.ui.current_section.params.deposit_direct_access,
    uiAnimation: state.ui.flowAnimationActive,
    isAppLoaded
  }
}

export default connect(mapStateToProps)(ModalLayout)
