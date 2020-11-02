import React, { Component } from 'react'
import loadable from '@loadable/component'
import { number_format } from '../../../utils'
import { SimpleLoader } from '../loaders'
import Environtment from '../../../environment'
import MaskedInput from 'react-text-mask'
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'
import './inputStyles.css'

const IconSwitch = loadable(() => import('../icons/iconSwitch'))
const NumberInput = loadable(() => import('./numberInput'))

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy')
const { CountryUrl } = Environtment


export const InputFormConverter = (props) => {

  return (
    <div className="contInputFormConverter">
      {
        props.icon &&
        <div className={`iconConverterContainer iConver ${props.iconPosition}`}>
          <div className="contIconvert">
            <IconSwitch
              icon={props.icon}
              size={25}
            />
          </div>
          <p className="currencyNameConv fuente">{props.currency_short_name}</p>
        </div>
      }
      <input
        className={`inputElement ${props.iconPosition}`}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        // onFocus={props.focusAction}
        // onBlur={unFocusAction}
        name={props.name}
      // defaultValue={props.value}
      // disabled={disabled}
      />
    </div>
  )

}


export const InputForm = (props) => {
  const { clase, disabled, address, focusAction, status, addressVerify, unFocusAction, state_item, autoFocus } = props
  return (
    <div className={`${!clase ? 'containerInputComponent' : clase}`}>
      <p className="labelText fuente" style={{ display: !props.label ? 'none' : 'initial' }}>{props.label}</p>
      <div className={`inputContainer ${props.active ? 'inputActivado' : ''} ${state_item}`}>
        <input
          className={`inputElement ${props.active ? 'inputActivado' : ''} ${addressVerify}`}
          type={props.type}
          placeholder={props.placeholder}
          onChange={props.actualizarEstado}
          onFocus={focusAction}
          onBlur={unFocusAction}
          name={props.name}
          value={props.value}
          onKeyPress={props.name === "account_number" ? props.handleKeyPress : null}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
        />
        {
          address &&
          <div className="contIconAddress">
            <IconSwitch icon={addressVerify === 'Verify' ? 'verify' : 'wallet'} color={addressVerify === 'Verify' ? '#4caf50' : 'gray'} size={25} />
          </div>
        }
      </div>
      {
        (props.type === "number" || props.type === "password") &&
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
    error,
    handleFocus,
    handleBlur,
    disabled
  } = props

  // console.log(`${}`)
  // <SimpleLoader/>

  return (
    <div className={`${!clase ? 'containerInputComponent AuthInputComp' : clase}`}>
      <p className="labelText fuente" style={{ display: !label ? 'none' : 'initial' }}>{label}</p>
      <div
        // className={`inputContainer ${active ? 'inputActivado' : '' }`}
        className="inputContainer inputAuths"
        style={{ border: (verifying && !active) ? '1px solid #039aff' : active ? '1px solid #59b200' : error ? '1px solid red' : '1px solid #50667a61' }}
      >
        {
          !verifying ?
            <input
              className={`inputElement TwoFactorTypo fuente2`}
              style={{ color: active ? '#59b200' : 'gray' }}
              type={type}
              placeholder={placeholder}
              onChange={actualizarEstado}
              name={name}
              defaultValue={value}
              onKeyPress={name === "account_number" ? handleKeyPress : null}
              onFocus={handleFocus ? handleFocus : null}
              onBlur={handleBlur ? handleBlur : null}
              disabled={disabled}
              autoFocus={true}
            />
            :
            <div className="AuthLoader">
              <SimpleLoader />
            </div>
        }

      </div>
      <p
        className="statusInput fuente"
        style={{ color: (verifying && !active) ? '#039aff' : active ? '#59b200' : error ? 'red' : '#50667a61' }}
      >
        <i className="fas fa-check"
          style={{ display: active ? 'initial' : 'none' }}
        ></i>
        {status}
      </p>
    </div>
  )
}



export class ReadReceiveCoin extends Component {
  render() {

    const {
      secondary_value,
      placeholder,
      secondary_coin,
      isReadOnly,
      active,
      actualizarEstado,
      name,
      primary_value,
      selectPair,
      totalValue
    } = this.props

    return (
      <>
        {/* <div className={`${!clase ? 'containerInputComponent' : clase}`}> */}
        <div className={`inputContainer ${active ? 'inputActivado' : ''}`}>

          {
            !secondary_value ?
              <div className="ReadReceiveCoinLoader">
                <SimpleLoader />
              </div>
              :
              <>
                <div className="coinBalance2 fuente2" onClick={() => selectPair(false)} >
                  <div className="coinB2">
                    <i className="fas fa-angle-down"></i>
                    <p>{secondary_coin}</p>
                    {
                      secondary_coin &&
                      <img src={require(`../../../assets/coins/${secondary_coin}.png`)} alt="" width="30" />
                    }
                  </div>
                </div>
                {
                  !isReadOnly ?
                    <input
                      className={`inputElement ${active ? 'inputActivado' : ''}`}
                      type="number"
                      placeholder={placeholder}
                      onChange={actualizarEstado}
                      name={name}
                      value={primary_value}
                    />
                    :
                    <p className="read_only" style={{ color: active ? '#3A7BD5' : 'gray' }}> {totalValue} {totalValue ? secondary_coin : '0'} </p>
                }
              </>
          }
        </div>
      </>
    )
  }
}







export const InputFormCoin = (props) => {

  const {
    saldoDisponible,
    coin,
    value,
    placeholder,
    getMaxAvailable,
    secondary_value,
    handleChange,
    useFiatInput,
    active,
    label,
    name,
    handleKeyPress
  } = props

  const isMovilViewport = window.innerWidth < 768
  return (
    <>
      {/* <div className={`${!clase ? 'containerInputComponent' : clase}`}> */}
      <div>
        <p className="labelText fuente" style={{ display: !label ? 'none' : 'initial' }}>{label}</p>
        <div className={`InputFormCoin inputContainer ${active ? 'inputActivado' : ''}`}>

          <div className="coinBalance fuente2" onClick={!secondary_value ? null : getMaxAvailable}>
            <p>{!isMovilViewport && 'Saldo disponible '}
              {saldoDisponible > 0 ? (useFiatInput ? `${number_format(saldoDisponible)}` : `${saldoDisponible}`) : '0'} {coin}
            </p>
            {
              coin &&
              <img src={require(`../../../assets/coins/${coin}.png`)} alt="" width="30" />
            }
          </div>
          {
            useFiatInput ?
              <NumberInput
                type="text"
                autoComplete="off"
                onChange={handleChange}
                placeholder={placeholder}
                name={name}
                className={`inputElement ${active ? 'inputActivado' : ''}`}
                value={value}
                max_available={saldoDisponible}
              />
              :
              <input
                className={`inputElement ${active ? 'inputActivado' : ''}`}
                type="number"
                placeholder={placeholder}
                onChange={handleChange}
                name={name}
                value={value}
                onKeyPress={name === "account_number" ? handleKeyPress : null}
              />
          }
        </div>

      </div>
    </>
  )
}


export class InputDepositForm extends Component {

  state = {
    placeHolder: window.innerWidth > 768 ? 'Escribe la cantidad' : 'Cantidad',
    finalValue: '',
  }

  componentDidMount() {
    this.setState({
      finalValue: this.state.placeHolder
    })
  }

  componentWillReceiveProps(props) {
    // console.log('InputDepositForm / componentWillReceiveProps -', isNaN(props.value))
    const {
      value
    } = props

    if (value) {
      this.setState({
        finalValue: number_format(value)
      })
    } else {
      this.setState({
        finalValue: this.state.placeHolder
      })
    }
  }

  render() {
    const {
      actualizar,
      handleKeyPress,
      value,
      name,
      autoFocus
    } = this.props
    const {
      finalValue
    } = this.state
    const style = { fontSize: (finalValue.length < 10) ? '90px' : (finalValue.length < 15) ? '60px' : '40px' }

    return (
      <div className="containerInputComponent with-adapt">
        <input
          className={`inputElement2 signoPesos fuente2 width-adapt-child`}
          type="text"
          style={style}
          placeholder={`$ ${finalValue}`}
          onChange={actualizar}
          name={name}
          autoFocus={autoFocus}
          value={value ? `$ ${finalValue}` : ''}
          onKeyPress={handleKeyPress}
        />
      </div>
    )
  }
}



export const InputCountryPrefix = (props) => {

  const {
    toggleSection,
    search_result,
    open,
    update,
    clean_search_result,
    autoFocus
  } = props

  // @Param search_result:object  => modelo que almacena la información del país (imagen, prefijo)
  // code: "colombia"
  // flag: "https://restcountries.eu/data/col.svg"
  // id: 1
  // name: "Colombia"
  // prefix: "57"

  // @Param open:boolean => Define si esta desplegado el componente o contraido

  // console.log('||||InputCountryPrefix', search_result && search_result.prefix)

  return (
    <div className={`PhoneamEsta ${open ? 'openS' : ''}`} onClick={open ? null : toggleSection}>
      <div className="inputPhone">
        {search_result &&
          <img src={`${CountryUrl}${search_result.flag}`} alt="" className="PhoneamEsta_img" width={20} height={20} />
        }
        <p className="fuentePrin PhoneamEsta_p">+ {search_result ? search_result.prefix[0] : '--'}</p>
        <div className={`inputComponentPhone ${open ? 'openS' : ''} ${search_result ? 'search_result' : ''}`} >
          {
            search_result ?
              <p className={`search_result_kyc ${open ? 'openS' : ''}`}>{search_result.name}
                <i className="fas fa-times cerratelo" onClick={clean_search_result}></i>
              </p>
              :
              <input
                type="text"
                className="inputElement3"
                autoFocus={autoFocus}
                placeholder="Escribe el país del indicativo."
                onChange={update}
                // name="findbar_name"
                name="country_prefix"
              />
          }
        </div>
      </div>
      <i className={`fas fa-chevron-down PhoneamEsta_icon ${open ? 'anim' : ''}`} onClick={toggleSection}></i>
      <span className="linePhone"></span>
    </div>
  )
}






export const InputKycBasic = (props) => {

  const {
    kyc,
    update,
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
  return (
    <div id="kycPrime" className={`containerInputComponent2 ${state.open_sect ? 'openS' : ''}`}>
      {/* <div id="kycPrime" className={`containerInputComponent2`}> */}

      <div className="inputLabelsCont">
        <div className="InputCarous" style={{ top: `-${(step - 1) * 40}px` }}>
          {
            kyc.map(item => {
              return <p key={item.id} className="labelText2 fuente" >{item.label}</p>
            })
          }
        </div>
      </div>

      <div className={`inputContainer3 ${state.active ? 'inputActivado' : ''}`}>

        {
          kyc.map(item => {
            const isDateInput = state.ui_type === 'date'
            const classNames = `inputElement3 ${state.active ? 'inputActivado' : ''} ${state.ui_type === 'phone' ? 'phone' : ''}`
            return step === item.id &&
              <form onSubmit={handleSubmit} key={item.id} id={`${state.ui_type === 'phone' ? 'phone' : ''}`}>
                {
                  state.ui_type === 'phone' &&
                  <InputCountryPrefix
                    open={state.open_sect}
                    autoFocus={true}
                    search_result={search_result}
                    {...props}
                  />
                }

                {
                  isDateInput && (
                    <MaskedInput
                      mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                      className={classNames}
                      placeholder={item.placeholder}
                      guide={true}
                      name={item.name}
                      autoFocus={true}
                      pipe={autoCorrectedDatePipe}
                      onChange={(e) => {
                        e.persist()
                        update(e)
                      }}
                    />
                  )
                }

                {
                  (search_result && state.ui_type === 'select') ?
                    <p className={`search_result_kyc openS`}>{search_result.name}
                      <i className="fas fa-times cerratelo" onClick={clean_search_result}></i>
                    </p>
                    :
                    !isDateInput && <input
                      key={item.id}
                      autoFocus={true}
                      className={classNames}
                      type={state.ui_type === 'phone' ? 'text' :
                        state.ui_type === 'select' ? 'text' : state.ui_type}
                      placeholder={state.data_state[item.name] ? state.data_state[item.name] : item.placeholder}
                      onChange={update}
                      name={item.name}
                      value={state.ui_type !== 'select' ? state.data_state[item.name] : ''}
                      onFocus={_onFocus}
                    // // onKeyPress={props.name === "account_number" ? props.handleKeyPress : null}
                    />
                }
              </form>
          })
        }

        <div className="InputProgressBar" >
          <div className="InputProgressed" style={{ width: step < 2 ? 0 : `${(((step * 100)) / kyc.length)}%` }} ></div>
        </div>

        <div className={`ctaInputKyc ${state.open_sect ? 'openPhone' : ''}`} onClick={state.open_sect ? toggleSection : handleSubmit}>
          <div className="contCtaKyc">
            <i className="fas fa-arrow-right arrowcito backInputKyc" ></i>
            <i className={` ${state.ui_type === 'phone' ? 'fas fa-mobile-alt' : 'fas fa-check'} frontInputKyc`} ></i>
          </div>
        </div>

      </div>
      <div className="InputContainerT" >
        <p className="fuente Inputmsg" style={{ color: `${state.colorMessage}` }} >{state.message}</p>
        <p className="fuente2 InputStep" >{step}/{kyc.length}</p>
      </div>
    </div>
  )

}

export const InputCountry = (props) => {

  const {
    handleSubmit,
    update_country,
    country_match,
    reset_data,
    disabled,
    active,
    loader
  } = props

  const idNextButton = useKeyActionAsClick(true, 'id-next-subfix-button', 13, false, 'onkeydown')

  return (
    <div id="kycPrime" className="containerInputComponent3">

      <div className="inputLabelsCont">
        <div className="InputCarous">
          <p className="labelText3 fuente " >Elige el país desde el que operarás</p>
        </div>
      </div>

      <div className={`inputContainer3 ${active ? 'inputActivado' : ''}`}>

        {
          loader &&
          <div className="inputCountryLoader">
            <SimpleLoader loader={2} />
          </div>
        }

        {
          country_match ?

            <div className="country_selected">
              <IconSwitch icon={country_match.value} size={25} />
              <p className="fuente">{country_match.ui_name}</p>
              <i className="fas fa-times cerratelo" onClick={reset_data}></i>
            </div>

            :

            <form onSubmit={handleSubmit}>
              <input
                className={`inputElement3 ${active ? 'inputActivado' : ''}`}
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
          <div className="InputProgressed" style={{ width: country_match ? '100%' : '0' }} ></div>
        </div>

        <i id={idNextButton} className={`fas fa-arrow-right arrowcito2 ${country_match ? 'aparecer' : ''}`} onClick={country_match ? handleSubmit : null} ></i>

      </div>
      <div className="InputContainerT" >
        {/* <p className="fuente Inputmsg" style={{ color: `${colorMessage}` }} >{message}</p> */}
        {/* <p className="fuente2 InputStep" >{step}/{kyc.length}</p> */}
      </div>
    </div>
  )

}

export default InputForm
