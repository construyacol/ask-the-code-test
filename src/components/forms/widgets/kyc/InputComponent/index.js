import React, { useEffect } from 'react'
import loadable from '@loadable/component'
import { removeItemTag, debugItemTag } from '../utils'
import styled from 'styled-components'
import MaskDateComponent from '../MaskDateComponent'
import { isSafari } from '../../../../../utils'
import {
    InputContainer,
    LabelText,
    // ButtonModule
  } from '../styles'


const DynamicLoadComponent = loadable(() => import('../../../dynamicLoadComponent'))


const InputComponent = props => {

  const {
    onChange,
    inputStatus,
    defaultValue,
    name,
    message,
    type,
    progressBar,
    // placeholder
    // label
  } = props


  //For metadata omit on main component and assign the property: "name", to the aux component.
  const inputName = name?.includes('meta') ? '' : name

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
      document.querySelector(`[name="${inputName}"]`)?.focus()
      debugItemTag(inputName)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])
  
  const inputProps = {
    className: `${inputStatus ? inputStatus : ''} `,
    type,
    // placeholder,
    onChange,
    defaultValue,
    name:inputName,
    // disabled,
    autoFocus:true,
    // onKeyDown: setMaxWithActionKey ? setMaxWithActionKeyFn : uxForInput,
    // autoComplete,
    ...props.dataForm?.stages[name]?.settings?.props
  };
  
  return (
      <InputContainer
        onSubmit={(e) => {e.preventDefault()}}
        inputStatus={inputStatus}
        className="inputContainer__ inputNumberFont"
        >
        {
          props.AuxComponent && 
          <AuxComponentContainer {...props} />
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
        <LabelText className={`fuente label_text__${name} label___message`}>
          {message}
        </LabelText>
      </InputContainer>
  )
}


export default InputComponent

const AuxComponentContainer = ({ AuxComponent, ...props }) => (
    typeof AuxComponent === "object" ?
      AuxComponent.map((SingleAuxComponent, idItem) => {
        if(!SingleAuxComponent){return null}
        if(typeof SingleAuxComponent === 'string'){return <DynamicLoadComponent key={idItem} component={SingleAuxComponent} {...props}/>}
        return <SingleAuxComponent key={idItem} />;
      }) 
    :
    typeof AuxComponent === "string" &&
      <DynamicLoadComponent component={AuxComponent} {...props}/>
)


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




