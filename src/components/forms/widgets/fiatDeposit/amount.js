// import ViewAmountComponent from '../../../wallets/views/viewAmount'
// import { useEffect, useState } from 'react';
import styled from 'styled-components'
import IconSwitch from "../../../widgets/icons/iconSwitch";
import { InputDepositForm } from "../../../widgets/inputs";
// import { ButtonForms } from "../../../widgets/buttons/buttons";
import ControlButton from "../../../widgets/buttons/controlButton";

import { AmountLayout } from './styles'
import {
    handleKeyPress,
    number_format,
    // get_ui_name_currency,
  } from "../../../../utils";


const AmountComponent = ({ nextStage, stageData, handleState:{ state, setState } }) => {


    const updateAmount = ({ target }) => {
        let amount = target.value.replace(/\D/g, "");
        setState(prevState => { return { ...prevState, [stageData?.key]: amount } })
    };

    const loadMinAmount = () => {
        setState(prevState => { return { ...prevState, [stageData?.key]: "20000" } })
    }

    console.log('state', state)

    return(
        <AmountLayout className="amountLayout">
            <Title className="fuente">Escribe la cantidad a depositar</Title>
            <Content>
                <IconSwitch icon="cop" size={45} />
                <InputDepositForm
                    classNames="without-adapt"
                    value={state[stageData?.key]}
                    autoFocus={true}
                    actualizar={updateAmount}
                    name="amount"
                    handleKeyPress={handleKeyPress}
                    service={number_format}
              /> 
              <MinAmount className="fuente2" onClick={loadMinAmount}>Cantidad mínima: $20.000</MinAmount>
            </Content>

            <ControlButton
                handleAction={() => nextStage()}
                // loader={true}
                formValidate={parseFloat(state[stageData?.key]) >= parseFloat("20000")}
                label="Continuar"
            />
        </AmountLayout>
    )
}

export default AmountComponent


const MinAmount = styled.p`
    color:gray;
    margin: 0;
    align-self: baseline;
    cursor:pointer;
    justify-self:end;
`

const Content = styled.section`
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
    grid-template-rows: 30% 1fr 1fr !important;
    min-height: 300px;
    height: 100%;
    padding: 0 15px;
    width:calc(100% - 30px);
    
`

export const Title = styled.h3`
    margin:0;
    color:var(--primary);
    font-size:1.3em;
`


