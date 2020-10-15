import React from 'react'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'
import './modal.css'

const OtherModalLayout = props =>{

  const {
    children,
    // close_modal,
    on_click
  } = props
  const idForCloseButton = useKeyActionAsClick(true, 'render-modal-close-button', 27, false, 'onkeyup', true)

  return(
    <section className={`Modal aparecer`}>
      <div id={idForCloseButton} className={`modalCont3 ConfirmationModal socketNotifyPers`} data-close_modal={true} onClick={on_click ? on_click : null}>
        {children}
      </div>
    </section>
  )
}

export default OtherModalLayout
