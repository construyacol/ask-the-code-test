import styled from 'styled-components'
import MaskDateComponent from 'components/forms/widgets/kyc/MaskDateComponent'
import { isSafari } from 'utils'
import RenderAuxComponent from 'components/forms/widgets/renderAuxComponent'
import useViewport from 'hooks/useViewport'


const InputComponent = props => {

  const {
    onChange,
    inputStatus,
    defaultValue,
    name,
    message,
    type,
    placeholder,
    className,
    label,
    inputMode = 'text',
    refEl,
    disabled = false
  } = props

  const { isMobile } = useViewport()

  
  const inputProps = {
    className: `${inputStatus ? inputStatus : ''}`,
    type,
    placeholder,
    onChange,
    defaultValue,
    name,
    ref:refEl,
    autoFocus:isMobile ? false : true,
    inputMode:inputMode, 
    disabled,
    ...props.dataForm?.stages[name]?.settings?.props
  };


  return (
    <InputWrapper className={`${label ? 'withLabel' : ''} ${className || ''}`}>
      {
        label && 
        <p className={`fuente ${label ? '_inputLabelP' : ''}`}>{label}</p>
      }
      <InputContainer
        onSubmit={(e) => {e.preventDefault()}}
        inputStatus={inputStatus}
        className="inputContainer__ inputNumberFont"
        >
        {
          props.AuxComponent && 
          <RenderAuxComponent {...props} />
        }
        {
          type === 'date' && isSafari() !== 'is_safari' ?
          <MaskDateComponent {...inputProps}/>
          :
          <input {...inputProps} />
        }
      </InputContainer>
      <LabelText className={`fuente label_text__${name} label___message`}>
        {message}
      </LabelText>
    </InputWrapper>
  )
} 

export default InputComponent



const LabelText = styled.p`
  margin: 0;
  font-size: 15px;
  color: var(--paragraph_color);

  &.skeleton{
    background:#d1d4d7;
    width: fit-content;
    height: fit-content;
    color: transparent;
    border-radius: 4px;
  }

`

export const InputWrapper = styled.div`
  display:grid;
  grid-template-rows:auto 40px;

  &.input__fit .inputContainer__{
    height: 45px;
    max-width: 700px;
  }

  &.withLabel{
    grid-template-rows:auto auto;
    row-gap: 10px;
    ._inputLabelP{
      margin:0;
      color:var(--paragraph_color);
    }
  }

  &.skeleton{
    p{
      color: transparent;
      border-radius: 4px;
      background: var(--skeleton_color);
      width: fit-content;
    }
  }

  &.rejected{
    ${LabelText}{
      color:red;
    }
  }

`

const InputContainer = styled.form`
  margin:15px 0;
  width: 100%;
  height: 63px;
  border: 1px solid ${props => props.inputStatus === 'success' ? "#00d2ff" : 'rgba(80,102,122,.38)'};
  border-radius: 6px;
  display: grid;
  position: relative;
  background: white;
  padding: 1px;
  transition:.01s;
  
  &._progress_bar{
    grid-template-rows:1fr auto;
  }

  input{
    border-color: transparent;
    outline: none;
    padding: 0 10px;
    font-size: 19px;
    width:calc(97% - 20px);
    &::-webkit-input-placeholder { 
      color:var(--placeholder);
      font-family: "Raleway", sans-serif !important;
    }
    &.success{
      color: #3a7bd5;
    }
  }

  input[name="birthday"].date_success{
    padding: 0 25px 0 10px;
    width: calc(97% - 35px);
    transition: .15s;
  }

  &.skeleton {
    align-items: center;
    input{
      background:#d1d4d7;
      width: fit-content;
      height: 17px;
      color: transparent;
      border-radius: 4px;
      justify-align:center;
      margin-left:20px;
    }
  }
`



