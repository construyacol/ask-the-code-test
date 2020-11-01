import React from 'react'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'
import './modal.css'

const OtherModalLayout = props =>{

  const {
    children,
    // close_modal,
    on_click,
    onkeydown,
    id = 'render-modal-close-button'
  } = props
  const idForCloseButton = on_click && useKeyActionAsClick(true, id, 27, false, onkeydown ? 'onkeydown' : 'onkeyup', true)

  return(
    <section className={`Modal aparecer`}>
      <div id={idForCloseButton} className={`modalCont3 ConfirmationModal socketNotifyPers`} data-close_modal={true} onClick={on_click ? on_click : null}>
        {children}
      </div>
    </section>
  )
}

export default OtherModalLayout
