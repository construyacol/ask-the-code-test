import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'
// import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import { InputForm, InputFormCoin } from '../../widgets/inputs'
import { ButtonForms } from '../../widgets/buttons/buttons'
import IconSwitch from '../../widgets/icons/iconSwitch'
import AddressValidator from 'wallet-address-validator'
import UnverifiedComponent from '../../widgets/unverified_user/unverifiedComponent'


class WithdrawView extends Component{

state = {
  value:"",
  address:null,
  account_id:this.props.match.params && this.props.match.params.id,
  active:false,
  addressVerify:false,
  show_last_address:false,
  address_value:null,
  verified:null
}

  componentDidMount(){
    this.props.initial(this.props.match.params.path, this.props.match.params.id)
    this.init_config()
  }

  init_config = async() =>{
    let verified = await this.props.action.user_verification_status('level_1')
    this.setState({verified})
  }


  actualizarEstado_coin = (e) =>{
    let valor = e.target.value
      this.setState({
        value:e.target.value
      })
  }

  actualizarEstado = async({target}) =>{
    // AddressValidator
    // alert('puto')
    const {
      current_wallet
    } = this.props

  let value = target.value.replace(' ', '')

  let addressVerify = await AddressValidator.validate(value, current_wallet.currency.currency === 'bitcoin_testnet' ? 'bitcoin' : current_wallet.currency.currency)
  // let addressVerify = await AddressValidator.validate(target.value, 'bitcoin')

  // console.log('AddressValidator', target.value.length)
    this.setState({
      address:value,
      addressVerify:addressVerify ? 'Verify' : (value.length>20 && !addressVerify) ? 'NoVerify' : '',
      active:addressVerify
    })
  }

  getMaxAvailable = e =>{
    let valor = e.target.id
    if(valor>0){
      this.setState({
        value:e.target.id
      })
    }
  }

  finish_withdraw = async(p) =>{

    const{
      value,
      address
    } = this.state

    const{
      current_wallet,
      withdraw_provider,
      available_address,
      user
    } = this.props


    let withdraw_account = available_address[address]

    if(!withdraw_account){
      // si la cuenta no existe, se crea una nueva y se consultan
      withdraw_account = await this.props.action.add_new_withdraw_account({
        provider_type:current_wallet.currency.currency,
        label:current_wallet.currency.currency,
        address:address,
        currency_type:'crypto'
      },'crypto')

      let get_withdraw_providers = await this.props.action.get_withdraw_providers(user)
      await this.props.action.get_withdraw_accounts(user, get_withdraw_providers, `{"where": {"userId": "${user.id}"}}`)
    }

    let retiro = await this.props.action.add_new_withdraw_order(value, current_wallet.id, withdraw_provider.id, withdraw_account.id)

    if(!retiro){return false}

    await this.props.action.current_section_params({currentFilter:'withdrawals'})
    this.props.history.push(`/wallets/activity/${this.state.account_id}`)
  }

  withdraw = () =>{
    // alert('retirando')
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Esto es importante, estas a punto de...",
      description:`Hacer un retiro de ${this.state.value} ${this.props.short_name}, una vez confirmado el retiro, este es irreversible, si deseas continuar la operación click en "Confirmar Retiro"`,
      txtPrimary:"Confirmar Retiro",
      txtSecondary:"Cancelar",
      payload:'putito',
      action:(this.finish_withdraw),
      img:"withdraw"
    })
  }


  fiat_withdraw = async() => {
    this.props.action.current_section_params({currentFilter:'withdrawals'})
    const{
      match
    } = this.props

  this.props.action.UpdateForm('withdraw', {account_from:match.params.id})
  await this.props.action.CurrentForm('withdraw')
  this.props.action.ToggleModal()
  }


  focusAction = () =>{
    this.setState({show_last_address:true})
  }

  unFocusAction = () =>{
    setTimeout(()=>{
      // this.setState({show_last_address:false})
    },100)
  }

  load_last_address = async() =>{

    let target = {
      target:{value:this.props.last_address}
    }
    // console.log(target.value)
    await this.actualizarEstado(target)
    await this.setState({address_value:this.props.last_address})
    // console.log('|||||||| . . . oooo', this.state.address_value)
  }



