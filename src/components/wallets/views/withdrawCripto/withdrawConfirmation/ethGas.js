import styled from 'styled-components'
import { useState } from 'react'
import P from 'components/widgets/typography/p'

import {
    GasLayout,
    Pcontainer,
} from './styles'

import { HR } from 'components/widgets/headerAccount/styles'
import { RiGasStationFill } from 'react-icons/ri';

import { number_format } from 'utils' 

export const HandleGas = ({ withdrawData, setWithdrawData }) => {

    const [ onEdit, setOnEdit ] = useState()

    return(
        <GasLayout>
            <Pcontainer>
                <P variant="bold" size={15}>Gas estimado:</P>
                <GasEdit>
                    <P size={15} variant="number" color='var(--primary)'>{number_format(withdrawData?.gas_limit || 0)}</P>
                    <RiGasStationFill color='var(--primary)'/>
                    <HR height={20}/>   
                    <button className={`${onEdit ? 'onEdit' : ''}`} onClick={() => setOnEdit(!onEdit)}>
                        <P  size={12} variant="number" color={`${onEdit ? 'white' : 'var(--primary)'}`} >EDITAR</P>
                    </button>
                </GasEdit>
            </Pcontainer>
            <RangeContainer className={`${onEdit ? 'open' : ''}`}>
                <input type="range" placeholder='gas' min="21000" max="80000" step="2" defaultValue={"25000"} onChange={({target:{value}}) => setWithdrawData(prevState => ({...prevState, gas_limit:value}))} />
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
    &.open{
        height: 50px;
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