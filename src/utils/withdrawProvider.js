import { formatToCurrency } from "utils/convert_currency";
// import { DEFAULT_COST_ID } from 'const/const'

export const getMinAmount = async(withdrawProvider) => {
    const providerMinAmount = formatToCurrency(withdrawProvider?.provider?.min_amount, withdrawProvider.currency)
    // const fixedCost = getFixedCost(withdrawProvider?.provider?.costs)
    const costAmount = formatToCurrency(0, withdrawProvider.currency)
    return providerMinAmount.plus(costAmount || 0)
}

// const getFixedCost = (costs, costId) => {
//     const cost_id = costId || DEFAULT_COST_ID;
//     if(costs[cost_id]?.fixed)return costs[cost_id]?.fixed;
// }
