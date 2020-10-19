import React, { useEffect } from 'react'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'
import './modal.css'

const OtherModalLayoutPairs = props =>{
  const {
    children,
    title,
    close_modal,
    classes
  } = props

  const idForCloseModal = useKeyActionAsClick(true, 'close-modal-button-orders', 27, true, 'onkeyup', true)


  const closeModal = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      close_modal && close_modal()
    }
  }
  
  return(
    <section className={`Modal aparecer`}>
      <div className={`modalCont2 ConfirmationModal`} data-close_modal={true} onClick={closeModal ? closeModal : null}>
        <div className={`PairList ${classes === '2auth' ? 'auth' : classes}`}>
          <div className="PairListtitle">
            <h1 className="fuente">{title}</h1>
            <i className="fas fa-times" id={idForCloseModal} onClick={close_modal}></i>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}

export default OtherModalLayoutPairs
