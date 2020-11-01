import React, { useEffect } from 'react'
import InputValidate from '../../hooks/inputValidate'
import styled from 'styled-components'
import SkeletonAnimation from '../loaders/skeleton'



const InputForm = (props) => {

  const {
    type,
    placeholder,
    name,
    handleStatus,
    errorState,
    resetErrorState,
    disabled,
    SuffixComponent,
    state,
    skeleton,
    handleChange = () => null,
    readOnly = false,
    value = '',
    isControlled,
    autoFocus,
    customError,
    setMaxWithActionKey,
    autoComplete = "off",
    AuxComponent
  } = props

  if (skeleton) {
    return (
      <InputLayout className="skeleton">
        <ContainerInputComponent>
          <p className="skeleton"></p>
          <InputContainer className="skeleton" />
        </ContainerInputComponent>
      </InputLayout>
    )
  }

  const [inputState, setInputState, changeState] = InputValidate(state)
  // const [ Icon, setIcon ] = useState(GetIcon(name, inputState))

  const validate = (e, specialArg) => {
    // if(errorState && resetErrorState){resetErrorState(null)}
    e.persist && e.persist()
    setInputState(name, e)
    handleChange(name, e.target.value, changeState, specialArg)
  }

  useEffect(() => {
    // setIcon(GetIcon(name, inputState))
    if (handleStatus) {
      handleStatus(inputState)
    }
  }, [inputState])

  useEffect(() => {
    state && changeState(state)
  }, [state])

  useEffect(() => {
    if(customError) {
      changeState('bad')
    } else {
      validate({ target: { value } }, true)
    }
  }, [customError, value])

  let movil = window.innerWidth < 768
  const subfixId = 'set-max-available'

  const setMaxWithActionKeyFn = (e) => {
    uxForInput(e)
    if (e.keyCode === 77) {
      e.preventDefault()
      const toClickElement = document.getElementById(subfixId)
      if(toClickElement) {
        document.getElementsByName(name)[0].blur()
        toClickElement.click()
      }
    }
  }

  const uxForInput = (e) => {
    if(e.keyCode === 8 && e.currentTarget.value === '') {
      e.currentTarget.blur()
      e.stopPropagation()
      return false
    }
  }

  const inputProps = {
    className: `inputElement ${name} ${movil ? 'movil' : ''}`,
    type,
    readOnly,
    placeholder,
    onChange: (e) => validate(e),
    name,
    disabled,
    autoFocus,
    onKeyDown: setMaxWithActionKey ? setMaxWithActionKeyFn : uxForInput,
    autoComplete
  }

  if (isControlled) {
    inputProps.value = value
  }

  return (
    <InputLayout>
      <ContainerInputComponent>
        <p className="labelText fuente" style={{ display: !props.label ? 'none' : 'initial' }}>{props.label}</p>
        <InputContainer className={`${inputState}`}>
          <input {...inputProps}/>
        </InputContainer>
        {
          SuffixComponent &&
          <SuffixComponentContainer>
            <SuffixComponent id={subfixId} />
          </SuffixComponentContainer>
        }

        {
          AuxComponent &&
          <AuxComponent/>
        }
      </ContainerInputComponent>
      {customError && (
        <ErrorText className="fuente">{customError.text}</ErrorText>
      )}
    </InputLayout>

  )
}

const ErrorText = styled.div`
  opacity: 0.7;
  color: red;
  font-size: 14px;
  margin-top: 10px;
`

const InputLayout = styled(SkeletonAnimation)`

`

const SuffixComponentContainer = styled.div`
  position: absolute;
  right: 15px;
  height: 47px;
  bottom: 0;
  display: grid;
  align-items: center;
`

export const InputContainer = styled.div`
  width: 100%;
  height: 45px;
  border: 1px solid #50667a61;
  border-radius: 6px;
  overflow: hidden;
  display: grid;
  position: relative;
  -webkit-transition: .5s;
  transition: .5s;
  background: white;

  .movil{
    display: block;
    margin-left: 10px;
    max-width: 210px;
    overflow: hidden;
    padding-left: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.good{
    border: 1px solid #00D2FF;
  }

  &.good input {
    color: #3A7BD5;
  }

  .amount, .buy-amount, .sell-amount{
    font-family: 'Tomorrow', sans-serif;
  }

  &.skeleton::before{
    content:'';
    background: #bfbfbf;
    width: 100%;
    border-radius: 3px;
    height: 15px;
    max-width: 150px;
    align-self: center;
    left: 15px;
    position: absolute;
  }
`

export const ContainerInputComponent = styled.div`
  height: 100px;
  width: 100%;
  position: relative;
  display: grid;
  align-items: center;

  p.skeleton{
    background: #bfbfbf;
    width: 100%;
    height: 15px;
    max-width: 400px;
    border-radius: 3px;
  }
`


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



export default InputForm
