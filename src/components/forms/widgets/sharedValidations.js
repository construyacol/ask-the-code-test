import BigNumber from "bignumber.js"


export function calculateCost(value, costs) {
  let range = 0;
  if(!value || !costs)return 0;
  const currentValue = BigNumber(value.replace(/,/g, ""));
  for (let cost in costs) {
    if (currentValue.isGreaterThanOrEqualTo(BigNumber(cost))) {
      range = cost;
    } else {
      break;
    }
  }
  if(currentValue.isLessThanOrEqualTo(0)) return 0;
  const fixedCost = BigNumber(costs[range]?.fixed)
  const percent = BigNumber(costs[range]?.percent || 0)
  return fixedCost.plus(currentValue.multipliedBy(percent.dividedBy(100))).toString();
}