import React, { Fragment, Component } from 'react'
import './inputStyles.css'
import { number_format } from '../../../services'
import { SimpleLoader } from '../loaders'
import { BigNumber } from "bignumber.js"
import IconSwitch from '../icons/iconSwitch'

export const InputForm = (props) => {
const { clase, disabled, address, focusAction, status, addressVerify, unFocusAction, state_item } = props
  return(
    <div className={`${!clase ? 'containerInputComponent' : clase}`}>
      <p className="labelText fuente" style={{display:!props.label ? 'none' : 'initial' }}>{props.label}</p>
      <div className={`inputContainer ${props.active ? 'inputActivado' : '' } ${state_item}`}>
        <input
          className={`inputElement ${props.active ? 'inputActivado' : '' } ${addressVerify}`}
          type={props.type}
          placeholder={props.placeholder}
          onChange={props.actualizarEstado}
          onFocus={focusAction}
          onBlur={unFocusAction}
          name={props.name}
          defaultValue={props.value}
          onKeyPress={props.name === "account_number" ? props.handleKeyPress : null}
          disabled={disabled}
        />
        { address &&
          <div className="contIconAddress">
            <IconSwitch icon={addressVerify === 'Verify' ? 'verify' : 'wallet'} color={addressVerify === 'Verify' ? '#4caf50' : 'gray'} size={25}/>
          </div>
        }
      </div>
      {
        (props.type === "number" || props.type ===  "password") &&
          <p className="statusInput">{status}</p>
      }
    </div>
  )
}


export const InputFormAuth = (props) => {

const {
  clase,
  label,
  active,
  type,
  placeholder,
  actualizarEstado,
  name,
  value,
  handleKeyPress,
  status,
  verifying,
  error
  } = props

// console.log(`${}`)

// <SimpleLoader/>

  return(
    <div className={`${!clase ? 'containerInputComponent AuthInputComp' : clase}`}>
      <p className="labelText fuente" style={{display:!label ? 'none' : 'initial' }}>{label}</p>
      <div
        // className={`inputContainer ${active ? 'inputActivado' : '' }`}
        className="inputContainer inputAuths"
        style={{border:(verifying && !active) ? '1px solid #039aff' : active ? '1px solid #59b200' : error ? '1px solid red' :'1px solid #50667a61'}}
        >
        {
          !verifying ?
          <input
            className={`inputElement`}
            style={{color:active ? '#59b200' : 'gray' }}
            type={type}
            placeholder={placeholder}
            onChange={actualizarEstado}
            name={name}
            defaultValue={value}
            onKeyPress={name === "account_number" ? handleKeyPress : null}
          />
          :
          <div className="AuthLoader">
            <SimpleLoader/>
          </div>
        }

      </div>
          <p
            className="statusInput"
            style={{color:(verifying && !active) ? '#039aff' : active ? '#59b200' : error ? 'red' :'#50667a61'}}
            >
              <i className="fas fa-check"
                style={{display: active ? 'initial' :'none'}}
                ></i>
                {status}
            </p>
    </div>
  )
}



export class ReadReceiveCoin extends Component{

state = {
  total_value:""
}

componentWillReceiveProps({primary_value}){
  this.total_value(primary_value)
}

total_value = async(value) =>{

  let total_value = value && await this.props.get_total_value(value)
  if(total_value === this.state.total_value || !total_value){return false}
  this.setState({
    total_value: total_value
  })
}

getOtherPairsSend = () =>{
  this.props.getOtherPairs(false)
}

render(){

const { clase,
  coin,
  secondary_value,
  placeholder,
  getMaxAvailable,
  puta,
  secondary_coin,
  solo_lectura,
  active,
  actualizarEstado,
  name,
  account_type,
  getOtherPairs,
  loader,
  primary_value
} = this.props

const {
total_value
} = this.state

// console.log('estoy desde el input', secondary_coin)

  return(
    <Fragment>
      {/* <div className={`${!clase ? 'containerInputComponent' : clase}`}> */}
        <div className={`inputContainer ${active ? 'inputActivado' : '' }`}>

        {  !secondary_value ?
          <div className="ReadReceiveCoinLoader">
             <SimpleLoader/>
          </div>
          :
         <Fragment>
          <div className="coinBalance2 fuente2" onClick={this.getOtherPairsSend} >
            <div className="coinB2">
              <i className="fas fa-angle-down"></i>
              <p>{secondary_coin}</p>
              {
                secondary_coin &&
                <img src={require(`../../../assets/coins/${secondary_coin}.png`)} alt="" width="30"/>
              }
            </div>
          </div>
          {
            !solo_lectura ?
            <input
              className={`inputElement ${active ? 'inputActivado' : '' }`}
              type="number"
              placeholder={placeholder}
              onChange={actualizarEstado}
              name={name}
              value={primary_value}
            />
            :
            <p className="read_only" style={{color:active ? '#3A7BD5' : 'gray'}}> {total_value} {total_value ? secondary_coin : '0'} </p>
          }
          </Fragment>
        }
        </div>
        {
          !secondary_value ?
          <Fragment/>
             :
            <p className="statusInput2 fuente2">1 {coin} = {!secondary_value ? 'Sin Cotización' : secondary_value} {secondary_coin}</p>
        }

    </Fragment>
  )
  }
}







