import { useEffect, useState, useRef } from 'react'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import sleep from 'utils/sleep'


const EthFee = () => {

    const [ coinsendaServices ] = useCoinsendaServices();
    const [ dataFee, setDataFee ] = useState({ timeLeft:'0', baseFee:'0' })
    const componentIsMount = useRef()


    const getNetData = async() => {
        const { data, error } = await coinsendaServices.fetchWithdrawProviderNetData()   
        if(error)return alert(error?.message);
        const jwt = await import('jsonwebtoken')
        const dataNetDecoded = await jwt.decode(data);
        const { exp, base_fee } = dataNetDecoded;
        setDataFee(prevState => ({...prevState, baseFee:base_fee}))
        validateExpTime(exp)
    }

    const validateExpTime = async(exp) => {
        const expiredTime = new Date(exp);
        const currentTime = new Date().getTime()/1000;        
        const currentDate = new Date(currentTime)
        const timeLeft = expiredTime.getTime() - currentDate.getTime()
        setDataFee(prevState => ({...prevState, timeLeft}))
        await sleep(1000)
        if(currentTime <= exp && componentIsMount?.current){
            return validateExpTime(exp)
        }else if(componentIsMount?.current){
            return getNetData()
        }
    }

    useEffect(() => {
        getNetData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log('dataFee', dataFee)


    return(
        <div ref={componentIsMount} style={{textAlign:'center'}}>
            {dataFee.baseFee} ({dataFee.timeLeft})
        </div>
    )
}

export default EthFee