render(){

const { current_wallet, short_name, available, withdraw_provider, last_address  } = this.props
const { value, address, active, addressVerify, show_last_address, address_value, verified } = this.state
// const { currency_type } = current_wallet

const atributos ={
  icon:'withdraw2',
  size:100,
  // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
  color:'#989898'
}

  // console.log('||||||||||| - - -Componente de retiro crypto', withdraw_provider && withdraw_provider.provider.min_amount)
  let min_amount = withdraw_provider && withdraw_provider.provider.min_amount

  return(

    <Fragment>
      {
        !verified ?
        <UnverifiedComponent/>
        :

      !current_wallet ?
          <SimpleLoader
            label="Consultando Billetera"
          />
          :
          <Fragment>
          { current_wallet.currency_type !== 'fiat' ?
              <section className={`WithdrawView ${!withdraw_provider ? 'maintance' : ''}`}>
                {/* <div className="ImportantInfo">
                  <p className="fuente soloAd">Retiro mínimo: 0.002 {short_name}</p>
                  <p className="fuente soloAd der">Limite de retiro por día: 1 {short_name}</p>
                </div> */}

                {
                  withdraw_provider ?

                <Fragment>


                <div className="WSection1">
                  <p className="fuente title soloAd3">Dirección de retiro de {short_name}:</p>

                  <div className="contInputForm">
                    <InputForm
                      active={((value>min_amount && value<=available) && active) ? true : false}
                      clase={true} //retiro los estilos que vienen por defecto
                      type="text"
                      placeholder={!withdraw_provider ? 'Billetera en mantenimiento' : 'Dirección de retiro'}
                      name="name"
                      actualizarEstado={this.actualizarEstado}
                      disabled={!withdraw_provider ? true : false}
                      address={true}
                      focusAction={this.focusAction}
                      unFocusAction={this.unFocusAction}
                      addressVerify={addressVerify}
                      value={address_value}
                    />

                    {
                      (last_address && show_last_address) &&
                      <div className={`last_address ${show_last_address ? 'show' : '' }`}
                        onClick={this.load_last_address}>
                        <p className="address_text fuente">Ultima dirección de retiro utilizada</p>
                        <span id="address_last" className="fuente2">
                          <span>
                            <IconSwitch
                              icon="root"
                              size={16}
                              color="#5999f1"
                              colorStroke="gray"
                            />
                          </span>
                          {last_address}
                        </span>
                      </div>
                    }

                  </div>
                </div>

                <div className="WSection1">
                  <p className="fuente title soloAd3">Cantidad:</p>

                  <InputFormCoin
                    active={((value>min_amount && value<=available) && active) ? true : false}
                    clase={true} //retiro los estilos que vienen por defecto
                    placeholder={min_amount}
                    getMaxAvailable={this.getMaxAvailable}
                    coin={short_name}
                    saldoDisponible={available}
                    name="name"
                    value={value}
                    actualizarEstado={this.actualizarEstado_coin}
                    // imgs={short_name}
                  />
                </div>

                <div className="WSection3">
                  <ButtonForms
                    active={((value>min_amount && value<=available) && active) ? true : false}
                    clases="cenVert"
                    ancho="200px"
                    type="primary"
                    siguiente={this.withdraw}
                  >
                      Enviar
                  </ButtonForms>
                </div>

              </Fragment>
              :
              <section className="maintanceW">
                <IconSwitch icon="maintence" size={130} color="#989898"/>
                <p className="fuente" >Los retiros de {current_wallet.currency.currency} estan fuera de servicio temporalmente, lo hacemos por la seguridad de tus activos, ten paciencia...</p>
              </section>
            }

              </section>


              :



              <section className="DepositView">

                <div className="contIcontSwitch">
                  <IconSwitch {...atributos}/>
                </div>

                  <p className="fuente">Gestiona y realiza retiros en tu moneda local ({short_name}), desde coinsenda a tu cuenta bancaria.</p>

                <div className="contButtons">
                    <ButtonForms
                      type="primary"
                      active={true}
                      siguiente={this.fiat_withdraw}
                    >
                      Realizar un retiro
                    </ButtonForms>
                </div>
              </section>
          }
          </Fragment>
      }
    </Fragment>

  )
}
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){

  const{
    balances,
    withdraw_providers,
    user,
    user_id,
    withdraw_accounts,
    withdrawals
  } = state.model_data

  const {
    current_wallet
  } = state.ui.current_section.params

  let wit_prov_list = null

  // servir proveedores de retiros
  if(withdraw_providers){
  user[user_id].withdraw_providers.map((provider_id)=>{
    if(withdraw_providers[provider_id].currency_type !== 'crypto'){return false}
    if(withdraw_providers[provider_id].country !== user[user_id].country){return false}
    wit_prov_list = {
      ...wit_prov_list,
      [withdraw_providers[provider_id].provider_type]:{
        ...withdraw_providers[provider_id]
      }
    }
  })
}

let withdraw_list = []



if(withdrawals && withdraw_accounts && current_wallet){
  user[user_id].withdrawals.map((withdraw_id)=>{
    // if(withdrawals[withdraw_id].account_id === current_wallet.id && withdrawals[withdraw_id].type_order === 'withdraw' && withdrawals[withdraw_id].state==='accepted')
    if(withdrawals[withdraw_id].account_id === current_wallet.id && withdrawals[withdraw_id].type_order === 'withdraw' && withdrawals[withdraw_id].state==='accepted'){
      withdraw_list.push(withdrawals[withdraw_id])
    }
  })
}

// servir objeto con cuentas de retiro donde su indice es el address
let withdraw_account_list

if(withdraw_accounts){
  user[user_id].withdraw_accounts.map((account_id)=>{
    if(withdraw_accounts[account_id].currency_type !== 'crypto'){return false}
    withdraw_account_list = {
      ...withdraw_account_list,
      [withdraw_accounts[account_id].account_address.value]:{
        ...withdraw_accounts[account_id]
      }
    }
  })
}


// console.log('|||||| ssss', withdraw_list.length>0 && withdraw_accounts[withdraw_list[0].withdraw_account].account_address.value)

  return{
    current_wallet:current_wallet,
    short_name:state.ui.current_section.params.short_name,
    available:current_wallet && balances && balances[current_wallet.id] && balances[current_wallet.id].available,
    withdraw_provider:wit_prov_list && current_wallet && wit_prov_list[current_wallet.currency.currency],
    // withdraw_provider:null,
    available_address:withdraw_account_list,
    withdraw_providers:null,
    user:user[user_id],
    last_address:current_wallet && current_wallet.currency_type === 'crypto' && withdraw_list.length>0 && withdraw_accounts[withdraw_list[0].withdraw_account].account_address.value
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (WithdrawView)
// export default withRouter(DepositView)
