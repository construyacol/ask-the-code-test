// import ViewAmountComponent from '../../../wallets/views/viewAmount'
import styled from 'styled-components'
import IconSwitch from "../../../widgets/icons/iconSwitch";
import { InputDepositForm } from "../../../widgets/inputs";
import ControlButton from "../../../widgets/buttons/controlButton";
import { OnlySkeletonAnimation } from '../../../widgets/loaders/skeleton'
import { HeaderComponent } from './'
import { AmountLayout } from './styles'
import {
    handleKeyPress,
    number_format,
    // get_ui_name_currency,
} from "../../../../utils";
import { ContainerLayout } from '../../../widgets/modal/render/addressBook'

// import { ButtonForms } from "../../../widgets/buttons/buttons";
  import {
    hide
} from '../onBoardingComponent/utils'

import { Content as ContentBackground} from '../../../widgets/modal/render/addressBook'
import { IconClose } from "../../../widgets/shared-styles";

const AmountComponent = ({ nextStage, stageData, handleState:{ state, setState } }) => {

    const updateAmount = ({ target }) => {
        let amount = target.value.replace(/\D/g, "");
        setState(prevState => { return { ...prevState, [stageData?.key]: amount } })
    };

    const loadMinAmount = () => {
        setState(prevState => { return { ...prevState, [stageData?.key]: "20000" } })
    }

    const next = async() => {
        await hide('.amountLayout', 300)
        nextStage()
    }


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
                handleAction={next}
                // loader={true}
                formValidate={parseFloat(state[stageData?.key]) >= parseFloat("20000")}
                label="Continuar"
            />
        </AmountLayout>
    )
}

export default AmountComponent


export const DepositSkeleton = ({ showHeader }) => {
    return(
        <ContainerLayout className="appear">
            {
              showHeader && 
                <>
                    <IconClose
                    theme="dark"
                    size={20}
                    /> 
                    <HeaderComponent 
                        prevStage={() => {}}
                        currentStage={0}
                    />
                </>
            }
            <ContentBackground id="mainContent">
                <AmountLayout className="amountLayout">
                    <Title className="fuente skeleton">Escribe la cantidad a depositar</Title>
                    <Content>
                        <IconSkeleton/>
                        <InputDepositForm skeleton/> 
                    </Content>
                    <ControlButton
                        formValidate={false}
                        label="Continuar"
                    />
                </AmountLayout>
            </ContentBackground>
        </ContainerLayout>
    )
}



export const InputAmountSkeleton = styled.div`
    width:150px;
    height:25px;
    background:#bfbfbf;
    margin-left:10px;
    border-radius:4px;
    ${OnlySkeletonAnimation} 
`

export const IconSkeleton = styled.div`
    background: #bfbfbf;
    border-radius: 50%;
    height:50px;
    width:50px;
    ${OnlySkeletonAnimation} 
`

const MinAmount = styled.p`
    color:var(--paragraph_color);
    margin: 0;
    align-self: baseline;
    cursor:pointer;
    justify-self:end;
`

export const Content = styled.section`
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
    color:var(--title1);
    font-size:1.3em;

    &.skeleton{
        color: #bfbfbf;
        background: #bfbfbf;
        border-radius: 4px;
        ${OnlySkeletonAnimation} 
    }
  
`


