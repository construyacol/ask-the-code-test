import styled from 'styled-components'
import { Title } from './amount'
import { payment_method } from "../../../api/ui/api.json";
import NewItemsLayout from "../../../widgets/items/new-items-layout";
import { CostIdLayout } from './styles'
// import { ButtonForms } from "../../../widgets/buttons/buttons";
import ControlButton from "../../../widgets/buttons/controlButton";


const CostIdComponent = ({ loader, submitForm, nextStage, stageData, handleState:{ state, setState } }) => {
    
    const select_method = (name, code, currency_type, pair_id, cost_id) => {
        setState(prevState => { return { ...prevState, [stageData?.key]: cost_id } })
    }


    return(
        <CostIdLayout className="_costIdLayout">
            <Title className="fuente">Elige el tipo de transacción</Title>
            <Content className="_costIdContent">
            {
                payment_method
                .filter((item) => item.code !== "debit")
                .map((item, index) => {
                return (
                    <NewItemsLayout
                    // setCurrentSelection={select_method}
                    focusedId={`pay-method-item-${index}`}
                    number={index}
                    classNames="mobileView"
                    // handleClick={select_method}
                    actualizarEstado={select_method}
                    actives={state[stageData?.key] === item.cost_id && true}
                    primarySelect={true}
                    {...item}
                    key={item.id}
                    />
                );
            })}
            </Content>

            <ControlButton
                handleAction={submitForm}
                loader={loader}
                formValidate={state[stageData?.key]}
                label="Continuar"
            />
        </CostIdLayout>
    )
}

export default CostIdComponent

const Content = styled.section`
    width: calc(100% - 40px);
    padding: 0 20px;
    display:grid;
    padding: 0 15px;
    width: calc(100% - 30px);
    row-gap: 10px;
    transform:scale(.98);
    grid-template-rows: repeat(auto-fill, minmax(150px, 1fr);
`;


