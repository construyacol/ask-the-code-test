import React, { Component, useState, useEffect } from 'react'
import { InputFormAuth } from '../../inputs'
import { useCoinsendaServices } from '../../../../services/useCoinsendaServices'




import './viewSettings.css';

const AuthReq = (props) => {

  const [ buttonActive, setButtonActive ] = useState()
  const [ loader, setLoader ] = useState()
  const [ verifying, setVerifying ] = useState()
  const [ status, setStatus ] = useState()
  const [ error, setError ] = useState()
  const [ value, setValue ] = useState()
  const [ desaparecer, setDesaparecer ] = useState()
  const [ coinsendaServices ] = useCoinsendaServices()




  const actualizarEstado = async p =>{

    const { value } = p.target

    if(value.length > 5){
      setLoader(true)
      setButtonActive(false)
      setStatus("Verificando...")

      let res
      if(props.isTryToDisable2fa){
        res = await coinsendaServices.disable2fa(value)
      }else{
        res = await coinsendaServices.addNewTransactionSecurity(value)
      }


        if(!res){
          setStatus("El codigo de verificación es incorrecto")
          setError(true)
          return setLoader(false)
        }

        setButtonActive(true)
        setStatus("Verificado con Exito")
        setError(false)
        setLoader(false)
        setValue(value)

        return ok_auth()



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



  const ok_auth = () =>{

    setTimeout(()=>{
      props.toggle_anim && props.toggle_anim()
      setDesaparecer(props.toggle_anim && true)
    },1200)

    setTimeout(()=>{
      props.authenticated && props.authenticated()
    }, 1500)
  }


  const {
      label,
      handleFocus,
      handleBlur,
      disabled
    } = props


  return(
    <div id="authReq" className={`${desaparecer ? 'desaparece': ''}`}>

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
