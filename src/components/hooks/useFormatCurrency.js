import { useEffect, useState } from 'react'
import { formatToCurrency } from '../../utils/convert_currency'

export const useFormatCurrency = (objetive_amount, currency) => {

  const [ amount, setAmount ] = useState(objetive_amount)
  const [ amountCurrency ] = useState(currency)

    const formating = async(objetive_amount, currency) => {
      // console.log('||||||||| FORMATING CURRENCY', objetive_amount, currency)
      let amount_converted = await formatToCurrency(objetive_amount, currency, true)
      setAmount(amount_converted)
    }

    useEffect(()=>{
      if(amount && amountCurrency){
        formating(amount, amountCurrency)
      }
    }, [])

  return [amount, formating]

}
