import React, { useEffect } from 'react'
import './newWallet.css'
import { InputButton, ButtonSuccess } from '../../widgets/buttons/buttons'
import InputForm from '../../widgets/inputs'
import ItemSelectionContainer from '../../widgets/items/ItemSelectionContainer'
import CopyContainer from '../../widgets/copy/copyContainer'
import {SimpleLoader} from '../../widgets/loaders'
import availableWalletCreator from '../../hooks/availableWalletCreator'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'

const NewWalletLayout = props =>{

  const {
    handleSubmit,
    actualizarEstado,
    name,
    currency,
    step,
    loader,
    address,
    short_currency_name,
    qr,
    clearCurrency
  } = props

  const [ availableCurrencies ] = availableWalletCreator()

  useEffect(() => {
    window.onkeypress = (event) => {
      if(event.keyCode === 13) {
        const el = document.getElementById('add-new-wallet-button')
        el && el.click()
      }
    }
    return () => {
      window.onkeypress = false
    }
  }, [window.onkeypress])

  return(
    <div className="containerFormWallet newWallet">
      {
        step === 1 &&
        <div className="step1 newWallet">
            {
              availableCurrencies ?
              <>
              <h1 className="fuente" > Nueva billetera </h1>
              <form
                onSubmit={handleSubmit}
                style={{width:"100%"}}
                >
                  <InputForm
                    clase="nameWallet containerInputComponent"
                    type="text"
                    label="Nombra tu nueva billetera"
                    placeholder="Billetera de trading"
                    name="name"
                    actualizarEstado={actualizarEstado}
                    active={name && currency}
                    autoFocus={true}
                    // value={name}
                  />
                <ItemSelectionContainer
                  type="coins"
                  label="¿Cúal moneda manejarás en tu billetera?"
                  itemSelect={currency}
                  actualizarEstado={actualizarEstado}
                  update_control_form={props.update_control_form}
                  items={availableCurrencies}
                  clearItem={clearCurrency}
                />
                <InputButton id="add-new-wallet-button" label="Crear Billetera" type="primary" active={name && currency}/>
              </form>
              </>
              :
                <SimpleLoader/>
            }


        </div>
      }


      {
        step === 2 &&
            <div className="step2">
              {
                loader ?
                <SimpleLoader
                  label={`Creando wallet ${currency}`}
                />
                    :
                <section className="stepFinish">

                  <div className="nWCabeza">
                    <div className="icon icon--order-success svg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px" alt="">
                        <g fill="none" stroke="white" strokeWidth="3">
                          <circle cx="36" cy="36" r="35"></circle>
                          <path className="check" d="M17.417,37.778l9.93,9.909l25.444-25.393"></path>
                        </g>
                      </svg>
                    </div>
                    <p className="titleWhite fuente"> Operación Exitosa</p>
                  </div>

                  <div className="nWbody fuente">
                      <div className="nWadress">
                        <div className="nWname">
                          {
                            short_currency_name !== "" &&
                            <img className="itemFuera" src={require(`../../../assets/coins/${short_currency_name}.png`)} width="30" alt=""/>
                          }
                          <p>Nueva wallet de {props.currency} creada</p>
                        </div>
                        <p>{name}</p>
                        <img className="itemFuera" src={qr} width="180" alt=""/>
                        <CopyContainer
                          valueToCopy={address}
                          color = "white"
                        />
                      </div>
                  </div>

                  <div className="nWcta" >
                    <ButtonSuccess id="add-new-wallet-button" toggleModal={props.finalizar}>Finalizar</ButtonSuccess>
                  </div>

                </section>
              }
            </div>
      }
    </div>
  )
}

export default NewWalletLayout
