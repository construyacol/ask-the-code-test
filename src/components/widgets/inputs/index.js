import React, { Fragment, Component } from 'react'
import './inputStyles.css'
import { number_format } from '../../../services'
import { SimpleLoader } from '../loaders'
import { BigNumber } from "bignumber.js"
import IconSwitch from '../icons/iconSwitch'
import Environtment from '../../../environment'

const { CountryUrl } = Environtment

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



export const InputCountryPrefix = (props) =>{

  const {
    toggleSection,
    search_result,
    open,
    update,
    clean_search_result,
    _onFocus
  } = props

  // @Param search_result:object  => modelo que almacena la información del país (imagen, prefijo)
  // code: "colombia"
  // flag: "https://restcountries.eu/data/col.svg"
  // id: 1
  // name: "Colombia"
  // prefix: "57"

  // @Param open:boolean => Define si esta desplegado el componente o contraido

  // console.log('||||InputCountryPrefix', search_result && search_result.prefix)

  return(
    <div className={`PhoneamEsta ${open ? 'openS' : '' }`} onClick={open ? null : toggleSection}>
      <div className="inputPhone">
        { search_result &&
          <img src={`${CountryUrl}${search_result.flag}`} alt="" className="PhoneamEsta_img" width={20} height={20}/>
        }
        <p className="fuentePrin PhoneamEsta_p">+ {search_result ? search_result.prefix[0] : '--'}</p>
        <div className={`inputComponentPhone ${open ? 'openS' : '' } ${search_result ? 'search_result' : ''}`} >
          {
            search_result ?
            <p className={`search_result_kyc ${open ? 'openS' : ''}`}>{search_result.name}
              <i className="fas fa-times cerratelo" onClick={clean_search_result}></i>
            </p>
            :
            <input
              type="text"
              className="inputElement3"
              placeholder="Escribe el país del indicativo."
              onChange={update}
              // name="findbar_name"
              name="country_prefix"
            />
          }
        </div>
      </div>
      <i className={`fas fa-chevron-down PhoneamEsta_icon ${open ? 'anim' : '' }`}  onClick={toggleSection}></i>
      <span className="linePhone"></span>
    </div>
  )
}






export const InputKycBasic = (props) =>{

  const {
    kyc,
    update,
    message,
    handleSubmit,
    state,
    step,
    toggleSection,
    _onFocus,
    search_results,
    clean_search_result,
  } = props

  let search_result = search_results && search_results[0]
  // console.log('InputKycBasic  S T A T E:::', props)
  return(
    <div id="kycPrime" className={`containerInputComponent2 ${state.open_sect ? 'openS' : '' }`}>
    {/* <div id="kycPrime" className={`containerInputComponent2`}> */}

      <div className="inputLabelsCont">
        <div className="InputCarous" style={{ top: `-${(step-1)*40}px` }}>
          {
            kyc.map(item=>{
              return <p key={item.id} className="labelText2 fuente" >{item.label}</p>
            })
          }
        </div>
      </div>

      <div className={`inputContainer3 ${state.active ? 'inputActivado' : '' }`}>

        {
          kyc.map(item=>{
                return  step === item.id &&
                        <form onSubmit={handleSubmit} key={item.id} id={`${state.ui_type === 'phone' ? 'phone' : ''}`}>
                          {
                            state.ui_type === 'phone' &&
                            <InputCountryPrefix
                              open={state.open_sect}
                              search_result={search_result}
                              {...props}
                            />
                          }

                          {
                            (search_result && state.ui_type === 'select') ?
                            <p className={`search_result_kyc openS`}>{search_result.name}
                              <i className="fas fa-times cerratelo" onClick={clean_search_result}></i>
                            </p>
                            :
                            <input
                             key={item.id}
                             className={`inputElement3 ${state.active ? 'inputActivado' : '' } ${state.ui_type === 'phone' ?'phone' :'' }`}
                             type={state.ui_type === 'phone' ? 'number' :
                                   state.ui_type === 'select' ? 'text' : state.ui_type }
                             placeholder={state.data_state[item.name] ? state.data_state[item.name] : item.placeholder}
                             onChange={update}
                             name={item.name}
                             defaultValue={state.ui_type !== 'select' ? state.data_state[item.name] : null}
                             onFocus={_onFocus}
                             // // onKeyPress={props.name === "account_number" ? props.handleKeyPress : null}
                            />
                          }
                        </form>
          })
        }

        <div className="InputProgressBar" >
          <div className="InputProgressed" style={{ width: step<2 ? 0 : `${(((step*100))/kyc.length)}%` }} ></div>
        </div>

        <div className={`ctaInputKyc ${state.open_sect ? 'openPhone' : '' }`} onClick={state.open_sect ? toggleSection : handleSubmit}>
          <div className="contCtaKyc">
            <i className="fas fa-arrow-right arrowcito backInputKyc" ></i>
            <i className={` ${state.ui_type === 'phone' ? 'fas fa-mobile-alt' : 'fas fa-check'} frontInputKyc`} ></i>
          </div>
        </div>

      </div>
      <div className="InputContainerT" >
        <p className="fuente Inputmsg" style={{color:`${state.colorMessage}`}} >{state.message}</p>
        <p className="fuente2 InputStep" >{step}/{kyc.length}</p>
      </div>
    </div>
  )

}












export const InputCountry = (props) =>{

  const {
    message,
    handleSubmit,
    colorMessage,
    update_country,
    country_match,
    reset_data,
    disabled,
    active
  } = props


  return(
    <div id="kycPrime" className="containerInputComponent3">

      <div className="inputLabelsCont">
        <div className="InputCarous">
           <p  className="labelText3 fuente " >Elige el país desde el que operarás</p>
        </div>
      </div>

      <div className={`inputContainer3 ${active ? 'inputActivado' : '' }`}>

        {
          country_match ?

          <div className="country_selected">
            <IconSwitch icon={country_match.value}  size={25}/>
            <p className="fuente">{country_match.ui_name}</p>
            <i className="fas fa-times cerratelo" onClick={reset_data}></i>
          </div>

          :

          <form onSubmit={handleSubmit} >
            <input
             className={`inputElement3 ${active ? 'inputActivado' : '' }`}
             type="text"
             placeholder="Ej: Colombia"
             onChange={update_country}
             name="country"
             disabled={disabled}
             // defaultValue=""
           />
          </form>
        }

        <div className="InputProgressBar countryppp" >
          {/* <div className="InputProgressed" style={{ width: step<2 ? 0 : `${(((step*100))/kyc.length)}%` }} ></div> */}
          <div className="InputProgressed" style={{ width:country_match?'100%':'0'}} ></div>
        </div>

        <i className={`fas fa-arrow-right arrowcito2 ${country_match ? 'aparecer' : ''}`} onClick={country_match ? handleSubmit : null} ></i>

      </div>
      <div className="InputContainerT" >
        {/* <p className="fuente Inputmsg" style={{ color: `${colorMessage}` }} >{message}</p> */}
        {/* <p className="fuente2 InputStep" >{step}/{kyc.length}</p> */}
      </div>
    </div>
  )

}

export default InputForm
