import React, { Fragment, Component } from 'react'
// import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import LoaderTrade from '../../widgets/loaders/loaderTrade'
import { InputForm, InputFormCoin } from '../../widgets/inputs'
import { ButtonForms } from '../../widgets/buttons/buttons'
import IconSwitch from '../../widgets/icons/iconSwitch'
import AddressValidator from 'wallet-address-validator'
import UnverifiedComponent from '../../widgets/unverified_user/unverifiedComponent'
import { formatToCurrency } from '../../../services/convert_currency'
// import { BigNumber } from "bignumber.js"


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



  async componentDidMount(){
    // await this.props.initial(this.props.match.params.path, this.props.match.params.account_id)
    this.init_config()
    if(!this.props.withdraws){
      await this.props.action.get_withdraws(this.props.current_wallet.id)
    }
  }

  init_config = async() =>{
    // console.log('|||||||||||||||||||||||||||||||||||||||||||| CURRENT_WALLET', this.props.current_wallet)
    // formatToCurrency
    let verified = await this.props.action.user_verification_status('level_1')
    this.setState({verified})
  }


  actualizarEstado_coin = async({target}) =>{
      // if(RegExp(/[\.]/).test(val)){
      //   this.props.action.mensaje('Debes separar decímales con coma ","', 'error')
      // }
      let value = await formatToCurrency(target.value, this.props.current_wallet.currency)
      if(isNaN(value.toNumber()) || value.toNumber() === 'NaN'){return target.value = null}
      let min_amount = await formatToCurrency(this.props.withdraw_provider.provider.min_amount, this.props.current_wallet.currency)
      this.setState({
        value:value.toNumber(),
        validate_min_amount:value.isGreaterThanOrEqualTo(min_amount)
      })
  }

  actualizarEstado = async({target}) =>{
    // AddressValidator
    const {
      current_wallet
    } = this.props

  // console.log('|||||||||||||| CURRENT TARGET', target.value)
  let value = target.value.replace(/[^a-zA-Z0-9]/g, '');
  // console.log('|||||||||||||| VALUE', value)
  let addressVerify = await AddressValidator.validate(value, current_wallet.currency.currency === 'bitcoin_testnet' ? 'bitcoin' : current_wallet.currency.currency)
  console.log(value, addressVerify, current_wallet)

    this.setState({
      address:value,
      addressVerify:addressVerify ? 'Verify' : (value.length>20 && !addressVerify) ? 'NoVerify' : '',
      active:addressVerify
    }, () => target.value = value)
  }


  getMaxAvailable = async e =>{
    let valor = e.target.id
    if(valor>0){
      this.setState({
        value:valor
      })
    }

    let value = await formatToCurrency(valor, this.props.current_wallet.currency)
    let min_amount = await formatToCurrency(this.props.withdraw_provider.provider.min_amount, this.props.current_wallet.currency)

    this.setState({
      validate_min_amount:value.isGreaterThanOrEqualTo(min_amount)
    })
  }

  finish_withdraw = async(p) =>{
    this.props.action.isAppLoading(true)


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


    // console.log('|||| ====> available_address', available_address)

    let withdraw_account = available_address && available_address[address]

    if(!withdraw_account){
      // si la cuenta no existe, se crea una nueva y se consultan
      withdraw_account = await this.props.action.add_new_withdraw_account({
        currency:current_wallet.currency,
        provider_type:current_wallet.currency.currency,
        label:current_wallet.currency.currency,
        address:address,
        country:user.country
      },'crypto')


      let get_withdraw_providers = await this.props.action.get_withdraw_providers(user)
      await this.props.action.get_withdraw_accounts(user, get_withdraw_providers)
    }

      let retiro = await this.props.action.add_new_withdraw_order(value, current_wallet.id, withdraw_provider.id, withdraw_account.id)

      if(!retiro){
        this.props.action.isAppLoading(false)
        return this.props.action.mensaje('No se ha podido crear la orden de retiro', 'error')
      }







      // Confirmamos la orden de retiro
      // let res = await this.props.action.add_update_withdraw(retiro.data.id, 'confirmed')
      //
      // if(!res || res === 465){
      //   this.props.action.isAppLoading(false)
      //   return this.props.action.mensaje('No se ha podido crear la orden de retiro', 'error')
      // }
      //
      // let new_withdraw_model = {
      //   id:retiro.data.id,
      //   unique_id:retiro.data.id,
      //   type_order:'withdraw',
      //   account_id:retiro.data.account_id,
      //   ...retiro.data,
      //   state:res.data.state
      // }
      //
      //
      // await this.props.action.get_account_balances(this.props.user)
      //
      // console.log('========> RESPUESTA ENDPOINT RETIRO', new_withdraw_model)
      // await this.props.action.add_item_state('withdraws', new_withdraw_model)
      // await this.props.action.update_activity_state(new_withdraw_model.account_id, 'withdraws')
      // await this.props.action.isAppLoading(false)
      // this.props.action.add_new_transaction_animation()
      // this.props.history.push(`/wallets/activity/${this.state.account_id}/withdraws`)
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
    this.props.action.current_section_params({currentFilter:'withdraws'})
    // const{
    //   match
    // } = this.props

  // this.props.action.UpdateForm('withdraw', {account_from:match.params.id})
  // await this.props.action.CurrentForm('withdraw')
  this.props.action.ToggleModal()
  }


  focusAction = async() =>{
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
const { value, active, addressVerify, show_last_address, address_value, verified } = this.state
// const { currency_type } = current_wallet
let movil_viewport = window.innerWidth < 768


// console.log('||||||||||||||||||||||||| WITHDRAW ==>  address_value ==> ', address_value)

const atributos ={
  icon:'withdraw2',
  size:movil_viewport ? 80 : 100,
  // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
  color:'#989898'
}

  let { validate_min_amount } = this.state


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
              <form id="withdrawForm" className={`WithdrawView ${!withdraw_provider ? 'maintance' : ''} itemWalletView ${movil_viewport ? 'movil' : ''}`}>

                {/* <div className="ImportantInfo">
                  <p className="fuente soloAd">Retiro mínimo: 0.002 {short_name}</p>
                  <p className="fuente soloAd der">Limite de retiro por día: 1 {short_name}</p>
                </div> */}

              {
                this.props.loader &&
                <LoaderTrade
                  label="Procesando tu retiro"
                />
              }

              {
                          withdraw_provider ?

                          <Fragment>
                            <div className="WSection1">
                              <p className="fuente title soloAd3">Dirección de retiro de {short_name}:</p>

                              <div className="contInputForm">
                                <InputForm
                                  active={((validate_min_amount && value<=available) && active) ? true : false}
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
                                active={((validate_min_amount && value<=available) && active) ? true : false}
                                clase={true} //retiro los estilos que vienen por defecto
                                placeholder={withdraw_provider && withdraw_provider.provider.min_amount}
                                getMaxAvailable={this.getMaxAvailable}
                                // coin={short_name}
                                saldoDisponible={available}
                                name="name"
                                value={value}
                                actualizarEstado={this.actualizarEstado_coin}
                                secondary_value
                                // imgs={short_name}
                              />
                            </div>

                            <div className="WSection3">
                              <ButtonForms
                                active={(!this.props.active_trade_operation && (validate_min_amount && value<=available) && active) ? true : false}
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


            </form>


              :

              <section className={`DepositView itemWalletView ${movil_viewport ? 'movil' : ''}`}>

                <div className="contIcontSwitch">
                  <IconSwitch {...atributos}/>
                </div>

                <div className="contIcontSwitchCont">
                  {
                    this.props.active_trade_operation ?
                    <p className="fuente active_trade_operation">Operación de intercambio en proceso, una vez finalice podrás hacer retiros.</p>
                    :
                    <p className="fuente">Gestiona y realiza retiros en tu moneda local ({short_name}), desde coinsenda a tu cuenta bancaria.</p>
                  }
                </div>


                <div className="contButtons">
                    <ButtonForms
                      type="primary"
                      active={this.props.active_trade_operation ? false : true}
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
    withdraws,
    wallets
  } = state.modelData

  const { params } = props.match


  const {
    loader
  } = state.isLoading

  const current_wallet = wallets[params.account_id]

  let wit_prov_list = null

  // servir proveedores de retiros
  if(withdraw_providers){
  user.withdraw_providers.map((provider_id)=>{

    if(withdraw_providers[provider_id].currency_type !== 'crypto'){return false}
    if(withdraw_providers[provider_id].country !== user.country){return false}

    return wit_prov_list = {
      ...wit_prov_list,
      [withdraw_providers[provider_id].provider_type]:{
        ...withdraw_providers[provider_id]
      }
    }

  })
}

let withdraw_list = []


if(withdraws && withdraw_accounts && current_wallet){
  user.withdraws.map((withdraw_id)=>{
    if(withdraws[withdraw_id].account_id === current_wallet.id && withdraws[withdraw_id].state==='accepted'){
      // console.log('withdraws list =============> |°°°°°°°°°°°°°°°°°', withdraw_id)
      return withdraw_list.push(withdraws[withdraw_id])
    }
    return false
  })
}

// servir objeto con cuentas de retiro donde su indice es el address
let withdraw_account_list

if(withdraw_accounts){
  user.withdraw_accounts.map((account_id)=>{
    if(withdraw_accounts[account_id].currency_type !== 'crypto'){return false}
      return withdraw_account_list = {
        ...withdraw_account_list,
        [withdraw_accounts[account_id].account_address.value]:{
          ...withdraw_accounts[account_id]
        }
      }
  })
}


// console.log('|||||||||||||||||||||||||||||| withdraw_accounts ===>', withdraw_list, withdraw_accounts)

  return{
    loader,
    current_wallet,
    active_trade_operation:state.ui.current_section.params.active_trade_operation,
    short_name:current_wallet.currency.currency,
    available:current_wallet && balances && balances[current_wallet.id] && balances[current_wallet.id].available,
    withdraw_provider:wit_prov_list && current_wallet && wit_prov_list[current_wallet.currency.currency],
    // withdraw_provider:null,
    withdraws:state.storage.activity_for_account[params.account_id] && state.storage.activity_for_account[params.account_id].withdraws,
    available_address:withdraw_account_list,
    withdraw_providers:null,
    user:user,
    last_address:null
    // last_address:(current_wallet && current_wallet.currency_type === 'crypto') && (withdraw_list.length>0 && withdraw_accounts[withdraw_list[0].withdraw_account].account_address.value)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (WithdrawView)
// export default withRouter(DepositView)
