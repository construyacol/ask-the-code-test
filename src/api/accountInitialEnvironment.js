import { CURRENCIES, DEFAULT_CURRENCIES } from 'core/config/currencies'

const getInitialBodyAccounts = (environment = 'test') => {
  const initialAccounts = DEFAULT_CURRENCIES.map(currency => {
    return {
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

const environment = process.env.NODE_ENV !== 'development' ? 'prod' : 'test'

const accountInitialEnvironment = {
  "accounts": getInitialBodyAccounts(environment)
}

export default accountInitialEnvironment