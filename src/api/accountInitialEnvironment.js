import { CURRENCIES, DEFAULT_CURRENCIES } from 'core/config/currencies'

export const createAccounts = (currencies = DEFAULT_CURRENCIES) => {
  const ENV = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 
  let environment = ["development", "staging"].includes(ENV) ? 'test' : 'prod';
  const initialAccounts = currencies.map(currency => {
    return{
      name:`Mi billetera ${CURRENCIES[currency][`${environment}Name`]}`,
      currency: CURRENCIES[currency][environment]
    }
  })
  return initialAccounts
}


const accountInitialEnvironment = {
  "accounts": createAccounts(DEFAULT_CURRENCIES)
}


export default accountInitialEnvironment