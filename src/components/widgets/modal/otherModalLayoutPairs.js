import React, { useEffect } from 'react'
import './modal.css'

const OtherModalLayoutPairs = props =>{
  const {
    children,
    title,
    close_modal,
    classes
  } = props

  useEffect(() => {
    document.onkeydown = (event) => {
      // esc
      if (event.keyCode === 27) {
        close_modal && close_modal()
        // event.preventDefault();
      }
    }
    return () => document.onkeydown = () => null
  }, [])
  
  return(
    <section className={`Modal aparecer`}>
      <div className={`modalCont2 ConfirmationModal`}>
        <div className={`PairList ${classes === '2auth' ? 'auth' : classes}`}>
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

export default OtherModalLayoutPairs
