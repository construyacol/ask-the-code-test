import React, { useEffect } from 'react'
import './modal.css'

const OtherModalLayout = props =>{

  const {
    children,
    // close_modal,
    on_click
  } = props
  const el = window

  useEffect(() => {
    el.onkeydown = (event) => {
      // esc
      if (event.keyCode === 27) {
        // console.log('ESC was pressed');
        // on_click && on_click({target:{dataset:{close_modal:true}}})
        on_click && on_click()
        // event.preventDefault();
      }
    }
    return () => {
      el.onkeydown = () => null
    }
  }, [el.onkeydown])

  return(
    <section className={`Modal aparecer`}>
      <div className={`modalCont3 ConfirmationModal socketNotifyPers`} data-close_modal={true} onClick={on_click ? on_click : null}>
        {children}
      </div>
    </section>
  )
}

export default OtherModalLayout
