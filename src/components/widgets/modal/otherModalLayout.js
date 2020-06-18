import React from 'react'
import './modal.css'

const OtherModalLayout = props =>{

  const {
    children,
    // close_modal,
    on_click
  } = props

  return(
    <section className={`Modal aparecer`}>
      <div className={`modalCont3 ConfirmationModal socketNotifyPers`} data-close_modal={true} onClick={on_click ? on_click : null}>
        {children}
      </div>
    </section>
  )
}

export default OtherModalLayout
