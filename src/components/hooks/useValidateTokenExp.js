import React, { useEffect } from 'react'
import { getUserToken } from '../utils'
let timer

const useValidateTokenExp = () => {


  const validateTokenExp = () => {
    timer = setInterval(()=>{
      getUserToken()
    }, 20000)
  }

  useEffect(() => {
    validateTokenExp()
    return(() => clearInterval(timer))
  }, [])


}

export default useValidateTokenExp
