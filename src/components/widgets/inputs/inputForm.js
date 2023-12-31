import React, { useEffect } from "react";
import InputValidate from "hooks/inputValidate";
import styled, { keyframes } from "styled-components";
import SkeletonAnimation from "../loaders/skeleton"; 
import useViewport from '../../../hooks/useWindowSize'

const InputForm = (props) => {

  const {
    type,
    placeholder,
    name, 
    handleStatus,
    className,
    // errorState,
    // resetErrorState,
    disabled,
    SuffixComponent,
    state,
    skeleton,
    handleChange = () => null,
    readOnly = false,
    value = "",
    isControlled,
    autoFocus,
    // customError,
    setMaxWithActionKey,
    autoComplete = "off",
    AuxComponent,
    inputMode
  } = props;

  const [inputState, setInputState, changeState, customError] = InputValidate(props);
  const { isMovilViewport } = useViewport()
  // const [ Icon, setIcon ] = useState(GetIcon(name, inputState))
  // console.log('|||||||||||||||||||| inputState:', inputState)

  const validate = (e) => {
    // if(errorState && resetErrorState){resetErrorState(null)}
    e.persist && e.persist();
    setInputState(name, e);
    handleChange(name, e.target.value, inputState);
  };

  useEffect(() => {
    // setIcon(GetIcon(name, inputState))
    if (handleStatus) {
      handleStatus(inputState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputState]);

  useEffect(() => {
    // console.log('|||||||||||||| InputForm', state)
    state && changeState(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    // if (customError) {
    //   changeState("bad");
    // } else {
    //   validate({ target: { value } }, true);
    // }
    validate({ target: { value } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const subfixId = "set-max-available";

  const setMaxWithActionKeyFn = (e) => {
    uxForInput(e);
    if (e.keyCode === 77) {
      e.preventDefault();
      const toClickElement = document.getElementById(subfixId);
      if (toClickElement) {
        document.getElementsByName(name)[0].blur();
        toClickElement.click();
      }
    }
  };

  const uxForInput = (e) => {
    if (e.keyCode === 8 && e.currentTarget.value === "") {
      e.currentTarget.blur();
      e.stopPropagation();
      return false;
    }
  };

  const inputProps = {
    className: `inputElement ${name} ${isMovilViewport ? "movil" : ""}`,
    type,
    readOnly,
    placeholder,
    onChange: (e) => validate(e),
    name,
    disabled,
    autoFocus:isMovilViewport ? false : autoFocus,
    onKeyDown: setMaxWithActionKey ? setMaxWithActionKeyFn : uxForInput,
    autoComplete,
    inputMode:inputMode || "text"
  };

  if (skeleton) {
    return (
      <InputLayout className={`skeleton ${className || ''}`}>
        <ContainerInputComponent>
          <p className="skeleton"></p>
          <InputContainer className="skeleton" />
        </ContainerInputComponent>
      </InputLayout>
    );
  }

  if (isControlled) {
    inputProps.value = value;
  }

  const Label = props.label

  return (
    <InputLayout className={`${className || ''}`}>
      <ContainerInputComponent>
        <p className="labelText fuente" style={{ display: !props.label ? "none" : "initial" }} >
          {
            typeof props.label === 'function' ?
            <Label/>
            :
            Label
          }
        </p>
        <InputContainer className={`${inputState} input__withdraw--amount`}>
          <input {...inputProps} />
        </InputContainer>
        {SuffixComponent && (
          <SuffixComponentContainer>
            <SuffixComponent id={subfixId} />
          </SuffixComponentContainer>
        )}
      {AuxComponent && <AuxComponentContainer AuxComponent={AuxComponent} />}
      {(customError || props.customError) && <ErrorTexts className="fuente2">{customError || props.customError}</ErrorTexts>}
      </ContainerInputComponent>
    </InputLayout>
  );
};

const AuxComponentContainer = ({ AuxComponent }) =>
  typeof AuxComponent === "function" ? (
    <AuxComponent />
  ) : (
    typeof AuxComponent === "object" &&
    AuxComponent.map((SingleAuxComponent, idItem) => {
      return <SingleAuxComponent key={idItem} />;
    })
  );

const ErrorTexts = styled.div`
  opacity: 0.7;
  color: red;
  font-size: 14px;
  margin-top: 10px;
  position: absolute;
  left: 0;
  bottom: -25px;
`;


export const isReadyAnim = keyframes`
    0%{
      border: 1px solid rgb(0, 210, 255);
    }
    40%{
      border: 1px solid #50667a61;
    }
    70%{
      border: 1px solid rgb(0, 210, 255);
    }
    90%{
      border: 1px solid #50667a61;
    }
    100%{
    }
`;



const InputLayout = styled(SkeletonAnimation)`
  .superImposed {
    position: relative;
    z-index: 2;
  }

  &.hide{
    opacity: 0;
    pointer-events: none;
  }

  &.isReady .input__withdraw--amount{
    animation-name: ${isReadyAnim};
    animation-duration: 1.5s;
    animation-iteration-count: forwards;
  }

  &.withdrawCripto.skeleton{
    max-width: calc(680px);
    width: 100%;
  }

`;

const SuffixComponentContainer = styled.div`
  position: absolute;
  right: 15px;
  height: 47px;
  bottom: 0;
  display: grid;
  align-items: center;
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 45px;
  border: 1px solid #50667a61;
  border-radius: 6px;
  overflow: hidden;
  display: grid;
  position: relative;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  background: white;

  .inputElement, .inputElement3 {
    color: var(--paragraph_color);
    width: calc(100% - 20px);
    height: 100%;
    background: 0 0;
    padding: 0 10px;
    border: 1px solid transparent;
    outline: 0;
    font-size: 16px;
    -webkit-transition: 0.5s;
    transition: 0.5s;
  }


  .inputElement::-webkit-input-placeholder{
    color: var(--paragraph_color);
  }

  .movil {
    display: block;
    margin-left: 10px;
    max-width: 250px;
    overflow: hidden;
    padding-left: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.good {
    border: 1px solid #00d2ff;
  }

  &.good input {
    color: #3a7bd5;
  }

  .amount,
  .spend-amount,
  .bought-amount {
    font-family: "Tomorrow", sans-serif;
  }

  &.skeleton::before {
    content: "";
    background: var(--skeleton_color); ;
    width: 100%;
    border-radius: 3px;
    height: 15px;
    max-width: 150px;
    align-self: center;
    left: 15px;
    position: absolute;
  }
`;

export const ContainerInputComponent = styled.div`
  min-height:100px;
  height:auto;
  width: 100%;
  position: relative;
  display: grid;
  align-items: center;

  p.skeleton {
    background: var(--skeleton_color); 
    width: 100%;
    height: 15px;
    max-width: 400px;
    border-radius: 3px;
  }
`;

// const GetIcon = (itemName, itemStatus) => {
//
//   let value
//   let color = itemStatus === 'bad' ? 'red' : itemStatus === 'good' ? 'green' : '#50667a'
//
//   switch (itemName) {
//     case 'email':
//       value = Mail
//       return{
//         value,
//         color
//       }
//     case 'password':
//     case 'password2':
//       value = Auth
//       return{
//         value,
//         color
//       }
//     default:
//   }
// }

export default InputForm;
