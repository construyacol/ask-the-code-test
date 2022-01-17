// import ViewAmountComponent from '../../../wallets/views/viewAmount'
import { useState } from 'react';
import styled from 'styled-components'
import IconSwitch from "../../../widgets/icons/iconSwitch";
import { InputDepositForm } from "../../../widgets/inputs";
import { ButtonForms } from "../../../widgets/buttons/buttons";
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


    return(
        <Layout>
            <Title className="fuente">Escribe la cantidad de depósito</Title>
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
            <ButtonForms
              type="primary"
              active={parseFloat(state[stageData?.key]) >= parseFloat("20000")}
              siguiente={() => nextStage()}
            >
              Continuar
            </ButtonForms>
        </Layout>
    )
}

export default AmountComponent


const MinAmount = styled.p`
    color:gray;
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

const Title = styled.p`
    margin:0;
`

const Layout = styled.div`
    grid-row-gap: 10px;
    display: grid;
    height: 100%;
    justify-items: center;
    align-items: center;
    perspective: 900px;3
    transform-style: preserve-3d; 
    text-align: center;
    width: calc(100% - 40px);
    padding: 0 20px;

    .botonForm{
        width:220px;
    }
`