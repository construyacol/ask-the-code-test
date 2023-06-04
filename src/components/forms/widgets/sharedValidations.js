import BigNumber from "bignumber.js"
import { isEmpty } from "lodash";


export function calculateCost(value, costs) {
  let range = 0;
  if(!value || !costs)return 0;
  const currentValue = new BigNumber(value.replace(/,/g, ""));
  for (let cost in costs) {
    if (currentValue.isGreaterThanOrEqualTo(new BigNumber(cost))) {
      range = cost;
    } else {
      break;
    }
  }
  if(currentValue.isLessThanOrEqualTo(0)) return 0;
  let taxValue = new BigNumber(0)
  const fixedCost = new BigNumber(costs[range]?.fixed)
  const percent = new BigNumber(costs[range]?.percent || 0)
  if(!isEmpty(costs[range]?.taxes))taxValue = calcCostStructTaxes(fixedCost.plus(currentValue.multipliedBy(percent.dividedBy(100))), costs[range]?.taxes)
  const cost = fixedCost.plus(currentValue.multipliedBy(percent.dividedBy(100)))
  return cost.plus(taxValue).toString();
}


function calcCostStructTaxes(cost_amount, taxes){
  if (isEmpty(taxes)) return new BigNumber(0);
  let total_taxes = new BigNumber(0);
  for (let tax_name of Object.keys(taxes)){
    let tax_struct = taxes[tax_name];
    tax_struct.fixed = tax_struct.fixed || 0;
    let tax_amount = new BigNumber(tax_struct.fixed);
    if (tax_struct.percent){
      let cost_multiplied_tax = cost_amount.multipliedBy(tax_struct.percent);
      cost_multiplied_tax = cost_multiplied_tax.div(100);
      tax_amount = tax_amount.plus(cost_multiplied_tax);
    }
    total_taxes = total_taxes.plus(tax_amount);
  }
  return total_taxes;
}