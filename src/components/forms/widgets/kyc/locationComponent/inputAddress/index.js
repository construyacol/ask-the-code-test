import { InputWrapper } from '../../InputComponent'
import { LOCATION_TYPES } from '../api'
import styled from 'styled-components'
import { SPAN } from 'core/components/atoms'
import {
    InputContainer,
    LabelText
} from '../../styles'
import { useState } from 'react'


export default function InputAddress(props){

   const { stageData } = props
   const [ currentInput, setCurrentInput ] = useState('')
   const [ addressState, setAddressState ] = useState(getInitialState(LOCATION_TYPES?.STAGES?.ADDRESS))

   const components = {
      streetName:StreetName(InputText),
      district:InputText,
      streetNumber:StreetNumber,
      zipCode:InputText
   }

   // console.log('|||||  InputAddress ==> ', props)

   const inputOnChange = ({ target }) => {
      console.log('inputOnChange', target?.name, target?.value)
      console.log('addressState', addressState)
   }

   const onFocus = ({ target }) => {
      setCurrentInput(target?.name)
   }

   return(
      <InputWrapper>
         <InputContainer className="kyc__input--address">
            {
               Object.keys(LOCATION_TYPES?.STAGES?.ADDRESS).map((ITEM_KEY, index) => {
                  const itemKey = LOCATION_TYPES?.STAGES?.ADDRESS[ITEM_KEY]
                  let itemData = stageData[itemKey]
                  if(!itemData)return null;
                  const inputProps = {
                     className: `${itemKey}`,
                     type:itemData?.uiType,
                     placeholder:itemData?.settings?.placeholder,
                     onChange:inputOnChange,
                     onFocus,
                     defaultValue:addressState[itemData?.key],
                     name:itemData?.key,
                     //ref:refEl,
                     // disabled,
                     //autoFocus:isMovilViewport ? false : true,
                     // onKeyDown: setMaxWithActionKey ? setMaxWithActionKeyFn : uxForInput,
                     //inputMode:inputMode, 
                     // autoComplete,
                     //...props.dataForm?.stages[name]?.settings?.props
                  };
                  let RenderComponent = components[stageData[itemKey]?.key] || DefaultRender
                  return <RenderComponent 
                     key={index} 
                     inputProps={inputProps}
                     data={itemData} 
                     {...props}
                     />
               })
            }
         </InputContainer>
         <LabelText className='fuente'>
            {stageData[currentInput]?.settings?.defaultMessage}
         </LabelText>
      </InputWrapper>
   )
}


const getInitialState = payload => {
   if(typeof payload !== 'object')return payload; 
   let state = {}
   for (const key in payload) {
      state = {
         ...state,
         [payload[key]]:""
      }
   }
   return state
}

const StreetNumberContainer = styled.div`
    display: grid;
    grid-template-columns: auto 50px auto 50px;
    align-items: center;
    column-gap: 5px;
    height: 80%;
    input{
      height: 100%;
      width: calc(100% - 20px);
      font-family: "Tomorrow", sans-serif !important;
    }
`

const StreetNumber = props => {
   const { data, inputProps } = props
   const placeHolder = "_ _"
   const onFocus = ({target}) => {
      inputProps?.onFocus({target:{name:"streetNumber"}})
   }
   return(
      <StreetNumberContainer>
         <SPAN size={18}>#</SPAN>
         <input {...inputProps} onFocus={onFocus} name="numberOne" placeholder={placeHolder}></input>
         <SPAN size={18}>-</SPAN>
         <input {...inputProps} onFocus={onFocus} name="numberTwo" placeholder={placeHolder}></input>
      </StreetNumberContainer>
   )
}


 function StreetName(AsComponent){
   return function (props) {
      return <AsComponent {...props}/>
   };
}


const InputText = props => {
   const { data, inputProps } = props
   return(
      <input {...inputProps}></input>
   )
}

const DefaultRender = props => {
   const { data } = props
   return <p>{data?.settings?.placeholder} -  </p>
}

