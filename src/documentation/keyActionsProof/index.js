import React, { useState } from "react";
import styled from "styled-components";
import OtherModalLayout from "../widgets/modal/otherModalLayout";
import useKeyActionAsClick from "../../hooks/useKeyActionAsClick";
import useNavigationKeyActions, {
  useItemsInteractions,
} from "../../hooks/useNavigationKeyActions";
import { useActions } from "../../hooks/useActions";
import { InputKeyActionHandler } from "../widgets/accountList/styles";
// import TestingComponent from './doc'

const list = new Array(10).fill({ name: "Test " });

const KeyActionsProofComponent = (props) => {
  /**
   * a partir de varios commits la accion close modal la hereda los contenedores de modales
   * Ver OtherModalLayout, y props. Al tener ambos 27[esc] como keyCode solo tomara el del padre o orden superior,
   * Ya agregue una validacion a OtherModalLayout para que puedas usarlo en esta prueba
   *
   */
  const exitId = useKeyActionAsClick(
    true,
    "close-modal",
    27,
    true,
    "onkeyup",
    true
  );
  const backId = useKeyActionAsClick(
    true,
    "backAsClick",
    8,
    true,
    "onkeyup",
    true
  );
  const [step, setStep] = useState(1);
  const actions = useActions();

  const salir = (props) => {
    actions.renderModal(null);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const backStep = () => {
    setStep(step - 1);
  };

  return (
    <OtherModalLayout>
      <Container>
        <Exit id={exitId} onClick={salir}>
          Salir
        </Exit>

        <Back id={backId} onClick={backStep}>
          Volver
        </Back>
        <StepView step={step} nextStep={nextStep} />
      </Container>
    </OtherModalLayout>
  );
};

export default KeyActionsProofComponent;

const Button = styled.button`
  position: absolute;
`;

const Exit = styled(Button)`
  top: 20px;
  right: 20px;
`;

const Back = styled(Button)`
  top: 20px;
  left: 20px;
`;

const StepView = ({ step, nextStep }) => {
  const stepId = useKeyActionAsClick(
    true,
    "next-step",
    13,
    true,
    "onkeyup",
    true
  );

  const [setCurrentSelection] = useNavigationKeyActions({
    items: list,
    loader: false,
    /**
     * a partir de varios commits atras, className cambia a uniqueIdForElement,
     * elimine la opcion de default
     * no es necesario desde varios commits atras ya que useItemsInteractions
     * tiene la opcion de seleccionar con setFocus, y es mas controlable
     */
    uniqueIdForElement: "test-item-",
    modalRestriction: false,
    default: 0,
    next: 40,
    prev: 38,
  });

  return (
    <Content>
      <p>{`Paso ${step}`}</p>
      {step !== 2 ? (
        <p>Contenido {step}</p>
      ) : (
        <List>
          {list.map((item, index) => {
            return (
              <Item
                key={index}
                number={index}
                setCurrentSelection={setCurrentSelection}
                focusedId={`test-item-${index}`}
                {...item}
              ></Item>
            );
          })}
        </List>
      )}
      <Cta id={stepId} onClick={nextStep}>
        Next step {step + 1}
      </Cta>
    </Content>
  );
};

const Item = (props) => {
  const handleAction = () => {
    return alert(`clicked in ${props.number}`);
  };

  const [isSelected, setFocus] = useItemsInteractions(
    props,
    { suprKeyAction: () => false, enterKeyAction: () => false },
    true
  );

  return (
    <ItemContainer
      className={`${isSelected ? "isSelected" : ""}`}
      onClick={handleAction}
    >
      {/**
       * aqui necesitamos un handler, un componente helper para actuar como puntero en este caso esta: InputKeyActionHandler
       * y reservamos el id (focusedId) para este elemento
       */}
      <InputKeyActionHandler
        aria-label="itemFromList"
        name="itemFromList"
        autoComplete="off"
        id={props.focusedId}
      />
      <p>{`${props.number}: ${props.name} ${props.number}`}</p>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  border: solid 1px transparent;
  cursor: pointer;

  &:hover,
  &.isSelected {
    color: red;
    border: solid 1px red;
  }
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const Cta = styled.button``;

const Content = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr 100px;
  width: 100%;
  height: 100%;
  p {
    text-align: center;
  }
`;

const Container = styled.section`
  width: 550px;
  height: 750px;
  background: white;
  border-radius: 6px;
  position: relative;
`;
