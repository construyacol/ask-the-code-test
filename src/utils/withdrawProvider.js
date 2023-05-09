import { formatToCurrency } from "utils/convert_currency";
import { isEmpty } from 'lodash'
// import { DEFAULT_COST_ID } from 'const/const'

export const getMinAmount = (withdrawProvider) => {
    if(!withdrawProvider || isEmpty(withdrawProvider))return;
    const providerMinAmount = formatToCurrency(withdrawProvider?.provider?.min_amount, withdrawProvider.currency)
    const costAmount = formatToCurrency(0, withdrawProvider.currency)
    return providerMinAmount.plus(costAmount || 0)
}

export const createProviderInfoNeeded = ({ accountLabel, accountAddress, provider_type }) => {
    const INFO_NEEDED = {
      internal_network:{
        identifier:accountAddress?.trim(),
        type:'email',
        label:accountLabel
      },
      default:{
        label:accountLabel,
        address:accountAddress?.trim()
      }
    }
    return INFO_NEEDED[provider_type] || INFO_NEEDED?.default
}