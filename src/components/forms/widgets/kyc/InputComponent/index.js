import React, { useEffect } from 'react'
import { removeItemTag, debugItemTag } from '../utils'
import styled from 'styled-components'
import MaskDateComponent from '../MaskDateComponent'
import { isSafari } from '../../../../../utils'
import {
    InputContainer,
    LabelText
} from '../styles'
import RenderAuxComponent from '../../renderAuxComponent'
import useViewport from '../../../../../hooks/useWindowSize'
import { device } from 'const/const'




const InputComponent = props => {

  const {
    onChange,
    inputStatus,
    defaultValue,
    name,
    message,
    type,
    progressBar,
    placeholder,
    className,
    label,
    inputMode = 'text',
    refEl
  } = props

  //For metadata omit on main component and assign the property: "name", to the aux component.
  const inputName = name?.includes('meta') ? '' : name
  const { isMovilViewport } = useViewport()

  const removeItem = (e) => {
    return removeItemTag(e, name, onChange)
  }

  useEffect(()=>{
    if(type === 'select'){
      const inputTarget = name.includes('meta') ? '.prefixInputContainer' : '.inputContainer__'
      const _inputContainer =  document.querySelector(inputTarget)
      _inputContainer?.addEventListener("click", removeItem)
      return () => _inputContainer?.removeEventListener("click", removeItem)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, name])
  
  useEffect(() => {
    if(inputName){
      if(!isMovilViewport) document.querySelector(`[name="${inputName}"]`)?.focus();
      debugItemTag(inputName)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])
  
  const inputProps = {
    className: `${inputStatus ? inputStatus : ''}`,
    type,
    placeholder,
    onChange,
    defaultValue,
    name:inputName,
    ref:refEl,
    // disabled,
    autoFocus:isMovilViewport ? false : true,
    // onKeyDown: setMaxWithActionKey ? setMaxWithActionKeyFn : uxForInput,
    inputMode:inputMode, 
    // autoComplete,
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
        { 
          progressBar &&
          <ProgressBarComponent {...progressBar}/>
        }
        
      </InputContainer>
      <LabelText className={`fuente label_text__${name} label___message`}>
        {message}
      </LabelText>
    </InputWrapper>
  )
} 

export default InputComponent

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




const ProgressBarComponent = ({ start = 0, end = 0, showSteps }) => {
  
  const count = `${start}/${end}`
  return(
    <ProgressBarContainer width={(start*100)/end} count={count}>
    {
      showSteps &&
        <Steps>{count}</Steps>
    }
    </ProgressBarContainer>
  )
}

const Steps = styled.p`
  margin:0;
  position:absolute;
  right:0;
  bottom:-30px;
  font-weight: 500;
  @media ${device.mobile}{
    display: none;
  }
`

const ProgressBarContainer = styled.div`
  background:#e5e5e5;
  height:5px;
  width:100%;
  position:absolute;
  bottom:0;
  z-index:1;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;

  &::before{
    content:'';
    height:100%;
    width:${props => `${props.width}%`};
    left:0;
    background:linear-gradient(90deg,#00d2ff,#3a7bd5);
    position:absolute;
    transition:.25s;
    border-bottom-right-radius: ${props => props.width === 100 ? '7px' : 0};
    border-bottom-left-radius: 7px;
  }
`




