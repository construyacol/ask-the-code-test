import { useState, useEffect } from 'react'
import { selectWithConvertToObjectWithCustomIndex } from '../components/hooks/useTxState'
import { useSelector } from "react-redux";
import { currencyLabels } from '../const/const'

export default function useCurrencies(){
    const currenciesModels = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
    const [ currencies, setCurrencies ] = useState(currenciesModels || currencyLabels)
    useEffect(() => {
        if(currenciesModels){
            setCurrencies(currenciesModels)
        }
    }, [currenciesModels])
    return currencies
}