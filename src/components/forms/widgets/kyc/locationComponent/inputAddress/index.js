import { InputWrapper } from '../../InputComponent'
import { LOCATION_TYPES } from '../api'
import styled from 'styled-components'
import { SPAN } from 'core/components/atoms'
import {
    InputContainer,
    LabelText
} from '../../styles'
import { useEffect, useState } from 'react'
import validations from '../../validations'
import { ProgressBarComponent } from '../../InputComponent'


export default function InputAddress(props){

   const { stageData, progressBar, handleState:{ state, setState } } = props
   const [ currentInput, setCurrentInput ] = useState(LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NAME)
   const [ addressState, setAddressState ] = useState(getInitialState(LOCATION_TYPES?.STAGES?.ADDRESS))

   // console.log('InputAddress', stageData?.key, state,  props)
   // console.log('addressState', addressState)
 
// selectlist
// validaciones inputs
// status input
// next cta input
// suggested zip code
// enable next button
// mobile support

   const components = {
      streetName:StreetName(InputText),
      district:InputText,
      streetNumber:StreetNumber,
      zipCode:InputText
   }

   const inputOnChange = ({ target }) => {
      if(!validations.address[target?.name])return;
      const [ _value, _status ] = validations.address[target?.name](target?.value, {...stageData[target?.name]});
      target.value = _value
      setAddressState(prevState => ({
         ...prevState,
         [target?.name]:target?.value
      }))
   }

   const onFocus = ({ target }) => {
      setCurrentInput(target?.name)
   }

   useEffect(() => {
      if(addressState[LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NAME]){
         setState(prevState => ({
            ...prevState,
            [stageData?.key]:addressState
         }))
      }
   }, [addressState])

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
                     autoFocus: currentInput === itemData?.key
                     // onKeyDown: setMaxWithActionKey ? setMaxWithActionKeyFn : uxForInput,
                     //inputMode:inputMode, 
                     // autoComplete,
                     //...props.dataForm?.stages[name]?.settings?.props
                  };
                  let RenderComponent = components[stageData[itemKey]?.key] || DefaultRender
                  return <RenderComponent 
                     key={index} 
                     currentKey={stageData[itemKey]?.key}
                     inputProps={inputProps}
                     data={itemData} 
                     {...props}
                     />
               })
            }

            { 
               progressBar &&
               <ProgressBarComponent {...progressBar}/>
            }
         </InputContainer>
         <LabelText className='fuente'>
            {stageData[currentInput]?.settings?.defaultMessage}
         </LabelText>
      </InputWrapper>
   )
}

const STREET_NUMBER_TYPES = {
      NUMBER_ONE:"numberOne",
      NUMBER_TWO:"numberTwo"
}

const StreetNumber = props => {
   const { data, inputProps } = props
   const placeHolder = "_ _"
   const [ streetNumberState, setStreetNumberState ] = useState(getInitialState(STREET_NUMBER_TYPES))

   const onFocus = ({target}) => {
      inputProps?.onFocus && inputProps?.onFocus({target:{name:"streetNumber"}})
   }

   const onChange = ({target}) => {
      setStreetNumberState(prevState => ({
         ...prevState,
         [target?.name]:target?.value
      }))
      // console.log('StreetNumberOnChange', target?.name, target?.value)
   }

   useEffect(() => {
      if(streetNumberState[STREET_NUMBER_TYPES?.NUMBER_ONE] && streetNumberState[STREET_NUMBER_TYPES?.NUMBER_TWO]){
         let value =`${streetNumberState[STREET_NUMBER_TYPES.NUMBER_ONE]} - ${streetNumberState[STREET_NUMBER_TYPES.NUMBER_TWO]}`
         inputProps?.onChange({target:{name:LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NUMBER, value}})
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [streetNumberState])

   // console.log('streetNumberState', streetNumberState[STREET_NUMBER_TYPES?.NUMBER_TWO])
   return(
      <StreetNumberContainer>
         <SPAN size={18}>#</SPAN>
         <input {...inputProps} onFocus={onFocus} onChange={onChange} name={STREET_NUMBER_TYPES?.NUMBER_ONE} placeholder={placeHolder}></input>
         <SPAN size={18}>-</SPAN>
         <input {...inputProps} onFocus={onFocus} onChange={onChange} name={STREET_NUMBER_TYPES?.NUMBER_TWO} placeholder={placeHolder}></input>
      </StreetNumberContainer>
   )
}


function StreetName(AsComponent){
   return function (props) {
      const { handleState:{ state, setState }, stageData, currentKey } = props

      console.log('StreetName', stageData[currentKey]?.selectList, props)
      
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