export const InputFormCoin = (props) => {
const { clase,
  saldoDisponible,
  coin,
  value,
  placeholder,
  getMaxAvailable,
  puta
} = props


  return(
    <Fragment>
      {/* <div className={`${!clase ? 'containerInputComponent' : clase}`}> */}
      <div>
        <p className="labelText fuente" style={{display:!props.label ? 'none' : 'initial' }}>{props.label}</p>
        <div className={`inputContainer ${props.active ? 'inputActivado' : '' }`}>

          <div className="coinBalance fuente2" onClick={getMaxAvailable} id={saldoDisponible}>
              <p id={saldoDisponible}>{saldoDisponible>0 ? `Disponible: ${saldoDisponible}`: '0'} {coin}</p>
            {
              coin &&
              <img src={require(`../../../assets/coins/${coin}.png`)} alt="" width="30"/>
            }
          </div>

          <input
            className={`inputElement ${props.active ? 'inputActivado' : '' }`}
            type="number"
            placeholder={placeholder}
            onChange={props.actualizarEstado}
            name={props.name}
            value={value}
            onKeyPress={props.name === "account_number" ? props.handleKeyPress : null}
          />
        </div>

      </div>
    </Fragment>
  )
}


export class InputDepositForm extends Component{

  state={
    finalValue:number_format(this.props.value)
  }
  componentWillReceiveProps(props){
    // console.log('InputDepositForm / componentWillReceiveProps -', isNaN(props.value))
    const {
      value
    } = props

    this.setState({
      finalValue:value ? number_format(value) : 'Escribe la cantidad'
    })
  }

render(){
  const { placeholder,
    actualizar,
    handleKeyPress,
    value,
    name,
    status,
    actives,
    service } = this.props

    const {
      finalValue
    } = this.state



    return(
        <div className="containerInputComponent putitass">
            <p className="signoPesos fuente2" style={{fontSize:(finalValue.length<10) ? '90px' : (finalValue.length<15) ? '60px' : '40px'}}>
            {`$ ${finalValue}`}
            </p>
            <input
              // className={`inputElement2 ${actives ? 'inputActivado' : '' }`}
              className={`inputElement2 inputDeposit`}
              type="number"
              placeholder={placeholder}
              onChange={actualizar}
              name={name}
              defaultValue={value}
              onKeyPress={handleKeyPress}
            />
              {/* <p className="statusInputs">{status}</p> */}
        </div>
    )
  }
}



export const InputKycBasic = (props) =>{

  const {
    kyc,
    step,
    update,
    message,
    handleSubmit,
    colorMessage,
    names,
    lastnames,
    birthDate,
    id,
    phone,
    city,
    address,
    activity
  } = props

  // console.log('BUTTONSS:::', names)

  return(
    <div id="kycPrime" className="containerInputComponent2">

      <div className="inputLabelsCont">
        <div className="InputCarous" style={{ top: `-${(step-1)*40}px` }}>
          {
            kyc.map(item=>{
              return <p key={item.id} className="labelText2 fuente" >{item.label}</p>
            })
          }
        </div>
      </div>

      <div className={`inputContainer3 ${props.active ? 'inputActivado' : '' }`}>

        {
          kyc.map(item=>{
                return  step === item.id &&
                        <form onSubmit={handleSubmit} key={item.id}>

                          <input
                           key={item.id}
                           className={`inputElement3 ${props.active ? 'inputActivado' : '' }`}
                           // type={props.type}
                           placeholder={item.placeholder}
                           onChange={update}
                           name={item.name}
                           defaultValue={
                             step === 1 ? names :
                             step === 2 ? lastnames :
                             step === 3 ? birthDate :
                             step === 4 ? id :
                             step === 5 ? phone :
                             step === 6 ? city :
                             step === 7 ? address :
                             ''
                             }
                           // onKeyPress={props.name === "account_number" ? props.handleKeyPress : null}
                         />

                        </form>
          })
        }

        <div className="InputProgressBar" >
          <div className="InputProgressed" style={{ width: step<2 ? 0 : `${(((step*100))/kyc.length)}%` }} ></div>
        </div>

        <i className="fas fa-arrow-right arrowcito" onClick={handleSubmit} ></i>

      </div>
      <div className="InputContainerT" >
        <p className="fuente Inputmsg" style={{ color: `${colorMessage}` }} >{message}</p>
        <p className="fuente2 InputStep" >{step}/{kyc.length}</p>
      </div>
    </div>
  )

}

export default InputForm
