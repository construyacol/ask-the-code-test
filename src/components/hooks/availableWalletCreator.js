import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
// import { CAccountAllowedContext } from '../context'
import { convertToObjectWithCustomIndex } from '../../utils'


const availableWalletCreator = () => {

  const [ availableCurrencies, setAvailableCurrencies ] = useState()
  const { currencies, wallets } = useSelector(state => state.modelData)


  const getAvailableCurrencies = async() =>{
    if(!currencies || !wallets){return}
    let objectCurrencies = await convertToObjectWithCustomIndex(currencies, 'currency')
    let availableWallets = await convertToObjectWithCustomIndex(wallets, 'currency.currency')
    let resultCurrencies = []

    Object.keys(objectCurrencies).forEach(currency_name => {
      if(!availableWallets[currency_name]){
        resultCurrencies.push(objectCurrencies[currency_name])
      }
    })
    setAvailableCurrencies(resultCurrencies)
  }

  useEffect(()=>{
    getAvailableCurrencies()
  }, [currencies, wallets])

  return [ availableCurrencies ]

}


export default availableWalletCreator
