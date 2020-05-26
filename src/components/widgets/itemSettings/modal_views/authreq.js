import React, { Component, useState, useEffect } from 'react'
import { InputFormAuth } from '../../inputs'
import { useCoinsendaServices } from '../../../../services/useCoinsendaServices'




import './viewSettings.css';

const AuthReq = (props) => {

  const [buttonActive, setButtonActive] = useState()
  const [loader, setLoader] = useState()
  const [verifying, setVerifying] = useState()
  const [status, setStatus] = useState()
  const [error, setError] = useState()
  const [value, setValue] = useState()
  const [desaparecer, setDesaparecer] = useState()
  const [coinsendaServices] = useCoinsendaServices()

  const errorCallback = () => {
    setStatus("El codigo de verificación es incorrecto")
    setError(true)
    setLoader(false)
  }

  const actualizarEstado = async p => {

    const { value } = p.target

    if (value.length > 5) {
      setLoader(true)
      setButtonActive(false)
      
      if (!props.isTryToDisable2fa) {
        setStatus("Verificando...")
        const res = await coinsendaServices.addNewTransactionSecurity(value)
        if (!res) {
          return errorCallback
        }
        await coinsendaServices.fetchCompleteUserData()
      }

      setButtonActive(true)
      !props.isTryToDisable2fa && setStatus("Verificado con Exito")
      setError(false)
      setLoader(false)
      setValue(value)

      props.activeButton && props.activeButton(tryToDisabled2fa, value)

      return !props.isTryToDisable2fa && ok_auth()



      // debugger
      //   setStatus("El codigo de verificación es incorrecto")
      //   setError(true)
      //   setLoader(false)
      //
      //   setButtonActive(true)
      //   setStatus("Verificado con Exito")
      //   setError(false)
      //   setLoader(false)
      //   setValue(value)
      //
      //   return ok_auth()

    }

    // if(value.length > 5 && value !== '666999'){
    //
    //   setTimeout(()=>{
    //     setStatus("El codigo de verificación es incorrecto")
    //     setError(true)
    //     setLoader(false)
    //   }, 500)
    //
    //
    //   setButtonActive(false)
    //   setLoader(true)
    //   return setStatus("Verificando...")
    //
    // }
    setStatus("")
    setButtonActive(false)
    setLoader(false)
    setError(false)

  }



  const ok_auth = () => {

    setTimeout(() => {
      props.toggle_anim && props.toggle_anim()
      setDesaparecer(props.toggle_anim && true)
    }, 1200)

    setTimeout(() => {
      !props.isTryToDisable2fa && props.authenticated && props.authenticated()
    }, 1500)
  }

  useEffect(() => {
    if(props.showError) errorCallback()
  }, [props.showError])

  const tryToDisabled2fa = async (token) => {
    const res = await coinsendaServices.disable2fa(token)
    if(res) {
      await coinsendaServices.fetchCompleteUserData()
      ok_auth()
    }
    return res
  }


  const {
    label,
    handleFocus,
    handleBlur,
    disabled
  } = props


  return (
    <div id="authReq" className={`${desaparecer ? 'desaparece' : ''}`}>

      <InputFormAuth
        disabled={disabled}
        type="number"
        label={label}
        placeholder="CODIGO 2FA"
        name="auth"
        actualizarEstado={actualizarEstado}
        active={buttonActive}
        verifying={loader}
        value={value}
        status={status}
        error={error}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
      />

    </div>
  )

}

export default AuthReq
