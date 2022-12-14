import styled from 'styled-components'
import { useState, useEffect } from 'react'
import P from 'components/widgets/typography/p'
import {
    GasLayout,
    Pcontainer,
} from './styles'
import { HR } from 'components/widgets/headerAccount/styles'
import { RiGasStationFill } from 'react-icons/ri';
import { number_format, funcDebounces } from 'utils' 
import { getCdnPath } from 'environment'
import BigNumber from "bignumber.js"

export const HandleGas = ({ 
    addressState, 
    current_wallet, 
    toAddress, 
    withdrawData, 
    setWithdrawData, 
}) => {

    const [ onEdit, setOnEdit ] = useState()
    const [ loader, setLoader ] = useState(false)
    const { withdrawAmount, ethersProvider, utils, gas_limit } = withdrawData

    // console.log('gas_limit', gas_limit)

    const setEstimatedGas = async() => {
        if(addressState !== 'good' || withdrawAmount.isNaN())return;
        funcDebounces({
            keyId:{[`estimating_gas`]:current_wallet?.currency}, 
            storageType:"sessionStorage",
            timeExect:300,
            callback:async() => {
                setLoader(true)
                const txParams = {
                    to: toAddress,
                    // data: "0xd0e30db0",
                    value: utils.parseEther(withdrawAmount.toString())
                }
                const gasLimit = await ethersProvider.estimateGas(txParams);
                setLoader(false)
                if(!BigNumber(gasLimit.toString()).isGreaterThanOrEqualTo(gas_limit))return;
                setWithdrawData(prevState => ({...prevState, gas_limit:gasLimit.toString()}))
            }
        })
    }

    useEffect(() => {
        if(withdrawData.ethersProvider && withdrawData.baseFee && withdrawData.withdrawAmount) setEstimatedGas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawData.ethersProvider, withdrawData.baseFee, withdrawData.withdrawAmount, addressState])

    return(
        <GasLayout className={`${onEdit ? 'open' : ''}`}>
            <Pcontainer>
                <P variant="bold" size={15}>Gas estimado:</P>
                <GasEdit>
                    <P size={15} variant="number" color='var(--primary)'>{number_format(withdrawData?.gas_limit || 0)}</P>
                    {
                        loader ?
                        <img src={`${getCdnPath('assets')}wallet/withdraw/estimating.gif`} alt="" width={18} />
                        :
                        <RiGasStationFill size={18} color='var(--primary)'/>
                    }
                    <HR height={20}/>   
                    <button className={`${onEdit ? 'onEdit' : ''}`} onClick={() => setOnEdit(!onEdit)}>
                        <P  size={12} variant="number" color={`${onEdit ? 'white' : 'var(--primary)'}`} >EDITAR</P>
                    </button>
                </GasEdit>
            </Pcontainer>
            <RangeContainer className="rangeCont">
                <input type="range" placeholder='gas' min="21000" max="80000" step="2" defaultValue={gas_limit} onChange={({target:{value}}) => setWithdrawData(prevState => ({...prevState, gas_limit:value}))} />
            </RangeContainer>
        </GasLayout>
    )
}


const RangeContainer = styled.div`
    overflow:hidden;
    transition:.3s;
    height: 0;
    display:flex;
    background: #e9e9e973;
    padding: 0 15px;

    input{
        width: 100%;
    }
   
`

const GasEdit = styled.div`
    display: flex;
    column-gap: 10px;
    align-items: center;
    height: 30px;

    button{
        cursor:pointer;
        border-style: none;
        padding: 5px;
        border-radius: 3px;
        background:#ebebeb;
        &.onEdit{
            background:var(--primary);
        }
    }
`