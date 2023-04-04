import { formatToCurrency } from "utils/convert_currency";
// import { DEFAULT_COST_ID } from 'const/const'

export const getMinAmount = (withdrawProvider) => {
    if(!withdrawProvider)return 0;
    const providerMinAmount = formatToCurrency(withdrawProvider?.provider?.min_amount, withdrawProvider.currency)
    // const fixedCost = getFixedCost(withdrawProvider?.provider?.costs)
    const costAmount = formatToCurrency(0, withdrawProvider.currency)
    return providerMinAmount.plus(costAmount || 0)
}

// const getFixedCost = (costs, costId) => {
//     const cost_id = costId || DEFAULT_COST_ID;
//     if(costs[cost_id]?.fixed)return costs[cost_id]?.fixed;
// }

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