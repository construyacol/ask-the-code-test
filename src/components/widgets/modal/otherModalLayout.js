import React from 'react'
import './modal.css'

const OtherModalLayout = props =>{
  const {
    children,
    title,
    close_modal
  } = props
  return(
    <section className={`Modal aparecer`}>
      <div className={`modalCont2 ConfirmationModal`}>
        <div className="otherModal">
          <div className="PairListtitle">
            <h1 className="fuente">{title}</h1>
            <i className="fas fa-times" onClick={close_modal}></i>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}

export default OtherModalLayout
