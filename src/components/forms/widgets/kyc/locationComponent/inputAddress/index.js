import { InputWrapper } from '../../InputComponent'
import { LOCATION_TYPES } from '../api'
import styled from 'styled-components'
import { SPAN } from 'core/components/atoms'
import {
    InputContainer,
    LabelText,
   //  StickyGroup
} from '../../styles'
import { useEffect, useState } from 'react'
import validations from '../../validations'
import { ProgressBarComponent } from '../../InputComponent'
import RenderAuxComponent from '../../../renderAuxComponent'
import { device } from 'const/const'


export default function InputAddress(props){

   const { stageData, progressBar, handleState:{ setState }, setSelectListConfig } = props
   const [ currentInput, setCurrentInput ] = useState(LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NAME)
   const [ addressState, setAddressState ] = useState(getInitialState(LOCATION_TYPES?.STAGES?.ADDRESS))

   const inputOnChange = ({ target }) => {
      if(!validations.address[currentInput])return;
      const [ _value ] = validations.address[currentInput](target?.value, {...stageData[currentInput]});
      // console.log('inputOnChange', _value)
      target.value = _value
      setAddressState(prevState => ({
         ...prevState,
         [currentInput]:target?.value
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
      props.onChange({target:{value:addressState}})
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [addressState])

   useEffect(() => {
      setSelectListConfig({
         list:stageData[currentInput]?.selectList,
         name:currentInput,
         state:addressState,
         handleAction:inputOnChange,
         exactResult:false
      })
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentInput, addressState])

   return( 
      <InputWrapper>
         <InputContainer inputStatus={props.stageStatus || ''} className="kyc__input--address">
            {
               props.AuxComponent && 
               <RenderAuxComponent {...props} />
            }
            {
               Object.keys(LOCATION_TYPES?.STAGES?.ADDRESS).map((ITEM_KEY, index) => {
                  const itemKey = LOCATION_TYPES?.STAGES?.ADDRESS[ITEM_KEY]
                  let itemData = stageData[itemKey]
                  if(!itemData)return null;
                  const isControlled = (itemData?.isControlled || itemData?.selectList) ? true : false
                  const inputProps = {
                     className: `${itemKey}`,
                     type:itemData?.uiType,
                     placeholder:itemData?.settings?.placeholder,
                     onChange:inputOnChange,
                     onFocus,
                     defaultValue:addressState[itemData?.key],
                     name:itemData?.key,
                     autoFocus: currentInput === itemData?.key
                  };
                  let RenderComponent = RENDER_COMPONENTS[stageData[itemKey]?.key] || DefaultRender
                  return <RenderComponent 
                     key={index} 
                     currentKey={stageData[itemKey]?.key}
                     inputProps={inputProps}
                     isControlled={isControlled}
                     data={itemData} 
                     localState={addressState}
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
// const { data } = props
   const placeholder = "_ _"
   const [ streetNumberState, setStreetNumberState ] = useState(getInitialState(STREET_NUMBER_TYPES))

   const onFocus = ({target}) => {
      props?.inputProps?.onFocus && props?.inputProps?.onFocus({target:{name:"streetNumber"}})
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
         props.inputProps?.onChange({target:{name:LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NUMBER, value}})
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [streetNumberState])

   let inputProps = {
      ...props.inputProps,
      onChange,
      onFocus,
      placeholder
   }

   return(
      <StreetNumberContainer>
         <SPAN size={18}>#</SPAN>
         <input {...inputProps} name={STREET_NUMBER_TYPES?.NUMBER_ONE}></input>
         <SPAN size={18}>-</SPAN>
         <input {...inputProps} name={STREET_NUMBER_TYPES?.NUMBER_TWO}></input>
      </StreetNumberContainer>
   )
}


const StreetName = props => {
  return <InputText {...props}/>
}


const InputText = props => {
   const { isControlled, localState, currentKey } = props
   let inputProps = {}
   if(isControlled){
      inputProps = {
         ...props.inputProps,
         value:localState[currentKey]
      }
   }else{
      inputProps = props.inputProps
   }
   return(
      <input {...inputProps}></input>
   )
}

const DefaultRender = props => {
   const { data } = props
   return <p>{data?.settings?.placeholder} -  </p>
}


const RENDER_COMPONENTS = {
   [LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NAME]:StreetName,
   [LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NUMBER]:StreetNumber,
   [LOCATION_TYPES?.STAGES?.ADDRESS?.DISTRICT]:InputText,
   // [LOCATION_TYPES?.STAGES?.ADDRESS?.ZIP_CODE]:InputText
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
    grid-template-columns: auto 70px auto 70px;
    align-items: center;
    column-gap: 5px;
    height: 80%;
    input{
      height: 100%;
      width: calc(100% - 20px);
      font-family: "Tomorrow", sans-serif !important;
    }

    @media ${device.mobile} {
      grid-template-columns: auto 45px auto 45px;
      column-gap: 3px;
      input{
         font-size: 13px;
      }
    }
`