import { useState } from 'react'
// import AddressValidator from 'wallet-address-validator'
// import useError from './errorHandle'
import { debounce } from '../../utils'
import { formatToCurrency } from '../../utils/convert_currency'
import WithdrawViewState from './withdrawStateHandle'


export default () => {

  const [ inputState, setInputState ] = useState()
  // const [ setHandleError ] = useError()
  // const globalState = useSelector(state => state)
  // const params = useParams()
  // const { account_id } = params
  // const { wallets, withdrawProviders } = globalState.modelData
    const [ { current_wallet, withdrawProviders } ]  = WithdrawViewState()

  const validateState = async(inputName, e) => {
      if(!e.target.value || e.target.value.length === 0){return setInputState(null)}
      switch (inputName) {
      //   case 'email':
      //     let minRegex = /@/
      //     let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      //     if (emailRegex.test(value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")) && value.length>8) {
      //       setInputState('good')
      //     }else if(minRegex.test(value)){
      //       setInputState('bad')
      //     }else{
      //       setInputState(null)
      //     }
      //   break
      //   case 'password':
      //     if(value.length > 6){
      //       setInputState('good')
      //     }else{
      //       setInputState(null)
      //     }
      //   break
      //   case 'password2':
      //     const form = new FormData(document.getElementById('authForm'))
      //     const password = form.get('password')
      //     let password2 = value
      //     if(password2.length > 6 && password2 === password){
      //       return setInputState('good')
      //     }
      //     if(password2.length > 6 && password2 !== password){
      //       // dispatch(handleError({response:{data:{error:'Las contraseñas no coinciden'}}}))
      //       // setHandleError('Las contraseñas no coinciden')
      //       setInputState('bad')
      //     }else{
      //       setInputState(null)
      //     }
      //     break
        case 'name-account':

          if(e.target.value.length > 4){
            setInputState('good')
          }

          break;

        case 'address':
        case 'address-account':
        // case: si encontramos @ al inicio de la linea: ^@

          let AddressValidator
          AddressValidator = await import('wallet-address-validator')

          let currency = current_wallet.currency.currency === 'bitcoin_testnet' ? 'bitcoin' : current_wallet.currency.currency
          let finalValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

          let addressVerify = await AddressValidator.validate(finalValue, currency)

            if(addressVerify){
              setInputState('good')
            }else{
              setInputState('bad')
            }
            e.target.value = finalValue
        break;


        case 'amount':
          let value = await formatToCurrency(e.target.value, current_wallet.currency)
          if(isNaN(value.toNumber()) || value.toNumber() === 'NaN'){return e.target.value = null}
          let min_amount = await formatToCurrency(withdrawProviders[current_wallet.currency.currency].provider.min_amount, current_wallet.currency)
          let available = await formatToCurrency(current_wallet.available, current_wallet.currency)
          if(value.isGreaterThanOrEqualTo(min_amount) && value.isLessThanOrEqualTo(available)){
            setInputState('good')
            return e.target.value
          }else{
            setInputState('bad')
          }
          break
        default:
      }
  }

  const debouncedValidateState = debounce(validateState, 100)

  return [ inputState, validateState, setInputState ]
}

























//
