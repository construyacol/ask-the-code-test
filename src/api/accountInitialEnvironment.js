import { CURRENCIES, DEFAULT_CURRENCIES } from 'core/config/currencies'



export const createAccounts = (currencies = DEFAULT_CURRENCIES) => {
  const ENV = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 
  let environment = ["development", "staging"].includes(ENV) ? 'test' : 'prod';
  const initialAccounts = currencies.map(currency => {
    return{
      data:{
        country: null,
        enabled: true,
        currency:CURRENCIES[currency][`${environment}Name`],
        "short_currency": {
          "currency": CURRENCIES[currency][environment],
          "is_token": false
        }
      }
    }
  })
  return initialAccounts
}


const accountInitialEnvironment = {
  "accounts": createAccounts(DEFAULT_CURRENCIES)
}


export default accountInitialEnvironment