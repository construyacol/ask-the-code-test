import { useState, useEffect } from 'react'
// import AddressValidator from 'wallet-address-validator'
// import useError from './errorHandle'
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { formatToCurrency } from '../../utils/convert_currency'
import WithdrawViewState from './withdrawStateHandle'


export default () => {

  const [ inputStatus, setInputStatus ] = useState()
  // const [ setHandleError ] = useError()
  // const globalState = useSelector(state => state)
  // const params = useParams()
  // const { account_id } = params
  // const { wallets, withdrawProviders } = globalState.modelData
  const [ withdrawState ]  = WithdrawViewState()
  const { current_wallet, withdrawProviders } = withdrawState

  const validate = async(inputName, e) => {
      if(!e.target.value || e.target.value.length === 0){return setInputStatus(null)}
      switch (inputName) {
      //   case 'email':
      //     let minRegex = /@/
      //     let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      //     if (emailRegex.test(value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")) && value.length>8) {
      //       setInputStatus('good')
      //     }else if(minRegex.test(value)){
      //       setInputStatus('bad')
      //     }else{
      //       setInputStatus(null)
      //     }
      //   break
      //   case 'password':
      //     if(value.length > 6){
      //       setInputStatus('good')
      //     }else{
      //       setInputStatus(null)
      //     }
      //   break
      //   case 'password2':
      //     const form = new FormData(document.getElementById('authForm'))
      //     const password = form.get('password')
      //     let password2 = value
      //     if(password2.length > 6 && password2 === password){
      //       return setInputStatus('good')
      //     }
      //     if(password2.length > 6 && password2 !== password){
      //       // dispatch(handleError({response:{data:{error:'Las contraseñas no coinciden'}}}))
      //       // setHandleError('Las contraseñas no coinciden')
      //       setInputStatus('bad')
      //     }else{
      //       setInputStatus(null)
      //     }
      //     break
        case 'address':
          let AddressValidator
          AddressValidator = await import('wallet-address-validator')

          let currency = current_wallet.currency.currency === 'bitcoin_testnet' ? 'bitcoin' : current_wallet.currency.currency
          let finalValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

          let addressVerify = await AddressValidator.validate(finalValue, currency)

            if(addressVerify){
              setInputStatus('good')
            }else{
              setInputStatus('bad')
            }
            e.target.value = finalValue
        break;


        case 'amount':
          let value = await formatToCurrency(e.target.value, current_wallet.currency)
          if(isNaN(value.toNumber()) || value.toNumber() === 'NaN'){return e.target.value = null}
          let min_amount = await formatToCurrency(withdrawProviders[current_wallet.currency.currency].provider.min_amount, current_wallet.currency)
          let available = await formatToCurrency(current_wallet.available, current_wallet.currency)
          if(value.isGreaterThanOrEqualTo(min_amount) && value.isLessThanOrEqualTo(available)){
            setInputStatus('good')
            return e.target.value = value.toNumber()
          }else{
            setInputStatus('bad')
          }
          break
        default:
      }
  }

  return [ inputStatus, validate ]
}

























//
