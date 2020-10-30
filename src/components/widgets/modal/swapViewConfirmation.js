import React, { useState, useEffect } from 'react'
import IconSwitch from '../icons/iconSwitch'
import { connect } from 'react-redux'


import {
  DownCounter,
  Buttons
} from '../../'

const SwapVIewConfirm = props => {


  const { cancelarClick, handleClick, idCancelButton, idAcceptButton, idCloseButton } = props

  const {
    title,
    // description,
    // txtPrimary,
    // txtSecondary,
    // img,
    // svg,
    type,
    from, spent, to, bought, handleSwap
  } = props.modal_confirmation

  const [counter, setCounter] = useState(20)


  useEffect(() => {
    const SwapCounter = setInterval(async () => {
      clearInterval(SwapCounter)
      if (counter === 1) {
        handleSwap()
      }

      if (counter === 0) {
        setCounter(20)
      } else {
        setCounter(counter - 1)
      }
    }, 1000)

    return (() => { clearInterval(SwapCounter) })

  }, [counter])

  const _cancelarClick = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      cancelarClick()
    }
  }

  // useEffect(()=>{
  //   formatToCurrency
  // }, [])
  // handleSwap
  // console.log('|||||||||||||||||||||  SwapVIewConfirm  ==> ', props)
  return (

    <div id={idCancelButton} className={`modalCont2 ConfirmationModal`} data-close_modal={true} onClick={_cancelarClick ? _cancelarClick : null}>
      <h1 className="bigCounter fuente2">{counter}</h1>
      <div className="LayoutSocketNotify swing-in-bottom-bck">
        <div className="msgSwapDisclamer" ><p className="fuente">La cotización se actualizará cada 20 segundos.</p></div>
        <div className={`socketContent ${type}`}>
          <div className="close_modal_btn" id={idCloseButton} onClick={cancelarClick}><i className="fas fa-times"></i></div>

          <div className="topSection swap">
            <h3 className="fuente swapTitleConfir">{title}</h3>
            <div className="contBackTopSection">
              <div className="backTopSection animate swap" />
            </div>
            <div className="socketIconContainer in swap">
              <div className="wavExpansive in" />
              <DownCounter current={counter} />
            </div>
          </div>

          <div className={`bottomSection ${type}`}>
            <div className="swapdescriptionText">

              <article id="Swapdescription" className="fuente" >
                Gastarás la cantidad de: <label className="fuente2">- {spent} {from}</label>, para adquirir la cantidad de:
            </article>

              <article className="depositAmount swap">
                <IconSwitch
                  icon={to}
                  size={35}
                />
                <article id="order_amount" className="fuente2 swap">
                  {/* {formatCurrency}  */}
                  {/* {description} */}
                + {bought}
                  <span className={to}>
                    {to}
                  </span>
                </article>
              </article>

            </div>

            <Buttons.ButtonNofity id={idAcceptButton} className="swap" buttonAction={handleClick} >
              <p id="ButtonNofityText" className="fuente">Confirmar Intercambio</p>
            </Buttons.ButtonNofity>
          </div>
        </div>
      </div>
    </div>
  )

}

export default SwapVIewConfirm
