import React, { useState, useEffect } from 'react'
import InputValidate  from '../../hooks/inputValidate'
import styled from 'styled-components'



const InputForm = (props) => {

  const {
    type,
    placeholder,
    name,
    handleStatus,
    errorState,
    resetErrorState,
    disabled
  } = props

  const [ inputStatus, setInputStatus ] = InputValidate()
  // const [ Icon, setIcon ] = useState(GetIcon(name, inputStatus))

  const validate = (e) => {
    // if(errorState && resetErrorState){resetErrorState(null)}
    e.persist()
    setInputStatus(name, e)
  }

  useEffect(()=>{
    // setIcon(GetIcon(name, inputStatus))
    if(handleStatus){
      handleStatus(inputStatus)
    }
  }, [inputStatus])


  return(
      <InputLayout>
      <div className="IconPrefix">
        {/* {
          Icon &&
          <Icon.value size={22} color={errorState ? 'red' : Icon.color}/>
        } */}
      </div>

      <ContainerInputComponent>
        <p className="labelText fuente" style={{display:!props.label ? 'none' : 'initial' }}>{props.label}</p>
        {/* <div className={`inputContainer ${errorState ? 'bad' : inputStatus} `}> */}
          <InputContainer className={`${inputStatus}`}>
          <input
            className={`inputElement`}
            type={type}
            placeholder={placeholder}
            onChange={validate}
            name={name}
            disabled={disabled}
          />
        </InputContainer>
        {/* </div> */}
    </ContainerInputComponent>

    </InputLayout>

  )
}


const InputLayout = styled.div`

`

const InputContainer = styled.div`
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
  &.good{
    border: 1px solid #00D2FF;
  }

  &.good input {
    color: green;
  }
`

const ContainerInputComponent = styled.div`
  height: 100px;
  width: 100%;
  position: relative;
  display: grid;
  align-items: center;
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
